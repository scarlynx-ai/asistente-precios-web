// ==========================================================================
// GESTOR DE AUTENTICACIÓN Y SEGURIDAD MULTI-ROL (M3 LOGIN)
// ==========================================================================
const AuthManager = {
  SESSION_KEY: 'antigravity_user_session',

  // Credenciales Vendedor y Administrador (Acceso por DNI)
  VALID_USER_DNIS: ['76051532', '76416749', '40395794'],
  VALID_USER_DNI: '76051532',
  VALID_USER_PASS: '76051532',

  // Credenciales Administrador (Inventario, Costos, Edición y Excel)
  VALID_ADMIN_USERS: ['76051532', '76416749', '40395794'],
  VALID_ADMIN_PASSWORDS: ['76051532', '76416749', '40395794'],

  init() {
    this.bindEvents();
    this.checkSession();
  },

  isAuthenticated() {
    const session = this.getSession();
    if (!session || !session.authenticated) return false;
    const cleanUser = String(session.username || '').trim();
    return this.VALID_USER_DNIS.includes(cleanUser) || this.VALID_ADMIN_USERS.includes(cleanUser);
  },

  isAdmin() {
    const session = this.getSession();
    if (!this.isAuthenticated()) return false;
    return session.role === 'admin' || this.VALID_ADMIN_USERS.includes(String(session.username || '').trim().toLowerCase());
  },

  isUser() {
    return this.isAuthenticated() && !this.isAdmin();
  },

  getRole() {
    const session = this.getSession();
    if (!this.isAuthenticated()) return null;
    return this.isAdmin() ? 'admin' : (session.role || 'user');
  },

  getSession() {
    try {
      const data = localStorage.getItem(this.SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error al leer sesión:', e);
      return null;
    }
  },

  loginUser(dni, password) {
    const cleanDni = String(dni || '').trim();
    const cleanPass = String(password || '').trim();

    const isValidDni = this.VALID_USER_DNIS.includes(cleanDni);
    const isAdminDni = this.VALID_ADMIN_USERS.includes(cleanDni.toLowerCase());
    const isValidPass = (cleanPass === cleanDni) || (isAdminDni && this.VALID_ADMIN_PASSWORDS.includes(cleanPass));

    if (isValidDni && isValidPass) {
      const assignedRole = isAdminDni ? 'admin' : 'user';
      const session = {
        username: cleanDni,
        role: assignedRole,
        authenticated: true,
        loginAt: Date.now()
      };
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
      this.hideErrors();
      this.showApp();
      if (typeof Assistant !== 'undefined' && Assistant.playGreetingNow) {
        Assistant.playGreetingNow(true);
      }
      if (typeof Toast !== 'undefined') {
        Toast.show(assignedRole === 'admin'
          ? 'Bienvenido Administrador. Acceso total concedido.'
          : 'Bienvenido. Sesión de Vendedor iniciada.');
      }
      return true;
    } else {
      this.showUserError('DNI o contraseña incorrectos. Verifica tus datos.');
      const passInput = document.getElementById('loginPassword');
      if (passInput) {
        passInput.value = '';
        passInput.focus();
      }
      return false;
    }
  },

  loginAdmin(username, password) {
    const cleanUser = String(username || '').trim().toLowerCase();
    const cleanPass = String(password || '').trim();

    const isValidUser = this.VALID_ADMIN_USERS.includes(cleanUser);
    const isValidPass = (cleanPass === cleanUser) || this.VALID_ADMIN_PASSWORDS.includes(cleanPass);

    if (isValidUser && isValidPass) {
      const session = {
        username: cleanUser,
        role: 'admin',
        authenticated: true,
        loginAt: Date.now()
      };
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
      this.hideErrors();
      this.showApp();
      if (typeof Assistant !== 'undefined' && Assistant.playGreetingNow) {
        Assistant.playGreetingNow(true);
      }
      if (typeof Toast !== 'undefined') {
        Toast.show('Bienvenido Administrador. Acceso total concedido.');
      }
      return true;
    } else {
      this.showAdminError('DNI o contraseña de administrador incorrectos.');
      const passInput = document.getElementById('loginAdminPassword');
      if (passInput) {
        passInput.value = '';
        passInput.focus();
      }
      return false;
    }
  },

  verifyAdminPassword(password) {
    const cleanPass = String(password || '').trim();
    return this.VALID_ADMIN_PASSWORDS.includes(cleanPass);
  },

  promoteCurrentSessionToAdmin() {
    const session = this.getSession() || {};
    session.role = 'admin';
    session.authenticated = true;
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    this.updateRoleUI();
    if (typeof Toast !== 'undefined') {
      Toast.show('Modo Administrador activado.');
    }
  },

  logout() {
    localStorage.removeItem(this.SESSION_KEY);
    if (typeof Assistant !== 'undefined') {
      Assistant.hasPlayedGreeting = false;
      Assistant.lastGreetingTime = 0;
      if (typeof VoiceEngine !== 'undefined') VoiceEngine.stop();
    }
    const dniInput = document.getElementById('loginDni');
    const passInput = document.getElementById('loginPassword');
    const adminUserInput = document.getElementById('loginAdminUser');
    const adminPassInput = document.getElementById('loginAdminPassword');
    if (dniInput) dniInput.value = '';
    if (passInput) passInput.value = '';
    if (adminUserInput) adminUserInput.value = '';
    if (adminPassInput) adminPassInput.value = '';
    this.hideErrors();
    this.showLogin();
    if (typeof Toast !== 'undefined') {
      Toast.show('Sesión cerrada');
    }
  },

  showLogin() {
    const viewLogin = document.getElementById('viewLogin');
    const viewConsultas = document.getElementById('viewConsultas');
    const viewCotizador = document.getElementById('viewCotizador');
    const viewAdmin = document.getElementById('viewAdmin');
    const subtitleBadge = document.getElementById('navTotalBadge');
    const roleBadge = document.getElementById('navRoleBadge');

    if (viewLogin) viewLogin.style.display = 'flex';
    if (viewConsultas) viewConsultas.style.display = 'none';
    if (viewCotizador) viewCotizador.style.display = 'none';
    if (viewAdmin) viewAdmin.style.display = 'none';
    if (subtitleBadge) subtitleBadge.style.display = 'none';
    if (roleBadge) roleBadge.style.display = 'none';

    // Ocultar elementos protegidos
    document.querySelectorAll('.app-auth-required').forEach(el => {
      el.style.display = 'none';
    });

    this.switchLoginTab('user');
  },

  showApp() {
    const viewLogin = document.getElementById('viewLogin');
    const viewConsultas = document.getElementById('viewConsultas');
    const viewCotizador = document.getElementById('viewCotizador');
    const viewAdmin = document.getElementById('viewAdmin');
    const tabConsultas = document.getElementById('tabBtnConsultas');
    const tabCotizador = document.getElementById('tabBtnCotizador');
    const tabAdmin = document.getElementById('tabBtnAdmin');
    const subtitleBadge = document.getElementById('navTotalBadge');

    if (viewLogin) viewLogin.style.display = 'none';
    if (viewConsultas) viewConsultas.style.display = 'flex';
    if (viewCotizador) viewCotizador.style.display = 'none';
    if (viewAdmin) viewAdmin.style.display = 'none';
    if (subtitleBadge) subtitleBadge.style.display = '';

    if (tabConsultas) tabConsultas.classList.add('active');
    if (tabCotizador) tabCotizador.classList.remove('active');
    if (tabAdmin) tabAdmin.classList.remove('active');

    // Mostrar elementos protegidos
    document.querySelectorAll('.app-auth-required').forEach(el => {
      el.style.display = '';
    });

    this.updateRoleUI();
    if (typeof QuoterPanel !== 'undefined' && QuoterPanel.updateBadgeCount) {
      QuoterPanel.updateBadgeCount();
    }

    if (typeof Assistant !== 'undefined') {
      if (Assistant.scrollToBottom) Assistant.scrollToBottom();
      if (Assistant.playGreetingIfAuthorized) Assistant.playGreetingIfAuthorized();
    }
  },

  updateRoleUI() {
    const tabAdmin = document.getElementById('tabBtnAdmin');
    const roleBadge = document.getElementById('navRoleBadge');
    const iconTabAdmin = document.getElementById('iconTabAdmin');
    const textTabAdmin = document.getElementById('textTabAdmin');
    const isAdmin = this.isAdmin();

    if (roleBadge) {
      roleBadge.textContent = isAdmin ? 'Admin' : 'Vendedor';
      roleBadge.style.background = isAdmin ? 'var(--md-sys-color-tertiary-container)' : 'var(--md-sys-color-secondary-container)';
      roleBadge.style.color = isAdmin ? 'var(--md-sys-color-on-tertiary-container)' : 'var(--md-sys-color-on-secondary-container)';
      roleBadge.style.display = '';
    }

    if (tabAdmin) {
      if (isAdmin) {
        tabAdmin.style.display = 'inline-flex';
        if (iconTabAdmin) iconTabAdmin.textContent = 'inventory_2';
        if (textTabAdmin) textTabAdmin.textContent = 'Admin';
        tabAdmin.title = 'Panel de Administración (Inventario y Precios)';
      } else {
        tabAdmin.style.display = 'none';
      }
    }
  },

  checkSession() {
    if (this.isAuthenticated()) {
      this.showApp();
    } else {
      this.showLogin();
    }
  },

  switchLoginTab(target) {
    const tabUser = document.getElementById('tabLoginUser');
    const tabAdmin = document.getElementById('tabLoginAdmin');
    const formUser = document.getElementById('formLoginUser');
    const formAdmin = document.getElementById('formLoginAdmin');
    const avatar = document.getElementById('loginHeaderAvatar');
    const icon = document.getElementById('loginHeaderIcon');
    const title = document.getElementById('loginHeaderTitle');
    const subtitle = document.getElementById('loginHeaderSubtitle');

    this.hideErrors();

    if (target === 'admin') {
      if (tabUser) tabUser.classList.remove('active');
      if (tabAdmin) tabAdmin.classList.add('active');
      if (formUser) formUser.style.display = 'none';
      if (formAdmin) formAdmin.style.display = 'flex';
      if (avatar) avatar.classList.add('admin');
      if (icon) icon.textContent = 'shield_person';
      if (title) title.textContent = 'Acceso de Administrador';
      if (subtitle) subtitle.textContent = 'Gestión de catálogo, edición de precios y costos';
      setTimeout(() => {
        const u = document.getElementById('loginAdminUser');
        if (u) u.focus();
      }, 100);
    } else {
      if (tabUser) tabUser.classList.add('active');
      if (tabAdmin) tabAdmin.classList.remove('active');
      if (formUser) formUser.style.display = 'flex';
      if (formAdmin) formAdmin.style.display = 'none';
      if (avatar) avatar.classList.remove('admin');
      if (icon) icon.textContent = 'storefront';
      if (title) title.textContent = 'Acceso a Ventas y Consultas';
      if (subtitle) subtitle.textContent = 'Consulta de precios, catálogo y cotizaciones';
      setTimeout(() => {
        const d = document.getElementById('loginDni');
        if (d) d.focus();
      }, 100);
    }
  },

  openAdminUnlockModal() {
    const modal = document.getElementById('modalAdminUnlock');
    const pwdInput = document.getElementById('adminUnlockPassword');
    const errBox = document.getElementById('adminUnlockErrorMsg');
    if (errBox) errBox.style.display = 'none';
    if (pwdInput) pwdInput.value = '';
    if (modal) {
      modal.classList.add('open');
      setTimeout(() => { if (pwdInput) pwdInput.focus(); }, 150);
    }
  },

  closeAdminUnlockModal() {
    const modal = document.getElementById('modalAdminUnlock');
    if (modal) modal.classList.remove('open');
  },

  showUserError(msg) {
    const errBox = document.getElementById('loginUserErrorMsg');
    const errText = document.getElementById('loginUserErrorText');
    if (errBox) {
      if (errText) errText.textContent = msg;
      errBox.style.display = 'flex';
      errBox.classList.remove('shake');
      void errBox.offsetWidth;
      errBox.classList.add('shake');
    }
  },

  showAdminError(msg) {
    const errBox = document.getElementById('loginAdminErrorMsg');
    const errText = document.getElementById('loginAdminErrorText');
    if (errBox) {
      if (errText) errText.textContent = msg;
      errBox.style.display = 'flex';
      errBox.classList.remove('shake');
      void errBox.offsetWidth;
      errBox.classList.add('shake');
    }
  },

  hideErrors() {
    const uErr = document.getElementById('loginUserErrorMsg');
    const aErr = document.getElementById('loginAdminErrorMsg');
    const unErr = document.getElementById('adminUnlockErrorMsg');
    if (uErr) uErr.style.display = 'none';
    if (aErr) aErr.style.display = 'none';
    if (unErr) unErr.style.display = 'none';
  },

  bindEvents() {
    // Tabs de selección de login
    const tabUser = document.getElementById('tabLoginUser');
    const tabAdmin = document.getElementById('tabLoginAdmin');
    if (tabUser) tabUser.addEventListener('click', () => this.switchLoginTab('user'));
    if (tabAdmin) tabAdmin.addEventListener('click', () => this.switchLoginTab('admin'));

    // Formulario Vendedor
    const formUser = document.getElementById('formLoginUser');
    if (formUser) {
      formUser.addEventListener('submit', (e) => {
        e.preventDefault();
        const dni = document.getElementById('loginDni')?.value;
        const pass = document.getElementById('loginPassword')?.value;
        this.loginUser(dni, pass);
      });
    }

    // Formulario Administrador
    const formAdmin = document.getElementById('formLoginAdmin');
    if (formAdmin) {
      formAdmin.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('loginAdminUser')?.value;
        const pass = document.getElementById('loginAdminPassword')?.value;
        this.loginAdmin(user, pass);
      });
    }

    // Formulario Desbloqueo Admin
    const formUnlock = document.getElementById('formAdminUnlock');
    if (formUnlock) {
      formUnlock.addEventListener('submit', (e) => {
        e.preventDefault();
        const pwd = document.getElementById('adminUnlockPassword')?.value;
        if (this.verifyAdminPassword(pwd)) {
          this.promoteCurrentSessionToAdmin();
          this.closeAdminUnlockModal();
          // Abrir vista Admin directamente
          const tabAdmin = document.getElementById('tabBtnAdmin');
          const tabConsultas = document.getElementById('tabBtnConsultas');
          const viewConsultas = document.getElementById('viewConsultas');
          const viewAdmin = document.getElementById('viewAdmin');
          if (tabAdmin && tabConsultas && viewConsultas && viewAdmin) {
            tabAdmin.classList.add('active');
            tabConsultas.classList.remove('active');
            viewConsultas.style.display = 'none';
            viewAdmin.style.display = 'block';
            if (typeof AdminPanel !== 'undefined') {
              AdminPanel.renderStats();
              AdminPanel.renderTable();
            }
          }
        } else {
          const errBox = document.getElementById('adminUnlockErrorMsg');
          if (errBox) {
            errBox.style.display = 'flex';
            errBox.classList.remove('shake');
            void errBox.offsetWidth;
            errBox.classList.add('shake');
          }
        }
      });
    }

    // Botones modal desbloqueo
    const btnCloseUnlock = document.getElementById('btnCloseAdminUnlock');
    const btnCancelUnlock = document.getElementById('btnCancelAdminUnlock');
    if (btnCloseUnlock) btnCloseUnlock.addEventListener('click', () => this.closeAdminUnlockModal());
    if (btnCancelUnlock) btnCancelUnlock.addEventListener('click', () => this.closeAdminUnlockModal());

    // Botón Cerrar Sesión
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
      btnLogout.addEventListener('click', () => {
        if (confirm('¿Deseas cerrar tu sesión?')) {
          this.logout();
        }
      });
    }

    // Toggles de contraseña
    const setupPwdToggle = (btnId, inputId, iconId) => {
      const btn = document.getElementById(btnId);
      const input = document.getElementById(inputId);
      const icon = document.getElementById(iconId);
      if (btn && input) {
        btn.addEventListener('click', () => {
          const isPwd = input.type === 'password';
          input.type = isPwd ? 'text' : 'password';
          if (icon) icon.textContent = isPwd ? 'visibility_off' : 'visibility';
        });
      }
    };

    setupPwdToggle('btnTogglePassword', 'loginPassword', 'iconPasswordToggle');
    setupPwdToggle('btnToggleAdminPassword', 'loginAdminPassword', 'iconAdminPasswordToggle');
    setupPwdToggle('btnToggleUnlockPassword', 'adminUnlockPassword', 'iconUnlockPasswordToggle');
  }
};
