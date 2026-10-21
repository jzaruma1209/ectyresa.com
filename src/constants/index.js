// Constantes de la aplicación ECTYRE

// Sitio y contacto (único lugar donde se define el WhatsApp de pedidos)
export const SITE_URL = 'https://www.ectyre.com';
export const SITE_NAME = 'ECTYRE S.A.';
export const WHATSAPP_NUMBER = '593999601748'; // +593 99 960 1748, formato internacional sin '+' para wa.me

// Impuestos
export const IVA_RATE = 0.15; // 15% IVA Ecuador

// LocalStorage keys
export const STORAGE_KEYS = {
  CART: 'ectyre_cart',
  USER: 'ectyre_user',
  TOKEN: 'ectyre_token',
  SESSION_ID: 'ectyre_session_id',
};

// Categorías de productos
export const CATEGORIES = {
  AUTOS: 'autos',
  MOTOS: 'motos',
  CAMIONES: 'camiones',
};

// Tipos de terreno
export const TERRAIN_TYPES = {
  ASFALTO: 'asfalto',
  TODO_TERRENO: 'todo-terreno',
  CARGA: 'carga',
};

// Ordenamiento
export const SORT_OPTIONS = {
  NAME: 'name',
  PRICE_ASC: 'price-asc',
  PRICE_DESC: 'price-desc',
};

// API
export const API_TIMEOUT = 10000; // 10 segundos
