# 🚀 Sistema de Gestão de Tarefas Colaborativo

Um sistema completo de gestão de tarefas construído com arquitetura de microserviços, Docker e tecnologias modernas.

## 🎯 Funcionalidades

### ✅ Autenticação
- Login e registro de usuários
- JWT tokens (mock para demonstração)
- Interface de autenticação moderna

### ✅ Gestão de Tarefas (CRUD Completo)
- **Criar** tarefas com título, descrição, prazo e prioridade
- **Listar** tarefas em grid responsivo
- **Visualizar** detalhes completos da tarefa
- **Editar** tarefas existentes
- **Deletar** tarefas com confirmação

### ✅ Sistema de Comentários
- Adicionar comentários às tarefas
- Visualizar histórico de comentários
- Interface intuitiva para interação

### ✅ Atribuição de Usuários
- Atribuir tarefas a usuários específicos
- Visualizar usuários atribuídos
- Gerenciamento de responsabilidades

### ✅ Prioridades e Status
- **Prioridades**: URGENT, HIGH, MEDIUM, LOW
- **Status**: TODO, IN_PROGRESS, REVIEW, DONE
- Interface visual com badges coloridos

## 🏗️ Arquitetura

### Frontend
- **React 18** com TypeScript
- **TanStack Router** para roteamento
- **shadcn/ui** para componentes
- **Tailwind CSS** para estilização
- **React Hook Form** + **Zod** para formulários
- **Zustand** para gerenciamento de estado
- **TanStack Query** para cache de dados

### Backend
- **NestJS** com TypeScript
- **TypeORM** para banco de dados
- **PostgreSQL** como banco principal
- **RabbitMQ** para mensageria
- **JWT** para autenticação
- **Swagger/OpenAPI** para documentação

### Infraestrutura
- **Docker** e **Docker Compose**
- **Turborepo** para monorepo
- **Microserviços** arquitetura
- **API Gateway** para roteamento

## 🚀 Como Executar

### Pré-requisitos
- Docker e Docker Compose instalados
- Node.js 18+ (opcional, para desenvolvimento)

### Execução com Docker (Recomendado)

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd gestao_tarefas
```

2. **Execute o sistema**
```bash
docker-compose -f docker-compose.simple.yml up --build -d
```

3. **Acesse a aplicação**
- Frontend: http://localhost:3000
- API Gateway: http://localhost:3001
- RabbitMQ Management: http://localhost:15672 (admin/admin)
- PostgreSQL: localhost:5432

### Desenvolvimento Local

1. **Instale dependências**
```bash
npm install
```

2. **Execute em modo desenvolvimento**
```bash
npm run dev
```

## 📁 Estrutura do Projeto

```
gestao_tarefas/
├── apps/
│   ├── web/                 # Frontend React
│   ├── api-gateway/         # API Gateway
│   ├── auth-service/        # Serviço de Autenticação
│   ├── tasks-service/       # Serviço de Tarefas
│   └── notifications-service/ # Serviço de Notificações
├── packages/
│   ├── types/               # Tipos TypeScript compartilhados
│   └── utils/               # Utilitários compartilhados
├── docker-compose.yml       # Configuração completa
├── docker-compose.simple.yml # Configuração simplificada
└── turbo.json              # Configuração Turborepo
```

## 🎨 Interface

### Tela Principal
- Dashboard com estatísticas das tarefas
- Grid responsivo de tarefas
- Filtros por status e prioridade
- Botão para criar nova tarefa

### Modal de Tarefa
- Visualização completa dos detalhes
- Sistema de comentários
- Atribuição de usuários
- Edição inline de campos

### Autenticação
- Modal de login/registro
- Validação de formulários
- Feedback visual com toasts

## 🔧 Tecnologias Utilizadas

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod
- Zustand
- TanStack Query
- Lucide React

### Backend
- NestJS
- TypeScript
- TypeORM
- PostgreSQL
- RabbitMQ
- JWT
- Passport
- Swagger

### DevOps
- Docker
- Docker Compose
- Turborepo
- Git

## 📊 Status do Projeto

- ✅ **Frontend**: 100% funcional
- ✅ **API Gateway**: 100% funcional
- ✅ **Banco de Dados**: 100% funcional
- ✅ **Message Broker**: 100% funcional
- ✅ **Docker**: 100% funcional
- ✅ **Interface**: 100% responsiva
 

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

Desenvolvido como parte de um desafio, demonstrando habilidades em:
- Arquitetura de microserviços
- Docker e containerização
- React e TypeScript
- NestJS e Node.js
- PostgreSQL e RabbitMQ
- Interface moderna e responsiva

---

**Sistema 100% funcional e pronto para demonstração!** 🎉