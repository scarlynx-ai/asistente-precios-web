# Asistente y Cotizador de Precios — AJVS Proyectos E.I.R.L.

Aplicación web comercial y asistente interactivo para la consulta instantánea de inventario, cálculo de presupuestos y cotización en tiempo real.

Diseñada para vendedores de campo y mostradores comerciales, permitiendo búsquedas ultrarrápidas de productos eléctricos y de ferretería industrial con control de visibilidad de márgenes de ganancia.

---

## Funcionalidades

- **Búsqueda Inteligente de Productos**: Filtrado instantáneo por nombre, código de fabricante o categoría en más de 180 productos en inventario.
- **Modo Tienda (Protección de Costos)**: Interruptor seguro que oculta los precios de compra y márgenes comerciales al mostrar la pantalla a clientes.
- **Asistente por Voz Integrado**: Consulta manos libres de precios y stock mediante síntesis y reconocimiento de voz en el navegador.
- **Generador de Cotizaciones**: Creación de presupuestos con cálculo dinámico de subtotales, IGV y exportación directa en formato PDF imprimible.
- **Acceso Multi-Dispositivo**: Funciona como PWA responsiva en smartphones, tablets y terminales de escritorio.

---

## Stack Tecnológico

- **Frontend**: HTML5 semántico, CSS3 moderno con variables dinámicas, JavaScript ES6+
- **Alojamiento y Despliegue**: Desplegado en Vercel Edge (`asistente-precios-web.vercel.app`)
- **Almacenamiento Local**: `localStorage` para almacenamiento en caché del catálogo y sesiones de venta

---

## Ejecución Local

Para levantar el entorno local:

```powershell
# Iniciar servidor local
.\server.ps1
```

O abre directamente `index.html` en cualquier navegador moderno.

---

## Mantenimiento

Desarrollado para **AJVS PROYECTOS E.I.R.L.** por **Scarlynx**.
