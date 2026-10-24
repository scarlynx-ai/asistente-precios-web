// ==========================================================================
// MÓDULO DE COTIZACIONES Y ÓRDENES DE COMPRA - AJVS PROYECTOS E.I.R.L.
// ==========================================================================

const QuoterPanel = {
  STORAGE_DOCS_KEY: 'ajvs_quoter_documents_v1',
  STORAGE_CLIENTS_KEY: 'ajvs_quoter_clients_v1',
  STORAGE_COUNTERS_KEY: 'ajvs_quoter_counters_v1',

  currentDoc: null,
  savedDocs: [],
  savedClients: [],
  counters: {
    COT: 26000197,
    OC: 26000001
  },

  // Datos oficiales de AJVS PROYECTOS E.I.R.L.
  COMPANY_INFO: {
    nombre: 'AJVS PROYECTOS E.I.R.L.',
    ruc: '20612076481',
    direccion: 'AV. PERIMETRICA 1503 RES. CONDOMINIO VALLE GRANDE T DPTO. 402 - CARABAYLLO - LIMA - LIMA',
    contacto: '926 536 54',
    email: 'adm.ajvs@gmail.com / tjayo.ajvs@gmail.com',
    rubro: 'VENTA DE ACCESORIOS PARA SANEAMIENTO, INDUSTRIA Y MINERIA. SERVICIOS HIDRAULICOS EN INDUSTRIA .',
    cuentas: [
      { banco: 'BANCO DE CREDITO DEL PERU (SOLES)', numero: '191-2441039-0-58' },
      { banco: 'BCP CCI (SOLES)', numero: '002 191 002441039058 57' },
      { banco: 'BANCO DE LA NACION CTA (SOLES)', numero: '00062145919' }
    ],
    vendedoraDefault: 'TULA JAYO VEGA',
    cargoDefault: 'JEFA DE VENTAS Y LOGISTICA'
  },

  init() {
    this.loadStorage();
    this.initNewDocument('COT', false);
    this.bindEvents();
    this.renderAll();
  },

  // ==========================================================================
  // PERSISTENCIA Y DATOS SEMILLA (EJEMPLOS REALES DE LOS PDFs DE AJVS)
  // ==========================================================================
  DEFAULT_CLIENTS: [
    {
      ruc: '20565900561',
      razonSocial: 'PUMPING ENGINEERING AND MECHANICS SPECIALISTS SAC',
      direccion: 'Cal. los Cactus Nro. 157 Dpto. 0 Int. 0 Urb. Los Halcones. Chaclacayo. Lima, Peru',
      atencion: 'FERNANDO SILVA',
      condicionPago: 'AL CONTADO'
    },
    {
      ruc: '20545044545',
      razonSocial: 'HYDROTECH PERU IMPORT E.I.R.L.',
      direccion: 'PJ. 45 MZA. C5 LOTE. 1 AA.HH. HUAYCAN ZONA J LIMA - LIMA - ATE',
      atencion: 'ANGELO AVALOS',
      condicionPago: 'AL CONTADO'
    },
    {
      ruc: '20508824972',
      razonSocial: 'MUSEO INTERACTIVO DE LIMA S.A.C.',
      direccion: 'JR. TOMASAL NRO 433 - SANTIAGO DE SURCO - LIMA',
      atencion: '',
      condicionPago: 'AL CONTADO'
    }
  ],

  loadStorage() {
    // 1. Clientes / Proveedores frecuentes
    const rawClients = localStorage.getItem(this.STORAGE_CLIENTS_KEY);
    if (rawClients) {
      try {
        this.savedClients = JSON.parse(rawClients);
      } catch (e) {
        this.savedClients = [];
      }
    }
    if (!Array.isArray(this.savedClients)) {
      this.savedClients = [];
    }
    // Asegurar que los clientes semilla estén disponibles sin sobrescribir ediciones del usuario
    let clientsModified = false;
    this.DEFAULT_CLIENTS.forEach(defClient => {
      const exists = this.savedClients.some(
        c => (c.ruc && c.ruc === defClient.ruc) ||
             (c.razonSocial && c.razonSocial.toUpperCase() === defClient.razonSocial.toUpperCase())
      );
      if (!exists) {
        this.savedClients.push({ ...defClient });
        clientsModified = true;
      }
    });
    if (clientsModified || !rawClients) {
      this.saveClients();
    }

    // 2. Contadores correlativos
    const rawCounters = localStorage.getItem(this.STORAGE_COUNTERS_KEY);
    if (rawCounters) {
      try {
        this.counters = { ...this.counters, ...JSON.parse(rawCounters) };
      } catch (e) {}
    }

    // 3. Historial de Cotizaciones y Órdenes de Compra (pre-cargado con 26000194 y 26000196)
    const rawDocs = localStorage.getItem(this.STORAGE_DOCS_KEY);
    if (rawDocs) {
      try {
        this.savedDocs = JSON.parse(rawDocs);
      } catch (e) {
        this.savedDocs = [];
      }
    }
    if (!this.savedDocs || this.savedDocs.length === 0) {
      this.savedDocs = this.getSeedDocuments();
      this.saveDocs();
    }
  },

  getSeedDocuments() {
    return [
      {
        id: 'seed-cot-26000196',
        tipo: 'COT',
        serie: 'COT 001',
        correlativo: '26000196',
        numeroCompleto: 'COT 001 - 26000196',
        clienteRazonSocial: 'HYDROTECH PERU IMPORT E.I.R.L.',
        clienteRuc: '20545044545',
        clienteDireccion: 'PJ. 45 MZA. C5 LOTE. 1 AA.HH. HUAYCAN ZONA J LIMA - LIMA - ATE',
        clienteAtencion: 'ANGELO AVALOS',
        fechaEmision: '2026-10-16',
        fechaVencimiento: '2026-10-23',
        condicionPago: 'AL CONTADO',
        moneda: 'SOLES',
        asunto: 'SERVICIO DE PERFORACION E INSTALACION DE ACCESORIOS EN TANQUE INDUSTRIAL DE 25000 LTS',
        observaciones: '• CONDICIONES DE PAGO: AL CONTADO.',
        vendedoraNombre: 'TULA JAYO VEGA',
        vendedoraCargo: 'JEFA DE VENTAS Y LOGISTICA',
        updatedAt: Date.now() - 3600000,
        items: [
          {
            rowId: 'r-1',
            isSection: true,
            itemNum: '1',
            descripcion: 'SERVICIO'
          },
          {
            rowId: 'r-2',
            isSection: false,
            itemNum: '1.1',
            und: 'und',
            codigo: 'SER01',
            descripcion: 'SERVICIO DE PERFORACION E INSTALACION DE ACCESORIOS EN TANQUE INDUSTRIAL DE 25000 LTS:\n•02 BRIDA ROMPE AGUA DE 6 PULG C-10\n•01 BRIDA ROMPE AGUA DE 4 PULG C-10\n•02 BRIDA ROMPE AGUA DE 3 PULG C-10\n•02 BRIDA ROMPE AGUA DE 2 PULG C-10\n•01 BRIDA ROMPE AGUA DE 1 PULG C-10\n•INSTALACION DE ESCALERA EXTERNA E INTERNA EN TANQUE DE 25000 LTS.',
            cantidad: 1,
            precioUnitario: 3500.00,
            importeOverride: null
          }
        ]
      },
      {
        id: 'seed-cot-26000194',
        tipo: 'COT',
        serie: 'COT 001',
        correlativo: '26000194',
        numeroCompleto: 'COT 001 - 26000194',
        clienteRazonSocial: 'PUMPING ENGINEERING AND MECHANICS SPECIALISTS SAC',
        clienteRuc: '20565900561',
        clienteDireccion: 'Cal. los Cactus Nro. 157 Dpto. 0 Int. 0 Urb. Los Halcones. Chaclacayo. Lima, Peru',
        clienteAtencion: 'FERNANDO SILVA',
        fechaEmision: '2026-10-16',
        fechaVencimiento: '2026-10-23',
        condicionPago: 'AL CONTADO',
        moneda: 'SOLES',
        asunto: 'SUMINISTRO DE ACCESORIOS',
        observaciones: 'TIEMPO DE FABRICACION: 3 DIAS HABILES\n• CONDICIONES DE PAGO: AL CONTADO.',
        vendedoraNombre: 'TULA JAYO VEGA',
        vendedoraCargo: 'JEFA DE VENTAS Y LOGISTICA',
        updatedAt: Date.now() - 7200000,
        items: [
          {
            rowId: 'r-10',
            isSection: true,
            itemNum: '1',
            descripcion: 'SUMINISTRO DE ACCESORIOS'
          },
          {
            rowId: 'r-11',
            isSection: false,
            itemNum: '1.1',
            und: 'und',
            codigo: 'AH0002',
            descripcion: 'TAPON HDPE CON ROSCA MACHO DE 2 PULG',
            cantidad: 4,
            precioUnitario: 65.25,
            importeOverride: 261.00
          },
          {
            rowId: 'r-12',
            isSection: false,
            itemNum: '1.2',
            und: 'und',
            codigo: 'AH0003',
            descripcion: 'TAPON HDPE CON ROSCA MACHO DE 3 PULG',
            cantidad: 4,
            precioUnitario: 84.75,
            importeOverride: 339.02
          },
          {
            rowId: 'r-13',
            isSection: false,
            itemNum: '1.3',
            und: 'und',
            codigo: 'AH0004',
            descripcion: 'TAPON HDPE CON ROSCA MACHO DE 4 PULG',
            cantidad: 4,
            precioUnitario: 118.64,
            importeOverride: 474.56
          }
        ]
      }
    ];
  },

  saveDocs() {
    localStorage.setItem(this.STORAGE_DOCS_KEY, JSON.stringify(this.savedDocs));
  },

  saveClients() {
    localStorage.setItem(this.STORAGE_CLIENTS_KEY, JSON.stringify(this.savedClients));
  },

  saveCounters() {
    localStorage.setItem(this.STORAGE_COUNTERS_KEY, JSON.stringify(this.counters));
  },

  // ==========================================================================
  // GESTIÓN DEL DOCUMENTO ACTIVO
  // ==========================================================================
  getTodayISO() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  },

  getFutureISO(days = 7) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  },

  initNewDocument(tipo = 'COT', notify = true) {
    const isOC = tipo === 'OC';
    const serie = isOC ? 'OC 001' : 'COT 001';
    const nextCorr = String(this.counters[tipo] || (isOC ? 26000001 : 26000197));

    this.currentDoc = {
      id: 'doc-' + Date.now(),
      tipo: tipo,
      serie: serie,
      correlativo: nextCorr,
      numeroCompleto: `${serie} - ${nextCorr}`,
      clienteRazonSocial: '',
      clienteRuc: '',
      clienteDireccion: '',
      clienteAtencion: '',
      fechaEmision: this.getTodayISO(),
      fechaVencimiento: this.getFutureISO(7),
      condicionPago: 'AL CONTADO',
      moneda: 'SOLES',
      asunto: isOC ? 'ADQUISICION DE ACCESORIOS Y MATERIALES' : 'SUMINISTRO DE ACCESORIOS',
      observaciones: isOC
        ? '• LUGAR DE ENTREGA: ALMACÉN AJVS PROYECTOS E.I.R.L.\n• CONDICIONES DE PAGO: AL CONTADO.'
        : 'TIEMPO DE FABRICACION: 3 DIAS HABILES\n• CONDICIONES DE PAGO: AL CONTADO.',
      vendedoraNombre: this.COMPANY_INFO.vendedoraDefault,
      vendedoraCargo: this.COMPANY_INFO.cargoDefault,
      updatedAt: Date.now(),
      items: [
        {
          rowId: 'sec-' + Date.now(),
          isSection: true,
          itemNum: '1',
          descripcion: isOC ? 'REQUERIMIENTO DE MATERIALES / ACCESORIOS' : 'SUMINISTRO DE ACCESORIOS'
        }
      ]
    };

    this.recalculateItemNumbers();
    this.renderAll();
    if (notify && typeof Toast !== 'undefined') {
      Toast.show(isOC ? 'Nueva Orden de Compra iniciada 📦' : 'Nueva Cotización iniciada 📄');
    }
  },

  switchDocType(tipo) {
    if (!this.currentDoc) return;
    if (this.currentDoc.tipo === tipo) return;

    const isOC = tipo === 'OC';
    this.currentDoc.tipo = tipo;
    this.currentDoc.serie = isOC ? 'OC 001' : 'COT 001';
    this.currentDoc.correlativo = String(this.counters[tipo] || (isOC ? 26000001 : 26000197));
    this.currentDoc.numeroCompleto = `${this.currentDoc.serie} - ${this.currentDoc.correlativo}`;

    if (this.currentDoc.asunto === 'SUMINISTRO DE ACCESORIOS' && isOC) {
      this.currentDoc.asunto = 'ADQUISICION DE ACCESORIOS Y MATERIALES';
    } else if (this.currentDoc.asunto === 'ADQUISICION DE ACCESORIOS Y MATERIALES' && !isOC) {
      this.currentDoc.asunto = 'SUMINISTRO DE ACCESORIOS';
    }

    // Si la primera fila es sección por defecto, actualizar su título
    if (this.currentDoc.items.length > 0 && this.currentDoc.items[0].isSection) {
      if (isOC && this.currentDoc.items[0].descripcion === 'SUMINISTRO DE ACCESORIOS') {
        this.currentDoc.items[0].descripcion = 'REQUERIMIENTO DE MATERIALES / ACCESORIOS';
      } else if (!isOC && this.currentDoc.items[0].descripcion === 'REQUERIMIENTO DE MATERIALES / ACCESORIOS') {
        this.currentDoc.items[0].descripcion = 'SUMINISTRO DE ACCESORIOS';
      }
    }

    this.renderAll();
  },

  recalculateItemNumbers() {
    if (!this.currentDoc || !Array.isArray(this.currentDoc.items)) return;
    let sectionIndex = 0;
    let subIndex = 0;

    this.currentDoc.items.forEach(item => {
      if (item.isSection) {
        sectionIndex++;
        subIndex = 0;
        item.itemNum = String(sectionIndex);
      } else {
        if (sectionIndex === 0) {
          sectionIndex = 1;
        }
        subIndex++;
        item.itemNum = `${sectionIndex}.${subIndex}`;
      }
    });
  },

  // ==========================================================================
  // AGREGAR PRODUCTOS DESDE EL CATÁLOGO, CHAT O ADMIN
  // ==========================================================================
  addProductFromCatalog(productId, qty = 1, switchTab = false) {
    const p = CatalogManager.getProductById(productId);
    if (!p) return;

    if (!this.currentDoc) {
      this.initNewDocument('COT', false);
    }

    const isOC = this.currentDoc.tipo === 'OC';
    // En Orden de Compra sugerimos precio_compra (si existe > 0), en Cotización usamos precio_venta (sin IGV)
    let unitPrice = Number(p.precio_venta) || 0;
    if (isOC && Number(p.precio_compra) > 0) {
      // Si el precio de compra registrado incluye IGV o es valor base, usamos valor sin IGV o directo
      unitPrice = Number(p.precio_compra);
    }

    // Verificar si ya existe el mismo código en el documento actual
    const existing = this.currentDoc.items.find(
      it => !it.isSection && it.codigo && p.codigo && it.codigo.toUpperCase() === p.codigo.toUpperCase()
    );

    if (existing) {
      existing.cantidad = (Number(existing.cantidad) || 0) + (Number(qty) || 1);
      existing.importeOverride = null;
    } else {
      this.currentDoc.items.push({
        rowId: 'item-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
        isSection: false,
        itemNum: '',
        und: 'und',
        codigo: p.codigo || 'S/C',
        descripcion: p.descripcion || '',
        cantidad: Number(qty) || 1,
        precioUnitario: Number(unitPrice.toFixed(2)),
        importeOverride: null
      });
    }

    this.recalculateItemNumbers();
    this.renderAll();

    if (typeof Toast !== 'undefined') {
      Toast.show(`➕ "${p.codigo || p.descripcion.slice(0, 22)}" agregado a ${this.currentDoc.tipo === 'OC' ? 'la Orden de Compra' : 'la Cotización'}`);
    }

    if (switchTab) {
      this.openQuoterTab();
    }
  },

  addCustomItem(isService = false) {
    if (!this.currentDoc) return;
    this.currentDoc.items.push({
      rowId: 'custom-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      isSection: false,
      itemNum: '',
      und: 'und',
      codigo: isService ? 'SER01' : 'ACC01',
      descripcion: isService
        ? 'SERVICIO DE INSTALACION / FABRICACION:\n• DETALLE 1\n• DETALLE 2'
        : 'DESCRIPCION DEL PRODUCTO O ACCESORIO',
      cantidad: 1,
      precioUnitario: 100.00,
      importeOverride: null
    });
    this.recalculateItemNumbers();
    this.renderAll();
  },

  addSectionRow(defaultTitle = '') {
    if (!this.currentDoc) return;
    const title = defaultTitle || (this.currentDoc.items.some(i => i.isSection) ? 'SERVICIO / INSTALACION' : 'SUMINISTRO DE ACCESORIOS');
    this.currentDoc.items.push({
      rowId: 'sec-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      isSection: true,
      itemNum: '',
      descripcion: title
    });
    this.recalculateItemNumbers();
    this.renderAll();
  },

  removeItem(rowId) {
    if (!this.currentDoc) return;
    const it = this.currentDoc.items.find(x => x.rowId === rowId);
    const isSec = it ? it.isSection : false;
    this.currentDoc.items = this.currentDoc.items.filter(item => item.rowId !== rowId);
    this.recalculateItemNumbers();
    this.renderAll();
    if (typeof Toast !== 'undefined') {
      Toast.show(isSec ? 'Sección eliminada' : 'Ítem eliminado');
    }
  },

  moveItem(rowId, direction) {
    if (!this.currentDoc) return;
    const idx = this.currentDoc.items.findIndex(it => it.rowId === rowId);
    if (idx === -1) return;
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= this.currentDoc.items.length) return;

    const temp = this.currentDoc.items[idx];
    this.currentDoc.items[idx] = this.currentDoc.items[targetIdx];
    this.currentDoc.items[targetIdx] = temp;

    this.recalculateItemNumbers();
    this.renderAll();
  },

  // ==========================================================================
  // CÁLCULO DE TOTALES Y CONVERSIÓN DE NÚMEROS A LETRAS (SON: ... SOLES)
  // ==========================================================================
  getRowImporte(item) {
    if (item.isSection) return 0;
    if (item.importeOverride !== null && item.importeOverride !== undefined && item.importeOverride !== '') {
      return Number(item.importeOverride) || 0;
    }
    const cant = Number(item.cantidad) || 0;
    const pu = Number(item.precioUnitario) || 0;
    return Number((cant * pu).toFixed(2));
  },

  calculateTotals() {
    if (!this.currentDoc || !Array.isArray(this.currentDoc.items)) {
      return { subtotal: 0, igv: 0, total: 0, sonLetras: 'CERO SOLES CON 00/100 CENTIMOS' };
    }

    let subtotal = 0;
    this.currentDoc.items.forEach(item => {
      if (!item.isSection) {
        subtotal += this.getRowImporte(item);
      }
    });

    subtotal = Number(subtotal.toFixed(2));
    const igv = Number((subtotal * 0.18).toFixed(2));
    const total = Number((subtotal + igv).toFixed(2));
    const monedaNombre = this.currentDoc.moneda === 'DOLARES' ? 'DOLARES AMERICANOS' : 'SOLES';
    const sonLetras = this.numberToSpanishWords(total, monedaNombre);

    return { subtotal, igv, total, sonLetras };
  },

  numberToSpanishWords(amount, currencyLabel = 'SOLES') {
    const num = Math.abs(Number(amount) || 0);
    const enteros = Math.floor(num);
    const centimos = Math.round((num - enteros) * 100);
    const centimosStr = String(centimos).padStart(2, '0');

    const letrasEnteros = this.enteroALetras(enteros);
    return `${letrasEnteros} ${currencyLabel} CON ${centimosStr}/100 CENTIMOS`;
  },

  enteroALetras(n) {
    if (n === 0) return 'CERO';
    if (n === 100) return 'CIEN';

    const unidades = ['', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
    const especiales = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISEIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
    const decenas = ['', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
    const centenas = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];

    const convertirMenorMil = (val) => {
      if (val === 0) return '';
      if (val === 100) return 'CIEN';
      let out = '';
      const c = Math.floor(val / 100);
      const resto = val % 100;
      if (c > 0) out += centenas[c] + ' ';

      if (resto > 0) {
        if (resto < 10) {
          out += unidades[resto];
        } else if (resto < 20) {
          out += especiales[resto - 10];
        } else if (resto === 20) {
          out += 'VEINTE';
        } else if (resto < 30) {
          out += 'VEINTI' + unidades[resto % 10];
        } else {
          const d = Math.floor(resto / 10);
          const u = resto % 10;
          out += decenas[d];
          if (u > 0) out += ' Y ' + unidades[u];
        }
      }
      return out.trim();
    };

    let resultado = '';
    const millones = Math.floor(n / 1000000);
    const restoMillones = n % 1000000;
    const miles = Math.floor(restoMillones / 1000);
    const restoMiles = restoMillones % 1000;

    if (millones > 0) {
      if (millones === 1) {
        resultado += 'UN MILLON ';
      } else {
        resultado += convertirMenorMil(millones) + ' MILLONES ';
      }
    }

    if (miles > 0) {
      if (miles === 1) {
        resultado += 'MIL ';
      } else {
        resultado += convertirMenorMil(miles) + ' MIL ';
      }
    }

    if (restoMiles > 0) {
      resultado += convertirMenorMil(restoMiles);
    }

    return resultado.trim();
  },

  formatDateDDMMYYYY(isoDate) {
    if (!isoDate) return '';
    const parts = String(isoDate).split('-');
    if (parts.length !== 3) return isoDate;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  },

  formatMoney(val) {
    const n = Number(val) || 0;
    return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  },

  escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  },

  // ==========================================================================
  // DIRECTORIO INTELIGENTE DE CLIENTES (AUTODETECCIÓN, SUNAT Y GUARDADO PROGRESIVO)
  // ==========================================================================
  lastLookedUpDocNum: '',
  statusBadgeTimer: null,

  setClientAutoStatus(text, mode = 'detected') {
    const badge = document.getElementById('clientAutoStatusBadge');
    if (!badge) return;
    if (!text) {
      badge.style.display = 'none';
      return;
    }
    badge.textContent = text;
    badge.className = `quoter-client-status-badge ${mode}`;
    badge.style.display = 'inline-flex';

    if (this.statusBadgeTimer) clearTimeout(this.statusBadgeTimer);
    this.statusBadgeTimer = setTimeout(() => {
      badge.style.display = 'none';
    }, 4500);
  },

  upsertClientRecord(clientData, silent = false) {
    const rucClean = String(clientData.ruc || '').trim();
    const razonClean = String(clientData.razonSocial || '').trim().toUpperCase();
    const dirClean = String(clientData.direccion || '').trim();
    const atenClean = String(clientData.atencion || '').trim().toUpperCase();
    const pagoClean = String(clientData.condicionPago || '').trim().toUpperCase();

    if (!rucClean && !razonClean) return null;

    let target = this.savedClients.find(c =>
      (rucClean && c.ruc && c.ruc === rucClean) ||
      (razonClean && c.razonSocial && c.razonSocial.toUpperCase() === razonClean)
    );

    if (target) {
      if (rucClean) target.ruc = rucClean;
      if (razonClean) target.razonSocial = razonClean;
      if (dirClean) target.direccion = dirClean;
      if (atenClean) target.atencion = atenClean;
      if (pagoClean) target.condicionPago = pagoClean;
    } else {
      target = {
        ruc: rucClean,
        razonSocial: razonClean || `CLIENTE RUC ${rucClean}`,
        direccion: dirClean,
        atencion: atenClean,
        condicionPago: pagoClean || 'AL CONTADO'
      };
      this.savedClients.unshift(target);
    }

    this.saveClients();
    this.renderSavedClientsChips();
    if (!silent) {
      this.setClientAutoStatus('Cliente guardado y actualizado', 'saved');
    }
    return target;
  },

  async saveCurrentClientManual() {
    if (!this.currentDoc) return;
    this.syncHeaderInputsToState();

    const ruc = (this.currentDoc.clienteRuc || '').trim();
    const razon = (this.currentDoc.clienteRazonSocial || '').trim();

    if (!ruc && !razon) {
      if (typeof Toast !== 'undefined') {
        Toast.show('Ingresa el RUC/DNI o la Razón Social para guardar el cliente');
      }
      return;
    }

    // Si solo puso el RUC/DNI y aún no tiene Razón Social, intentar autocompletar desde SUNAT antes de guardar
    if ((ruc.length === 11 || ruc.length === 8) && !razon) {
      await this.lookupRucOrDniOnline(ruc, false);
    }

    const saved = this.upsertClientRecord({
      ruc: this.currentDoc.clienteRuc,
      razonSocial: this.currentDoc.clienteRazonSocial,
      direccion: this.currentDoc.clienteDireccion,
      atencion: this.currentDoc.clienteAtencion,
      condicionPago: this.currentDoc.condicionPago
    }, false);

    if (saved && typeof Toast !== 'undefined') {
      Toast.show(`Cliente guardado: ${saved.razonSocial || saved.ruc}`);
    }
  },

  autoSyncCurrentClientIfKnown() {
    if (!this.currentDoc) return;
    const ruc = (this.currentDoc.clienteRuc || '').trim();
    const razon = (this.currentDoc.clienteRazonSocial || '').trim().toUpperCase();
    if (!ruc && !razon) return;

    const existing = this.savedClients.find(c =>
      (ruc && c.ruc && c.ruc === ruc) ||
      (razon && c.razonSocial && c.razonSocial.toUpperCase() === razon)
    );

    // Si ya es un cliente conocido o si ya tiene RUC válido + Razón Social, ir guardando lo que se va rellenando
    if (existing || ((ruc.length === 11 || ruc.length === 8) && razon.length >= 3)) {
      this.upsertClientRecord({
        ruc: this.currentDoc.clienteRuc,
        razonSocial: this.currentDoc.clienteRazonSocial,
        direccion: this.currentDoc.clienteDireccion,
        atencion: this.currentDoc.clienteAtencion,
        condicionPago: this.currentDoc.condicionPago
      }, true);
      this.setClientAutoStatus('Datos de cliente actualizados automáticamente', 'saved');
    }
  },

  clearClientFields() {
    if (!this.currentDoc) return;
    this.currentDoc.clienteRazonSocial = '';
    this.currentDoc.clienteRuc = '';
    this.currentDoc.clienteDireccion = '';
    this.currentDoc.clienteAtencion = '';
    this.lastLookedUpDocNum = '';
    this.renderHeaderInputs();
    this.renderPreviewSheet();
    this.setClientAutoStatus('Campos de cliente limpiados', 'detected');
  },

  deleteSavedClient(clientIndex, event) {
    if (event) event.stopPropagation();
    const c = this.savedClients[clientIndex];
    if (!c) return;
    if (!confirm(`¿Quitar a "${c.razonSocial || c.ruc}" de los clientes guardados?`)) return;
    this.savedClients.splice(clientIndex, 1);
    this.saveClients();
    this.renderSavedClientsChips();
    if (typeof Toast !== 'undefined') {
      Toast.show('Cliente retirado de la lista rápida');
    }
  },

  applyClientToForm(clientObj, sourceLabel = 'Cliente detectado automáticamente') {
    if (!clientObj || !this.currentDoc) return;
    this.currentDoc.clienteRazonSocial = clientObj.razonSocial || this.currentDoc.clienteRazonSocial || '';
    this.currentDoc.clienteRuc = clientObj.ruc || this.currentDoc.clienteRuc || '';
    this.currentDoc.clienteDireccion = clientObj.direccion || this.currentDoc.clienteDireccion || '';
    this.currentDoc.clienteAtencion = clientObj.atencion || this.currentDoc.clienteAtencion || '';
    if (clientObj.condicionPago) {
      this.currentDoc.condicionPago = clientObj.condicionPago;
    }
    this.hideClientDropdowns();
    this.renderHeaderInputs();
    this.renderPreviewSheet();
    this.setClientAutoStatus(sourceLabel, 'detected');
  },

  hideClientDropdowns() {
    const d1 = document.getElementById('qClienteRazonDropdown');
    const d2 = document.getElementById('qClienteRucDropdown');
    if (d1) d1.style.display = 'none';
    if (d2) d2.style.display = 'none';
  },

  renderClientDropdown(mode, rawQuery) {
    const boxId = mode === 'ruc' ? 'qClienteRucDropdown' : 'qClienteRazonDropdown';
    const otherId = mode === 'ruc' ? 'qClienteRazonDropdown' : 'qClienteRucDropdown';
    const box = document.getElementById(boxId);
    const otherBox = document.getElementById(otherId);
    if (otherBox) otherBox.style.display = 'none';
    if (!box) return;

    const q = String(rawQuery || '').trim();
    if (!q) {
      box.style.display = 'none';
      return;
    }

    const qUpper = q.toUpperCase();
    const matches = this.savedClients
      .map((c, idx) => ({ client: c, idx }))
      .filter(({ client }) => {
        const rucMatch = (client.ruc || '').includes(qUpper);
        const nameMatch = (client.razonSocial || '').toUpperCase().includes(qUpper);
        const atenMatch = (client.atencion || '').toUpperCase().includes(qUpper);
        return rucMatch || nameMatch || atenMatch;
      })
      .slice(0, 8);

    // Si el usuario ya seleccionó exactamente ese cliente y no hay más opciones, no estorbar
    if (
      matches.length === 1 &&
      ((mode === 'ruc' && matches[0].client.ruc === qUpper && this.currentDoc.clienteRazonSocial === matches[0].client.razonSocial) ||
       (mode === 'razon' && matches[0].client.razonSocial.toUpperCase() === qUpper && this.currentDoc.clienteRuc === matches[0].client.ruc))
    ) {
      box.style.display = 'none';
      return;
    }

    let html = matches.map(({ client, idx }) => `
      <div class="quoter-autocomplete-item" onclick="QuoterPanel.selectSavedClient(${idx})">
        <div style="min-width: 0;">
          <div style="font-weight: 700; font-size: 0.86rem; color: var(--md-sys-color-on-surface); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            ${this.escapeHtml(client.razonSocial || 'SIN RAZÓN SOCIAL')}
          </div>
          <div style="font-size: 0.76rem; color: var(--md-sys-color-on-surface-variant);">
            RUC/DNI: <strong>${this.escapeHtml(client.ruc || '—')}</strong>
            ${client.atencion ? ` | Atención: ${this.escapeHtml(client.atencion)}` : ''}
            ${client.direccion ? ` | ${this.escapeHtml(client.direccion.slice(0, 42))}${client.direccion.length > 42 ? '…' : ''}` : ''}
          </div>
        </div>
        <span class="material-symbols-rounded" style="color: var(--md-sys-color-primary); font-size: 19px; flex-shrink: 0;">north_west</span>
      </div>
    `).join('');

    if (mode === 'ruc' && (q.length === 11 || q.length === 8)) {
      html += `
        <div class="quoter-autocomplete-item" style="background: var(--md-sys-color-surface-container);" onclick="QuoterPanel.lookupRucOrDniOnline('${this.escapeHtml(q)}', true)">
          <div style="font-size: 0.82rem; font-weight: 700; color: var(--md-sys-color-primary);">
            Consultar ${q.length === 11 ? 'RUC' : 'DNI'} ${this.escapeHtml(q)} en SUNAT y guardar cliente
          </div>
          <span class="material-symbols-rounded" style="color: var(--md-sys-color-primary); font-size: 19px;">travel_explore</span>
        </div>
      `;
    } else if (mode === 'razon' && q.length >= 3 && matches.length === 0) {
      html += `
        <div class="quoter-autocomplete-item" style="background: var(--md-sys-color-surface-container);" onclick="QuoterPanel.saveCurrentClientManual(); QuoterPanel.hideClientDropdowns();">
          <div style="font-size: 0.82rem; font-weight: 700; color: var(--md-sys-color-primary);">
            + Guardar "${this.escapeHtml(q.toUpperCase())}" en Directorio de Clientes
          </div>
          <span class="material-symbols-rounded" style="color: var(--md-sys-color-primary); font-size: 19px;">person_add</span>
        </div>
      `;
    }

    if (!html) {
      box.style.display = 'none';
      return;
    }

    box.innerHTML = html;
    box.style.display = 'block';
  },

  async lookupRucOrDniOnline(rawNumero, notifyToast = false) {
    const num = String(rawNumero || '').replace(/\D/g, '').trim();
    if (!this.currentDoc) return;

    // 1. Primero verificar si ya existe en clientes guardados
    const localMatch = this.savedClients.find(c => c.ruc === num);
    if (localMatch && localMatch.razonSocial) {
      this.applyClientToForm(localMatch, 'Cliente detectado en tu directorio');
      if (notifyToast && typeof Toast !== 'undefined') {
        Toast.show(`Cliente detectado: ${localMatch.razonSocial}`);
      }
      // Si además ya tiene dirección local, no hace falta consultar red salvo que pidan explícitamente
      if (localMatch.direccion && !notifyToast) return;
    }

    if (num.length !== 11 && num.length !== 8) {
      if (notifyToast && typeof Toast !== 'undefined') {
        Toast.show('Ingresa un RUC de 11 dígitos o DNI de 8 dígitos para buscar');
      }
      return;
    }

    if (!notifyToast && this.lastLookedUpDocNum === num) return;
    this.lastLookedUpDocNum = num;

    const isRuc = num.length === 11;
    this.setClientAutoStatus(`Buscando ${isRuc ? 'RUC' : 'DNI'} ${num}...`, 'loading');

    const endpoints = isRuc
      ? [`/api/ruc?numero=${num}`, `https://asistente-precios-web.vercel.app/api/ruc?numero=${num}`]
      : [`/api/dni?numero=${num}`, `https://asistente-precios-web.vercel.app/api/dni?numero=${num}`];

    for (const url of endpoints) {
      try {
        const res = await fetch(url);
        if (!res.ok) continue;
        const data = await res.json();
        const nombre = (data.nombre || data.razonSocial || '').trim();
        if (nombre) {
          let direccionCompleta = (data.direccion || '').trim();
          const extras = [data.distrito, data.provincia, data.departamento]
            .map(x => (x || '').trim())
            .filter(x => x && x !== '-');
          if (direccionCompleta && extras.length) {
            const dirUpper = direccionCompleta.toUpperCase();
            const missingExtras = extras.filter(ex => !dirUpper.includes(ex.toUpperCase()));
            if (missingExtras.length) {
              direccionCompleta = `${direccionCompleta} - ${missingExtras.join(' - ')}`;
            }
          }

          this.currentDoc.clienteRuc = num;
          this.currentDoc.clienteRazonSocial = nombre.toUpperCase();
          if (direccionCompleta && (!this.currentDoc.clienteDireccion || this.currentDoc.clienteDireccion === '—')) {
            this.currentDoc.clienteDireccion = direccionCompleta;
          }

          const savedClient = this.upsertClientRecord({
            ruc: this.currentDoc.clienteRuc,
            razonSocial: this.currentDoc.clienteRazonSocial,
            direccion: this.currentDoc.clienteDireccion,
            atencion: this.currentDoc.clienteAtencion,
            condicionPago: this.currentDoc.condicionPago
          }, true);

          this.hideClientDropdowns();
          this.renderHeaderInputs();
          this.renderPreviewSheet();
          this.setClientAutoStatus(`Detectado: ${savedClient ? savedClient.razonSocial : nombre}`, 'detected');
          if (notifyToast && typeof Toast !== 'undefined') {
            Toast.show(`Datos obtenidos: ${nombre}`);
          }
          return;
        }
      } catch (e) {
        // Intentar siguiente endpoint
      }
    }

    if (notifyToast && typeof Toast !== 'undefined') {
      Toast.show('Puedes escribir la Razón Social y tocar "Guardar Cliente"');
    }
    this.setClientAutoStatus('Completa los datos y se guardarán en el cliente', 'saved');
  },

  // ==========================================================================
  // GUARDAR, CARGAR, DUPLICAR Y EXPORTAR DOCUMENTOS
  // ==========================================================================
  saveCurrentDocument(silentToast = false) {
    if (!this.currentDoc) return;
    this.syncHeaderInputsToState();

    this.currentDoc.numeroCompleto = `${this.currentDoc.serie} - ${this.currentDoc.correlativo}`;
    this.currentDoc.updatedAt = Date.now();

    // Guardar o actualizar cliente en el directorio si tiene RUC o Razón Social
    if (this.currentDoc.clienteRazonSocial.trim() || this.currentDoc.clienteRuc.trim()) {
      this.upsertClientRecord({
        ruc: this.currentDoc.clienteRuc,
        razonSocial: this.currentDoc.clienteRazonSocial,
        direccion: this.currentDoc.clienteDireccion,
        atencion: this.currentDoc.clienteAtencion,
        condicionPago: this.currentDoc.condicionPago
      }, true);
    }

    // Guardar en historial de documentos
    const idx = this.savedDocs.findIndex(
      d => d.id === this.currentDoc.id || d.numeroCompleto === this.currentDoc.numeroCompleto
    );
    const snapshot = JSON.parse(JSON.stringify(this.currentDoc));
    if (idx >= 0) {
      this.savedDocs[idx] = snapshot;
    } else {
      this.savedDocs.unshift(snapshot);
    }
    this.saveDocs();

    // Actualizar correlativo siguiente si es mayor o igual
    const numCorr = parseInt(this.currentDoc.correlativo, 10);
    if (!isNaN(numCorr) && numCorr >= (this.counters[this.currentDoc.tipo] || 0)) {
      this.counters[this.currentDoc.tipo] = numCorr + 1;
      this.saveCounters();
    }

    this.renderAll();
    if (!silentToast && typeof Toast !== 'undefined') {
      Toast.show(`Documento ${this.currentDoc.numeroCompleto} guardado en el historial`);
    }
  },

  loadDocumentById(docId) {
    const found = this.savedDocs.find(d => d.id === docId);
    if (!found) return;
    this.currentDoc = JSON.parse(JSON.stringify(found));
    this.recalculateItemNumbers();
    this.renderAll();
    if (typeof Toast !== 'undefined') {
      Toast.show(`Documento cargado: ${this.currentDoc.numeroCompleto}`);
    }
  },

  duplicateDocumentById(docId) {
    const found = this.savedDocs.find(d => d.id === docId);
    if (!found) return;
    const copy = JSON.parse(JSON.stringify(found));
    const tipo = copy.tipo || 'COT';
    const nextCorr = String(this.counters[tipo] || (tipo === 'OC' ? 26000001 : 26000197));
    copy.id = 'doc-' + Date.now();
    copy.correlativo = nextCorr;
    copy.numeroCompleto = `${copy.serie} - ${nextCorr}`;
    copy.fechaEmision = this.getTodayISO();
    copy.fechaVencimiento = this.getFutureISO(7);
    copy.updatedAt = Date.now();

    this.currentDoc = copy;
    this.recalculateItemNumbers();
    this.renderAll();
    if (typeof Toast !== 'undefined') {
      Toast.show(`Duplicado como ${copy.numeroCompleto}`);
    }
  },

  deleteDocumentById(docId) {
    const found = this.savedDocs.find(d => d.id === docId);
    if (!found) return;
    if (!confirm(`¿Eliminar "${found.numeroCompleto} - ${found.clienteRazonSocial || 'Sin cliente'}" del historial?`)) return;
    this.savedDocs = this.savedDocs.filter(d => d.id !== docId);
    this.saveDocs();
    this.renderHistoryList();
    if (typeof Toast !== 'undefined') {
      Toast.show('Documento eliminado del historial');
    }
  },

  selectSavedClient(clientIndex) {
    const c = this.savedClients[clientIndex];
    if (!c || !this.currentDoc) return;
    this.currentDoc.clienteRazonSocial = c.razonSocial || '';
    this.currentDoc.clienteRuc = c.ruc || '';
    this.currentDoc.clienteDireccion = c.direccion || '';
    this.currentDoc.clienteAtencion = c.atencion || '';
    if (c.condicionPago) this.currentDoc.condicionPago = c.condicionPago;
    this.hideClientDropdowns();
    this.renderAll();
    this.setClientAutoStatus(`Cliente cargado: ${c.razonSocial || c.ruc}`, 'detected');
    if (typeof Toast !== 'undefined') {
      Toast.show(`Datos de ${c.razonSocial || c.ruc} cargados`);
    }
  },

  // ==========================================================================
  // NAVEGACIÓN DE PESTAÑA Y EVENTOS UI
  // ==========================================================================
  openQuoterTab() {
    if (typeof AuthManager !== 'undefined' && !AuthManager.isAuthenticated()) return;

    const tabConsultas = document.getElementById('tabBtnConsultas');
    const tabCotizador = document.getElementById('tabBtnCotizador');
    const tabAdmin = document.getElementById('tabBtnAdmin');

    const viewConsultas = document.getElementById('viewConsultas');
    const viewCotizador = document.getElementById('viewCotizador');
    const viewAdmin = document.getElementById('viewAdmin');

    if (tabConsultas) tabConsultas.classList.remove('active');
    if (tabAdmin) tabAdmin.classList.remove('active');
    if (tabCotizador) tabCotizador.classList.add('active');

    if (viewConsultas) viewConsultas.style.display = 'none';
    if (viewAdmin) viewAdmin.style.display = 'none';
    if (viewCotizador) viewCotizador.style.display = 'block';

    this.renderAll();
    requestAnimationFrame(() => {
      this.fitPreviewToViewport();
    });
  },

  bindEvents() {
    const tabCotizador = document.getElementById('tabBtnCotizador');
    const tabConsultas = document.getElementById('tabBtnConsultas');
    const tabAdmin = document.getElementById('tabBtnAdmin');
    const viewCotizador = document.getElementById('viewCotizador');

    if (tabCotizador) {
      tabCotizador.addEventListener('click', () => {
        this.openQuoterTab();
      });
    }

    // Asegurar que al hacer clic en Chat o Admin se oculte viewCotizador
    if (tabConsultas) {
      tabConsultas.addEventListener('click', () => {
        if (viewCotizador) viewCotizador.style.display = 'none';
        if (tabCotizador) tabCotizador.classList.remove('active');
      });
    }
    if (tabAdmin) {
      tabAdmin.addEventListener('click', () => {
        if (typeof AuthManager !== 'undefined' && !AuthManager.isAdmin()) return;
        if (viewCotizador) viewCotizador.style.display = 'none';
        if (tabCotizador) tabCotizador.classList.remove('active');
      });
    }

    // Buscador rápido de catálogo dentro del cotizador
    const searchInput = document.getElementById('quoterCatalogSearch');
    const searchResultsBox = document.getElementById('quoterCatalogResults');

    if (searchInput && searchResultsBox) {
      searchInput.addEventListener('input', (e) => {
        this.renderCatalogAutocomplete(e.target.value);
      });
      searchInput.addEventListener('focus', (e) => {
        if (e.target.value.trim()) {
          this.renderCatalogAutocomplete(e.target.value);
        }
      });
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.quoter-search-wrapper')) {
          searchResultsBox.style.display = 'none';
        }
        if (!e.target.closest('.quoter-client-field-wrap')) {
          this.hideClientDropdowns();
        }
      });
    }

    // Inputs de cabecera del formulario
    const headerFields = [
      ['qSerie', 'serie'],
      ['qCorrelativo', 'correlativo'],
      ['qClienteRazon', 'clienteRazonSocial'],
      ['qClienteRuc', 'clienteRuc'],
      ['qClienteDireccion', 'clienteDireccion'],
      ['qClienteAtencion', 'clienteAtencion'],
      ['qFechaEmision', 'fechaEmision'],
      ['qFechaVenc', 'fechaVencimiento'],
      ['qCondicionPago', 'condicionPago'],
      ['qMoneda', 'moneda'],
      ['qAsunto', 'asunto'],
      ['qObservaciones', 'observaciones'],
      ['qVendedoraNombre', 'vendedoraNombre'],
      ['qVendedoraCargo', 'vendedoraCargo']
    ];

    headerFields.forEach(([domId, prop]) => {
      const el = document.getElementById(domId);
      if (el) {
        el.addEventListener('input', (e) => {
          if (!this.currentDoc) return;
          const val = e.target.value;
          this.currentDoc[prop] = val;
          this.currentDoc.numeroCompleto = `${this.currentDoc.serie} - ${this.currentDoc.correlativo}`;

          // 1. Si escribe en RUC / DNI: mostrar autocompletado y autodetectar cliente guardado o en SUNAT
          if (prop === 'clienteRuc') {
            const cleanDigits = val.trim();
            this.renderClientDropdown('ruc', cleanDigits);

            const exactMatch = this.savedClients.find(c => c.ruc && c.ruc === cleanDigits);
            if (exactMatch && (cleanDigits.length === 11 || cleanDigits.length === 8)) {
              this.applyClientToForm(exactMatch, 'Cliente detectado por RUC');
              return;
            } else if (cleanDigits.length === 11 || cleanDigits.length === 8) {
              this.lookupRucOrDniOnline(cleanDigits, false);
            }
          }

          // 2. Si escribe en Cliente / Razón Social: mostrar autocompletado y autodetectar si coincide con un cliente guardado
          if (prop === 'clienteRazonSocial') {
            const cleanName = val.trim().toUpperCase();
            this.renderClientDropdown('razon', cleanName);

            if (cleanName.length >= 4) {
              const exactByName = this.savedClients.find(
                c => c.razonSocial && c.razonSocial.toUpperCase() === cleanName
              );
              if (exactByName) {
                this.currentDoc.clienteRuc = exactByName.ruc || this.currentDoc.clienteRuc;
                this.currentDoc.clienteDireccion = exactByName.direccion || this.currentDoc.clienteDireccion;
                this.currentDoc.clienteAtencion = exactByName.atencion || this.currentDoc.clienteAtencion;
                if (exactByName.condicionPago) this.currentDoc.condicionPago = exactByName.condicionPago;
                this.renderHeaderInputs();
                this.hideClientDropdowns();
                this.setClientAutoStatus('Cliente detectado por Razón Social', 'detected');
              }
            }
          }

          // 3. Si va rellenando Atención o Dirección de un cliente existente, actualizar su ficha automáticamente
          if (prop === 'clienteAtencion' || prop === 'clienteDireccion') {
            this.autoSyncCurrentClientIfKnown();
          }

          this.renderPreviewSheet();
        });

        // Al salir de cualquier campo de cliente, sincronizar cambios en la ficha del cliente si ya tiene RUC o Razón Social
        if (['clienteRazonSocial', 'clienteRuc', 'clienteDireccion', 'clienteAtencion', 'condicionPago'].includes(prop)) {
          el.addEventListener('change', () => {
            this.autoSyncCurrentClientIfKnown();
          });
        }
      }
    });

    const razonEl = document.getElementById('qClienteRazon');
    if (razonEl) {
      razonEl.addEventListener('focus', (e) => {
        if (e.target.value.trim()) {
          this.renderClientDropdown('razon', e.target.value);
        }
      });
    }

    const rucEl = document.getElementById('qClienteRuc');
    if (rucEl) {
      rucEl.addEventListener('focus', (e) => {
        if (e.target.value.trim()) {
          this.renderClientDropdown('ruc', e.target.value);
        }
      });
    }

    window.addEventListener('resize', () => {
      this.fitPreviewToViewport();
    });
  },

  syncHeaderInputsToState() {
    if (!this.currentDoc) return;
    const getVal = (id) => {
      const el = document.getElementById(id);
      return el ? el.value : '';
    };
    this.currentDoc.serie = getVal('qSerie') || this.currentDoc.serie;
    this.currentDoc.correlativo = getVal('qCorrelativo') || this.currentDoc.correlativo;
    this.currentDoc.clienteRazonSocial = getVal('qClienteRazon');
    this.currentDoc.clienteRuc = getVal('qClienteRuc');
    this.currentDoc.clienteDireccion = getVal('qClienteDireccion');
    this.currentDoc.clienteAtencion = getVal('qClienteAtencion');
    this.currentDoc.fechaEmision = getVal('qFechaEmision');
    this.currentDoc.fechaVencimiento = getVal('qFechaVenc');
    this.currentDoc.condicionPago = getVal('qCondicionPago');
    this.currentDoc.moneda = getVal('qMoneda') || 'SOLES';
    this.currentDoc.asunto = getVal('qAsunto');
    this.currentDoc.observaciones = getVal('qObservaciones');
    this.currentDoc.vendedoraNombre = getVal('qVendedoraNombre');
    this.currentDoc.vendedoraCargo = getVal('qVendedoraCargo');
    this.currentDoc.numeroCompleto = `${this.currentDoc.serie} - ${this.currentDoc.correlativo}`;
  },

  // ==========================================================================
  // AUTOCOMPLETADO INTELIGENTE DEL CATÁLOGO
  // ==========================================================================
  renderCatalogAutocomplete(query) {
    const box = document.getElementById('quoterCatalogResults');
    if (!box) return;

    const q = (query || '').trim();
    if (!q) {
      box.style.display = 'none';
      return;
    }

    const all = CatalogManager.getAllProducts();
    const normQ = SearchEngine.normalizeText(q);
    const tokens = normQ.split(/\s+/).filter(Boolean);

    const scored = [];
    all.forEach(p => {
      const codeNorm = SearchEngine.normalizeText(p.codigo || '');
      const descNorm = SearchEngine.normalizeText(p.descripcion || '');
      let score = 0;

      if (codeNorm === normQ) score += 200;
      else if (codeNorm.startsWith(normQ)) score += 120;
      else if (codeNorm.includes(normQ)) score += 80;

      let matchedTokens = 0;
      tokens.forEach(tk => {
        if (codeNorm.includes(tk) || descNorm.includes(tk)) {
          matchedTokens++;
          score += 25;
        }
      });

      if (matchedTokens === tokens.length && tokens.length > 0) {
        score += 50;
      }

      if (score > 0) {
        scored.push({ product: p, score });
      }
    });

    scored.sort((a, b) => b.score - a.score);
    const top = scored.slice(0, 12);

    if (top.length === 0) {
      box.innerHTML = `
        <div style="padding: 14px 16px; color: var(--md-sys-color-on-surface-variant); font-size: 0.9rem; display: flex; justify-content: space-between; align-items: center;">
          <span>No se encontró "${this.escapeHtml(q)}" en el catálogo.</span>
          <button type="button" class="m3-tonal-btn active" style="padding: 6px 12px; font-size: 0.8rem;" onclick="QuoterPanel.addCustomFromSearch('${this.escapeHtml(q)}')">
            + Agregar como ítem libre
          </button>
        </div>
      `;
      box.style.display = 'block';
      return;
    }

    box.innerHTML = top.map(({ product: p }) => {
      const ventaSinIgv = (Number(p.precio_venta) || 0).toFixed(2);
      const totalConIgv = (Number(p.total) || 0).toFixed(2);
      return `
        <div class="quoter-autocomplete-item" onclick="QuoterPanel.selectAutocompleteProduct(${p.id})">
          <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
            <span class="m3-code-chip" style="font-size: 0.78rem; flex-shrink: 0;">${this.escapeHtml(p.codigo || 'S/C')}</span>
            <span style="font-weight: 600; font-size: 0.88rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${this.escapeHtml(p.descripcion)}
            </span>
          </div>
          <div style="display: flex; align-items: center; gap: 12px; flex-shrink: 0;">
            <span style="font-size: 0.8rem; color: var(--md-sys-color-on-surface-variant);">
              P/U: <strong>S/ ${ventaSinIgv}</strong> <small>(c/IGV: S/ ${totalConIgv})</small>
            </span>
            <span class="material-symbols-rounded" style="color: var(--md-sys-color-primary); font-size: 20px;">add_circle</span>
          </div>
        </div>
      `;
    }).join('');
    box.style.display = 'block';
  },

  selectAutocompleteProduct(productId) {
    this.addProductFromCatalog(productId, 1, false);
    const searchInput = document.getElementById('quoterCatalogSearch');
    const searchResultsBox = document.getElementById('quoterCatalogResults');
    if (searchInput) searchInput.value = '';
    if (searchResultsBox) searchResultsBox.style.display = 'none';
  },

  addCustomFromSearch(text) {
    if (!this.currentDoc) return;
    this.currentDoc.items.push({
      rowId: 'custom-' + Date.now(),
      isSection: false,
      itemNum: '',
      und: 'und',
      codigo: 'SER01',
      descripcion: String(text || '').toUpperCase(),
      cantidad: 1,
      precioUnitario: 0.00,
      importeOverride: null
    });
    const searchInput = document.getElementById('quoterCatalogSearch');
    const searchResultsBox = document.getElementById('quoterCatalogResults');
    if (searchInput) searchInput.value = '';
    if (searchResultsBox) searchResultsBox.style.display = 'none';
    this.recalculateItemNumbers();
    this.renderAll();
  },

  // ==========================================================================
  // RENDERIZADO COMPLETO DEL PANEL Y LA HOJA OFICIAL A4
  // ==========================================================================
  renderAll() {
    this.updateBadgeCount();
    this.renderDocTypeButtons();
    this.renderSavedClientsChips();
    this.renderHeaderInputs();
    this.renderItemsEditorTable();
    this.renderPreviewSheet();
    this.renderHistoryList();
  },

  updateBadgeCount() {
    const badge = document.getElementById('quoterBadgeCount');
    if (!badge || !this.currentDoc) return;
    const count = this.currentDoc.items.filter(i => !i.isSection).length;
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-flex' : 'none';
  },

  renderDocTypeButtons() {
    if (!this.currentDoc) return;
    const btnCot = document.getElementById('btnModeCotizacion');
    const btnOC = document.getElementById('btnModeOrdenCompra');
    const lblPartner = document.getElementById('lblClienteOrProveedor');

    const isOC = this.currentDoc.tipo === 'OC';
    if (btnCot) btnCot.classList.toggle('active', !isOC);
    if (btnOC) btnOC.classList.toggle('active', isOC);
    if (lblPartner) {
      lblPartner.textContent = isOC
        ? 'Proveedor / Razón Social (Autocompleta al escribir)'
        : 'Cliente / Razón Social (Autocompleta al escribir)';
    }
  },

  renderSavedClientsChips() {
    const container = document.getElementById('quoterSavedClientsBar');
    if (!container) return;

    if (!this.savedClients.length) {
      container.innerHTML = `<span style="font-size: 0.78rem; color: var(--md-sys-color-on-surface-variant);">No hay clientes guardados aún. Escribe un RUC o Razón Social y toca "Guardar / Actualizar Cliente".</span>`;
      return;
    }

    container.innerHTML = this.savedClients.slice(0, 10).map((c, idx) => {
      const isSelected = this.currentDoc && (
        (c.ruc && this.currentDoc.clienteRuc === c.ruc) ||
        (c.razonSocial && (this.currentDoc.clienteRazonSocial || '').toUpperCase() === c.razonSocial.toUpperCase())
      );
      return `
        <div class="quoter-client-chip ${isSelected ? 'selected' : ''}" onclick="QuoterPanel.selectSavedClient(${idx})" title="RUC: ${this.escapeHtml(c.ruc || 'S/R')} | Atención: ${this.escapeHtml(c.atencion || '—')} | Dirección: ${this.escapeHtml(c.direccion || '—')}">
          <span class="material-symbols-rounded" style="font-size: 15px;">business</span>
          <span>${this.escapeHtml((c.razonSocial || c.ruc).length > 32 ? (c.razonSocial || c.ruc).slice(0, 32) + '…' : (c.razonSocial || c.ruc))}</span>
          ${c.ruc ? `<small class="quoter-chip-ruc">${this.escapeHtml(c.ruc)}</small>` : ''}
          <span class="quoter-chip-del material-symbols-rounded" onclick="QuoterPanel.deleteSavedClient(${idx}, event)" title="Quitar de la lista">close</span>
        </div>
      `;
    }).join('');
  },

  renderHeaderInputs() {
    if (!this.currentDoc) return;
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el && document.activeElement !== el) {
        el.value = val !== undefined && val !== null ? val : '';
      }
    };

    setVal('qSerie', this.currentDoc.serie);
    setVal('qCorrelativo', this.currentDoc.correlativo);
    setVal('qClienteRazon', this.currentDoc.clienteRazonSocial);
    setVal('qClienteRuc', this.currentDoc.clienteRuc);
    setVal('qClienteDireccion', this.currentDoc.clienteDireccion);
    setVal('qClienteAtencion', this.currentDoc.clienteAtencion);
    setVal('qFechaEmision', this.currentDoc.fechaEmision);
    setVal('qFechaVenc', this.currentDoc.fechaVencimiento);
    setVal('qCondicionPago', this.currentDoc.condicionPago);
    setVal('qMoneda', this.currentDoc.moneda);
    setVal('qAsunto', this.currentDoc.asunto);
    setVal('qObservaciones', this.currentDoc.observaciones);
    setVal('qVendedoraNombre', this.currentDoc.vendedoraNombre);
    setVal('qVendedoraCargo', this.currentDoc.vendedoraCargo);
  },

  renderItemsEditorTable() {
    const tbody = document.getElementById('quoterItemsEditorBody');
    if (!tbody || !this.currentDoc) return;

    if (this.currentDoc.items.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 24px; color: var(--md-sys-color-on-surface-variant);">
            No hay ítems en este documento. Usa el buscador de arriba o los botones para agregar productos o servicios.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = this.currentDoc.items.map((item) => {
      if (item.isSection) {
        return `
          <tr class="quoter-editor-section-row">
            <td class="q-cell-item" data-label="SECCIÓN" style="font-weight: 800; text-align: center; color: var(--md-sys-color-primary);">${this.escapeHtml(item.itemNum)}</td>
            <td class="q-cell-sec-title" colspan="7" data-label="TÍTULO DE GRUPO">
              <div style="display: flex; align-items: center; gap: 8px; width: 100%;">
                <span class="material-symbols-rounded" style="font-size: 18px; color: var(--md-sys-color-primary);">folder</span>
                <input
                  type="text"
                  class="form-input quoter-inline-input"
                  style="font-weight: 700; text-transform: uppercase; width: 100%;"
                  value="${this.escapeHtml(item.descripcion)}"
                  placeholder="TÍTULO DE LA SECCIÓN (EJ. SUMINISTRO DE ACCESORIOS O SERVICIO)"
                  oninput="QuoterPanel.onEditRowField('${item.rowId}', 'descripcion', this.value)"
                >
              </div>
            </td>
            <td class="q-cell-actions" data-label="ACCIONES" style="text-align: center; white-space: nowrap;">
              <button type="button" class="m3-icon-btn-tonal" onclick="QuoterPanel.moveItem('${item.rowId}', -1)" title="Subir sección">
                <span class="material-symbols-rounded" style="font-size: 17px;">arrow_upward</span>
              </button>
              <button type="button" class="m3-icon-btn-tonal" onclick="QuoterPanel.moveItem('${item.rowId}', 1)" title="Bajar sección">
                <span class="material-symbols-rounded" style="font-size: 17px;">arrow_downward</span>
              </button>
              <button type="button" class="m3-icon-btn-tonal delete" onclick="QuoterPanel.removeItem('${item.rowId}')" title="Eliminar sección">
                <span class="material-symbols-rounded" style="font-size: 17px;">delete</span>
              </button>
            </td>
          </tr>
        `;
      }

      const puSinIgv = Number(item.precioUnitario) || 0;
      const puConIgv = Number((puSinIgv * 1.18).toFixed(2));
      const importe = this.getRowImporte(item);

      return `
        <tr class="quoter-editor-item-row">
          <td class="q-cell-item" data-label="ITEM" style="font-weight: 700; text-align: center; white-space: nowrap;">
            <div style="display: flex; flex-direction: column; align-items: center; gap: 2px;">
              <span>${this.escapeHtml(item.itemNum)}</span>
              <button type="button" class="quoter-inline-del-btn" onclick="QuoterPanel.removeItem('${item.rowId}')" title="Eliminar ítem ${this.escapeHtml(item.itemNum)}">
                <span class="material-symbols-rounded" style="font-size: 15px;">delete</span>
              </button>
            </div>
          </td>
          <td class="q-cell-und" data-label="UND">
            <select class="form-input quoter-inline-input" style="padding: 6px 8px; min-width: 68px;" onchange="QuoterPanel.onEditRowField('${item.rowId}', 'und', this.value)">
              ${['und', 'glb', 'srv', 'pza', 'jgo', 'm', 'kit'].map(u => `<option value="${u}" ${item.und === u ? 'selected' : ''}>${u}</option>`).join('')}
            </select>
          </td>
          <td class="q-cell-code" data-label="CÓDIGO">
            <input
              type="text"
              class="form-input quoter-inline-input"
              style="width: 100%; min-width: 78px; font-weight: 700; text-transform: uppercase;"
              value="${this.escapeHtml(item.codigo)}"
              oninput="QuoterPanel.onEditRowField('${item.rowId}', 'codigo', this.value)"
            >
          </td>
          <td class="q-cell-desc" data-label="DESCRIPCIÓN" style="min-width: 220px;">
            <textarea
              class="form-input quoter-inline-textarea"
              rows="${(item.descripcion || '').includes('\n') ? Math.min(8, (item.descripcion || '').split('\n').length) : 2}"
              oninput="QuoterPanel.onEditRowField('${item.rowId}', 'descripcion', this.value)"
              placeholder="Descripción del producto o servicio (usa Enter para viñetas)"
            >${this.escapeHtml(item.descripcion)}</textarea>
          </td>
          <td class="q-cell-qty" data-label="CANT.">
            <input
              type="number"
              step="any"
              min="0.01"
              class="form-input quoter-inline-input"
              style="width: 100%; min-width: 68px; text-align: center; font-weight: 700;"
              value="${item.cantidad}"
              oninput="QuoterPanel.onEditRowField('${item.rowId}', 'cantidad', this.value)"
            >
          </td>
          <td class="q-cell-pu-sin" data-label="P/U (Sin IGV)">
            <input
              type="number"
              step="0.01"
              class="form-input quoter-inline-input"
              style="width: 100%; min-width: 88px; text-align: right;"
              id="pu-sin-${item.rowId}"
              value="${puSinIgv.toFixed(2)}"
              title="Precio Unitario SIN IGV"
              oninput="QuoterPanel.onEditUnitPrice('${item.rowId}', this.value, false)"
            >
          </td>
          <td class="q-cell-pu-con" data-label="P/U (Con IGV)">
            <input
              type="number"
              step="0.01"
              class="form-input quoter-inline-input"
              style="width: 100%; min-width: 88px; text-align: right; background: var(--md-sys-color-surface-container-highest);"
              id="pu-con-${item.rowId}"
              value="${puConIgv.toFixed(2)}"
              title="Precio Unitario CON IGV (calcula automáticamente el P/U sin IGV)"
              oninput="QuoterPanel.onEditUnitPrice('${item.rowId}', this.value, true)"
            >
          </td>
          <td class="q-cell-importe" data-label="IMPORTE" style="text-align: right; font-weight: 800; white-space: nowrap;" id="importe-cell-${item.rowId}">
            S/ ${this.formatMoney(importe)}
          </td>
          <td class="q-cell-actions" data-label="ACCIONES" style="text-align: center; white-space: nowrap;">
            <button type="button" class="m3-icon-btn-tonal" onclick="QuoterPanel.moveItem('${item.rowId}', -1)" title="Subir ítem">
              <span class="material-symbols-rounded" style="font-size: 17px;">arrow_upward</span>
            </button>
            <button type="button" class="m3-icon-btn-tonal" onclick="QuoterPanel.moveItem('${item.rowId}', 1)" title="Bajar ítem">
              <span class="material-symbols-rounded" style="font-size: 17px;">arrow_downward</span>
            </button>
            <button type="button" class="m3-icon-btn-tonal delete" onclick="QuoterPanel.removeItem('${item.rowId}')" title="Eliminar ítem">
              <span class="material-symbols-rounded" style="font-size: 17px;">delete</span>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  onEditRowField(rowId, field, value) {
    if (!this.currentDoc) return;
    const item = this.currentDoc.items.find(it => it.rowId === rowId);
    if (!item) return;

    if (field === 'cantidad') {
      item.cantidad = parseFloat(value) || 0;
      item.importeOverride = null;
      const impCell = document.getElementById(`importe-cell-${rowId}`);
      if (impCell) impCell.textContent = `S/ ${this.formatMoney(this.getRowImporte(item))}`;
    } else {
      item[field] = value;
    }

    this.renderPreviewSheet();
  },

  onEditUnitPrice(rowId, rawValue, isWithIgv) {
    if (!this.currentDoc) return;
    const item = this.currentDoc.items.find(it => it.rowId === rowId);
    if (!item) return;

    const val = parseFloat(rawValue) || 0;
    item.importeOverride = null;

    if (isWithIgv) {
      const sinIgv = val / 1.18;
      item.precioUnitario = Number(sinIgv.toFixed(2));
      // Guardamos el importe exacto basado en el precio con IGV si aplica (como en el PDF 26000194)
      const exactSinIgvTotal = (val * (Number(item.cantidad) || 1)) / 1.18;
      item.importeOverride = Number(exactSinIgvTotal.toFixed(2));

      const sinInput = document.getElementById(`pu-sin-${rowId}`);
      if (sinInput && document.activeElement !== sinInput) {
        sinInput.value = item.precioUnitario.toFixed(2);
      }
    } else {
      item.precioUnitario = val;
      const conInput = document.getElementById(`pu-con-${rowId}`);
      if (conInput && document.activeElement !== conInput) {
        conInput.value = (val * 1.18).toFixed(2);
      }
    }

    const impCell = document.getElementById(`importe-cell-${rowId}`);
    if (impCell) impCell.textContent = `S/ ${this.formatMoney(this.getRowImporte(item))}`;

    this.renderPreviewSheet();
  },

  // ==========================================================================
  // HOJA A4 OFICIAL DE AJVS PROYECTOS E.I.R.L. (VISTA PREVIA E IMPRESIÓN PDF)
  // ==========================================================================
  getAjvsLogoSvg() {
    return `
      <img src="img/logo-ajvs.jpg" class="ajvs-print-logo" alt="AJVS PROYECTOS EIRL" style="max-width: 165px; max-height: 82px; width: auto; height: auto; object-fit: contain; display: block;">
    `;
  },

  buildPreviewHtml() {
    if (!this.currentDoc) return '';
    const d = this.currentDoc;
    const isOC = d.tipo === 'OC';
    const docTitleBox = isOC ? 'ORDEN DE COMPRA N°' : 'COTIZACION N°';
    const numeroCompleto = `${d.serie || (isOC ? 'OC 001' : 'COT 001')} - ${d.correlativo || ''}`;
    const symbol = d.moneda === 'DOLARES' ? '$' : 'S/';
    const totals = this.calculateTotals();

    const rowsHtml = d.items.map(item => {
      if (item.isSection) {
        return `
          <tr class="ajvs-row-section">
            <td class="c-item">${this.escapeHtml(item.itemNum)}</td>
            <td class="c-und"></td>
            <td class="c-cod"></td>
            <td class="c-desc" style="font-weight: 700;">${this.escapeHtml(item.descripcion)}</td>
            <td class="c-cant"></td>
            <td class="c-pu"></td>
            <td class="c-imp"></td>
          </tr>
        `;
      }

      const descFormatted = this.escapeHtml(item.descripcion || '').replace(/\n/g, '<br>');
      const pu = Number(item.precioUnitario) || 0;
      const imp = this.getRowImporte(item);

      return `
        <tr class="ajvs-row-item">
          <td class="c-item">${this.escapeHtml(item.itemNum)}</td>
          <td class="c-und">${this.escapeHtml(item.und || 'und')}</td>
          <td class="c-cod">${this.escapeHtml(item.codigo || '')}</td>
          <td class="c-desc">${descFormatted}</td>
          <td class="c-cant">${this.escapeHtml(item.cantidad)}</td>
          <td class="c-pu">${this.formatMoney(pu)}</td>
          <td class="c-imp">${this.formatMoney(imp)}</td>
        </tr>
      `;
    }).join('');

    const obsFormatted = this.escapeHtml(d.observaciones || '').replace(/\n/g, '<br>');

    return `
      <div class="ajvs-a4-page" id="ajvsPrintablePage">
        <!-- CABECERA 3 COLUMNAS -->
        <div class="ajvs-header-grid">
          <div class="ajvs-logo-col">
            ${this.getAjvsLogoSvg()}
          </div>

          <div class="ajvs-company-col">
            <div class="ajvs-company-name">${this.escapeHtml(this.COMPANY_INFO.nombre)}</div>
            <div class="ajvs-company-ruc">RUC ${this.escapeHtml(this.COMPANY_INFO.ruc)}</div>
            <div class="ajvs-company-detail">${this.escapeHtml(this.COMPANY_INFO.direccion)}</div>
            <div class="ajvs-company-detail">Contacto: ${this.escapeHtml(this.COMPANY_INFO.contacto)}</div>
            <div class="ajvs-company-detail">Email: ${this.escapeHtml(this.COMPANY_INFO.email)}</div>
          </div>

          <div class="ajvs-docbox-col">
            <div class="ajvs-doc-badge">
              <div class="ajvs-doc-badge-title">${docTitleBox}</div>
              <div class="ajvs-doc-badge-num">${this.escapeHtml(numeroCompleto)}</div>
            </div>
            <div class="ajvs-company-rubro">
              ${this.escapeHtml(this.COMPANY_INFO.rubro)}
            </div>
          </div>
        </div>

        <hr class="ajvs-divider">

        <!-- INFORMACIÓN GENERAL -->
        <div class="ajvs-section-heading">INFORMACIÓN GENERAL</div>
        <div class="ajvs-info-box">
          <div class="ajvs-info-col-left">
            <div class="ajvs-info-row">
              <span class="ajvs-info-label">${isOC ? 'PROVEEDOR / RAZON SOCIAL' : 'CLIENTE / RAZON SOCIAL'}</span>
              <span class="ajvs-info-colon">:</span>
              <span class="ajvs-info-value">${this.escapeHtml(d.clienteRazonSocial || '—')}</span>
            </div>
            <div class="ajvs-info-row">
              <span class="ajvs-info-label">RUC</span>
              <span class="ajvs-info-colon">:</span>
              <span class="ajvs-info-value">${this.escapeHtml(d.clienteRuc || '—')}</span>
            </div>
            <div class="ajvs-info-row">
              <span class="ajvs-info-label">DIRECCIÓN</span>
              <span class="ajvs-info-colon">:</span>
              <span class="ajvs-info-value">${this.escapeHtml(d.clienteDireccion || '—')}</span>
            </div>
            <div class="ajvs-info-row">
              <span class="ajvs-info-label">ATENCIÓN</span>
              <span class="ajvs-info-colon">:</span>
              <span class="ajvs-info-value">${this.escapeHtml(d.clienteAtencion || '—')}</span>
            </div>
          </div>

          <div class="ajvs-info-col-right">
            <div class="ajvs-info-row">
              <span class="ajvs-info-label">FECHA EMISIÓN</span>
              <span class="ajvs-info-colon">:</span>
              <span class="ajvs-info-value">${this.formatDateDDMMYYYY(d.fechaEmision)}</span>
            </div>
            <div class="ajvs-info-row">
              <span class="ajvs-info-label">FECHA DE VENC.</span>
              <span class="ajvs-info-colon">:</span>
              <span class="ajvs-info-value">${this.formatDateDDMMYYYY(d.fechaVencimiento)}</span>
            </div>
            <div class="ajvs-info-row">
              <span class="ajvs-info-label">CONDICIÓN PAGO</span>
              <span class="ajvs-info-colon">:</span>
              <span class="ajvs-info-value">${this.escapeHtml(d.condicionPago || 'AL CONTADO')}</span>
            </div>
            <div class="ajvs-info-row">
              <span class="ajvs-info-label">MONEDA</span>
              <span class="ajvs-info-colon">:</span>
              <span class="ajvs-info-value">${this.escapeHtml(d.moneda || 'SOLES')}</span>
            </div>
          </div>
        </div>

        <!-- BARRA ASUNTO -->
        <div class="ajvs-asunto-bar">
          <strong>ASUNTO:</strong>
          <span>${this.escapeHtml(d.asunto || '')}</span>
        </div>

        <div class="ajvs-intro-line">
          ${isOC
            ? 'Por medio de la presente solicitamos el suministro / atención de lo siguiente:'
            : 'Por medio de la presente nos es grato cotizarle lo siguiente:'}
        </div>

        <!-- TABLA DE ÍTEMS -->
        <table class="ajvs-items-table">
          <thead>
            <tr>
              <th style="width: 44px;">ITEM</th>
              <th style="width: 46px;">UND</th>
              <th style="width: 68px;">COD</th>
              <th>DESCRIPCION</th>
              <th style="width: 52px;">CANT</th>
              <th style="width: 78px;">P/U</th>
              <th style="width: 86px;">IMPORTE</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <!-- TOTALES ALINEADOS A LA DERECHA -->
        <div class="ajvs-totals-wrap">
          <div class="ajvs-totals-table">
            <div class="ajvs-total-line">
              <span class="ajvs-total-lbl">SUBTOTAL :</span>
              <span class="ajvs-total-sym">${symbol}</span>
              <span class="ajvs-total-val">${this.formatMoney(totals.subtotal)}</span>
            </div>
            <div class="ajvs-total-line">
              <span class="ajvs-total-lbl">IGV (18%):</span>
              <span class="ajvs-total-sym">${symbol}</span>
              <span class="ajvs-total-val">${this.formatMoney(totals.igv)}</span>
            </div>
            <div class="ajvs-total-line ajvs-total-grand">
              <span class="ajvs-total-lbl">TOTAL A PAGAR (INCL. IGV):</span>
              <span class="ajvs-total-sym">${symbol}</span>
              <span class="ajvs-total-val">${this.formatMoney(totals.total)}</span>
            </div>
          </div>
        </div>

        <!-- MONTO EN LETRAS (SON: ...) -->
        <div class="ajvs-son-line">
          SON: ${this.escapeHtml(totals.sonLetras)}
        </div>

        <hr class="ajvs-divider" style="margin: 8px 0 10px 0;">

        <!-- OBSERVACIONES -->
        <div class="ajvs-observaciones">
          <div class="ajvs-obs-title">OBSERVACIONES:</div>
          <div class="ajvs-obs-body">${obsFormatted}</div>
        </div>

        <!-- PIE DE PÁGINA: MEDIOS DE PAGO Y VENDEDORA -->
        <div class="ajvs-footer-grid">
          <div class="ajvs-bank-col">
            <div class="ajvs-footer-title">MEDIOS DE PAGOS:</div>
            <table class="ajvs-bank-table">
              <tbody>
                ${this.COMPANY_INFO.cuentas.map(c => `
                  <tr>
                    <td style="padding-right: 16px;">${this.escapeHtml(c.banco)}</td>
                    <td>${this.escapeHtml(c.numero)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="ajvs-seller-col">
            <div class="ajvs-footer-title">${isOC ? 'SOLICITADO POR:' : 'VENDEDORA:'}</div>
            <div class="ajvs-seller-name">${this.escapeHtml(d.vendedoraNombre || this.COMPANY_INFO.vendedoraDefault)}</div>
            <div class="ajvs-seller-role">${this.escapeHtml(d.vendedoraCargo || this.COMPANY_INFO.cargoDefault)}</div>
          </div>
        </div>
      </div>
    `;
  },

  renderPreviewSheet() {
    const container = document.getElementById('ajvsPreviewContainer');
    if (!container) return;
    container.innerHTML = this.buildPreviewHtml();
    this.fitPreviewToViewport();
  },

  fitPreviewToViewport() {
    const container = document.getElementById('ajvsPreviewContainer');
    const page = document.getElementById('ajvsPrintablePage');
    if (!container || !page) return;

    // Reducir temporalmente para medir el ancho real disponible de la columna sin que la hoja A4 la expanda
    page.style.zoom = '0.2';
    const parentEl = container.parentElement || container;
    const rawWidth = parentEl.clientWidth || container.clientWidth || (window.innerWidth - 32);
    const availWidth = rawWidth - 16;
    const baseWidth = 794; // 210mm A4 en px

    if (availWidth > 0 && availWidth < baseWidth) {
      const ratio = Math.max(0.32, Math.min(1, availWidth / baseWidth));
      page.style.zoom = String(Number(ratio.toFixed(3)));
    } else {
      page.style.zoom = '1';
    }
  },

  // ==========================================================================
  // HISTORIAL DE DOCUMENTOS GUARDADOS
  // ==========================================================================
  renderHistoryList() {
    const tbody = document.getElementById('quoterHistoryTableBody');
    if (!tbody) return;

    if (!this.savedDocs || this.savedDocs.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 20px; color: var(--md-sys-color-on-surface-variant);">
            Aún no hay documentos guardados.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = this.savedDocs.map(doc => {
      // Calcular total del doc guardado
      let sub = 0;
      (doc.items || []).forEach(it => {
        if (!it.isSection) {
          if (it.importeOverride !== null && it.importeOverride !== undefined && it.importeOverride !== '') {
            sub += Number(it.importeOverride) || 0;
          } else {
            sub += (Number(it.cantidad) || 0) * (Number(it.precioUnitario) || 0);
          }
        }
      });
      const total = sub * 1.18;
      const isOC = doc.tipo === 'OC';

      return `
        <tr class="admin-table-row quoter-history-row">
          <td data-label="Documento" style="padding: 10px;">
            <span class="m3-code-chip" style="background: ${isOC ? 'var(--md-sys-color-tertiary-container)' : 'var(--md-sys-color-primary-container)'}; color: ${isOC ? 'var(--md-sys-color-on-tertiary-container)' : 'var(--md-sys-color-on-primary-container)'};">
              ${this.escapeHtml(doc.numeroCompleto)}
            </span>
          </td>
          <td data-label="Cliente / Proveedor" style="padding: 10px; font-weight: 600;">
            ${this.escapeHtml(doc.clienteRazonSocial || 'Sin razón social')}
            <div style="font-size: 0.78rem; color: var(--md-sys-color-on-surface-variant); font-weight: 400;">
              RUC: ${this.escapeHtml(doc.clienteRuc || '—')} | Atención: ${this.escapeHtml(doc.clienteAtencion || '—')}
            </div>
          </td>
          <td data-label="Asunto" style="padding: 10px; font-size: 0.85rem;">
            ${this.escapeHtml(doc.asunto || '')}
          </td>
          <td data-label="Emisión" style="padding: 10px; white-space: nowrap;">
            ${this.formatDateDDMMYYYY(doc.fechaEmision)}
          </td>
          <td data-label="Total (Incl. IGV)" style="padding: 10px; font-weight: 800; color: var(--md-sys-color-success); white-space: nowrap;">
            S/ ${this.formatMoney(total)}
          </td>
          <td data-label="Acciones" style="padding: 10px; text-align: center; white-space: nowrap;">
            <button type="button" class="m3-tonal-btn" style="padding: 6px 12px; font-size: 0.8rem;" onclick="QuoterPanel.loadDocumentById('${doc.id}')" title="Abrir y editar">
              <span class="material-symbols-rounded" style="font-size: 16px;">file_open</span>
              <span>Abrir</span>
            </button>
            <button type="button" class="m3-icon-btn-tonal" onclick="QuoterPanel.downloadSavedDocPdf('${doc.id}')" title="Descargar PDF A4 directo">
              <span class="material-symbols-rounded" style="font-size: 17px;">picture_as_pdf</span>
            </button>
            <button type="button" class="m3-icon-btn-tonal" onclick="QuoterPanel.duplicateDocumentById('${doc.id}')" title="Duplicar con nuevo correlativo">
              <span class="material-symbols-rounded" style="font-size: 17px;">content_copy</span>
            </button>
            <button type="button" class="m3-icon-btn-tonal delete" onclick="QuoterPanel.deleteDocumentById('${doc.id}')" title="Eliminar del historial">
              <span class="material-symbols-rounded" style="font-size: 17px;">delete</span>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  async downloadSavedDocPdf(docId) {
    const found = this.savedDocs.find(d => d.id === docId);
    if (!found) return;
    this.currentDoc = JSON.parse(JSON.stringify(found));
    this.recalculateItemNumbers();
    this.renderAll();
    await this.downloadPdfA4();
  },

  // ==========================================================================
  // DESCARGA DIRECTA DE PDF EN FORMATO A4 OFICIAL E IMPRESIÓN A4
  // ==========================================================================
  async downloadPdfA4() {
    if (!this.currentDoc) return;
    this.saveCurrentDocument(true);

    const safeNum = (this.currentDoc.numeroCompleto || 'DOCUMENTO')
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_-]/g, '');
    const fileName = `AJVS_${safeNum}.pdf`;

    if (typeof html2pdf === 'undefined') {
      this.printOrDownloadPdf();
      return;
    }

    if (typeof Toast !== 'undefined') {
      Toast.show('Generando PDF en formato A4...');
    }

    // Guardar posición de scroll del usuario y alinear a (0,0) para evitar desfase en html2canvas
    const prevScrollX = window.scrollX || window.pageXOffset || 0;
    const prevScrollY = window.scrollY || window.pageYOffset || 0;
    window.scrollTo(0, 0);

    // Crear un contenedor A4 exacto (794px = 210mm a 96 DPI) con zoom 1:1 para que nunca salga reducido ni recortado
    const tempWrap = document.createElement('div');
    tempWrap.style.cssText = 'position: absolute; top: 0; left: 0; width: 794px; background: #ffffff; z-index: -9999; pointer-events: none; margin: 0; padding: 0; overflow: visible;';
    tempWrap.innerHTML = this.buildPreviewHtml();
    document.body.appendChild(tempWrap);

    const a4El = tempWrap.querySelector('.ajvs-a4-page');
    if (a4El) {
      a4El.style.width = '794px';
      a4El.style.minWidth = '794px';
      a4El.style.maxWidth = '794px';
      a4El.style.minHeight = '0';
      a4El.style.height = 'auto';
      a4El.style.zoom = '1';
      a4El.style.transform = 'none';
      a4El.style.margin = '0';
      a4El.style.padding = '34px 44px';
      a4El.style.border = 'none';
      a4El.style.boxShadow = 'none';
      a4El.style.borderRadius = '0';
      a4El.style.boxSizing = 'border-box';
    }

    // Esperar a que el logo institucional termine de decodificar
    const imgs = Array.from(tempWrap.querySelectorAll('img'));
    await Promise.all(imgs.map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise(res => {
        img.onload = res;
        img.onerror = res;
      });
    }));

    try {
      const opt = {
        margin: 0,
        filename: fileName,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: 794,
          windowWidth: 794,
          scrollX: 0,
          scrollY: 0,
          x: 0,
          y: 0
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait'
        },
        pagebreak: { mode: 'css' }
      };

      await html2pdf().set(opt).from(a4El || tempWrap).save();
      if (typeof Toast !== 'undefined') {
        Toast.show(`PDF A4 descargado: ${fileName}`);
      }
    } catch (err) {
      console.error('Error al generar PDF A4 directo:', err);
      this.printOrDownloadPdf();
    } finally {
      window.scrollTo(prevScrollX, prevScrollY);
      if (tempWrap && tempWrap.parentNode) {
        tempWrap.parentNode.removeChild(tempWrap);
      }
    }
  },

  printOrDownloadPdf() {
    if (!this.currentDoc) return;
    this.saveCurrentDocument(true);

    const docTitle = `AJVS ${this.currentDoc.numeroCompleto}`.replace(/\s+/g, ' ').trim();
    const originalTitle = document.title;
    document.title = docTitle;

    // Restablecer zoom a 1:1 antes de abrir el diálogo de impresión A4 para que ocupe toda la hoja A4
    const page = document.getElementById('ajvsPrintablePage');
    const prevZoom = page ? page.style.zoom : '1';
    if (page) {
      page.style.zoom = '1';
      page.style.transform = 'none';
    }

    window.print();

    setTimeout(() => {
      document.title = originalTitle;
      if (page) {
        page.style.zoom = prevZoom;
      }
      this.fitPreviewToViewport();
    }, 900);
  },

  exportCurrentDocToExcel() {
    if (!this.currentDoc || typeof XLSX === 'undefined') {
      if (typeof Toast !== 'undefined') Toast.show('Librería Excel no disponible');
      return;
    }
    this.syncHeaderInputsToState();
    const d = this.currentDoc;
    const totals = this.calculateTotals();

    const rows = [
      [this.COMPANY_INFO.nombre, '', '', '', '', docTitleForExcel(d)],
      [`RUC: ${this.COMPANY_INFO.ruc}`, '', '', '', '', d.numeroCompleto],
      [this.COMPANY_INFO.direccion],
      [`Contacto: ${this.COMPANY_INFO.contacto} | Email: ${this.COMPANY_INFO.email}`],
      [],
      ['INFORMACIÓN GENERAL'],
      ['CLIENTE / RAZON SOCIAL:', d.clienteRazonSocial, '', 'FECHA EMISIÓN:', this.formatDateDDMMYYYY(d.fechaEmision)],
      ['RUC:', d.clienteRuc, '', 'FECHA DE VENC.:', this.formatDateDDMMYYYY(d.fechaVencimiento)],
      ['DIRECCIÓN:', d.clienteDireccion, '', 'CONDICIÓN PAGO:', d.condicionPago],
      ['ATENCIÓN:', d.clienteAtencion, '', 'MONEDA:', d.moneda],
      [],
      ['ASUNTO:', d.asunto],
      [],
      ['ITEM', 'UND', 'COD', 'DESCRIPCION', 'CANT', 'P/U', 'IMPORTE']
    ];

    function docTitleForExcel(doc) {
      return doc.tipo === 'OC' ? 'ORDEN DE COMPRA N°' : 'COTIZACION N°';
    }

    d.items.forEach(item => {
      if (item.isSection) {
        rows.push([item.itemNum, '', '', item.descripcion, '', '', '']);
      } else {
        rows.push([
          item.itemNum,
          item.und || 'und',
          item.codigo || '',
          item.descripcion || '',
          Number(item.cantidad) || 0,
          Number(item.precioUnitario) || 0,
          this.getRowImporte(item)
        ]);
      }
    });

    rows.push([]);
    rows.push(['', '', '', '', '', 'SUBTOTAL :', totals.subtotal]);
    rows.push(['', '', '', '', '', 'IGV (18%):', totals.igv]);
    rows.push(['', '', '', '', '', 'TOTAL A PAGAR (INCL. IGV):', totals.total]);
    rows.push(['SON: ' + totals.sonLetras]);
    rows.push([]);
    rows.push(['OBSERVACIONES:']);
    rows.push([d.observaciones]);

    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [
      { wch: 10 },
      { wch: 10 },
      { wch: 14 },
      { wch: 58 },
      { wch: 10 },
      { wch: 16 },
      { wch: 18 }
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, d.tipo === 'OC' ? 'OrdenCompra' : 'Cotizacion');
    const safeFileName = `AJVS_${d.numeroCompleto.replace(/[^a-zA-Z0-9_-]/g, '_')}.xlsx`;
    XLSX.writeFile(wb, safeFileName);

    if (typeof Toast !== 'undefined') {
      Toast.show(`Archivo Excel descargado: ${safeFileName}`);
    }
  }
};
