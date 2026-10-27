/* global process */
// Función de Vercel para /product/:param (ver vercel.json). Devuelve un código HTTP real ANTES de cargar la SPA:
//   308  /product/5 o un slug viejo/incorrecto → /product/5-nankang-ultra-sport-ns-2-175-50-r13-72v
//   404  el producto no existe        410  el producto está desactivado   (la SPA se sirve con noindex)
//   503  la API falló temporalmente (Google reintenta y conserva lo indexado)
//   200  URL canónica (también los productos agotados): se sirve el index.html de la SPA
// La decisión la toma el backend (GET /seo/producto/:param): una sola fuente de verdad para las URLs.

const API_BASE = (process.env.API_BASE_URL || 'https://ectyre-backend.vercel.app/api/v1').replace(/\/$/, '');
const TIMEOUT_MS = 4000;

const cacheControl = {
  ok: 'public, max-age=0, s-maxage=60, stale-while-revalidate=300',
  redirect: 'public, max-age=0, s-maxage=300, stale-while-revalidate=3600',
  missing: 'public, max-age=0, s-maxage=60',
  error: 'no-store',
};

async function resolver(param) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(`${API_BASE}/seo/producto/${encodeURIComponent(param)}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// HTML de la SPA: se pide a la propia tienda (/index.html es un archivo estático, no pasa por esta función)
async function cargarShell(req) {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const response = await fetch(`${proto}://${host}/index.html`);
  if (!response.ok) throw new Error(`index.html respondió ${response.status}`);
  return response.text();
}

// Conserva los parámetros de seguimiento (utm_*, fbclid…) en la redirección; descarta el parámetro interno "p".
function queryString(req) {
  const params = new URLSearchParams();
  for (const [clave, valor] of Object.entries(req.query || {})) {
    if (clave === 'p') continue;
    (Array.isArray(valor) ? valor : [valor]).forEach((v) => params.append(clave, v));
  }
  const texto = params.toString();
  return texto ? `?${texto}` : '';
}

export default async function handler(req, res) {
  const param = String(Array.isArray(req.query?.p) ? req.query.p[0] : req.query?.p || '').replace(/\/+$/, '');
  const resultado = await resolver(param);

  if (resultado?.estado === 'redirect' && /^\/product\/[\w-]+$/.test(resultado.canonical || '')) {
    res.setHeader('Cache-Control', cacheControl.redirect);
    res.setHeader('Location', `${resultado.canonical}${queryString(req)}`);
    res.statusCode = 308;
    return res.end();
  }

  let html;
  try {
    html = await cargarShell(req);
  } catch {
    res.statusCode = 503;
    res.setHeader('Retry-After', '120');
    res.setHeader('Cache-Control', cacheControl.error);
    return res.end('Servicio temporalmente no disponible');
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  if (!resultado) {
    // La API no respondió: 503 (temporal) para que Google no des-indexe ni indexe una página vacía.
    res.statusCode = 503;
    res.setHeader('Retry-After', '120');
    res.setHeader('Cache-Control', cacheControl.error);
    return res.end(html);
  }

  if (resultado.estado === 'no-existe' || resultado.estado === 'desactivado') {
    res.statusCode = resultado.status === 410 ? 410 : 404;
    res.setHeader('Cache-Control', cacheControl.missing);
    res.setHeader('X-Robots-Tag', 'noindex');
    return res.end(html.replace('</head>', '<meta name="robots" content="noindex, follow" /></head>'));
  }

  res.statusCode = 200;
  res.setHeader('Cache-Control', cacheControl.ok);
  return res.end(html);
}
