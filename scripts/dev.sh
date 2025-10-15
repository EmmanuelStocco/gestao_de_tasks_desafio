#!/bin/bash

echo "🚀 Iniciando Sistema de Gestão de Tarefas..."

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker primeiro."
    exit 1
fi

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose down

# Remover volumes antigos (opcional)
read -p "Deseja remover dados antigos? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️ Removendo volumes antigos..."
    docker-compose down -v
fi

# Construir e iniciar containers
echo "🔨 Construindo e iniciando containers..."
docker-compose up --build -d

# Aguardar serviços ficarem prontos
echo "⏳ Aguardando serviços ficarem prontos..."
sleep 30

# Verificar status dos containers
echo "📊 Status dos containers:"
docker-compose ps

echo ""
echo "✅ Sistema iniciado com sucesso!"
echo ""
echo "🌐 Acesse:"
echo "   Frontend: http://localhost:3000"
echo "   API Gateway: http://localhost:3001"
echo "   Swagger: http://localhost:3001/api/docs"
echo "   RabbitMQ Management: http://localhost:15672 (admin/admin)"
echo ""
echo "📝 Para ver logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 Para parar:"
echo "   docker-compose down"
