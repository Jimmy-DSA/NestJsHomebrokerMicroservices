Write-Host "checking mongo-keyfile..."

if (!(Test-Path "mongo-keyfile")) {
    openssl rand -base64 756 > mongo-keyfile
    Write-Host "mongo-keyfile succefully created."
} else {
    Write-Host "mongo-keyfile already exists."
}


# Inicia o Docker Compose
Write-Host "starting docker compose..."
docker-compose --env-file ./dev.env up -d

