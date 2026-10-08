# Tech Store — Next.js + Sanity + Stripe

Boutique exécutable avec catalogue, fiches produit et panier persistant. Sans configuration externe, un catalogue de démonstration est disponible et les paiements sont désactivés explicitement.

## Démarrage local

Node.js 22 :

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Ouvrir http://localhost:3000. Vérification : http://localhost:3000/api/health.

```bash
npm test
npm run build
npm start
```

## Catalogue et paiement Stripe

Configurer `.env.local` à partir de `.env.example` :

- `NEXT_PUBLIC_SANITY_PROJECT_ID` et `NEXT_PUBLIC_SANITY_DATASET` identifient le catalogue.
- `SANITY_READ_TOKEN` reste côté serveur et est nécessaire si le dataset est privé.
- `STRIPE_SECRET_KEY` reste côté serveur. Utiliser une clé de test pour la validation initiale.
- `APP_BASE_URL` est l'origine réelle de la boutique, par exemple `http://localhost:3000` en local.

Les documents Sanity `product` doivent avoir `_id`, `name`, `price` (CAD, deux décimales maximum), `slug.current`, `image` et `details`. Les bannières sont optionnelles. Les prix Stripe sont reconstruits depuis Sanity, jamais depuis le panier envoyé. Les quantités sont bornées, les doublons regroupés et les tentatives répétées utilisent une clé d'idempotence.

La page de retour vérifie l'état payé auprès de Stripe avant de vider le panier. Elle ne déclenche pas l'expédition. Avant de vendre réellement, ajouter un registre de commandes durable, des webhooks de paiement signés, la gestion des stocks, des remboursements et les règles de livraison/taxes. Les anciens tarifs de livraison Stripe codés en dur ont été retirés.

## Docker

```bash
docker build -t tech-store .
docker run --rm -p 127.0.0.1:3000:3000 tech-store
```

Ce lancement utilise le catalogue de démonstration. Les variables `NEXT_PUBLIC_*` utilisées pour les images sont intégrées au build ; pour un catalogue réel, les fournir au build dans votre plateforme, puis fournir les clés privées uniquement au runtime.

Ne jamais utiliser de variables `NEXT_PUBLIC_*` pour des clés privées. Si les anciennes clés ont été exposées, les révoquer dans les tableaux de bord Stripe/Sanity : enlever un fichier de la branche ne supprime pas son historique Git.
