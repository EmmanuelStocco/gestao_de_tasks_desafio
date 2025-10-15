const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'API Gateway is running' });
});

// Auth endpoints (mock)
app.post('/api/auth/register', (req, res) => {
  res.json({
    success: true,
    data: {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      user: {
        id: '1',
        email: req.body.email,
        username: req.body.username,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  res.json({
    success: true,
    data: {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      user: {
        id: '1',
        email: req.body.email,
        username: 'usuario',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }
  });
});

app.post('/api/auth/refresh', (req, res) => {
  res.json({
    success: true,
    data: {
      accessToken: 'new-mock-access-token'
    }
  });
});

// Tasks endpoints (mock)
app.get('/api/tasks', (req, res) => {
  res.json({
    success: true,
    data: {
      data: [],
      total: 0,
      page: 1,
      size: 10,
      totalPages: 0
    }
  });
});

app.post('/api/tasks', (req, res) => {
  res.json({
    success: true,
    data: {
      id: '1',
      title: req.body.title,
      description: req.body.description,
      deadline: req.body.deadline,
      priority: req.body.priority,
      status: 'TODO',
      assignedUsers: [],
      comments: [],
      createdBy: { username: 'usuario' },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });
});

app.get('/api/tasks/:id', (req, res) => {
  res.json({
    success: true,
    data: {
      id: req.params.id,
      title: 'Tarefa de Exemplo',
      description: 'Descrição da tarefa',
      deadline: new Date(),
      priority: 'MEDIUM',
      status: 'TODO',
      assignedUsers: [],
      comments: [],
      createdBy: { username: 'usuario' },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });
});

app.put('/api/tasks/:id', (req, res) => {
  res.json({
    success: true,
    data: {
      id: req.params.id,
      ...req.body,
      updatedAt: new Date()
    }
  });
});

app.delete('/api/tasks/:id', (req, res) => {
  res.json({
    success: true,
    message: 'Tarefa deletada com sucesso'
  });
});

app.post('/api/tasks/:id/comments', (req, res) => {
  res.json({
    success: true,
    data: {
      id: '1',
      content: req.body.content,
      author: { username: 'usuario' },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });
});

app.get('/api/tasks/:id/comments', (req, res) => {
  res.json({
    success: true,
    data: {
      data: [],
      total: 0,
      page: 1,
      size: 10,
      totalPages: 0
    }
  });
});

// Notifications endpoints (mock)
app.get('/api/notifications', (req, res) => {
  res.json({
    success: true,
    data: {
      data: [],
      total: 0,
      page: 1,
      size: 10,
      totalPages: 0
    }
  });
});

app.patch('/api/notifications/:id/read', (req, res) => {
  res.json({
    success: true,
    message: 'Notificação marcada como lida'
  });
});

app.patch('/api/notifications/read-all', (req, res) => {
  res.json({
    success: true,
    message: 'Todas as notificações marcadas como lidas'
  });
});

// Swagger endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    info: {
      title: 'Gestão de Tarefas API',
      description: 'API para sistema de gestão de tarefas colaborativo',
      version: '1.0.0'
    },
    paths: {
      '/api/auth/register': {
        post: {
          summary: 'Registrar usuário',
          description: 'Cria uma nova conta de usuário'
        }
      },
      '/api/auth/login': {
        post: {
          summary: 'Login',
          description: 'Autentica um usuário'
        }
      }
    }
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`API Gateway running on port ${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
  console.log(`API Docs: http://localhost:${port}/api/docs`);
});
