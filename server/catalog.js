const sanityClient = require('@sanity/client');
const demoProducts = ['Casque', 'Enceinte', 'Ecouteurs'].map((name, i) => ({
  _id: `demo-${i}`, name, price: [79, 49, 29][i], slug: {current: name.toLowerCase()},
  details: 'Produit de démonstration. Configurez votre catalogue Sanity pour vendre.',
  image: [{url: '/products/demo.svg'}],
}));
function configured() { return Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID); }
function client() {
  return sanityClient({projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production', apiVersion: '2026-01-01',
    token: process.env.SANITY_READ_TOKEN || undefined, useCdn: false});
}
async function loadCatalog() {
  if (!configured()) return {products: demoProducts, bannerData: [], demo: true};
  const [products, bannerData] = await Promise.all([
    client().fetch('*[_type == "product"]'), client().fetch('*[_type == "banner"]')]);
  return {products, bannerData, demo: false};
}
async function findProducts(ids) {
  if (!configured()) throw Object.assign(new Error('Configurez Sanity pour activer les paiements.'), {status: 503});
  return client().fetch('*[_type == "product" && _id in $ids]{_id,name,price}', {ids});
}
module.exports = {loadCatalog, findProducts};
