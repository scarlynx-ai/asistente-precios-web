// Catálogo precargado extraído de 'LISTA DE PRECIOS - 2025.xlsm'
const INITIAL_PRODUCTS = [
    {
        "id":  1,
        "codigo":  "ADB001",
        "descripcion":  "ADAPTADOR BRIDA DE 50MM PPR - IFAN",
        "precio_compra":  35,
        "precio_venta":  76.27,
        "igv":  13.73,
        "total":  90
    },
    {
        "id":  2,
        "codigo":  "ADB002",
        "descripcion":  "ADAPTADOR BRIDA DE 90MM PPR - IFAN",
        "precio_compra":  70,
        "precio_venta":  96.82,
        "igv":  17.43,
        "total":  114.25
    },
    {
        "id":  3,
        "codigo":  "HDPE024",
        "descripcion":  "ADAPTADOR DE 6 PULGADAS SCH 80 HILO NPT",
        "precio_compra":  0,
        "precio_venta":  55,
        "igv":  9.9,
        "total":  64.9
    },
    {
        "id":  4,
        "codigo":  "APZ008",
        "descripcion":  "ARANDELAS PLANAS 3/4 PULGADAS ZINCADO",
        "precio_compra":  0,
        "precio_venta":  0.74,
        "igv":  0.13,
        "total":  0.87
    },
    {
        "id":  5,
        "codigo":  "AINOX002",
        "descripcion":  "ARANDELAS PLANAS 5/8 INOXIDABLES 304",
        "precio_compra":  0.5,
        "precio_venta":  0.68,
        "igv":  0.12,
        "total":  0.8
    },
    {
        "id":  6,
        "codigo":  "APZ006",
        "descripcion":  "ARANDELAS PLANAS 5/8 PULGADAS ZINCADO",
        "precio_compra":  0,
        "precio_venta":  0.65,
        "igv":  0.12,
        "total":  0.77
    },
    {
        "id":  7,
        "codigo":  "AINOX003",
        "descripcion":  "ARANDELAS PRESION 5/8 INOX 304",
        "precio_compra":  0.7,
        "precio_venta":  0.86,
        "igv":  0.15,
        "total":  1.01
    },
    {
        "id":  8,
        "codigo":  "BRA001",
        "descripcion":  "BACKING RING 3\" HD ASTM A536 ANSI SDR11 CLASE 150 C/ PINTURA EPOXICA",
        "precio_compra":  31.2,
        "precio_venta":  35,
        "igv":  6.3,
        "total":  41.3
    },
    {
        "id":  9,
        "codigo":  "BRA002",
        "descripcion":  "BACKING RING 4\" HD ASTM A536 ANSI SDR11 CLASE 150 C/ PINTURA EPOXICA",
        "precio_compra":  31.2,
        "precio_venta":  47.2,
        "igv":  8.5,
        "total":  55.7
    },
    {
        "id":  10,
        "codigo":  "HDPE019",
        "descripcion":  "BRANCH SADDLE 110MM X 3/4\" HDPE",
        "precio_compra":  0,
        "precio_venta":  18,
        "igv":  3.24,
        "total":  21.24
    },
    {
        "id":  11,
        "codigo":  "HDPE006",
        "descripcion":  "BRANCH SADDLE DE 110MM X  1/2 HDPE",
        "precio_compra":  0,
        "precio_venta":  19,
        "igv":  3.42,
        "total":  22.42
    },
    {
        "id":  12,
        "codigo":  "HDPE004",
        "descripcion":  "BRANCH SADDLE DE 110MM X 1\" HDPE",
        "precio_compra":  0,
        "precio_venta":  16,
        "igv":  2.88,
        "total":  18.88
    },
    {
        "id":  13,
        "codigo":  "HDPE007",
        "descripcion":  "BRANCH SADDLE DE 160MM X 1\" HDPE",
        "precio_compra":  0,
        "precio_venta":  38,
        "igv":  6.84,
        "total":  44.84
    },
    {
        "id":  14,
        "codigo":  "HDPE014",
        "descripcion":  "BRANCH SADDLE DE 90MM X 3/4\" HDPE SDR11",
        "precio_compra":  0,
        "precio_venta":  13,
        "igv":  2.34,
        "total":  15.34
    },
    {
        "id":  15,
        "codigo":  "APPR0067",
        "descripcion":  "BRIDA + BUJE DE 110MM PPR LESSO",
        "precio_compra":  120,
        "precio_venta":  197.31,
        "igv":  35.52,
        "total":  232.83
    },
    {
        "id":  16,
        "codigo":  "APPR0066",
        "descripcion":  "BRIDA + BUJE DE 160MM PPR LESSO",
        "precio_compra":  215,
        "precio_venta":  302.8,
        "igv":  54.5,
        "total":  357.3
    },
    {
        "id":  17,
        "codigo":  "SCH006",
        "descripcion":  "BRIDA VAN STONE Ø4\" SCH80 ASTM",
        "precio_compra":  50,
        "precio_venta":  66.95,
        "igv":  12.05,
        "total":  79
    },
    {
        "id":  18,
        "codigo":  "SCH007",
        "descripcion":  "BRIDA VAN STONE Ø6\" SCH80 ASTM",
        "precio_compra":  0,
        "precio_venta":  67,
        "igv":  12.06,
        "total":  79.06
    },
    {
        "id":  19,
        "codigo":  "CHB004",
        "descripcion":  "CARRETE BRIDADO DE HDPE DE 2\" CON PERNOS INOX COMPLETOS Y EMPAQUE.",
        "precio_compra":  0,
        "precio_venta":  0,
        "igv":  0,
        "total":  0
    },
    {
        "id":  20,
        "codigo":  "CHB006",
        "descripcion":  "CARRETE BRIDADO DE HDPE DE 250MM CON PERNOS INOX COMPLETOS Y EMPAQUE.",
        "precio_compra":  0,
        "precio_venta":  2150,
        "igv":  387,
        "total":  2537
    },
    {
        "id":  21,
        "codigo":  "CHB003",
        "descripcion":  "CARRETE BRIDADO DE HDPE DE 3\" CON PERNOS INOX COMPLETOS Y EMPAQUE.",
        "precio_compra":  0,
        "precio_venta":  630,
        "igv":  113.4,
        "total":  743.4
    },
    {
        "id":  22,
        "codigo":  "CHB005",
        "descripcion":  "CARRETE BRIDADO DE HDPE DE 4\" CON PERNOS INOX COMPLETOS Y EMPAQUE.",
        "precio_compra":  0,
        "precio_venta":  820,
        "igv":  147.6,
        "total":  967.6
    },
    {
        "id":  23,
        "codigo":  "CHB001",
        "descripcion":  "CARRETE BRIDADO DE HDPE DE 6\" CON PERNOS INOX COMPLETOS Y EMPAQUE.",
        "precio_compra":  0,
        "precio_venta":  1050,
        "igv":  189,
        "total":  1239
    },
    {
        "id":  24,
        "codigo":  "CHB002",
        "descripcion":  "CARRETE BRIDADO DE HDPE DE 8\" CON PERNOS INOX COMPLETOS Y EMPAQUE.",
        "precio_compra":  0,
        "precio_venta":  1600,
        "igv":  288,
        "total":  1888
    },
    {
        "id":  25,
        "codigo":  "APPR0034",
        "descripcion":  "CODO 110MM X 90° PPR LESSO",
        "precio_compra":  45,
        "precio_venta":  73,
        "igv":  13.14,
        "total":  86.14
    },
    {
        "id":  26,
        "codigo":  "APPR0033",
        "descripcion":  "CODO 160MM X 90° PPR LESSO",
        "precio_compra":  120,
        "precio_venta":  141.6,
        "igv":  25.49,
        "total":  167.09
    },
    {
        "id":  27,
        "codigo":  "APPR0038",
        "descripcion":  "CODO 32MM X 90° PPR LESSO",
        "precio_compra":  3,
        "precio_venta":  5.38,
        "igv":  0.97,
        "total":  6.35
    },
    {
        "id":  28,
        "codigo":  "APPR0036",
        "descripcion":  "CODO 40MM X 90° PPR LESSO",
        "precio_compra":  5,
        "precio_venta":  8.9,
        "igv":  1.6,
        "total":  10.5
    },
    {
        "id":  29,
        "codigo":  "APPR0037",
        "descripcion":  "CODO 50MM X 90° PPR LESSO",
        "precio_compra":  5,
        "precio_venta":  8.9,
        "igv":  1.6,
        "total":  10.5
    },
    {
        "id":  30,
        "codigo":  "APPR0039",
        "descripcion":  "CODO 63MM X 90° PPR LESSO",
        "precio_compra":  11,
        "precio_venta":  15.5,
        "igv":  2.79,
        "total":  18.29
    },
    {
        "id":  31,
        "codigo":  "APPR0040",
        "descripcion":  "CODO 75MM X 90° PPR LESSO",
        "precio_compra":  20,
        "precio_venta":  27.5,
        "igv":  4.95,
        "total":  32.45
    },
    {
        "id":  32,
        "codigo":  "HDPE009",
        "descripcion":  "CODO DE 110MM X 90° HDPE SDR11",
        "precio_compra":  0,
        "precio_venta":  43,
        "igv":  7.74,
        "total":  50.74
    },
    {
        "id":  33,
        "codigo":  "HDPE016",
        "descripcion":  "CODO DE 160MM HDPE SDR11",
        "precio_compra":  0,
        "precio_venta":  175,
        "igv":  31.5,
        "total":  206.5
    },
    {
        "id":  34,
        "codigo":  "APVC0009",
        "descripcion":  "CODO DE 250MM X 90° PVC S/P LESSO",
        "precio_compra":  210,
        "precio_venta":  283.56,
        "igv":  51.04,
        "total":  334.6
    },
    {
        "id":  35,
        "codigo":  "HDPE012",
        "descripcion":  "CODO DE 90MM X 90° HDPE SDR11",
        "precio_compra":  23,
        "precio_venta":  30,
        "igv":  5.4,
        "total":  35.4
    },
    {
        "id":  36,
        "codigo":  "SCH010",
        "descripcion":  "CODO Ø3\" x 45° SCH80 ASTM",
        "precio_compra":  0,
        "precio_venta":  23,
        "igv":  4.14,
        "total":  27.14
    },
    {
        "id":  37,
        "codigo":  "SCH001",
        "descripcion":  "CODO Ø3\" x 90° SCH80 ASTM",
        "precio_compra":  0,
        "precio_venta":  28,
        "igv":  5.04,
        "total":  33.04
    },
    {
        "id":  38,
        "codigo":  "SCH008",
        "descripcion":  "CODO Ø4\" x 90° SCH80 ASTM",
        "precio_compra":  0,
        "precio_venta":  40,
        "igv":  7.2,
        "total":  47.2
    },
    {
        "id":  39,
        "codigo":  "SCH009",
        "descripcion":  "CODO Ø6\" x 90° SCH80 ASTM",
        "precio_compra":  0,
        "precio_venta":  108,
        "igv":  19.44,
        "total":  127.44
    },
    {
        "id":  40,
        "codigo":  "SCH011",
        "descripcion":  "CODO Ø8\" x 90° SCH80 ASTM",
        "precio_compra":  0,
        "precio_venta":  302,
        "igv":  54.36,
        "total":  356.36
    },
    {
        "id":  41,
        "codigo":  "APPR0007",
        "descripcion":  "CODO PPR 32M X 90°",
        "precio_compra":  3,
        "precio_venta":  4.8,
        "igv":  0.86,
        "total":  5.66
    },
    {
        "id":  42,
        "codigo":  "APPR0003",
        "descripcion":  "CODO PPR 63MM X 90°",
        "precio_compra":  11,
        "precio_venta":  15,
        "igv":  2.7,
        "total":  17.7
    },
    {
        "id":  43,
        "codigo":  "APPR0009",
        "descripcion":  "CODO PPR Ø40MM X 90°",
        "precio_compra":  5,
        "precio_venta":  8.6,
        "igv":  1.55,
        "total":  10.15
    },
    {
        "id":  44,
        "codigo":  "APPR0010",
        "descripcion":  "CODO PPR Ø50MM X 90°",
        "precio_compra":  5,
        "precio_venta":  8.6,
        "igv":  1.55,
        "total":  10.15
    },
    {
        "id":  45,
        "codigo":  "APPR0011",
        "descripcion":  "CODO PPR Ø75MM X 90°",
        "precio_compra":  20,
        "precio_venta":  27.5,
        "igv":  4.95,
        "total":  32.45
    },
    {
        "id":  46,
        "codigo":  "APPR0012",
        "descripcion":  "CODO PPR Ø90MM X 90°",
        "precio_compra":  25,
        "precio_venta":  31,
        "igv":  5.58,
        "total":  36.58
    },
    {
        "id":  47,
        "codigo":  "APVC0003",
        "descripcion":  "CODO PVC 110MM X 90°",
        "precio_compra":  23,
        "precio_venta":  27,
        "igv":  4.86,
        "total":  31.86
    },
    {
        "id":  48,
        "codigo":  "APVC0001",
        "descripcion":  "CODO PVC 160MM X 90°",
        "precio_compra":  60,
        "precio_venta":  65,
        "igv":  11.7,
        "total":  76.7
    },
    {
        "id":  49,
        "codigo":  "APPR0002",
        "descripcion":  "CODO REDUCCION PPR 63MM A 32MM X 90°",
        "precio_compra":  16,
        "precio_venta":  18,
        "igv":  3.24,
        "total":  21.24
    },
    {
        "id":  50,
        "codigo":  "APVC0006",
        "descripcion":  "CODO REDUCCION PVC 160MM A 110MM X  90°",
        "precio_compra":  95,
        "precio_venta":  102,
        "igv":  18.36,
        "total":  120.36
    },
    {
        "id":  51,
        "codigo":  "CHH0001",
        "descripcion":  "CONEXIÓN HEXAGONAL 1 PULG SELLO VITON",
        "precio_compra":  0,
        "precio_venta":  110,
        "igv":  19.8,
        "total":  129.8
    },
    {
        "id":  52,
        "codigo":  "CHH0002",
        "descripcion":  "CONEXIÓN HEXAGONAL 2 PULG SELLO VITON",
        "precio_compra":  0,
        "precio_venta":  180,
        "igv":  32.4,
        "total":  212.4
    },
    {
        "id":  53,
        "codigo":  "CHH0003",
        "descripcion":  "CONEXIÓN HEXAGONAL DE 2 PULGADAS CON SELLO EPDM.",
        "precio_compra":  0,
        "precio_venta":  165,
        "igv":  29.7,
        "total":  194.7
    },
    {
        "id":  54,
        "codigo":  "CHH0004",
        "descripcion":  "CONEXIÓN HEXAGONAL DE 3 PULGADAS CON SELLO EPDM.",
        "precio_compra":  0,
        "precio_venta":  260,
        "igv":  46.8,
        "total":  306.8
    },
    {
        "id":  55,
        "codigo":  "CHH0005",
        "descripcion":  "CONEXIÓN HEXAGONAL DE 4 PULGADAS CON SELLO EPDM.",
        "precio_compra":  0,
        "precio_venta":  450,
        "igv":  81,
        "total":  531
    },
    {
        "id":  56,
        "codigo":  "CHH0006",
        "descripcion":  "CONEXIÓN HEXAGONAL DE 6 PULGADAS CON SELLO EPDM.",
        "precio_compra":  0,
        "precio_venta":  1250,
        "igv":  225,
        "total":  1475
    },
    {
        "id":  57,
        "codigo":  "AFPPR001",
        "descripcion":  "FLANGE ADAPTER PPR 110MM SDR11 BISELADO",
        "precio_compra":  75,
        "precio_venta":  330.51,
        "igv":  59.49,
        "total":  390
    },
    {
        "id":  58,
        "codigo":  "AFPPR002",
        "descripcion":  "FLANGE ADAPTER PPR 160MM SDR11 BISELADO",
        "precio_compra":  112,
        "precio_venta":  501.7,
        "igv":  90.31,
        "total":  592
    },
    {
        "id":  59,
        "codigo":  "HDPE017",
        "descripcion":  "FLANGE ADAPTER SDR11 HDPE DE 200MM CON BACKING RING 8\"",
        "precio_compra":  0,
        "precio_venta":  300,
        "igv":  54,
        "total":  354
    },
    {
        "id":  60,
        "codigo":  "HDPE013",
        "descripcion":  "FLANGE ADAPTER SDR11 HDPE DE 90MM CON BACKING RING 3\"",
        "precio_compra":  0,
        "precio_venta":  55,
        "igv":  9.9,
        "total":  64.9
    },
    {
        "id":  61,
        "codigo":  "LPP001",
        "descripcion":  "LIMPIADOR PARA PVC",
        "precio_compra":  0,
        "precio_venta":  78,
        "igv":  14.04,
        "total":  92.04
    },
    {
        "id":  62,
        "codigo":  "HDPE022",
        "descripcion":  "NIPLE DE 3\" HDPE EN HILO NTP",
        "precio_compra":  0,
        "precio_venta":  21,
        "igv":  3.78,
        "total":  24.78
    },
    {
        "id":  63,
        "codigo":  "HDPE023",
        "descripcion":  "NIPLE DE 4\" HDPE EN HILO NTP",
        "precio_compra":  0,
        "precio_venta":  27,
        "igv":  4.86,
        "total":  31.86
    },
    {
        "id":  64,
        "codigo":  "HDPE021",
        "descripcion":  "NIPLE ROSCADO HDPE 1 PULG X 30 CM",
        "precio_compra":  0,
        "precio_venta":  22,
        "igv":  3.96,
        "total":  25.96
    },
    {
        "id":  65,
        "codigo":  "HDPE020",
        "descripcion":  "NIPLE ROSCADO HDPE 2 PULG X 30 CM",
        "precio_compra":  0,
        "precio_venta":  30,
        "igv":  5.4,
        "total":  35.4
    },
    {
        "id":  66,
        "codigo":  "PPV001",
        "descripcion":  "PEGAMENTO PARA PVC",
        "precio_compra":  0,
        "precio_venta":  85,
        "igv":  15.3,
        "total":  100.3
    },
    {
        "id":  67,
        "codigo":  "APZ001",
        "descripcion":  "PERNOS HEXAGONALES 5/8 X 4 COMPLETO ZINCADO",
        "precio_compra":  4.5,
        "precio_venta":  5.7,
        "igv":  1.03,
        "total":  6.73
    },
    {
        "id":  68,
        "codigo":  "APZ002",
        "descripcion":  "PERNOS HEXAGONALES 5/8 X 6 COMPLETO ZINCADO",
        "precio_compra":  6,
        "precio_venta":  7.5,
        "igv":  1.35,
        "total":  8.85
    },
    {
        "id":  69,
        "codigo":  "APZ003",
        "descripcion":  "PERNOS HEXAGONALES 5/8 X 7 COMPLETO ZINCADO",
        "precio_compra":  8,
        "precio_venta":  9.6,
        "igv":  1.73,
        "total":  11.33
    },
    {
        "id":  70,
        "codigo":  "APZ004",
        "descripcion":  "PERNOS HEXAGONALES 5/8 X 8 COMPLETO ZINCADO",
        "precio_compra":  10,
        "precio_venta":  11.9,
        "igv":  2.14,
        "total":  14.04
    },
    {
        "id":  71,
        "codigo":  "PHB003",
        "descripcion":  "PLATO VORTEX HDPE 2 PULGADAS COMPLETO, SELLO EPDM Y PERNOS INOXIDABLES COMPLETOS",
        "precio_compra":  0,
        "precio_venta":  930,
        "igv":  167.4,
        "total":  1097.4
    },
    {
        "id":  72,
        "codigo":  "PHB004",
        "descripcion":  "PLATO VORTEX HDPE 3 PULGADAS COMPLETO, SELLO EPDM Y PERNOS INOXIDABLES COMPLETOS",
        "precio_compra":  0,
        "precio_venta":  1200,
        "igv":  216,
        "total":  1416
    },
    {
        "id":  73,
        "codigo":  "PHB005",
        "descripcion":  "PLATO VORTEX HDPE 4 PULGADAS COMPLETO, SELLO EPDM Y PERNOS INOXIDABLES COMPLETOS",
        "precio_compra":  0,
        "precio_venta":  1400,
        "igv":  252,
        "total":  1652
    },
    {
        "id":  74,
        "codigo":  "PHB001",
        "descripcion":  "PLATO VORTEX HDPE 6 PULGADAS COMPLETO, SELLO EPDM Y PERNOS INOXIDABLES COMPLETOS",
        "precio_compra":  0,
        "precio_venta":  1700,
        "igv":  306,
        "total":  2006
    },
    {
        "id":  75,
        "codigo":  "PHB002",
        "descripcion":  "PLATO VORTEX HDPE 8 PULGADAS COMPLETO, SELLO EPDM Y PERNOS INOXIDABLES COMPLETOS",
        "precio_compra":  0,
        "precio_venta":  1480,
        "igv":  266.4,
        "total":  1746.4
    },
    {
        "id":  76,
        "codigo":  "SCH004",
        "descripcion":  "REDUCCION BUSHING Ø6\" x Ø3\" SCH80 ASTM EMB",
        "precio_compra":  0,
        "precio_venta":  45,
        "igv":  8.1,
        "total":  53.1
    },
    {
        "id":  77,
        "codigo":  "SCH005",
        "descripcion":  "REDUCCION BUSHING Ø8\" x Ø6\" SCH80 ASTM EMB",
        "precio_compra":  0,
        "precio_venta":  132,
        "igv":  23.76,
        "total":  155.76
    },
    {
        "id":  78,
        "codigo":  "APPR0049",
        "descripcion":  "REDUCCION CAMPANA 110MM X 50MM PPR LESSO",
        "precio_compra":  18,
        "precio_venta":  32,
        "igv":  5.76,
        "total":  37.76
    },
    {
        "id":  79,
        "codigo":  "APPR0044",
        "descripcion":  "REDUCCION CAMPANA 110MM X 63MM PPR LESSO",
        "precio_compra":  19,
        "precio_venta":  32,
        "igv":  5.76,
        "total":  37.76
    },
    {
        "id":  80,
        "codigo":  "APPR0050",
        "descripcion":  "REDUCCION CAMPANA 110MM X 90MM PPR LESSO",
        "precio_compra":  18,
        "precio_venta":  32,
        "igv":  5.76,
        "total":  37.76
    },
    {
        "id":  81,
        "codigo":  "APPR0043",
        "descripcion":  "REDUCCION CAMPANA 160MM X 63MM PPR LESSO",
        "precio_compra":  65,
        "precio_venta":  89.15,
        "igv":  16.05,
        "total":  105.2
    },
    {
        "id":  82,
        "codigo":  "APPR0045",
        "descripcion":  "REDUCCION CAMPANA 63MM X 50MM PPR LESSO",
        "precio_compra":  7,
        "precio_venta":  16.5,
        "igv":  2.97,
        "total":  19.47
    },
    {
        "id":  83,
        "codigo":  "APPR0046",
        "descripcion":  "REDUCCION CAMPANA 75MM X 63MM PPR LESSO",
        "precio_compra":  10,
        "precio_venta":  18,
        "igv":  3.24,
        "total":  21.24
    },
    {
        "id":  84,
        "codigo":  "APPR0047",
        "descripcion":  "REDUCCION CAMPANA 90MM X 63MM PPR LESSO",
        "precio_compra":  13,
        "precio_venta":  22.8,
        "igv":  4.1,
        "total":  26.9
    },
    {
        "id":  85,
        "codigo":  "APPR0048",
        "descripcion":  "REDUCCION CAMPANA 90MM X 75MM PPR LESSO",
        "precio_compra":  10,
        "precio_venta":  20.31,
        "igv":  3.66,
        "total":  23.97
    },
    {
        "id":  86,
        "codigo":  "HDPE003",
        "descripcion":  "REDUCCION CONCENTRICA 110MM A 90MM HDPE SDR11",
        "precio_compra":  0,
        "precio_venta":  40,
        "igv":  7.2,
        "total":  47.2
    },
    {
        "id":  87,
        "codigo":  "HDPE001",
        "descripcion":  "REDUCCION CONCENTRICA 160MM A 110MM HDPE SDR11",
        "precio_compra":  0,
        "precio_venta":  60,
        "igv":  10.8,
        "total":  70.8
    },
    {
        "id":  88,
        "codigo":  "HDPE005",
        "descripcion":  "REDUCCION EXCENTRICA DE 110MM X 90MM HDPE SDR11",
        "precio_compra":  0,
        "precio_venta":  120,
        "igv":  21.6,
        "total":  141.6
    },
    {
        "id":  89,
        "codigo":  "HDPE018",
        "descripcion":  "REDUCCION EXCENTRICA DE 160MM X 110MM HDPE SDR11",
        "precio_compra":  0,
        "precio_venta":  190,
        "igv":  34.2,
        "total":  224.2
    },
    {
        "id":  90,
        "codigo":  "APPR0015",
        "descripcion":  "REDUCCION PPR SDR11 63MM - 50MM",
        "precio_compra":  7,
        "precio_venta":  16.5,
        "igv":  2.97,
        "total":  19.47
    },
    {
        "id":  91,
        "codigo":  "APPR0016",
        "descripcion":  "REDUCCION PPR SDR11 75MM - 50MM",
        "precio_compra":  10,
        "precio_venta":  18,
        "igv":  3.24,
        "total":  21.24
    },
    {
        "id":  92,
        "codigo":  "APPR0017",
        "descripcion":  "REDUCCION PPR SDR11 75MM - 63MM",
        "precio_compra":  10,
        "precio_venta":  18,
        "igv":  3.24,
        "total":  21.24
    },
    {
        "id":  93,
        "codigo":  "APPR0018",
        "descripcion":  "REDUCCION PPR SDR11 90MM - 63MM",
        "precio_compra":  13,
        "precio_venta":  20,
        "igv":  3.6,
        "total":  23.6
    },
    {
        "id":  94,
        "codigo":  "APPR0019",
        "descripcion":  "REDUCCION PPR SDR11 90MM - 75MM",
        "precio_compra":  13,
        "precio_venta":  22,
        "igv":  3.96,
        "total":  25.96
    },
    {
        "id":  95,
        "codigo":  "STBH02",
        "descripcion":  "STUBEND FLANGE ADAPTER 110MM SDR11 PN16 PE100",
        "precio_compra":  22,
        "precio_venta":  30.51,
        "igv":  5.49,
        "total":  36
    },
    {
        "id":  96,
        "codigo":  "STBH01",
        "descripcion":  "STUBEND FLANGE ADAPTER 90MM SDR11 PN16 PE100",
        "precio_compra":  18,
        "precio_venta":  24.32,
        "igv":  4.38,
        "total":  28.7
    },
    {
        "id":  97,
        "codigo":  "APPR0032",
        "descripcion":  "TAPON HEMBRA 160 PPR LESSO",
        "precio_compra":  50,
        "precio_venta":  75,
        "igv":  13.5,
        "total":  88.5
    },
    {
        "id":  98,
        "codigo":  "APPR0041",
        "descripcion":  "TAPON HEMBRA 50MM PPR LESSO",
        "precio_compra":  5,
        "precio_venta":  8.5,
        "igv":  1.53,
        "total":  10.03
    },
    {
        "id":  99,
        "codigo":  "APPR0042",
        "descripcion":  "TAPON HEMBRA 63MM PPR LESSO",
        "precio_compra":  11,
        "precio_venta":  16.2,
        "igv":  2.92,
        "total":  19.12
    },
    {
        "id":  100,
        "codigo":  "APPR0008",
        "descripcion":  "TAPON PPR Ø160MM",
        "precio_compra":  105,
        "precio_venta":  116.5,
        "igv":  20.97,
        "total":  137.47
    },
    {
        "id":  101,
        "codigo":  "APPR0013",
        "descripcion":  "TAPON PPR Ø50MM",
        "precio_compra":  16,
        "precio_venta":  8.5,
        "igv":  1.53,
        "total":  10.03
    },
    {
        "id":  102,
        "codigo":  "APPR0014",
        "descripcion":  "TAPON PPR Ø63MM",
        "precio_compra":  11,
        "precio_venta":  16.2,
        "igv":  2.92,
        "total":  19.12
    },
    {
        "id":  103,
        "codigo":  "APVC0004",
        "descripcion":  "TEE 110MM PVC",
        "precio_compra":  28,
        "precio_venta":  34,
        "igv":  6.12,
        "total":  40.12
    },
    {
        "id":  104,
        "codigo":  "APPR0051",
        "descripcion":  "TEE 160MM PPR LESSO",
        "precio_compra":  150,
        "precio_venta":  189,
        "igv":  34.02,
        "total":  223.02
    },
    {
        "id":  105,
        "codigo":  "APVC0002",
        "descripcion":  "TEE 160MM PVC",
        "precio_compra":  74,
        "precio_venta":  79,
        "igv":  14.22,
        "total":  93.22
    },
    {
        "id":  106,
        "codigo":  "APPR0006",
        "descripcion":  "TEE 32MM PPR",
        "precio_compra":  10,
        "precio_venta":  15,
        "igv":  2.7,
        "total":  17.7
    },
    {
        "id":  107,
        "codigo":  "APPR0004",
        "descripcion":  "TEE 63MM PPR",
        "precio_compra":  11,
        "precio_venta":  15,
        "igv":  2.7,
        "total":  17.7
    },
    {
        "id":  108,
        "codigo":  "APPR0052",
        "descripcion":  "TEE 63MM PPR LESSO",
        "precio_compra":  15,
        "precio_venta":  22.5,
        "igv":  4.05,
        "total":  26.55
    },
    {
        "id":  109,
        "codigo":  "HDPE011",
        "descripcion":  "TEE DE 110MM HDPE SDR11",
        "precio_compra":  0,
        "precio_venta":  43,
        "igv":  7.74,
        "total":  50.74
    },
    {
        "id":  110,
        "codigo":  "HDPE002",
        "descripcion":  "TEE DE 160MM HDPE SDR11",
        "precio_compra":  0,
        "precio_venta":  85,
        "igv":  15.3,
        "total":  100.3
    },
    {
        "id":  111,
        "codigo":  "HDPE010",
        "descripcion":  "TEE DE 90MM HDPE SDR11",
        "precio_compra":  0,
        "precio_venta":  35,
        "igv":  6.3,
        "total":  41.3
    },
    {
        "id":  112,
        "codigo":  "SCH002",
        "descripcion":  "TEE Ø6\" SCH80 ASTM",
        "precio_compra":  0,
        "precio_venta":  120,
        "igv":  21.6,
        "total":  141.6
    },
    {
        "id":  113,
        "codigo":  "SCH003",
        "descripcion":  "TEE Ø8\" SCH80 ASTM",
        "precio_compra":  0,
        "precio_venta":  405,
        "igv":  72.9,
        "total":  477.9
    },
    {
        "id":  114,
        "codigo":  "APPR0020",
        "descripcion":  "TEE PPR SDR11 Ø160MM",
        "precio_compra":  105,
        "precio_venta":  112,
        "igv":  20.16,
        "total":  132.16
    },
    {
        "id":  115,
        "codigo":  "HDPE008",
        "descripcion":  "TEE REDUCCCION DE 200MM X 90MM HDPE SDR11",
        "precio_compra":  0,
        "precio_venta":  145,
        "igv":  26.1,
        "total":  171.1
    },
    {
        "id":  116,
        "codigo":  "APPR0053",
        "descripcion":  "TEE REDUCCION 160MM X 110MM PPR LESSO",
        "precio_compra":  165,
        "precio_venta":  192.35,
        "igv":  34.62,
        "total":  226.97
    },
    {
        "id":  117,
        "codigo":  "APPR0062",
        "descripcion":  "TEE REDUCCION 32MM X 20MM PPR LESSO",
        "precio_compra":  4,
        "precio_venta":  7.92,
        "igv":  1.43,
        "total":  9.35
    },
    {
        "id":  118,
        "codigo":  "APPR0055",
        "descripcion":  "TEE REDUCCION 40MM X 20MM PPR LESSO",
        "precio_compra":  6,
        "precio_venta":  14,
        "igv":  2.52,
        "total":  16.52
    },
    {
        "id":  119,
        "codigo":  "APPR0056",
        "descripcion":  "TEE REDUCCION 50MM X 20MM PPR LESSO",
        "precio_compra":  7,
        "precio_venta":  16.8,
        "igv":  3.02,
        "total":  19.82
    },
    {
        "id":  120,
        "codigo":  "APPR0054",
        "descripcion":  "TEE REDUCCION 50MM X 40MM PPR LESSO",
        "precio_compra":  7,
        "precio_venta":  17.21,
        "igv":  3.1,
        "total":  20.31
    },
    {
        "id":  121,
        "codigo":  "APPR0060",
        "descripcion":  "TEE REDUCCION 63MM X 20MM PPR LESSO",
        "precio_compra":  14,
        "precio_venta":  22.5,
        "igv":  4.05,
        "total":  26.55
    },
    {
        "id":  122,
        "codigo":  "APPR0001",
        "descripcion":  "TEE REDUCCION 63MM X 32MM PPR",
        "precio_compra":  11,
        "precio_venta":  16,
        "igv":  2.88,
        "total":  18.88
    },
    {
        "id":  123,
        "codigo":  "APPR0059",
        "descripcion":  "TEE REDUCCION 63MM X 32MM PPR LESSO",
        "precio_compra":  14,
        "precio_venta":  24.67,
        "igv":  4.44,
        "total":  29.11
    },
    {
        "id":  124,
        "codigo":  "APPR0058",
        "descripcion":  "TEE REDUCCION 63MM X 40MM PPR LESSO",
        "precio_compra":  14,
        "precio_venta":  23,
        "igv":  4.14,
        "total":  27.14
    },
    {
        "id":  125,
        "codigo":  "APPR0057",
        "descripcion":  "TEE REDUCCION 63MM X 50MM PPR LESSO",
        "precio_compra":  14,
        "precio_venta":  25,
        "igv":  4.5,
        "total":  29.5
    },
    {
        "id":  126,
        "codigo":  "APPR0061",
        "descripcion":  "TEE REDUCCION 75MM X 32MM PPR LESSO",
        "precio_compra":  23,
        "precio_venta":  35,
        "igv":  6.3,
        "total":  41.3
    },
    {
        "id":  127,
        "codigo":  "APPR0065",
        "descripcion":  "TEE REDUCCION 75MM X 63MM PPR LESSO",
        "precio_compra":  23,
        "precio_venta":  37,
        "igv":  6.66,
        "total":  43.66
    },
    {
        "id":  128,
        "codigo":  "APPR0064",
        "descripcion":  "TEE REDUCCION 90MM X 40MM PPR LESSO",
        "precio_compra":  24,
        "precio_venta":  39,
        "igv":  7.02,
        "total":  46.02
    },
    {
        "id":  129,
        "codigo":  "APPR0063",
        "descripcion":  "TEE REDUCCION 90MM X 75MM PPR LESSO",
        "precio_compra":  24,
        "precio_venta":  45,
        "igv":  8.1,
        "total":  53.1
    },
    {
        "id":  130,
        "codigo":  "APPR0021",
        "descripcion":  "TEE REDUCCION PPR SDR11 Ø160MM - Ø160MM - Ø75MM",
        "precio_compra":  220,
        "precio_venta":  235,
        "igv":  42.3,
        "total":  277.3
    },
    {
        "id":  131,
        "codigo":  "APPR0022",
        "descripcion":  "TEE REDUCCION PPR SDR11 Ø50MM - Ø50MM - Ø40MM",
        "precio_compra":  7,
        "precio_venta":  14,
        "igv":  2.52,
        "total":  16.52
    },
    {
        "id":  132,
        "codigo":  "APPR0023",
        "descripcion":  "TEE REDUCCION PPR SDR11 Ø63MM - Ø63MM - Ø32MM",
        "precio_compra":  14,
        "precio_venta":  20,
        "igv":  3.6,
        "total":  23.6
    },
    {
        "id":  133,
        "codigo":  "APPR0024",
        "descripcion":  "TEE REDUCCION PPR SDR11 Ø63MM - Ø63MM - Ø40MM",
        "precio_compra":  14,
        "precio_venta":  21,
        "igv":  3.78,
        "total":  24.78
    },
    {
        "id":  134,
        "codigo":  "APPR0025",
        "descripcion":  "TEE REDUCCION PPR SDR11 Ø63MM - Ø63MM - Ø50MM",
        "precio_compra":  14,
        "precio_venta":  25,
        "igv":  4.5,
        "total":  29.5
    },
    {
        "id":  135,
        "codigo":  "APPR0026",
        "descripcion":  "TEE REDUCCION PPR SDR11 Ø75MM - Ø75MM - Ø32MM",
        "precio_compra":  25,
        "precio_venta":  35,
        "igv":  6.3,
        "total":  41.3
    },
    {
        "id":  136,
        "codigo":  "APPR0027",
        "descripcion":  "TEE REDUCCION PPR SDR11 Ø75MM - Ø75MM - Ø63MM",
        "precio_compra":  25,
        "precio_venta":  37,
        "igv":  6.66,
        "total":  43.66
    },
    {
        "id":  137,
        "codigo":  "APPR0028",
        "descripcion":  "TEE REDUCCION PPR SDR11 Ø90MM - Ø90MM - Ø40MM",
        "precio_compra":  25,
        "precio_venta":  39,
        "igv":  7.02,
        "total":  46.02
    },
    {
        "id":  138,
        "codigo":  "APPR0029",
        "descripcion":  "TEE REDUCCION PPR SDR11 Ø90MM - Ø90MM - Ø75MM",
        "precio_compra":  35,
        "precio_venta":  61,
        "igv":  10.98,
        "total":  71.98
    },
    {
        "id":  139,
        "codigo":  "APVC0005",
        "descripcion":  "TEE REDUCCION PVC 160MM A 110MM",
        "precio_compra":  64,
        "precio_venta":  68,
        "igv":  12.24,
        "total":  80.24
    },
    {
        "id":  140,
        "codigo":  "HDPE012",
        "descripcion":  "TUBERIA HDPE 090MM SDR11 X 1 METRO",
        "precio_compra":  26,
        "precio_venta":  31.27,
        "igv":  5.63,
        "total":  36.9
    },
    {
        "id":  141,
        "codigo":  "HDPE013",
        "descripcion":  "TUBERIA HDPE 110MM SDR11 X 1 METRO",
        "precio_compra":  38,
        "precio_venta":  44.07,
        "igv":  7.93,
        "total":  52
    },
    {
        "id":  142,
        "codigo":  "HDPE014",
        "descripcion":  "TUBERIA HDPE 160MM SDR11 X 1 METRO",
        "precio_compra":  43,
        "precio_venta":  50.42,
        "igv":  9.08,
        "total":  59.5
    },
    {
        "id":  143,
        "codigo":  "TPPR0008",
        "descripcion":  "TUBERIA PPR SDR11 Ø110MM PN20 LESSO X 4 METROS",
        "precio_compra":  0,
        "precio_venta":  0,
        "igv":  0,
        "total":  0
    },
    {
        "id":  144,
        "codigo":  "TPPR0017",
        "descripcion":  "TUBERIA PPR SDR11 Ø110MM PN20 LESSO X 4 METROS LINEA AZUL",
        "precio_compra":  200,
        "precio_venta":  225,
        "igv":  40.5,
        "total":  265.5
    },
    {
        "id":  145,
        "codigo":  "TPPR0009",
        "descripcion":  "TUBERIA PPR SDR11 Ø160MM PN20 LESSO X 4 METROS",
        "precio_compra":  0,
        "precio_venta":  0,
        "igv":  0,
        "total":  0
    },
    {
        "id":  146,
        "codigo":  "TPPR0018",
        "descripcion":  "TUBERIA PPR SDR11 Ø160MM PN20 LESSO X 4 METROS LINEA AZUL",
        "precio_compra":  500,
        "precio_venta":  586,
        "igv":  105.48,
        "total":  691.48
    },
    {
        "id":  147,
        "codigo":  "TPPR0010",
        "descripcion":  "TUBERIA PPR SDR11 Ø20MM PN20 LESSO X 4 METROS LINEA AZUL",
        "precio_compra":  10,
        "precio_venta":  26,
        "igv":  4.68,
        "total":  30.68
    },
    {
        "id":  148,
        "codigo":  "TBP0003",
        "descripcion":  "TUBERIA PPR SDR11 Ø32MM PN20 LESSO X 4 METROS",
        "precio_compra":  35,
        "precio_venta":  42,
        "igv":  7.56,
        "total":  49.56
    },
    {
        "id":  149,
        "codigo":  "TPPR0011",
        "descripcion":  "TUBERIA PPR SDR11 Ø32MM PN20 LESSO X 4 METROS LINEA AZUL",
        "precio_compra":  22,
        "precio_venta":  45,
        "igv":  8.1,
        "total":  53.1
    },
    {
        "id":  150,
        "codigo":  "TPPR0004",
        "descripcion":  "TUBERIA PPR SDR11 Ø40MM PN20 LESSO X 4 METROS",
        "precio_compra":  55,
        "precio_venta":  70,
        "igv":  12.6,
        "total":  82.6
    },
    {
        "id":  151,
        "codigo":  "TPPR0012",
        "descripcion":  "TUBERIA PPR SDR11 Ø40MM PN20 LESSO X 4 METROS LINEA AZUL",
        "precio_compra":  35,
        "precio_venta":  70,
        "igv":  12.6,
        "total":  82.6
    },
    {
        "id":  152,
        "codigo":  "TPPR0005",
        "descripcion":  "TUBERIA PPR SDR11 Ø50MM PN20 LESSO X 4 METROS",
        "precio_compra":  65,
        "precio_venta":  78.5,
        "igv":  14.13,
        "total":  92.63
    },
    {
        "id":  153,
        "codigo":  "TPPR0013",
        "descripcion":  "TUBERIA PPR SDR11 Ø50MM PN20 LESSO X 4 METROS LINEA AZUL",
        "precio_compra":  50,
        "precio_venta":  78.5,
        "igv":  14.13,
        "total":  92.63
    },
    {
        "id":  154,
        "codigo":  "TBP0002",
        "descripcion":  "TUBERIA PPR SDR11 Ø63MM PN20 LESSO X 4 METROS",
        "precio_compra":  100,
        "precio_venta":  120,
        "igv":  21.6,
        "total":  141.6
    },
    {
        "id":  155,
        "codigo":  "TPPR0014",
        "descripcion":  "TUBERIA PPR SDR11 Ø63MM PN20 LESSO X 4 METROS LINEA AZUL",
        "precio_compra":  90,
        "precio_venta":  127.6,
        "igv":  22.97,
        "total":  150.57
    },
    {
        "id":  156,
        "codigo":  "TPPR0006",
        "descripcion":  "TUBERIA PPR SDR11 Ø75MM PN20 LESSO X 4 METROS",
        "precio_compra":  115,
        "precio_venta":  132.4,
        "igv":  23.83,
        "total":  156.23
    },
    {
        "id":  157,
        "codigo":  "TPPR0015",
        "descripcion":  "TUBERIA PPR SDR11 Ø75MM PN20 LESSO X 4 METROS LINEA AZUL",
        "precio_compra":  100,
        "precio_venta":  132.4,
        "igv":  23.83,
        "total":  156.23
    },
    {
        "id":  158,
        "codigo":  "TPPR0007",
        "descripcion":  "TUBERIA PPR SDR11 Ø90MM PN20 LESSO X 4 METROS",
        "precio_compra":  225,
        "precio_venta":  244.8,
        "igv":  44.06,
        "total":  288.86
    },
    {
        "id":  159,
        "codigo":  "TPPR0016",
        "descripcion":  "TUBERIA PPR SDR11 Ø90MM PN20 LESSO X 4 METROS LINEA AZUL",
        "precio_compra":  190,
        "precio_venta":  244.8,
        "igv":  44.06,
        "total":  288.86
    },
    {
        "id":  160,
        "codigo":  "TBA001",
        "descripcion":  "TUBO AIREADOR 2\" ESTANDAR",
        "precio_compra":  0,
        "precio_venta":  38,
        "igv":  6.84,
        "total":  44.84
    },
    {
        "id":  161,
        "codigo":  "TBA002",
        "descripcion":  "TUBO AIREADOR 2\" RANGO LARGO",
        "precio_compra":  0,
        "precio_venta":  47,
        "igv":  8.46,
        "total":  55.46
    },
    {
        "id":  162,
        "codigo":  "TPVC0003",
        "descripcion":  "TUBO DE 250MM X 6 MTS CLASE 10 MARCA EUROTUBO",
        "precio_compra":  560,
        "precio_venta":  593.22,
        "igv":  106.78,
        "total":  700
    },
    {
        "id":  163,
        "codigo":  "APZ007",
        "descripcion":  "TUERCAS 3/4 PULGADAS ZINCADO",
        "precio_compra":  0,
        "precio_venta":  0.82,
        "igv":  0.15,
        "total":  0.97
    },
    {
        "id":  164,
        "codigo":  "APZ005",
        "descripcion":  "TUERCAS 5/8 PULGADAS ZINCADO",
        "precio_compra":  0,
        "precio_venta":  0.78,
        "igv":  0.14,
        "total":  0.92
    },
    {
        "id":  165,
        "codigo":  "AINOX001",
        "descripcion":  "TUERCAS HEXAGONALES 5/8 INOXIDABLES 304",
        "precio_compra":  1.6,
        "precio_venta":  1.77,
        "igv":  0.32,
        "total":  2.09
    },
    {
        "id":  166,
        "codigo":  "APPR0005",
        "descripcion":  "UNION 63MM PPR",
        "precio_compra":  10,
        "precio_venta":  15,
        "igv":  2.7,
        "total":  17.7
    },
    {
        "id":  167,
        "codigo":  "APVC0011",
        "descripcion":  "UNION SIMPLE DE 160MM S/P PVC - LESSO",
        "precio_compra":  58,
        "precio_venta":  68.18,
        "igv":  12.27,
        "total":  80.45
    },
    {
        "id":  168,
        "codigo":  "APVC0010",
        "descripcion":  "UNION SIMPLE DE 200MM S/P PVC - LESSO",
        "precio_compra":  110,
        "precio_venta":  121.36,
        "igv":  21.84,
        "total":  143.2
    },
    {
        "id":  169,
        "codigo":  "APPR0070",
        "descripcion":  "VALVULA BOLA DE 32MM PPR",
        "precio_compra":  70,
        "precio_venta":  105,
        "igv":  18.9,
        "total":  123.9
    },
    {
        "id":  170,
        "codigo":  "APPR0068",
        "descripcion":  "VALVULA BOLA DE 40MM PPR",
        "precio_compra":  168,
        "precio_venta":  235,
        "igv":  42.3,
        "total":  277.3
    },
    {
        "id":  171,
        "codigo":  "APPR0069",
        "descripcion":  "VALVULA BOLA DE 50MM PPR",
        "precio_compra":  180,
        "precio_venta":  290,
        "igv":  52.2,
        "total":  342.2
    },
    {
        "id":  172,
        "codigo":  "APPR0071",
        "descripcion":  "VALVULA BOLA DE 63MM PPR",
        "precio_compra":  280,
        "precio_venta":  370,
        "igv":  66.6,
        "total":  436.6
    },
    {
        "id":  173,
        "codigo":  "APPR0072",
        "descripcion":  "VALVULA BOLA DE 75MM PPR",
        "precio_compra":  750,
        "precio_venta":  885,
        "igv":  159.3,
        "total":  1044.3
    },
    {
        "id":  174,
        "codigo":  "APPR0073",
        "descripcion":  "VALVULA BOLA DE 90MM PPR",
        "precio_compra":  900,
        "precio_venta":  1170,
        "igv":  210.6,
        "total":  1380.6
    },
    {
        "id":  175,
        "codigo":  "SCH012",
        "descripcion":  "VALVULA DIAFRAGMA Ø3\"",
        "precio_compra":  0,
        "precio_venta":  430,
        "igv":  77.4,
        "total":  507.4
    },
    {
        "id":  176,
        "codigo":  "VLMX001",
        "descripcion":  "VALVULA MARIPOSA 4 PULG INOXIDABLES",
        "precio_compra":  105,
        "precio_venta":  140,
        "igv":  25.2,
        "total":  165.2
    },
    {
        "id":  177,
        "codigo":  "AVZ001",
        "descripcion":  "VARILLA ROSCADA 3/4 X 1 MT. ZIN",
        "precio_compra":  16,
        "precio_venta":  21.3,
        "igv":  3.83,
        "total":  25.13
    },
    {
        "id":  178,
        "codigo":  "AVINOX001",
        "descripcion":  "VARILLA ROSCADA 5/8 X 1 MT. INOXIDABLE 304",
        "precio_compra":  40,
        "precio_venta":  44.83,
        "igv":  8.07,
        "total":  52.9
    },
    {
        "id":  179,
        "codigo":  "AVZ002",
        "descripcion":  "VARILLA ROSCADA 5/8 X 1 MT. ZIN",
        "precio_compra":  14,
        "precio_venta":  18.5,
        "igv":  3.33,
        "total":  21.83
    }
    ,
    {
        "id": 180,
        "codigo": "AH0002",
        "descripcion": "TAPON HDPE CON ROSCA MACHO DE 2 PULG",
        "precio_compra": 48,
        "precio_venta": 65.25,
        "igv": 11.75,
        "total": 77.00
    },
    {
        "id": 181,
        "codigo": "AH0003",
        "descripcion": "TAPON HDPE CON ROSCA MACHO DE 3 PULG",
        "precio_compra": 62,
        "precio_venta": 84.75,
        "igv": 15.25,
        "total": 100.00
    },
    {
        "id": 182,
        "codigo": "AH0004",
        "descripcion": "TAPON HDPE CON ROSCA MACHO DE 4 PULG",
        "precio_compra": 88,
        "precio_venta": 118.64,
        "igv": 21.36,
        "total": 140.00
    },
    {
        "id": 183,
        "codigo": "SER01",
        "descripcion": "SERVICIO DE PERFORACION E INSTALACION DE ACCESORIOS EN TANQUE INDUSTRIAL DE 25000 LTS",
        "precio_compra": 0,
        "precio_venta": 3500.00,
        "igv": 630.00,
        "total": 4130.00
    }
];
