import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AuthModal } from '@/components/AuthModal'
import { CreateTaskModal } from '@/components/CreateTaskModal'
import { TaskModal } from '@/components/TaskModal'
import { TaskCard } from '@/components/TaskCard'
import { Plus, LogOut, Calendar, User, MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { Task, TaskPriority, TaskStatus } from '@gestao-tarefas/types'
import { useAuthStore } from '@/store/auth'
import api from '@/lib/api'

function App() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)

  // Carregar tarefas quando usuário estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      loadTasks()
    }
  }, [isAuthenticated])

  const handleLogout = () => {
    logout()
    setTasks([])
    toast.success('Logout realizado com sucesso!')
  }

  const handleLogin = (userData: any) => {
    setShowAuthModal(false)
    loadTasks()
  }

  const loadTasks = async () => {
    setLoading(true)
    try {
      const response = await api.get('/api/tasks')
      setTasks(response.data.data || [])
    } catch (error: any) {
      toast.error('Erro ao carregar tarefas')
      console.error('Error loading tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (taskData: any) => {
    try {
      const response = await api.post('/api/tasks', taskData)
      setTasks(prev => [response.data, ...prev])
      toast.success('Tarefa criada com sucesso!')
      setShowCreateModal(false)
    } catch (error: any) {
      toast.error('Erro ao criar tarefa')
      console.error('Error creating task:', error)
    }
  }

  const handleTaskView = (task: Task) => {
    setSelectedTask(task)
    setShowTaskModal(true)
  }

  const handleTaskUpdate = async (updatedTask: Task) => {
    try {
      const response = await api.patch(`/api/tasks/${updatedTask.id}`, updatedTask)
      setTasks(prev => prev.map(task => 
        task.id === updatedTask.id ? response.data : task
      ))
      toast.success('Tarefa atualizada com sucesso!')
    } catch (error: any) {
      toast.error('Erro ao atualizar tarefa')
      console.error('Error updating task:', error)
    }
  }

  const handleTaskDelete = async (taskId: string) => {
    try {
      await api.delete(`/api/tasks/${taskId}`)
      setTasks(prev => prev.filter(task => task.id !== taskId))
      toast.success('Tarefa deletada com sucesso!')
    } catch (error: any) {
      toast.error('Erro ao deletar tarefa')
      console.error('Error deleting task:', error)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Gestão de Tarefas</CardTitle>
            <CardDescription>
              Sistema colaborativo para gerenciar suas tarefas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setShowAuthModal(true)} 
              className="w-full"
              size="lg"
            >
              Entrar / Registrar
            </Button>
          </CardContent>
        </Card>
        
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Gestão de Tarefas</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                <div>Olá, <span className="font-semibold">{user?.username || 'Usuário'}</span></div>
                <div className="text-xs text-gray-400">{user?.email}</div>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Suas Tarefas</h2>
            <p className="text-gray-600">Gerencie e acompanhe suas tarefas</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Tarefa
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : tasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onView={handleTaskView}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500 text-lg">Nenhuma tarefa encontrada</p>
              <p className="text-gray-400">Crie sua primeira tarefa para começar</p>
            </CardContent>
          </Card>
        )}

        {/* Estatísticas */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium">Total</span>
              </div>
              <p className="text-2xl font-bold mt-1">{tasks.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium">A Fazer</span>
              </div>
              <p className="text-2xl font-bold mt-1">{tasks.filter(t => t.status === TaskStatus.TODO).length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium">Em Progresso</span>
              </div>
              <p className="text-2xl font-bold mt-1">{tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Concluídas</span>
              </div>
              <p className="text-2xl font-bold mt-1">{tasks.filter(t => t.status === TaskStatus.DONE).length}</p>
            </CardContent>
          </Card>
        </div>
      </main>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
      />
      
      <CreateTaskModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateTask}
      />
      
      <TaskModal 
        task={selectedTask}
        isOpen={showTaskModal} 
        onClose={() => {
          setShowTaskModal(false)
          setSelectedTask(null)
        }}
        onUpdate={handleTaskUpdate}
        onDelete={handleTaskDelete}
      />
    </div>
  )
}

export default App
