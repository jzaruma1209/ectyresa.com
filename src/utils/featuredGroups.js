const GROUP_SIZE = 4;

// Barajar una copia: el catálogo y el orden de los destacados no se modifican.
const shuffle = (items, random) => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

export function buildFeaturedGroups(products, random = Math.random) {
  const catalog = [...new Map(
    products.filter((product) => product.active !== false)
      .map((product) => [String(product.id), product])
  ).values()];
  // Las ofertas también aparecen en destacados sin exigir una segunda casilla.
  const featured = catalog.filter((product) => product.featured || product.onSale);
  const groups = [];

  for (let index = 0; index < featured.length; index += GROUP_SIZE) {
    const group = featured.slice(index, index + GROUP_SIZE);
    const used = new Set(group.map((product) => String(product.id)));
    const candidates = shuffle(catalog.filter((product) => !used.has(String(product.id))), random);
    group.push(...candidates.slice(0, GROUP_SIZE - group.length));

    // Solo repetir si el catálogo entero no alcanza para cuatro tarjetas distintas.
    while (group.length < GROUP_SIZE) {
      const cycle = shuffle(catalog, random);
      group.push(...cycle.slice(0, GROUP_SIZE - group.length));
    }
    groups.push(group);
  }
  return groups;
}
