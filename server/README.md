# API Node (PostgreSQL)

Sur le serveur Ubuntu :

```bash
cd server
npm install
cp .env.example .env   # puis renseigner DB_*, PORT, CORS_ORIGIN
npm start              # ou pm2 start server.js --name meuse-api
```

Routes : `GET /health`, `GET /poilus?q=&limit=&offset=`, `GET /poilus/:id`.

Les tables doivent s'appeler `personne`, `commune`, `bureau`, `regiment`, `section`, `cause`, `conflit` (schéma `public`).

Côté front, définir `VITE_POILUS_API_URL` (ex. `https://mon-serveur:3001`) ; défaut : `http://localhost:3001`.
