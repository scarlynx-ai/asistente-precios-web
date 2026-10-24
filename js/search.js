// Motor de Búsqueda e Inteligencia de Catálogo
const SearchEngine = {
  // Quitar acentos y caracteres especiales para búsqueda flexible
  normalizeText(str) {
    if (!str) return '';
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s\/\.\-\"]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  },

  // Detectar categoría automáticamente según la descripción
  detectCategory(desc) {
    const d = (desc || '').toUpperCase();
    if (d.includes('VALVULA') || d.includes('VÁLVULA')) return 'Válvulas';
    if (d.includes('BRIDA') || d.includes('BACKING RING')) return 'Bridas y Anillos';
    if (d.includes('ARANDELA')) return 'Arandelas';
    if (d.includes('ADAPTADOR')) return 'Adaptadores';
    if (d.includes('VARILLA')) return 'Varillas';
    if (d.includes('PERNO') || d.includes('TUERCA')) return 'Pernos y Tuercas';
    if (d.includes('HDPE') || d.includes('PPR')) return 'PPR y HDPE';
    if (d.includes('CODO') || d.includes('TEE') || d.includes('UNION') || d.includes('TAPON')) return 'Conexiones';
    return 'General';
  },

  // Limpiar intenciones de lenguaje natural para que su tía pueda escribir como habla
  cleanNaturalQuery(query) {
    let q = this.normalizeText(query);
    const stopWords = [
      'cuanto', 'cuesta', 'cuestan', 'sale', 'salen', 'precio', 'de', 'del', 
      'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'tienes', 'hay', 
      'por', 'favor', 'dame', 'detalle', 'stock', 'informacion', 'info', 'hola',
      'buenas', 'buenos', 'dias', 'tardes', 'a'
    ];
    
    const tokens = q.split(' ').filter(token => token.length > 0 && !stopWords.includes(token));
    return tokens.length > 0 ? tokens : q.split(' ').filter(t => t.length > 0);
  },

  // Búsqueda inteligente multidimensional
  search(products, rawQuery, activeCategory = 'Todos') {
    if (!products || !Array.isArray(products)) return [];

    let filtered = products;

    // Filtro por categoría
    if (activeCategory && activeCategory !== 'Todos') {
      filtered = filtered.filter(p => (p.categoria || this.detectCategory(p.descripcion)) === activeCategory);
    }

    if (!rawQuery || !rawQuery.trim()) {
      return filtered;
    }

    const queryTokens = this.cleanNaturalQuery(rawQuery);
    if (queryTokens.length === 0) return filtered;

    const results = [];

    for (const p of filtered) {
      const codeNorm = this.normalizeText(p.codigo || '');
      const descNorm = this.normalizeText(p.descripcion || '');
      const combined = `${codeNorm} ${descNorm}`;

      // Coincidencia exacta por código
      if (codeNorm === this.normalizeText(rawQuery)) {
        results.push({ item: p, score: 100 });
        continue;
      }

      // Comprobar si todas las palabras de la búsqueda están en la descripción o código
      let allMatch = true;
      let score = 0;

      for (const token of queryTokens) {
        if (combined.includes(token)) {
          score += 10;
          if (codeNorm.includes(token)) score += 15;
        } else {
          allMatch = false;
          break;
        }
      }

      if (allMatch) {
        results.push({ item: p, score });
      }
    }

    // Ordenar por relevancia
    results.sort((a, b) => b.score - a.score);
    return results.map(r => r.item);
  },

  // Formatear precio en Soles
  formatCurrency(amount) {
    const num = Number(amount) || 0;
    return `S/ ${num.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
};