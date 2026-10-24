// Gestor de Catálogo y Panel de Administración
const CatalogManager = {
  STORAGE_KEY: 'antigravity_catalog_v1',
  products: [],

  init() {
    this.loadProducts();
  },

  loadProducts() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        this.products = JSON.parse(saved);
        // Sincronizar productos nuevos agregados en INITIAL_PRODUCTS que no estén aún en localStorage
        if (Array.isArray(INITIAL_PRODUCTS)) {
          let addedNew = false;
          INITIAL_PRODUCTS.forEach(initProd => {
            const exists = this.products.some(
              p => (p.codigo && initProd.codigo && p.codigo.toUpperCase() === initProd.codigo.toUpperCase()) || p.id === initProd.id
            );
            if (!exists) {
              this.products.push({ ...initProd });
              addedNew = true;
            }
          });
          if (addedNew) this.saveToStorage();
        }
      } catch (e) {
        console.error('Error cargando catálogo de localStorage', e);
        this.products = Array.isArray(INITIAL_PRODUCTS) ? [...INITIAL_PRODUCTS] : [];
      }
    } else {
      this.products = Array.isArray(INITIAL_PRODUCTS) ? [...INITIAL_PRODUCTS] : [];
      this.saveToStorage();
    }
  },

  saveToStorage() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.products));
  },

  getAllProducts() {
    return this.products;
  },

  getProductById(id) {
    return this.products.find(p => p.id === Number(id));
  },

  getNextId() {
    if (this.products.length === 0) return 1;
    return Math.max(...this.products.map(p => p.id || 0)) + 1;
  },

  addProduct(productData) {
    const newProduct = {
      id: this.getNextId(),
      codigo: (productData.codigo || '').trim().toUpperCase(),
      descripcion: (productData.descripcion || '').trim().toUpperCase(),
      precio_compra: Number(productData.precio_compra) || 0,
      precio_venta: Number(productData.precio_venta) || 0,
      igv: Number(productData.igv) || 0,
      total: Number(productData.total) || 0,
      stock: productData.stock || 'Disponible',
      categoria: productData.categoria || SearchEngine.detectCategory(productData.descripcion)
    };

    this.products.unshift(newProduct);
    this.saveToStorage();
    return newProduct;
  },

  updateProduct(id, productData) {
    const idx = this.products.findIndex(p => p.id === Number(id));
    if (idx === -1) return false;

    this.products[idx] = {
      ...this.products[idx],
      codigo: (productData.codigo || this.products[idx].codigo).trim().toUpperCase(),
      descripcion: (productData.descripcion || this.products[idx].descripcion).trim().toUpperCase(),
      precio_compra: Number(productData.precio_compra) || 0,
      precio_venta: Number(productData.precio_venta) || 0,
      igv: Number(productData.igv) || 0,
      total: Number(productData.total) || 0,
      stock: productData.stock !== undefined ? productData.stock : this.products[idx].stock,
      categoria: productData.categoria || SearchEngine.detectCategory(productData.descripcion)
    };

    this.saveToStorage();
    return true;
  },

  deleteProduct(id) {
    this.products = this.products.filter(p => p.id !== Number(id));
    this.saveToStorage();
  },

  bulkUpsert(newItems) {
    let inserted = 0;
    let updated = 0;

    newItems.forEach(item => {
      const code = (item.codigo || '').trim().toUpperCase();
      if (!code && !item.descripcion) return;

      const existing = code ? this.products.find(p => p.codigo && p.codigo.toUpperCase() === code) : null;

      if (existing) {
        existing.descripcion = item.descripcion || existing.descripcion;
        existing.precio_compra = Number(item.precio_compra) || existing.precio_compra;
        existing.precio_venta = Number(item.precio_venta) || existing.precio_venta;
        existing.igv = Number(item.igv) || existing.igv;
        existing.total = Number(item.total) || existing.total;
        existing.categoria = SearchEngine.detectCategory(existing.descripcion);
        updated++;
      } else {
        this.products.push({
          id: this.getNextId(),
          codigo: code,
          descripcion: (item.descripcion || '').trim().toUpperCase(),
          precio_compra: Number(item.precio_compra) || 0,
          precio_venta: Number(item.precio_venta) || 0,
          igv: Number(item.igv) || 0,
          total: Number(item.total) || 0,
          stock: 'Disponible',
          categoria: SearchEngine.detectCategory(item.descripcion)
        });
        inserted++;
      }
    });

    this.saveToStorage();
    return { inserted, updated };
  },

  resetCatalog() {
    this.products = Array.isArray(INITIAL_PRODUCTS) ? JSON.parse(JSON.stringify(INITIAL_PRODUCTS)) : [];
    this.saveToStorage();
  }
};

// Interfaz del Panel de Administración
const AdminPanel = {
  currentEditId: null,

  init() {
    CatalogManager.init();
    this.bindEvents();
    this.renderStats();
    this.renderTable();
  },

  bindEvents() {
    // Pestañas de navegación
    const tabConsultas = document.getElementById('tabBtnConsultas');
    const tabCotizador = document.getElementById('tabBtnCotizador');
    const tabAdmin = document.getElementById('tabBtnAdmin');
    const viewConsultas = document.getElementById('viewConsultas');
    const viewCotizador = document.getElementById('viewCotizador');
    const viewAdmin = document.getElementById('viewAdmin');

    if (tabConsultas && tabAdmin) {
      tabConsultas.addEventListener('click', () => {
        if (typeof AuthManager !== 'undefined' && !AuthManager.isAuthenticated()) return;
        tabConsultas.classList.add('active');
        if (tabCotizador) tabCotizador.classList.remove('active');
        tabAdmin.classList.remove('active');
        viewConsultas.style.display = 'flex';
        if (viewCotizador) viewCotizador.style.display = 'none';
        viewAdmin.style.display = 'none';
        if (typeof Assistant.scrollToBottom === 'function') {
          Assistant.scrollToBottom();
        }
      });

      tabAdmin.addEventListener('click', () => {
        if (typeof AuthManager !== 'undefined' && !AuthManager.isAuthenticated()) return;
        
        // Si el usuario es vendedor y no administrador, solicitar contraseña admin
        if (typeof AuthManager !== 'undefined' && !AuthManager.isAdmin()) {
          AuthManager.openAdminUnlockModal();
          return;
        }

        tabAdmin.classList.add('active');
        tabConsultas.classList.remove('active');
        if (tabCotizador) tabCotizador.classList.remove('active');
        viewConsultas.style.display = 'none';
        if (viewCotizador) viewCotizador.style.display = 'none';
        viewAdmin.style.display = 'block';
        this.renderStats();
        this.renderTable();
      });
    }

    // Modal de Producto (Nuevo / Editar)
    const btnNewProduct = document.getElementById('btnNewProduct');
    const modalProduct = document.getElementById('modalProduct');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const btnCancelModal = document.getElementById('btnCancelModal');
    const formProduct = document.getElementById('formProduct');

    if (btnNewProduct) {
      btnNewProduct.addEventListener('click', () => this.openProductModal());
    }

    if (btnCloseModal) btnCloseModal.addEventListener('click', () => this.closeProductModal());
    if (btnCancelModal) btnCancelModal.addEventListener('click', () => this.closeProductModal());

    // Cálculo automático de IGV y Total mientras se ingresa el precio
    const inpVenta = document.getElementById('inpPrecioVenta');
    const inpIGV = document.getElementById('inpIGV');
    const inpTotal = document.getElementById('inpTotal');

    if (inpVenta) {
      inpVenta.addEventListener('input', (e) => {
        const venta = parseFloat(e.target.value) || 0;
        const igv = venta * 0.18;
        const total = venta + igv;
        if (inpIGV) inpIGV.value = igv.toFixed(2);
        if (inpTotal) inpTotal.value = total.toFixed(2);
      });
    }

    if (formProduct) {
      formProduct.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveProductForm();
      });
    }

    // Buscador en la tabla admin
    const tableSearch = document.getElementById('tableSearch');
    if (tableSearch) {
      tableSearch.addEventListener('input', (e) => this.renderTable(e.target.value));
    }

    // Subida y Drag & Drop de Excel
    const dropzone = document.getElementById('excelDropzone');
    const fileInput = document.getElementById('excelFileInput');
    const btnUpload = document.getElementById('btnUploadExcel');

    if (btnUpload && fileInput) {
      btnUpload.addEventListener('click', () => fileInput.click());
    }

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
          this.processExcelFile(e.target.files[0]);
        }
      });
    }

    if (dropzone) {
      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('drag-over');
      });

      dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('drag-over');
      });

      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('drag-over');
        if (e.dataTransfer.files.length > 0) {
          this.processExcelFile(e.dataTransfer.files[0]);
        }
      });
    }

    // Exportar Excel
    const btnExport = document.getElementById('btnExportExcel');
    if (btnExport) {
      btnExport.addEventListener('click', () => this.exportToExcel());
    }

    // Botón de Google Drive Sheets
    const btnGoogle = document.getElementById('btnGoogleSheets');
    if (btnGoogle) {
      btnGoogle.addEventListener('click', () => this.openGoogleModal());
    }
  },

  renderStats() {
    const products = CatalogManager.getAllProducts();
    const statTotal = document.getElementById('statTotalProducts');
    const statCategories = document.getElementById('statTotalCategories');

    if (statTotal) statTotal.textContent = products.length;

    if (statCategories) {
      const cats = new Set(products.map(p => p.categoria || SearchEngine.detectCategory(p.descripcion)));
      statCategories.textContent = cats.size;
    }

    const badgeNav = document.getElementById('navTotalBadge');
    if (badgeNav) badgeNav.textContent = `${products.length} productos`;
  },

  renderTable(filter = '') {
    const tbody = document.getElementById('adminTableBody');
    if (!tbody) return;

    let list = CatalogManager.getAllProducts();

    if (filter.trim()) {
      const f = SearchEngine.normalizeText(filter);
      list = list.filter(p => 
        SearchEngine.normalizeText(p.codigo || '').includes(f) ||
        SearchEngine.normalizeText(p.descripcion || '').includes(f)
      );
    }

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 24px; color: var(--gray-500);">No se encontraron productos coincidentes.</td></tr>`;
      return;
    }

    // Mostrar hasta 200 filas para fluidez
    const renderList = list.slice(0, 200);
    tbody.innerHTML = renderList.map(p => `
      <tr class="admin-table-row">
        <td style="padding: 12px 10px;">
          <span class="m3-code-chip" style="font-size: 0.8rem;">
            ${p.codigo || 'S/C'}
          </span>
        </td>
        <td style="padding: 12px 10px; font-weight: 500; max-width: 320px;">
          ${p.descripcion}
        </td>
        <td style="padding: 12px 10px; color: var(--md-sys-color-on-surface-variant);">
          S/ ${(Number(p.precio_compra) || 0).toFixed(2)}
        </td>
        <td style="padding: 12px 10px;">
          S/ ${(Number(p.precio_venta) || 0).toFixed(2)}
        </td>
        <td style="padding: 12px 10px; color: var(--md-sys-color-on-surface-variant);">
          S/ ${(Number(p.igv) || 0).toFixed(2)}
        </td>
        <td style="padding: 12px 10px;">
          <strong style="color: var(--md-sys-color-success); font-size: 0.95rem;">
            S/ ${(Number(p.total) || 0).toFixed(2)}
          </strong>
        </td>
        <td style="padding: 12px 10px;">
          <div class="m3-action-cell">
            <button class="m3-icon-btn-tonal" onclick="QuoterPanel.addProductFromCatalog(${p.id}, 1, false)" title="Agregar a Cotización / OC">
              <span class="material-symbols-rounded">post_add</span>
            </button>
            <button class="m3-icon-btn-tonal edit" onclick="AdminPanel.editProduct(${p.id})" title="Editar producto">
              <span class="material-symbols-rounded">edit</span>
            </button>
            <button class="m3-icon-btn-tonal delete" onclick="AdminPanel.deleteProductConfirm(${p.id})" title="Eliminar producto">
              <span class="material-symbols-rounded">delete</span>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  },

  openProductModal(product = null) {
    const modal = document.getElementById('modalProduct');
    const title = document.getElementById('modalProductTitle');
    const form = document.getElementById('formProduct');
    if (!modal || !form) return;

    form.reset();

    if (product) {
      this.currentEditId = product.id;
      title.textContent = 'Editar Producto';
      document.getElementById('inpCodigo').value = product.codigo || '';
      document.getElementById('inpDescripcion').value = product.descripcion || '';
      document.getElementById('inpPrecioCompra').value = product.precio_compra || '';
      document.getElementById('inpPrecioVenta').value = product.precio_venta || '';
      document.getElementById('inpIGV').value = (product.igv || 0).toFixed(2);
      document.getElementById('inpTotal').value = (product.total || 0).toFixed(2);
      document.getElementById('inpStock').value = product.stock || 'Disponible';
    } else {
      this.currentEditId = null;
      title.textContent = 'Registrar Nuevo Producto';
      document.getElementById('inpStock').value = 'Disponible';
    }

    modal.classList.add('open');
  },

  closeProductModal() {
    const modal = document.getElementById('modalProduct');
    if (modal) modal.classList.remove('open');
    this.currentEditId = null;
  },

  editProduct(id) {
    const p = CatalogManager.getProductById(id);
    if (p) this.openProductModal(p);
  },

  deleteProductConfirm(id) {
    const p = CatalogManager.getProductById(id);
    if (!p) return;
    if (confirm(`¿Estás seguro de eliminar el producto "${p.descripcion}" (${p.codigo})?`)) {
      CatalogManager.deleteProduct(id);
      Toast.show('Producto eliminado del catálogo');
      this.renderStats();
      this.renderTable(document.getElementById('tableSearch')?.value || '');
      if (typeof Assistant.renderQuickChips === 'function') Assistant.renderQuickChips();
    }
  },

  saveProductForm() {
    const data = {
      codigo: document.getElementById('inpCodigo').value,
      descripcion: document.getElementById('inpDescripcion').value,
      precio_compra: parseFloat(document.getElementById('inpPrecioCompra').value) || 0,
      precio_venta: parseFloat(document.getElementById('inpPrecioVenta').value) || 0,
      igv: parseFloat(document.getElementById('inpIGV').value) || 0,
      total: parseFloat(document.getElementById('inpTotal').value) || 0,
      stock: document.getElementById('inpStock').value || 'Disponible'
    };

    if (!data.descripcion.trim()) {
      alert('La descripción del producto es obligatoria.');
      return;
    }

    if (this.currentEditId) {
      CatalogManager.updateProduct(this.currentEditId, data);
      Toast.show('Producto actualizado exitosamente');
    } else {
      CatalogManager.addProduct(data);
      Toast.show('Nuevo producto registrado exitosamente');
    }

    this.closeProductModal();
    this.renderStats();
    this.renderTable(document.getElementById('tableSearch')?.value || '');
    if (typeof Assistant.renderQuickChips === 'function') Assistant.renderQuickChips();
  },

  // Procesar archivo Excel subido
  processExcelFile(file) {
    if (!window.XLSX) {
      alert('La librería SheetJS no está cargada.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convertir a JSON crudo
        const rawJson = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        if (!rawJson || rawJson.length < 2) {
          alert('El archivo Excel parece estar vacío o sin datos.');
          return;
        }

        // Buscar fila de encabezados (buscamos CODIGO o DESCRIPCION)
        let headerRowIdx = -1;
        for (let r = 0; r < Math.min(15, rawJson.length); r++) {
          const row = rawJson[r] || [];
          const rowStr = row.map(c => String(c).toUpperCase()).join(' ');
          if (rowStr.includes('CODIGO') || rowStr.includes('DESCRIPCION') || rowStr.includes('PRECIO')) {
            headerRowIdx = r;
            break;
          }
        }

        if (headerRowIdx === -1) {
          alert('No se encontraron columnas reconocibles de "CODIGO" o "DESCRIPCION" en las primeras filas del Excel.');
          return;
        }

        const headers = rawJson[headerRowIdx].map(h => String(h || '').trim().toUpperCase());
        const colCodigo = headers.findIndex(h => h.includes('COD'));
        const colDesc = headers.findIndex(h => h.includes('DESC') || h.includes('NOMBRE') || h.includes('ARTICULO'));
        const colCompra = headers.findIndex(h => h.includes('COMPRA') || h.includes('COSTO'));
        const colVenta = headers.findIndex(h => h.includes('VENTA'));
        const colIGV = headers.findIndex(h => h.includes('IGV'));
        const colTotal = headers.findIndex(h => h.includes('TOTAL') || h.includes('FINAL') || h.includes('PUBLICO'));

        const parsedItems = [];
        for (let r = headerRowIdx + 1; r < rawJson.length; r++) {
          const row = rawJson[r];
          if (!row || row.length === 0) continue;

          const cod = colCodigo !== -1 && row[colCodigo] ? String(row[colCodigo]).trim() : '';
          const desc = colDesc !== -1 && row[colDesc] ? String(row[colDesc]).trim() : '';
          
          if (!cod && !desc) continue;

          const pCompra = colCompra !== -1 ? parseFloat(row[colCompra]) || 0 : 0;
          let pVenta = colVenta !== -1 ? parseFloat(row[colVenta]) || 0 : 0;
          let igv = colIGV !== -1 ? parseFloat(row[colIGV]) || 0 : 0;
          let total = colTotal !== -1 ? parseFloat(row[colTotal]) || 0 : 0;

          if (total === 0 && pVenta > 0) {
            igv = pVenta * 0.18;
            total = pVenta + igv;
          } else if (pVenta === 0 && total > 0) {
            pVenta = total / 1.18;
            igv = total - pVenta;
          }

          parsedItems.push({
            codigo: cod,
            descripcion: desc,
            precio_compra: Math.round(pCompra * 100) / 100,
            precio_venta: Math.round(pVenta * 100) / 100,
            igv: Math.round(igv * 100) / 100,
            total: Math.round(total * 100) / 100
          });
        }

        if (parsedItems.length === 0) {
          alert('No se pudieron extraer filas de productos válidas.');
          return;
        }

        const res = CatalogManager.bulkUpsert(parsedItems);
        Toast.show(`¡Excel sincronizado! ${res.updated} actualizados, ${res.inserted} nuevos agregados.`);
        
        this.renderStats();
        this.renderTable();
        if (typeof Assistant.renderQuickChips === 'function') Assistant.renderQuickChips();

      } catch (err) {
        console.error(err);
        alert('Error al leer el archivo Excel: ' + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
  },

  // Exportar inventario actual a un archivo Excel (.xlsx)
  exportToExcel() {
    if (!window.XLSX) {
      alert('Librería SheetJS no disponible.');
      return;
    }

    const products = CatalogManager.getAllProducts();
    const exportData = products.map(p => ({
      'CODIGO': p.codigo,
      'DESCRIPCION': p.descripcion,
      'PRECIO COMPRA': Number(p.precio_compra) || 0,
      'PRECIO VENTA': Number(p.precio_venta) || 0,
      'IGV': Number(p.igv) || 0,
      'TOTAL': Number(p.total) || 0,
      'STOCK': p.stock || 'Disponible',
      'CATEGORIA': p.categoria || SearchEngine.detectCategory(p.descripcion)
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'LISTA DE PRECIOS');

    const fileName = `LISTA_DE_PRECIOS_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    Toast.show('Archivo Excel generado y descargado');
  },

  openGoogleModal() {
    const modal = document.getElementById('modalGoogleSheets');
    if (modal) modal.classList.add('open');
  },

  closeGoogleModal() {
    const modal = document.getElementById('modalGoogleSheets');
    if (modal) modal.classList.remove('open');
  }
};

// Componente de Notificaciones Toast
const Toast = {
  show(message, duration = 3500) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = `<span>🔔</span> <span>${message}</span>`;
    container.appendChild(el);

    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(10px)';
      el.style.transition = 'all 0.3s ease';
      setTimeout(() => el.remove(), 300);
    }, duration);
  }
};