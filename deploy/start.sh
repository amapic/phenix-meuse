#!/usr/bin/env bash
# Lance l'API et le site. Ã€ placer dans /home/ubuntu/testApi (Ã  cÃ´tÃ© de server/ et .output/).
# Usage : ./start.sh   (ports : API_PORT=3002 WEB_PORT=8082 ./start.sh)
cd "$(dirname "$0")"

API_PORT="${API_PORT:-3001}"
WEB_PORT="${WEB_PORT:-8081}"

[ -f server/.env ] || { echo "CrÃ©er server/.env (copie de server/.env.example) puis relancer."; exit 1; }
[ -d server/node_modules ] || (cd server && npm install --omit=dev) || exit 1

(cd server && PORT="$API_PORT" exec node server.js) &
API_PID=$!
PORT="$WEB_PORT" node .output/server/index.mjs &
WEB_PID=$!

trap 'kill $API_PID $WEB_PID 2>/dev/null' INT TERM EXIT
echo "API : port $API_PORT | Site : http://IP_DU_SERVEUR:$WEB_PORT/poilus"
wait
