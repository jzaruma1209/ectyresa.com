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
      name: "VORTEX",
      tagline: "Performance sin límites",
      logo: makeLogo("VORTEX", "%23E60000"),
      link: "#",
    },
    products: [
      {
        image: TYRE_PLACEHOLDER,
        title: "Vortex Sport RS",
        model: "Sport RS",
        measure: "205/55R16",
        description: "Llanta de alto rendimiento para uso en ciudad y carretera.",
        price: "89.99",
        originalPrice: "120.00",
        badge: "OFERTA",
      },
      {
        image: TYRE_PLACEHOLDER,
        title: "Vortex Sport RS",
        model: "Xtreme GT",
        measure: "225/45R17",
        description: "Ideal para conducción deportiva en seco y mojado.",
        price: "115.00",
        originalPrice: null,
        badge: null,
      },
      {
        image: TYRE_PLACEHOLDER,
        title: "Vortex Eco Pro",
        model: "Eco Pro",
        measure: "185/65R15",
        description: "Bajo consumo de combustible y larga durabilidad.",
        price: "74.50",
        originalPrice: "95.00",
        badge: null,
      },
      {
        image: TYRE_PLACEHOLDER,
        title: "Vortex AllTerrain",
        model: "AllTerrain AT",
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
      name: "IRONMAX",
      tagline: "Fuerza para el trabajo",
      logo: makeLogo("IRONMAX", "%231A1A1A"),
      link: "#",
    },
    products: [
      {
        image: TYRE_PLACEHOLDER,
        title: "Ironmax HD Cargo",
        model: "HD Cargo",
        measure: "295/80R22.5",
        description: "Carga pesada para camiones de larga distancia.",
        price: "320.00",
        originalPrice: "390.00",
        badge: "LIQUIDACIÓN",
      },
      {
        image: TYRE_PLACEHOLDER,
        title: "Ironmax Moto Steer",
        model: "Moto Steer",
        measure: "315/70R22.5",
        description: "Dirección precisa en flota de transporte.",
        price: "285.00",
        originalPrice: null,
        badge: null,
      },
      {
        image: TYRE_PLACEHOLDER,
        title: "Ironmax Urban Fleet",
        model: "Urban Fleet",
        measure: "235/75R17.5",
        description: "Óptima para reparto urbano y distribución regional.",
        price: "178.00",
        originalPrice: "210.00",
        badge: null,
      },
      {
        image: TYRE_PLACEHOLDER,
        title: "Ironmax Super Grip",
        model: "Super Grip",
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
      name: "TERRALUX",
      tagline: "El campo es nuestro terreno",
      logo: makeLogo("TERRALUX", "%2327AE60"),
      link: "#",
    },
    products: [
      {
        image: TYRE_PLACEHOLDER,
        title: "Terralux Agro Plus",
        model: "Agro Plus",
        measure: "420/85R34",
        description: "Alta flotación para tractores en terreno blando.",
        price: "560.00",
        originalPrice: null,
        badge: null,
      },
      {
        image: TYRE_PLACEHOLDER,
        title: "Terralux Harvest Pro",
        model: "Harvest Pro",
        measure: "380/70R28",
        description: "Mínimo compactado de suelo en cosecha.",
        price: "490.00",
        originalPrice: "580.00",
        badge: "OFERTA",
      },
      {
        image: TYRE_PLACEHOLDER,
        title: "Terralux Field King",
        model: "Field King",
        measure: "480/65R28",
        description: "Resistencia extrema para maquinaria de gran potencia.",
        price: "620.00",
        originalPrice: null,
        badge: null,
      },
      {
        image: TYRE_PLACEHOLDER,
        title: "Terralux Mini Agro",
        model: "Mini Agro",
        measure: "280/70R18",
        description: "Para tractores compactos y usos hortícolas.",
        price: "230.00",
        originalPrice: "270.00",
        badge: null,
      },
    ],
  },

  {
    brand: {
      name: "STEELRIDE",
      tagline: "Confianza en cada vuelta",
      logo: makeLogo("STEELRIDE", "%232C3E50"),
      link: "#",
    },
    products: [
      {
        image: TYRE_PLACEHOLDER,
        title: "Steelride Comfort X",
        model: "Comfort X",
        measure: "215/60R16",
        description: "Confort silencioso para sedanes y crossovers.",
        price: "96.00",
        originalPrice: null,
        badge: null,
      },
      {
        image: TYRE_PLACEHOLDER,
        title: "Steelride HP Sport",
        model: "HP Sport",
        measure: "245/40R18",
        description: "Alto rendimiento con excelente respuesta en curva.",
        price: "138.00",
        originalPrice: "160.00",
        badge: "OFERTA",
      },
      {
        image: TYRE_PLACEHOLDER,
        title: "Steelride Winter",
        model: "Winter Force",
        measure: "205/55R16",
        description: "Diseñado para frío extremo, nieve y hielo.",
        price: "112.00",
        originalPrice: null,
        badge: "NUEVO",
      },
      {
        image: TYRE_PLACEHOLDER,
        title: "Steelride SUV Max",
        model: "SUV Max",
        measure: "265/60R18",
        description: "Para SUVs y camionetas con uso mixto.",
        price: "152.00",
        originalPrice: "185.00",
        badge: null,
      },
    ],
  },
];
