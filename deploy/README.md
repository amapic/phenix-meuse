# Test temporaire sur Ubuntu (sans pm2 ni nginx)

## Sur le PC
```powershell
npm run build:node        # génère .output/
```

## Envoi (FileZilla) dans /home/ubuntu/testApi
- `.output/`
- `server/` (sans `node_modules`)
- `deploy/start.sh`

## Sur le serveur
```bash
cd /home/ubuntu/testApi
cp server/.env.example server/.env && nano server/.env   # DB_NAME, DB_PASSWORD (une seule fois)
chmod +x start.sh
./start.sh
```

Ouvrir `http://IP_DU_SERVEUR:8081/poilus`. L'API tourne sur le port 3001. Ctrl+C arrête les deux.

- Ports : `API_PORT=3002 WEB_PORT=8082 ./start.sh` (si l'API change de port, rebuild avec `$env:VITE_POILUS_API_URL="http://IP:PORT"`).
- Pare-feu : `sudo ufw allow 8081` et `sudo ufw allow 3001` si besoin (à refermer après).
- Après fermeture du terminal : `nohup ./start.sh > run.log 2>&1 &`
- Test API : `curl http://127.0.0.1:3001/health`
