#!/bin/bash

echo "Ajustando permissões do keyFile..."
chmod 400 /etc/mongo-keyfile
chown 999:999 /etc/mongo-keyfile

# Aguardar o MongoDB iniciar
echo "Aguardando MongoDB iniciar..."
until mongosh --host mongo -u root -p root --authenticationDatabase admin --eval "db.adminCommand('ping')" &>/dev/null; do
    echo "Aguardando MongoDB..."
    sleep 5
done

# Iniciar o replica set
echo "Iniciando replica set..."
mongosh --host mongo -u root -p root --authenticationDatabase admin <<EOF
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongo:27017" }
  ]
})
EOF

echo "Replica set iniciado!"
tail -f /dev/null