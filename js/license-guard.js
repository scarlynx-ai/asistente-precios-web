/**
 * ============================================================================
 * AGENTE GUARDIÁN DE LICENCIA Y PAGOS (CLIENTE)
 * ============================================================================
 * Módulo ligero del lado del cliente.
 * NO contiene paneles de configuración ni claves de desarrollador.
 * Consulta el estado del servicio al endpoint maestro (o Google Sheets / caché local)
 * y aplica las políticas de suspensión o restricción si existe impago.
 */

const LicenseGuard = {
  PRIMARY_ENDPOINT: 'https://asistente-control-maestro.vercel.app/api/license',
  GIST_ENDPOINT: 'https://gist.githubusercontent.com/scarlynx-ai/eceb63b2dfada89211310b9907ba32c6/raw/license.json',
  FALLBACK_ENDPOINT: '/api/license',
  STORAGE_KEY: '__ajvs_client_lic_state__',

  state: {
    status: 'active', // 'active' | 'restricted' | 'locked'
    debtAmount: 'S/. 1,800.00',
    reason: 'Cuota de desarrollo pendiente de regularización.',
    dueDate: '',
    expiredMode: 'restricted',
    restrictedFeatures: {
      quoter: true,
      admin: true,
      search: false,
      voice: true
    },
    paymentInfo: {
      bcp: 'BCP Soles: 191-94829102-0-45 (CCI: 0021910094829102045)',
      bbva: 'BBVA Soles: 0011-0175-0200849302',
      interbank: 'Interbank Soles: 200-3001849201',
      yapePlin: 'Yape / Plin: 970 411 928',
      holder: 'Desarrollador / Empresa de Software'
    },
    contactWhatsApp: '51970411928',
    contactPhone: '+51 970 411 928',
    unlockCodes: ['AJVS-ACT-2025', 'PAGO-OK-2026']
  },

  _heartbeat: null,

  async init() {
    this.loadCachedState();
    this.injectStyles();
    this.bindInterceptors();

    // Verificación remota con el servidor maestro
    await this.fetchRemoteStatus();

    this.checkDueDate();
    this.applyPolicy();
    this.startWatchdog();
  },

  loadCachedState() {
    try {
      const cached = localStorage.getItem(this.STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        this.state = { ...this.state, ...parsed };
      }
    } catch (e) {
      // Ignorar errores de caché
    }
  },

  saveCachedState() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      // Ignorar
    }
  },

  async fetchRemoteStatus() {
    const tryFetch = async (url) => {
      const resp = await fetch(url + (url.includes('?') ? '&' : '?') + 't=' + Date.now(), { cache: 'no-store' });
      if (!resp.ok) throw new Error('Status ' + resp.status);
      return await resp.json();
    };

    try {
      // 1. Intentar endpoint maestro dedicado en Vercel
      const remote = await tryFetch(this.PRIMARY_ENDPOINT);
      if (remote && remote.status) {
        this.state = { ...this.state, ...remote };
        this.saveCachedState();
        return;
      }
    } catch (e1) {
      // 2. Intentar lectura directa del almacén Gist
      try {
        const gist = await tryFetch(this.GIST_ENDPOINT);
        if (gist && gist.status) {
          this.state = { ...this.state, ...gist };
          this.saveCachedState();
          return;
        }
      } catch (e2) {
        // 3. Fallback a endpoint local
        try {
          const local = await tryFetch(this.FALLBACK_ENDPOINT);
          if (local && local.status) {
            this.state = { ...this.state, ...local };
            this.saveCachedState();
          }
        } catch (e3) {
          console.info('[LicenseGuard] Verificación offline activa.');
        }
      }
    }
  },

  checkDueDate() {
    if (this.state.dueDate && this.state.status === 'active') {
      const today = new Date().toISOString().split('T')[0];
      if (today > this.state.dueDate) {
        this.state.status = this.state.expiredMode || 'restricted';
        this.saveCachedState();
      }
    }
  },

  isLocked() {
    return this.state.status === 'locked';
  },

  isRestricted() {
    return this.state.status === 'restricted';
  },

  isFeatureDisabled(featureKey) {
    if (this.isLocked()) return true;
    if (this.isRestricted()) {
      return Boolean(this.state.restrictedFeatures && this.state.restrictedFeatures[featureKey]);
    }
    return false;
  },

  applyPolicy() {
    if (this.isLocked()) {
      this.hideBanner();
      this.showLockoutModal();
    } else if (this.isRestricted()) {
      this.hideLockoutModal();
      this.showBanner();
      this.dimRestrictedElements();
    } else {
      this.hideLockoutModal();
      this.hideBanner();
      this.restoreElements();
    }
  },

  startWatchdog() {
    clearInterval(this._heartbeat);
    this._heartbeat = setInterval(() => {
      if (this.isLocked()) {
        const overlay = document.getElementById('licenseLockoutOverlay');
        if (!overlay || overlay.style.display === 'none') {
          this.showLockoutModal();
        }
      }
    }, 2000);
  },

  bindInterceptors() {
    // Interceptar clics en fase de captura para bloquear módulos suspendidos
    window.addEventListener('click', (e) => {
      // 1. Bloqueo total
      if (this.isLocked()) {
        const isWithinModal = e.target.closest('#licenseLockoutOverlay');
        if (!isWithinModal) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }

      // 2. Modo restringido
      if (this.isRestricted()) {
        if (this.isFeatureDisabled('quoter')) {
          const isQuoter = e.target.closest('#tabBtnCotizador') || 
                           e.target.closest('.btn-add-quote') ||
                           e.target.closest('#btnExportPDF') ||
                           e.target.closest('#btnExportQuotationExcel');
          if (isQuoter) {
            e.preventDefault();
            e.stopPropagation();
            this.notifyRestricted('Módulo de cotizaciones suspendido por regularización de pago.');
            return false;
          }
        }

        if (this.isFeatureDisabled('admin')) {
          const isAdmin = e.target.closest('#tabBtnAdmin') || 
                          e.target.closest('#btnNewProduct') ||
                          e.target.closest('#btnUploadExcel') ||
                          e.target.closest('#excelDropzone');
          if (isAdmin) {
            e.preventDefault();
            e.stopPropagation();
            this.notifyRestricted('Panel de administración suspendido por regularización de pago.');
            return false;
          }
        }
      }
    }, true);

    // Impedir atajos que intenten saltarse el bloqueo
    window.addEventListener('keydown', (e) => {
      if (this.isLocked()) {
        const isInput = e.target.closest('#inpClientUnlockCode');
        if (!isInput && (e.key === 'Escape' || e.key === 'F12')) {
          e.preventDefault();
        }
      }
    }, true);
  },

  showLockoutModal() {
    let overlay = document.getElementById('licenseLockoutOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'licenseLockoutOverlay';
      overlay.className = 'license-lockout-backdrop';
      document.body.appendChild(overlay);
    }

    const { debtAmount, reason, paymentInfo, contactWhatsApp, contactPhone } = this.state;
    const waUrl = `https://wa.me/${contactWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hola, deseo regularizar el pago acordado para reactivar el sistema.')}`;

    overlay.innerHTML = `
      <div class="license-lockout-card">
        <div class="license-lockout-icon">
          <span class="material-symbols-rounded">lock_clock</span>
        </div>

        <h2 class="license-lockout-title">Servicio Suspendido Temporalmente</h2>
        <p class="license-lockout-desc">
          El acceso a la plataforma se encuentra temporalmente inactivo debido a cuotas de desarrollo pendientes de pago.
        </p>

        <div class="license-debt-box">
          <div class="license-debt-row">
            <span>Monto Pendiente:</span>
            <strong>${debtAmount || 'S/. 1,800.00'}</strong>
          </div>
          <div class="license-debt-row">
            <span>Motivo:</span>
            <span>${reason || 'Cuota de desarrollo de software'}</span>
          </div>
        </div>

        <div class="license-payment-box">
          <h4>Cuentas Bancarias de Regularización:</h4>
          <ul>
            <li><strong>BCP:</strong> ${paymentInfo.bcp || 'Consultar con soporte'}</li>
            <li><strong>BBVA:</strong> ${paymentInfo.bbva || 'Consultar con soporte'}</li>
            <li><strong>Interbank:</strong> ${paymentInfo.interbank || 'Consultar con soporte'}</li>
            <li><strong>Yape / Plin:</strong> ${paymentInfo.yapePlin || 'Consultar con soporte'}</li>
            <li><strong>Beneficiario:</strong> ${paymentInfo.holder || 'Desarrollador de Software'}</li>
          </ul>
        </div>

        <div class="license-actions">
          <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="license-btn-wa">
            <span class="material-symbols-rounded">chat</span>
            <span>Contactar al Desarrollador (${contactPhone})</span>
          </a>
        </div>

        <div class="license-unlock-box">
          <label for="inpClientUnlockCode">¿Ya realizaste el abono? Ingresa tu código de reactivación:</label>
          <form id="formLicenseUnlock" style="display: flex; gap: 8px; margin-top: 8px;">
            <input 
              type="text" 
              id="inpClientUnlockCode" 
              class="form-input" 
              placeholder="Ej. AJVS-ACT-2025" 
              style="text-transform: uppercase; font-weight: 700; text-align: center; letter-spacing: 1.5px;" 
              required
            >
            <button type="submit" class="m3-tonal-btn active" style="white-space: nowrap; padding: 10px 18px;">
              Reactivar
            </button>
          </form>
          <div id="licenseUnlockErr" style="display: none; color: #ba1a1a; font-size: 0.85rem; margin-top: 6px; font-weight: 600;">
            Código no válido. Por favor comuníquese con el desarrollador.
          </div>
        </div>
      </div>
    `;

    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    const form = document.getElementById('formLicenseUnlock');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const inp = document.getElementById('inpClientUnlockCode');
        const err = document.getElementById('licenseUnlockErr');
        const val = (inp?.value || '').trim().toUpperCase();

        if (this.verifyUnlockCode(val)) {
          if (err) err.style.display = 'none';
          this.reactivate();
        } else {
          if (err) err.style.display = 'block';
          if (inp) {
            inp.value = '';
            inp.focus();
          }
        }
      });
    }
  },

  hideLockoutModal() {
    const overlay = document.getElementById('licenseLockoutOverlay');
    if (overlay) overlay.style.display = 'none';
    document.body.style.overflow = '';
  },

  showBanner() {
    let banner = document.getElementById('licensePaymentBanner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'licensePaymentBanner';
      banner.className = 'license-payment-banner';

      const header = document.querySelector('.m3-top-app-bar');
      if (header && header.parentNode) {
        header.parentNode.insertBefore(banner, header.nextSibling);
      } else {
        document.body.prepend(banner);
      }
    }

    const { debtAmount, dueDate, contactWhatsApp } = this.state;
    const waUrl = `https://wa.me/${contactWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hola, deseo coordinar el pago de la cuota pendiente.')}`;
    const dateText = dueDate ? ` antes del ${dueDate}` : '';

    banner.innerHTML = `
      <div class="license-banner-content">
        <div class="license-banner-text">
          <span class="material-symbols-rounded">warning</span>
          <span><strong>Aviso de Pago Pendiente:</strong> Existe un saldo de <strong>${debtAmount || 'S/. 1,800.00'}</strong>${dateText}. Módulos de cotización y administración en modo restringido.</span>
        </div>
        <div class="license-banner-actions">
          <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="license-banner-btn-wa">
            <span class="material-symbols-rounded" style="font-size: 18px;">chat</span>
            <span>Regularizar</span>
          </a>
          <button type="button" class="license-banner-btn-code" id="btnBannerEnterCode">
            <span class="material-symbols-rounded" style="font-size: 18px;">key</span>
            <span>Ingresar Código</span>
          </button>
        </div>
      </div>
    `;

    banner.style.display = 'block';

    const btnCode = document.getElementById('btnBannerEnterCode');
    if (btnCode) {
      btnCode.addEventListener('click', () => {
        const code = prompt('Ingresa el código de activación proporcionado por el desarrollador:');
        if (code) {
          if (this.verifyUnlockCode(code)) {
            this.reactivate();
          } else {
            alert('Código no válido. Consulte con el desarrollador.');
          }
        }
      });
    }
  },

  hideBanner() {
    const banner = document.getElementById('licensePaymentBanner');
    if (banner) banner.style.display = 'none';
  },

  dimRestrictedElements() {
    const tabCotizador = document.getElementById('tabBtnCotizador');
    const tabAdmin = document.getElementById('tabBtnAdmin');
    if (tabCotizador && this.isFeatureDisabled('quoter')) {
      tabCotizador.style.opacity = '0.5';
      tabCotizador.title = 'Módulo suspendido por regularización de pago';
    }
    if (tabAdmin && this.isFeatureDisabled('admin')) {
      tabAdmin.style.opacity = '0.5';
      tabAdmin.title = 'Panel administrativo suspendido por regularización de pago';
    }
  },

  restoreElements() {
    const tabCotizador = document.getElementById('tabBtnCotizador');
    const tabAdmin = document.getElementById('tabBtnAdmin');
    if (tabCotizador) {
      tabCotizador.style.opacity = '';
      tabCotizador.title = '';
    }
    if (tabAdmin) {
      tabAdmin.style.opacity = '';
      tabAdmin.title = '';
    }
  },

  notifyRestricted(message) {
    if (typeof Toast !== 'undefined') {
      Toast.show(`⚠️ ${message}`, 4000);
    } else {
      alert(`⚠️ ${message}`);
    }
  },

  verifyUnlockCode(code) {
    const clean = String(code || '').trim().toUpperCase();
    const codes = Array.isArray(this.state.unlockCodes) ? this.state.unlockCodes : [];
    return codes.some(c => String(c).trim().toUpperCase() === clean);
  },

  reactivate() {
    this.state.status = 'active';
    this.saveCachedState();
    this.applyPolicy();

    // Notificar al endpoint maestro del desbloqueo
    fetch(this.ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'active' })
    }).catch(() => {});

    if (typeof Toast !== 'undefined') {
      Toast.show('✅ ¡Servicio reactivado con éxito! Acceso completo restablecido.', 5000);
    } else {
      alert('✅ ¡Servicio reactivado con éxito!');
    }
  },

  injectStyles() {
    if (document.getElementById('licenseGuardStyles')) return;
    const style = document.createElement('style');
    style.id = 'licenseGuardStyles';
    style.textContent = `
      .license-lockout-backdrop {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(14, 16, 22, 0.95);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        z-index: 9999999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        box-sizing: border-box;
      }

      .license-lockout-card {
        background: var(--md-sys-color-surface-container-lowest, #ffffff);
        color: var(--md-sys-color-on-surface, #1e1e1e);
        border-radius: 28px;
        max-width: 560px;
        width: 100%;
        padding: 32px 28px;
        box-shadow: 0 24px 48px rgba(0,0,0,0.4);
        border: 2px solid var(--md-sys-color-error, #ba1a1a);
        text-align: center;
        animation: licPop 0.3s cubic-bezier(0.1, 0.9, 0.2, 1);
        box-sizing: border-box;
      }

      @keyframes licPop {
        from { transform: scale(0.93); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }

      .license-lockout-icon {
        width: 76px;
        height: 76px;
        background: var(--md-sys-color-error-container, #ffdad6);
        color: var(--md-sys-color-error, #ba1a1a);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 16px auto;
      }

      .license-lockout-icon .material-symbols-rounded {
        font-size: 42px;
      }

      .license-lockout-title {
        font-size: 1.45rem;
        font-weight: 800;
        margin-bottom: 8px;
        color: var(--md-sys-color-on-surface, #1a1c1e);
      }

      .license-lockout-desc {
        font-size: 0.95rem;
        line-height: 1.5;
        color: var(--md-sys-color-on-surface-variant, #44474e);
        margin-bottom: 18px;
      }

      .license-debt-box {
        background: var(--md-sys-color-error-container, #ffdad6);
        color: var(--md-sys-color-on-error-container, #410002);
        border-radius: 16px;
        padding: 12px 18px;
        margin-bottom: 16px;
        text-align: left;
      }

      .license-debt-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.95rem;
        margin-bottom: 4px;
      }
      .license-debt-row:last-child { margin-bottom: 0; }

      .license-payment-box {
        background: var(--md-sys-color-surface-container, #f0f0f4);
        border-radius: 16px;
        padding: 12px 18px;
        margin-bottom: 18px;
        text-align: left;
      }

      .license-payment-box h4 {
        font-size: 0.9rem;
        font-weight: 700;
        margin-bottom: 6px;
      }

      .license-payment-box ul {
        list-style: none;
        padding: 0;
        margin: 0;
        font-size: 0.85rem;
        line-height: 1.5;
      }

      .license-actions {
        display: flex;
        justify-content: center;
        margin-bottom: 18px;
      }

      .license-btn-wa {
        background: #25D366 !important;
        color: #ffffff !important;
        text-decoration: none;
        font-weight: 700;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 12px 24px;
        border-radius: var(--m3-shape-full);
      }

      .license-unlock-box {
        border-top: 1px dashed var(--md-sys-color-outline-variant);
        padding-top: 16px;
        text-align: left;
      }

      .license-unlock-box label {
        font-size: 0.88rem;
        font-weight: 600;
        color: var(--md-sys-color-on-surface);
      }

      .license-payment-banner {
        background: #fff3cd;
        color: #856404;
        border-bottom: 2px solid #ffeeba;
        padding: 10px 18px;
        position: sticky;
        top: 0;
        z-index: 999;
        box-shadow: 0 2px 6px rgba(0,0,0,0.08);
      }

      .license-banner-content {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
      }

      .license-banner-text {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.92rem;
      }

      .license-banner-actions {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .license-banner-btn-wa {
        background: #25D366;
        color: #fff;
        text-decoration: none;
        padding: 6px 14px;
        border-radius: var(--m3-shape-full);
        font-size: 0.85rem;
        font-weight: 700;
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }

      .license-banner-btn-code {
        background: #856404;
        color: #fff;
        border: none;
        padding: 6px 12px;
        border-radius: var(--m3-shape-full);
        font-size: 0.85rem;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }
    `;
    document.head.appendChild(style);
  }
};

window.LicenseGuard = LicenseGuard;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => LicenseGuard.init());
} else {
  LicenseGuard.init();
}
