/**
 * Mock data para las secciones de marca en la HomePage.
 * Cuando el backend esté listo, estos datos serán reemplazados
 * por llamadas a la API.
 *
 * Imagen genérica de llanta: usamos SVGs en base64 simples para no depender de assets externos.
 */

// Imagen placeholder SVG de una llanta vista de frente
const TYRE_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%23222' stroke='%23555' stroke-width='3'/%3E%3Ccircle cx='50' cy='50' r='32' fill='%23444'/%3E%3Ccircle cx='50' cy='50' r='15' fill='%23222' stroke='%23999' stroke-width='2'/%3E%3C/svg%3E";

// Logo genérico SVG para las marcas (texto + color de fondo)
const makeLogo = (text, bg, fg = "%23fff") =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='50'%3E%3Crect width='160' height='50' rx='8' fill='${bg}'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='20' font-weight='bold' font-family='Arial' fill='${fg}'%3E${text}%3C/text%3E%3C/svg%3E`;

// ─────────────────────────────────────────────────────────────────────────────
// MARCAS
// ─────────────────────────────────────────────────────────────────────────────
export const BRAND_SECTIONS = [
  {
    brand: {
      name: "NANKANG",
      tagline: "Rendimiento Deportivo y Confiabilidad",
      logo: "/img_marcas/nankang.jpg",
      link: "#",
    },
    products: [
      {
        image: TYRE_PLACEHOLDER,
        title: "Nankang Sportnek",
        model: "Sportnek AS-2+",
        measure: "205/55R16",
        description: "Llanta de alto rendimiento para uso en ciudad y carretera.",
        price: "89.99",
        originalPrice: "120.00",
        badge: "OFERTA",
      },
      {
        image: TYRE_PLACEHOLDER,
        title: "Nankang Cross Sport",
        model: "SP-9",
        measure: "225/45R17",
        description: "Ideal para conducción deportiva en seco y mojado.",
        price: "115.00",
        originalPrice: null,
        badge: null,
      },
      {
        image: TYRE_PLACEHOLDER,
        title: "Nankang Econex",
        model: "NA-1",
        measure: "185/65R15",
        description: "Bajo consumo de combustible y larga durabilidad.",
        price: "74.50",
        originalPrice: "95.00",
        badge: null,
      },
      {
        image: TYRE_PLACEHOLDER,
        title: "Nankang Mudstar",
        model: "M/T",
        measure: "265/70R17",
        description: "Tracción en todo tipo de terreno, barro y grava.",
        price: "145.00",
        originalPrice: null,
        badge: "NUEVO",
      },
    ],
  },

  {
    brand: {
      name: "YEADA",
      tagline: "Durabilidad Extrema",
      logo: "/img_marcas/yeada.png",
      link: "#",
    },
    products: [
      {
        image: TYRE_PLACEHOLDER,
        title: "Yeada YD-136",
        model: "YD-136",
        measure: "295/80R22.5",
        description: "Carga pesada para camiones de larga distancia.",
        price: "320.00",
        originalPrice: "390.00",
        badge: "LIQUIDACIÓN",
      },
      {
        image: TYRE_PLACEHOLDER,
        title: "Yeada YDA-226",
        model: "YDA-226",
        measure: "315/70R22.5",
        description: "Dirección precisa en flota de transporte.",
        price: "285.00",
        originalPrice: null,
        badge: null,
      },
      {
        image: TYRE_PLACEHOLDER,
        title: "Yeada YD-118",
        model: "YD-118",
        measure: "235/75R17.5",
        description: "Óptima para reparto urbano y distribución regional.",
        price: "178.00",
        originalPrice: "210.00",
        badge: null,
      },
      {
        image: TYRE_PLACEHOLDER,
        title: "Yeada YDA-286",
        model: "YDA-286",
        measure: "11R22.5",
        description: "Máximo agarre en carretera húmeda para flota pesada.",
        price: "340.00",
        originalPrice: null,
        badge: "NUEVO",
      },
    ],
  },

  {
    brand: {
      name: "TORNEL",
      tagline: "Orgullo en Movimiento",
      logo: "/img_marcas/tornel.png",
      link: "#",
    },
    products: [
      {
        image: TYRE_PLACEHOLDER,
        title: "Tornel Real",
        model: "Real",
        measure: "420/85R34",
        description: "Alta flotación para tractores en terreno blando.",
        price: "160.00",
        originalPrice: null,
        badge: null,
      },
      {
        image: TYRE_PLACEHOLDER,
        title: "Tornel Direccional",
        model: "Direccional",
        measure: "380/70R28",
        description: "Agarre excelente para el día a día.",
        price: "90.00",
        originalPrice: "110.00",
        badge: "OFERTA",
      },
      {
        image: TYRE_PLACEHOLDER,
        title: "Tornel America",
        model: "America Cargo",
        measure: "480/65R28",
        description: "Resistencia extrema para carga pesada.",
        price: "120.00",
        originalPrice: null,
        badge: null,
      },
      {
        image: TYRE_PLACEHOLDER,
        title: "Tornel Classic",
        model: "Classic",
        measure: "280/70R18",
        description: "El clasico diseño con larga duración.",
        price: "85.00",
        originalPrice: "95.00",
        badge: null,
      },
    ],
  },

  {
    brand: {
      name: "WANLI",
      tagline: "Innova tu Camino",
      logo: "/img_marcas/WANLI-LOGO-1.jpg",
      link: "#",
    },
    products: [
      {
        image: TYRE_PLACEHOLDER,
        title: "Wanli Harmonic",
        model: "Harmonic",
        measure: "215/60R16",
        description: "Confort silencioso para sedanes y crossovers.",
        price: "96.00",
        originalPrice: null,
        badge: null,
      },
      {
        image: TYRE_PLACEHOLDER,
        title: "Wanli Racing",
        model: "Racing",
        measure: "245/40R18",
        description: "Alto rendimiento con excelente respuesta en curva.",
        price: "138.00",
        originalPrice: "160.00",
        badge: "OFERTA",
      },
      {
        image: TYRE_PLACEHOLDER,
        title: "Wanli SnowGrip",
        model: "SnowGrip",
        measure: "205/55R16",
        description: "Diseñado para frío extremo, lluvia y nieve.",
        price: "112.00",
        originalPrice: null,
        badge: "NUEVO",
      },
      {
        image: TYRE_PLACEHOLDER,
        title: "Wanli SUV Comfort",
        model: "SUV Comfort",
        measure: "265/60R18",
        description: "Para SUVs y camionetas con uso mixto.",
        price: "152.00",
        originalPrice: "185.00",
        badge: null,
      },
    ],
  }
];
