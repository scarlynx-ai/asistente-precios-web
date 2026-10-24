// Gestor de Modo Noche / Día (Material Design 3)
const ThemeManager = {
  THEME_KEY: 'antigravity_theme_mode',

  init() {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      this.setTheme('dark');
    } else {
      this.setTheme('light');
    }

    const btn = document.getElementById('btnThemeToggle');
    if (btn) {
      btn.addEventListener('click', () => this.toggleTheme());
    }
  },

  setTheme(theme) {
    const isDark = theme === 'dark';
    document.body.classList.toggle('dark-mode', isDark);
    localStorage.setItem(this.THEME_KEY, theme);
    
    const icon = document.getElementById('iconTheme');
    if (icon) {
      icon.textContent = isDark ? 'light_mode' : 'dark_mode';
    }
    const btn = document.getElementById('btnThemeToggle');
    if (btn) {
      btn.title = isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Noche';
    }
  },

  toggleTheme() {
    const isCurrentlyDark = document.body.classList.contains('dark-mode');
    this.setTheme(isCurrentlyDark ? 'light' : 'dark');
    Toast.show(isCurrentlyDark ? 'Modo Claro activado' : 'Modo Noche activado 🌙');
  }
};

// ==========================================================================
// MOTOR DE VOZ CON FRAGMENTACIÓN (CHUNKING) Y PREVENCIÓN DE CORTES
// ==========================================================================
const VoiceEngine = {
  queue: [],
  currentIndex: 0,
  isPlaying: false,
  sessionId: 0,
  activeUtterances: [],
  onStartCallback: null,

  init() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        try { window.speechSynthesis.getVoices(); } catch (e) {}
      };
      try { window.speechSynthesis.getVoices(); } catch (e) {}
    }
  },

  getVoice() {
    if (!('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;
    return voices.find(v => v.lang === 'es-PE')
      || voices.find(v => v.lang === 'es-419')
      || voices.find(v => v.lang.startsWith('es-'))
      || voices.find(v => v.lang.startsWith('es'))
      || null;
  },

  stop() {
    this.sessionId++;
    this.isPlaying = false;
    this.queue = [];
    this.currentIndex = 0;
    this.onStartCallback = null;

    if (this.activeUtterances && this.activeUtterances.length > 0) {
      for (const utt of this.activeUtterances) {
        utt.onstart = null;
        utt.onend = null;
        utt.onerror = null;
      }
      this.activeUtterances = [];
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    }
  },

  formatPrice(num) {
    const val = Number(num) || 0;
    const enteros = Math.floor(val);
    const centimos = Math.round((val - enteros) * 100);
    if (centimos === 0) {
      return enteros === 1 ? '1 sol' : `${enteros} soles`;
    }
    return `${enteros} soles con ${centimos} céntimos`;
  },

  stripEmojis(text) {
    if (!text) return '';
    return String(text)
      .replace(/<[^>]*>/g, ' ')
      .replace(/\p{Extended_Pictographic}/gu, '')
      .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}]/gu, '')
      .replace(/[\uD83C-\uDBFF\uDC00-\uDFFF]/g, '')
      .replace(/[🤖⭐🔧⭕🔩⚙️📏💧💬📋🔊🔒⚠️💡👍👋🛒✨❌✅🌙]/g, '');
  },

  normalizeText(rawText) {
    if (!rawText) return '';
    let text = this.stripEmojis(rawText);

    return text
      .replace(/(\d+)\s*"/g, '$1 pulgadas')
      .replace(/(\d+)\s*\/\s*(\d+)"/g, (m, a, b) => {
        if (a === '1' && b === '2') return 'media pulgada';
        if (a === '3' && b === '4') return 'tres cuartos de pulgada';
        if (a === '5' && b === '8') return 'cinco octavos de pulgada';
        if (a === '1' && b === '4') return 'un cuarto de pulgada';
        if (a === '3' && b === '8') return 'tres octavos de pulgada';
        return `${a} sobre ${b} pulgadas`;
      })
      .replace(/(\d+)\s*mm\b/gi, '$1 milímetros')
      .replace(/(\d+)\s*cm\b/gi, '$1 centímetros')
      .replace(/(\d+)\s*m\b/gi, '$1 metros')
      .replace(/\bPPR\b/gi, 'P P R')
      .replace(/\bHDPE\b/gi, 'H D P E')
      .replace(/\bPVC\b/gi, 'P V C')
      .replace(/\bIFAN\b/gi, 'Ifan')
      .replace(/S\/\s*(\d+(\.\d+)?)/g, (m, p1) => this.formatPrice(p1))
      .replace(/[*_#`~]/g, '')
      .replace(/#/g, 'código ')
      .replace(/\s+/g, ' ')
      .trim();
  },

  splitIntoChunks(rawText, maxLen = 130) {
    const text = this.normalizeText(rawText);
    if (!text) return [];
    if (text.length <= maxLen) return [text];

    const rawTokens = text.split(/([.!?\n,;]+)/);
    const chunks = [];
    let current = '';

    for (let i = 0; i < rawTokens.length; i += 2) {
      const phrase = ((rawTokens[i] || '') + (rawTokens[i + 1] || '')).trim();
      if (!phrase) continue;

      if ((current + ' ' + phrase).trim().length <= maxLen) {
        current = (current + ' ' + phrase).trim();
      } else {
        if (current.trim()) chunks.push(current.trim());

        if (phrase.length > maxLen) {
          const words = phrase.split(/\s+/);
          current = '';
          for (const w of words) {
            if ((current + ' ' + w).trim().length <= maxLen) {
              current = (current + ' ' + w).trim();
            } else {
              if (current.trim()) chunks.push(current.trim());
              current = w;
            }
          }
        } else {
          current = phrase;
        }
      }
    }

    if (current.trim()) chunks.push(current.trim());
    return chunks.filter(c => c.length > 0);
  },

  speak(text, onStartCallback = null) {
    if (!text || !('speechSynthesis' in window)) return;
    this.stop();

    const chunks = this.splitIntoChunks(text, 130);
    if (chunks.length === 0) return;

    const session = ++this.sessionId;
    this.queue = chunks;
    this.currentIndex = 0;
    this.isPlaying = true;
    this.onStartCallback = onStartCallback;

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    setTimeout(() => {
      if (this.sessionId !== session || !this.isPlaying) return;
      this.playNext(session);
    }, 40);
  },

  playNext(session) {
    if (this.sessionId !== session || !this.isPlaying || this.currentIndex >= this.queue.length) {
      if (this.sessionId === session) {
        this.stop();
      }
      return;
    }

    const chunkText = this.queue[this.currentIndex];
    const utterance = new SpeechSynthesisUtterance(chunkText);
    utterance.lang = 'es-PE';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voice = this.getVoice();
    if (voice) utterance.voice = voice;

    this.activeUtterances.push(utterance);

    utterance.onstart = () => {
      if (this.sessionId !== session || !this.isPlaying) return;
      if (this.currentIndex === 0 && this.onStartCallback) {
        const cb = this.onStartCallback;
        this.onStartCallback = null;
        try { cb(); } catch (e) { console.warn(e); }
      }
    };

    utterance.onend = () => {
      if (this.sessionId !== session || !this.isPlaying) return;
      this.currentIndex++;
      this.playNext(session);
    };

    utterance.onerror = (err) => {
      if (err && (err.error === 'canceled' || err.error === 'interrupted')) {
        return;
      }
      if (this.sessionId !== session || !this.isPlaying) return;
      console.warn('VoiceEngine error:', err);
      this.currentIndex++;
      this.playNext(session);
    };

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    window.speechSynthesis.speak(utterance);

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  }
};

// Asistente Chatbot Conversacional
const Assistant = {
  storeModeActive: false, // Ocultar costos al cliente
  autoVoiceEnabled: false, // Salida de voz desactivada por defecto
  speechRecognition: null,
  isListening: false,
  quantities: {}, // Cantidades multiplicadoras
  chatMessages: [],
  hasPlayedGreeting: true,
  lastGreetingTime: 0,

  init() {
    VoiceEngine.init();
    ThemeManager.init();
    this.initSpeechRecognition();
    this.bindEvents();
    this.renderQuickChips();
    this.startInitialChat();
  },

  // Mensaje de bienvenida inicial del Chatbot
  startInitialChat() {
    const count = CatalogManager.getAllProducts().length;
    const hour = new Date().getHours();
    let saludo = '¡Buenos días!';
    if (hour >= 12 && hour < 19) saludo = '¡Buenas tardes!';
    if (hour >= 19 || hour < 6) saludo = '¡Buenas noches!';

    const speechText = `${saludo}. Soy tu Asistente de Precios y Catálogo. Tienes ${count} productos disponibles para consultar. Escríbeme o háblame sobre lo que necesitas.`;

    this.addAssistantMessage(`
      ${saludo} Soy tu **Asistente de Precios y Catálogo** 🤖.
      <br><br>
      Tienes **${count} productos** disponibles para consultar. Escríbeme o háblame sobre lo que necesitas (por ejemplo: *"válvula mariposa 4"*, *"arandela 5/8"*, o el código *"ADB001"*).
    `, null, speechText);
  },

  playGreetingNow(force = false) {
    if (this.hasPlayedGreeting && !force) return;
    if (Date.now() - this.lastGreetingTime < 2000) return;
    if (!this.autoVoiceEnabled) return;
    if (typeof AuthManager !== 'undefined' && !AuthManager.isAuthenticated()) return;

    this.lastGreetingTime = Date.now();

    const count = CatalogManager.getAllProducts().length;
    const hour = new Date().getHours();
    let saludo = '¡Buenos días!';
    if (hour >= 12 && hour < 19) saludo = '¡Buenas tardes!';
    if (hour >= 19 || hour < 6) saludo = '¡Buenas noches!';

    const greetingText = `${saludo}. Soy tu Asistente de Precios y Catálogo. Tienes ${count} productos disponibles para consultar. Escríbeme o háblame sobre lo que necesitas.`;

    VoiceEngine.speak(greetingText, () => {
      // Marcamos como reproducido solo cuando el audio comenzó a sonar en el altavoz
      this.hasPlayedGreeting = true;
    });
  },

  playGreetingIfAuthorized() {
    if (this.hasPlayedGreeting) return;
    if (!this.autoVoiceEnabled) return;
    if (typeof AuthManager !== 'undefined' && !AuthManager.isAuthenticated()) return;

    this.playGreetingNow();
  },

  // Desbloqueo de autoplay en navegadores móviles (primer toque en pantalla)
  setupAutoplayUnlock() {
    const unlockListener = () => {
      if (!this.hasPlayedGreeting && this.autoVoiceEnabled) {
        if (typeof AuthManager !== 'undefined' && AuthManager.isAuthenticated()) {
          this.playGreetingNow(true);
        }
      }
      if (this.hasPlayedGreeting) {
        document.removeEventListener('click', unlockListener, true);
        document.removeEventListener('touchstart', unlockListener, true);
        document.removeEventListener('keydown', unlockListener, true);
      }
    };

    document.addEventListener('click', unlockListener, true);
    document.addEventListener('touchstart', unlockListener, true);
    document.addEventListener('keydown', unlockListener, true);
  },

  // Inicializar reconocimiento de voz
  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.speechRecognition = new SpeechRecognition();
      this.speechRecognition.lang = 'es-PE';
      this.speechRecognition.continuous = false;
      this.speechRecognition.interimResults = false;
      this.speechRecognition.maxAlternatives = 1;

      this.speechRecognition.onstart = () => {
        this.isListening = true;
        const micBtn = document.getElementById('btnMic');
        if (micBtn) micBtn.classList.add('listening');
        Toast.show('🎙️ Escuchando... habla cerca del micrófono');
      };

      this.speechRecognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const input = document.getElementById('chatInput');
        if (input) input.value = transcript;
        this.handleUserSubmit(transcript);
      };

      this.speechRecognition.onerror = (event) => {
        this.stopListening();
        const err = event && event.error ? event.error : 'unknown';
        console.warn('SpeechRecognition error:', err);

        if (err === 'not-allowed') {
          this.addAssistantMessage('⚠️ **Permiso de micrófono bloqueado**: Toca el candado o triángulo en la barra de tu navegador (junto a la dirección IP) y activa el permiso de **Micrófono**.');
          Toast.show('Micrófono bloqueado por el navegador');
        } else if (err === 'service-not-allowed') {
          this.addAssistantMessage('⚠️ **Brave bloquea la voz de Google por privacidad**: Puedes activarlo en *Ajustes de Brave > Privacidad > Reconocimiento de voz de Google*, o abrir la web en Google Chrome.');
          Toast.show('Brave requiere activar la voz en Ajustes');
        } else if (err === 'no-speech') {
          Toast.show('No se detectó voz. Vuelve a tocar el micrófono.');
        } else {
          Toast.show(`Voz no captada (${err}). Puedes escribirlo.`);
        }
      };

      this.speechRecognition.onend = () => {
        this.stopListening();
      };
    }
  },

  async toggleSpeech() {
    if (!this.speechRecognition) {
      Toast.show('Reconocimiento de voz no soportado en este navegador. Usa Chrome.');
      return;
    }

    if (this.isListening) {
      this.speechRecognition.stop();
      this.stopListening();
      return;
    }

    // Solicitar permiso en pantalla si mediaDevices está disponible
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(t => t.stop());
      } catch (e) {
        if (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError') {
          Toast.show('Permiso de micrófono denegado');
          this.addAssistantMessage('⚠️ Permiso de micrófono denegado. Actívalo en la barra del navegador.');
          return;
        }
      }
    }

    try {
      this.speechRecognition.start();
    } catch (e) {
      if (e.name === 'InvalidStateError') {
        this.speechRecognition.stop();
        setTimeout(() => { try { this.speechRecognition.start(); } catch(err){} }, 200);
      }
    }
  },

  stopListening() {
    this.isListening = false;
    const micBtn = document.getElementById('btnMic');
    if (micBtn) micBtn.classList.remove('listening');
  },

  // Motor de Voz con Fragmentación Inteligente (Chunking) para soportar textos largos sin cortes
  speakText(text) {
    if (!this.autoVoiceEnabled) return;
    VoiceEngine.speak(text);
  },

  formatPriceForSpeech(num) {
    return VoiceEngine.formatPrice(num);
  },

  // Lectura individual cuando se toca el icono del parlante en una tarjeta
  speakProduct(productId) {
    let p = null;
    if (typeof productId === 'number') {
      p = CatalogManager.getProductById(productId);
    }
    if (!p) return;

    const qty = this.quantities[p.id] || 1;
    const totalUnit = Number(p.total) || 0;
    const precioHabla = this.formatPriceForSpeech(totalUnit);
    const sinIgvHabla = this.formatPriceForSpeech(p.precio_venta);

    if (qty > 1) {
      const accum = (totalUnit * qty).toFixed(2);
      const accumHabla = this.formatPriceForSpeech(accum);
      VoiceEngine.speak(`${p.descripcion}. Por ${qty} unidades, total a pagar: ${accumHabla}. Precio por unidad: ${precioHabla}.`);
    } else {
      const codigoTxt = p.codigo ? `Código ${p.codigo}. ` : '';
      VoiceEngine.speak(`${p.descripcion}. ${codigoTxt}Precio al público: ${precioHabla}. Sin I G V: ${sinIgvHabla}. Disponible.`);
    }
  },

  bindEvents() {
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('btnSendMessage');
    const clearBtn = document.getElementById('btnClearInput');
    const micBtn = document.getElementById('btnMic');
    const tiendaBtn = document.getElementById('btnModoTienda');
    const voiceToggleBtn = document.getElementById('btnVoiceToggle');

    // Botón para silenciar o activar la voz automática
    if (voiceToggleBtn) {
      voiceToggleBtn.addEventListener('click', () => {
        this.autoVoiceEnabled = !this.autoVoiceEnabled;
        const icon = document.getElementById('iconVoice');

        if (this.autoVoiceEnabled) {
          if (icon) {
            icon.textContent = 'volume_up';
            icon.style.color = 'var(--md-sys-color-primary)';
          }
          Toast.show('Voz automática activada 🔊');
          this.speakText('Voz automática activada.');
        } else {
          window.speechSynthesis.cancel();
          if (icon) {
            icon.textContent = 'volume_off';
            icon.style.color = 'var(--md-sys-color-on-surface-variant)';
          }
          Toast.show('Voz automática silenciada 🔇');
        }
      });
    }

    if (input) {
      input.addEventListener('input', (e) => {
        if (clearBtn) clearBtn.style.display = e.target.value ? 'flex' : 'none';
      });

      input.addEventListener('focus', () => {
        setTimeout(() => this.scrollToBottom(), 250);
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.handleUserSubmit(input.value);
        }
      });
    }

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', () => {
        this.scrollToBottom();
      });
    }

    if (sendBtn) {
      sendBtn.addEventListener('click', () => {
        if (input) this.handleUserSubmit(input.value);
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (input) {
          input.value = '';
          input.focus();
        }
        clearBtn.style.display = 'none';
      });
    }

    if (micBtn) {
      micBtn.addEventListener('click', () => this.toggleSpeech());
    }

    if (tiendaBtn) {
      tiendaBtn.addEventListener('click', () => {
        this.storeModeActive = !this.storeModeActive;
        const icon = document.getElementById('iconModoTienda');
        const text = document.getElementById('textModoTienda');

        if (this.storeModeActive) {
          tiendaBtn.classList.add('active');
          if (icon) icon.textContent = 'visibility_off';
          if (text) text.textContent = 'Costos Ocultos';
          Toast.show('Modo Tienda: Costos de compra ocultos');
        } else {
          tiendaBtn.classList.remove('active');
          if (icon) icon.textContent = 'visibility';
          if (text) text.textContent = 'Ver Costos';
          Toast.show('Costos de compra visibles');
        }

        // Actualizar tarjetas visibles en el chat
        document.querySelectorAll('.m3-cost-details').forEach(el => {
          el.style.display = this.storeModeActive ? 'none' : 'block';
        });
      });
    }
  },

  // Procesar consulta del usuario
  isProcessingQuery: false,

  handleUserSubmit(rawText) {
    if (!rawText || !rawText.trim()) return;
    if (this.isProcessingQuery) return;
    this.isProcessingQuery = true;

    const text = rawText.trim();

    const input = document.getElementById('chatInput');
    if (input) input.value = '';
    const clearBtn = document.getElementById('btnClearInput');
    if (clearBtn) clearBtn.style.display = 'none';

    // 1. Agregar mensaje del usuario al chat
    this.addUserMessage(text);

    // 2. Mostrar indicador de escritura del asistente
    this.showTypingIndicator();

    setTimeout(() => {
      this.removeTypingIndicator();
      this.processQuery(text);
      this.isProcessingQuery = false;
    }, 350);
  },

  buildResultsSpeech(query, results) {
    if (!results || results.length === 0) {
      return `No encontré ningún producto para ${query}. Prueba buscando por ejemplo válvula o arandela.`;
    }

    if (results.length === 1) {
      const p = results[0];
      const precio = this.formatPriceForSpeech(p.total);
      return `Encontré un producto para ${query}: ${p.descripcion}. Precio al público: ${precio}.`;
    }

    const maxToRead = Math.min(results.length, 8);
    const ordinals = ['Primero', 'Segundo', 'Tercero', 'Cuarto', 'Quinto', 'Sexto', 'Séptimo', 'Octavo'];

    let speech = `Encontré ${results.length} opciones para ${query}. `;
    for (let i = 0; i < maxToRead; i++) {
      const p = results[i];
      const ord = ordinals[i] || `Opción ${i + 1}`;
      const precio = this.formatPriceForSpeech(p.total);
      speech += `${ord}: ${p.descripcion}, precio: ${precio}. `;
    }

    if (results.length > maxToRead) {
      const remaining = results.length - maxToRead;
      speech += `Y ${remaining} productos más disponibles en tu pantalla.`;
    }

    return speech;
  },

  processQuery(query) {
    const allProducts = CatalogManager.getAllProducts();

    // Búsqueda especial "todos" o "catalogo"
    const qLower = SearchEngine.normalizeText(query);
    if (qLower === 'todos' || qLower === 'catalogo' || qLower === 'ver todo') {
      const maxCat = Math.min(allProducts.length, 5);
      let catSpeech = `Aquí tienes el catálogo completo con ${allProducts.length} productos. Te menciono los primeros: `;
      for (let i = 0; i < maxCat; i++) {
        const p = allProducts[i];
        catSpeech += `${p.descripcion}, precio: ${this.formatPriceForSpeech(p.total)}. `;
      }
      catSpeech += `Y ${allProducts.length - maxCat} productos más en la lista.`;

      this.addAssistantMessage(`Aquí tienes el catálogo completo (${allProducts.length} productos):`, allProducts, catSpeech);
      this.speakText(catSpeech);
      return;
    }

    const results = SearchEngine.search(allProducts, query);
    const speech = this.buildResultsSpeech(query, results);

    if (results.length === 0) {
      this.addAssistantMessage(`
        No encontré productos coincidentes con **"${query}"**.
        <br><br>
        💡 *Consejo:* Prueba buscando palabras clave más cortas como *"válvula"*, *"arandela"*, *"brida"*, o toca una de las sugerencias abajo.
      `, null, speech);
    } else if (results.length === 1) {
      this.addAssistantMessage(`Encontré exactamente este producto para **"${query}"**:`, results, speech);
    } else {
      this.addAssistantMessage(`Encontré **${results.length} opciones** para **"${query}"**:`, results, speech);
    }

    this.speakText(speech);
  },

  // Render de chips de sugerencia rápida
  renderQuickChips() {
    const container = document.getElementById('chatQuickChips');
    if (!container) return;

    const suggestions = [
      { label: '⭐ Todos', query: 'todos' },
      { label: '🔧 Válvulas', query: 'válvula' },
      { label: '⭕ Bridas', query: 'brida' },
      { label: '🔩 Arandelas', query: 'arandela' },
      { label: '⚙️ Adaptadores', query: 'adaptador' },
      { label: '📏 Varillas', query: 'varilla' },
      { label: '💧 HDPE / PPR', query: 'ppr' }
    ];

    container.innerHTML = suggestions.map(s => `
      <button class="m3-chip" onclick="Assistant.handleQuickChip('${s.query}')">
        <span>${s.label}</span>
      </button>
    `).join('');
  },

  handleQuickChip(query) {
    this.handleUserSubmit(query);
  },

  // Manejo de Mensajes en el Chat
  addUserMessage(text) {
    const feed = document.getElementById('chatFeed');
    if (!feed) return;

    const row = document.createElement('div');
    row.className = 'chat-msg-row user';
    row.innerHTML = `
      <div class="chat-bubble-wrapper">
        <div class="chat-bubble">${this.escapeHtml(text)}</div>
        <div class="chat-msg-footer">
          <span class="chat-time">${this.getTimeString()}</span>
          <button class="chat-msg-speak-btn" title="Escuchar mensaje" onclick="Assistant.speakBubbleText(this)">
            <span class="material-symbols-rounded">volume_up</span>
          </button>
        </div>
      </div>
      <div class="chat-avatar user">
        <span class="material-symbols-rounded">person</span>
      </div>
    `;

    feed.appendChild(row);
    this.scrollToBottom();
  },

  addAssistantMessage(htmlText, products = null, speechText = null) {
    const feed = document.getElementById('chatFeed');
    if (!feed) return;

    const row = document.createElement('div');
    row.className = 'chat-msg-row assistant';

    let productsHtml = '';
    if (products && products.length > 0) {
      // Limitar a los primeros 30 productos si la búsqueda es masiva para no congelar la pantalla
      const displayList = products.slice(0, 30);
      productsHtml = `
        <div class="chat-products-list">
          ${displayList.map(p => this.createProductCardHtml(p)).join('')}
        </div>
      `;
      if (products.length > 30) {
        productsHtml += `<div style="text-align:center; padding: 8px; font-size: 0.85rem; color: var(--md-sys-color-on-surface-variant);">Mostrando los primeros 30 de ${products.length} productos coincidentes.</div>`;
      }
    }

    const dataAttr = speechText ? `data-speech="${this.escapeHtml(speechText)}"` : '';

    row.innerHTML = `
      <div class="chat-avatar assistant">
        <span class="material-symbols-rounded fill">smart_toy</span>
      </div>
      <div class="chat-bubble-wrapper" style="width: 100%;">
        <div class="chat-bubble">${htmlText}</div>
        ${productsHtml}
        <div class="chat-msg-footer">
          <span class="chat-time">${this.getTimeString()}</span>
          <button class="chat-msg-speak-btn" title="Escuchar mensaje completo" ${dataAttr} onclick="Assistant.speakBubbleText(this)">
            <span class="material-symbols-rounded">volume_up</span>
          </button>
        </div>
      </div>
    `;

    feed.appendChild(row);
    if (products && products.length > 0) {
      setTimeout(() => {
        row.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    } else {
      this.scrollToBottom();
    }
  },

  speakBubbleText(buttonEl) {
    if (!buttonEl) return;
    let text = buttonEl.getAttribute('data-speech');
    if (!text) {
      const wrapper = buttonEl.closest('.chat-bubble-wrapper');
      if (wrapper) {
        const bubble = wrapper.querySelector('.chat-bubble');
        if (bubble) text = bubble.innerText || bubble.textContent || '';
      }
    }
    if (!text || !text.trim()) return;

    buttonEl.style.transform = 'scale(1.25)';
    buttonEl.style.color = 'var(--md-sys-color-primary)';
    setTimeout(() => {
      buttonEl.style.transform = '';
      buttonEl.style.color = '';
    }, 450);

    VoiceEngine.speak(text);
  },

  showTypingIndicator() {
    const feed = document.getElementById('chatFeed');
    if (!feed) return;

    const row = document.createElement('div');
    row.id = 'typingIndicator';
    row.className = 'chat-msg-row assistant';
    row.innerHTML = `
      <div class="chat-avatar assistant">
        <span class="material-symbols-rounded fill">smart_toy</span>
      </div>
      <div class="typing-bubble">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    feed.appendChild(row);
    this.scrollToBottom();
  },

  removeTypingIndicator() {
    const ind = document.getElementById('typingIndicator');
    if (ind) ind.remove();
  },

  scrollToBottom() {
    const feed = document.getElementById('chatFeed');
    if (feed) {
      setTimeout(() => {
        feed.scrollTop = feed.scrollHeight;
      }, 50);
    }
  },

  // Tarjeta de Producto con Material 3
  createProductCardHtml(p) {
    const qty = this.quantities[p.id] || 1;
    const totalUnit = Number(p.total) || 0;
    const ventaUnit = Number(p.precio_venta) || 0;
    const igvUnit = Number(p.igv) || 0;
    const compraUnit = Number(p.precio_compra) || 0;
    const totalAccum = (totalUnit * qty).toFixed(2);
    const category = p.categoria || SearchEngine.detectCategory(p.descripcion);

    const isCostHidden = this.storeModeActive;
    const margen = totalUnit - compraUnit;
    const costDisplay = (!isCostHidden && compraUnit > 0) ? 'block' : 'none';

    return `
      <div class="m3-product-card" id="card-${p.id}">
        <div class="m3-card-top-tags">
          <span class="m3-code-chip">
            <span class="material-symbols-rounded" style="font-size: 16px;">tag</span>
            ${p.codigo || 'S/C'}
          </span>
          <span class="m3-cat-chip">${category}</span>
        </div>

        <h4 class="m3-card-title">${p.descripcion}</h4>

        <div class="m3-price-container">
          <div class="m3-price-header">
            <span class="m3-price-tag-label">Precio al Público:</span>
            <span class="m3-price-total">${SearchEngine.formatCurrency(totalUnit)}</span>
          </div>
          <div class="m3-price-details">
            <span>Sin IGV: S/ ${ventaUnit.toFixed(2)}</span>
            <span>IGV (18%): S/ ${igvUnit.toFixed(2)}</span>
          </div>
          <div class="m3-cost-details" style="display: ${costDisplay};">
            Costo compra: <strong>S/ ${compraUnit.toFixed(2)}</strong> | Margen est.: S/ ${margen.toFixed(2)}
          </div>
        </div>

        <div class="m3-row-details">
          <span class="m3-stock-indicator">
            <span class="material-symbols-rounded fill" style="font-size: 16px;">check_circle</span>
            ${p.stock || 'Disponible'}
          </span>

          <div class="m3-calc-control">
            <button class="m3-calc-btn" onclick="Assistant.changeQuantity(${p.id}, -1)">-</button>
            <span class="m3-calc-qty" id="qty-${p.id}">${qty}</span>
            <button class="m3-calc-btn" onclick="Assistant.changeQuantity(${p.id}, 1)">+</button>
            <span class="m3-calc-accum" id="subtotal-${p.id}"> = S/ ${totalAccum}</span>
          </div>
        </div>

        <div class="m3-card-actions">
          <button class="m3-btn-act" style="background: var(--md-sys-color-primary-container); color: var(--md-sys-color-on-primary-container);" onclick="QuoterPanel.addProductFromCatalog(${p.id}, Assistant.quantities[${p.id}] || 1, false)" title="Enviar este producto al Cotizador / Orden de Compra">
            <span class="material-symbols-rounded" style="font-size: 18px;">post_add</span>
            <span>Cotizar</span>
          </button>
          <button class="m3-btn-act m3-btn-whatsapp" onclick="Assistant.shareWhatsapp(${p.id})">
            <span>💬 WhatsApp</span>
          </button>
          <button class="m3-btn-act m3-btn-copy" id="btn-copy-${p.id}" onclick="Assistant.copyQuote(${p.id}, this)">
            <span class="material-symbols-rounded" style="font-size: 18px;">content_copy</span>
            <span>Copiar</span>
          </button>
          <button class="m3-btn-act m3-btn-speak" title="Escuchar producto completo" onclick="Assistant.speakProduct(${p.id})">
            <span class="material-symbols-rounded">volume_up</span>
          </button>
        </div>
      </div>
    `;
  },

  changeQuantity(productId, delta) {
    let cur = this.quantities[productId] || 1;
    cur += delta;
    if (cur < 1) cur = 1;
    this.quantities[productId] = cur;

    const qtyEl = document.getElementById(`qty-${productId}`);
    const subtotalEl = document.getElementById(`subtotal-${productId}`);
    const product = CatalogManager.getProductById(productId);

    if (qtyEl && subtotalEl && product) {
      qtyEl.textContent = cur;
      const totalAccum = (Number(product.total) * cur).toFixed(2);
      subtotalEl.textContent = ` = S/ ${totalAccum}`;
    }
  },

  copyQuote(productId, btnEl) {
    const p = CatalogManager.getProductById(productId);
    if (!p) return;
    const qty = this.quantities[productId] || 1;
    const totalUnit = Number(p.total).toFixed(2);
    const totalAccum = (Number(p.total) * qty).toFixed(2);

    let text = `*${p.descripcion}*\nCódigo: ${p.codigo}\nPrecio Unitario: S/ ${totalUnit} (inc. IGV)`;
    if (qty > 1) {
      text += `\nCantidad: ${qty}\n*Total a cobrar: S/ ${totalAccum}*`;
    }

    const onCopied = () => {
      Toast.show('¡Cotización copiada al portapapeles!');
      if (btnEl) {
        const originalHtml = btnEl.innerHTML;
        btnEl.innerHTML = '<span class="material-symbols-rounded" style="font-size: 18px;">check</span><span>¡Copiado!</span>';
        btnEl.style.background = 'var(--md-sys-color-success-container)';
        btnEl.style.color = 'var(--md-sys-color-on-success-container)';
        setTimeout(() => {
          btnEl.innerHTML = originalHtml;
          btnEl.style.background = '';
          btnEl.style.color = '';
        }, 2000);
      }
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(onCopied).catch(() => {
        this.fallbackCopyText(text, onCopied);
      });
    } else {
      this.fallbackCopyText(text, onCopied);
    }
  },

  fallbackCopyText(text, onSuccess) {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '0';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      textarea.setSelectionRange(0, 99999);
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);

      if (successful && onSuccess) {
        onSuccess();
      }
    } catch (e) {
      console.warn('fallbackCopyText error:', e);
    }
  },

  shareWhatsapp(productId) {
    const p = CatalogManager.getProductById(productId);
    if (!p) return;
    const qty = this.quantities[productId] || 1;
    const totalUnit = Number(p.total).toFixed(2);
    const totalAccum = (Number(p.total) * qty).toFixed(2);

    let msg = `Hola, te comparto el precio:\n\n*${p.descripcion}*\nCódigo: ${p.codigo}\nPrecio: S/ ${totalUnit} con IGV.`;
    if (qty > 1) {
      msg += `\nPara ${qty} unidades el total es: *S/ ${totalAccum}*`;
    }

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  },

  escapeHtml(str) {
    return (str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  },

  getTimeString() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
};