export default function handler(req, res) {
  res.status(200).json({status: 'ok', mode: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ? 'catalog' : 'demo'});
}
