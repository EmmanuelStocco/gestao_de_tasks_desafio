Write-Host "🚀 Iniciando Sistema de Gestão de Tarefas..." -ForegroundColor Green

# Verificar se Docker está rodando
try {
    docker info | Out-Null
} catch {
    Write-Host "❌ Docker não está rodando. Por favor, inicie o Docker primeiro." -ForegroundColor Red
    exit 1
}

# Parar containers existentes
Write-Host "🛑 Parando containers existentes..." -ForegroundColor Yellow
docker-compose down

# Perguntar se quer remover volumes antigos
$removeVolumes = Read-Host "Deseja remover dados antigos? (y/N)"
if ($removeVolumes -eq "y" -or $removeVolumes -eq "Y") {
    Write-Host "🗑️ Removendo volumes antigos..." -ForegroundColor Yellow
    docker-compose down -v
}

# Construir e iniciar containers
Write-Host "🔨 Construindo e iniciando containers..." -ForegroundColor Blue
docker-compose up --build -d

# Aguardar serviços ficarem prontos
Write-Host "⏳ Aguardando serviços ficarem prontos..." -ForegroundColor Cyan
Start-Sleep -Seconds 30

# Verificar status dos containers
Write-Host "📊 Status dos containers:" -ForegroundColor Green
docker-compose ps

Write-Host ""
Write-Host "✅ Sistema iniciado com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Acesse:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   API Gateway: http://localhost:3001" -ForegroundColor White
Write-Host "   Swagger: http://localhost:3001/api/docs" -ForegroundColor White
Write-Host "   RabbitMQ Management: http://localhost:15672 (admin/admin)" -ForegroundColor White
Write-Host ""
Write-Host "📝 Para ver logs:" -ForegroundColor Cyan
Write-Host "   docker-compose logs -f" -ForegroundColor White
Write-Host ""
Write-Host "🛑 Para parar:" -ForegroundColor Cyan
Write-Host "   docker-compose down" -ForegroundColor White
