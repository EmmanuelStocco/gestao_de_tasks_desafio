import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Task, TaskPriority, TaskStatus, CreateCommentDto } from '@gestao-tarefas/types'
import { Calendar, User, MessageCircle, Send } from 'lucide-react'
import toast from 'react-hot-toast'

const commentSchema = z.object({
  content: z.string().min(1, 'Comentário não pode estar vazio'),
})

type CommentForm = z.infer<typeof commentSchema>

interface TaskModalProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (task: Task) => void
  onDelete: (taskId: string) => void
}

export function TaskModal({ task, isOpen, onClose, onUpdate, onDelete }: TaskModalProps) {
  const [comments, setComments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const commentForm = useForm<CommentForm>({
    resolver: zodResolver(commentSchema),
  })

  useEffect(() => {
    if (task && isOpen) {
      loadComments()
    }
  }, [task, isOpen])

  const loadComments = async () => {
    if (!task) return
    try {
      // Simular comentários para demonstração
      const mockComments = [
        {
          id: '1',
          content: 'Tarefa iniciada com sucesso!',
          author: { username: 'dev1' },
          createdAt: new Date()
        },
        {
          id: '2', 
          content: 'Aguardando revisão do código.',
          author: { username: 'reviewer' },
          createdAt: new Date()
        }
      ]
      setComments(mockComments)
    } catch (error) {
      toast.error('Erro ao carregar comentários')
    }
  }

  const onSubmitComment = async (data: CommentForm) => {
    if (!task) return
    try {
      setLoading(true)
      
      // Simular adição de comentário
      const newComment = {
        id: Date.now().toString(),
        content: data.content,
        author: { username: 'Usuário Atual' },
        createdAt: new Date()
      }
      
      setComments(prev => [...prev, newComment])
      commentForm.reset()
      toast.success('Comentário adicionado!')
    } catch (error) {
      toast.error('Erro ao adicionar comentário')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !task) return null

  const priorityColors = {
    [TaskPriority.LOW]: 'bg-green-100 text-green-800',
    [TaskPriority.MEDIUM]: 'bg-yellow-100 text-yellow-800',
    [TaskPriority.HIGH]: 'bg-orange-100 text-orange-800',
    [TaskPriority.URGENT]: 'bg-red-100 text-red-800',
  }

  const statusColors = {
    [TaskStatus.TODO]: 'bg-gray-100 text-gray-800',
    [TaskStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
    [TaskStatus.REVIEW]: 'bg-purple-100 text-purple-800',
    [TaskStatus.DONE]: 'bg-green-100 text-green-800',
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{task.title}</CardTitle>
              <CardDescription className="mt-2">{task.description}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge className={priorityColors[task.priority]}>
                {task.priority}
              </Badge>
              <Badge className={statusColors[task.status]}>
                {task.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Prazo: {new Date(task.deadline).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Criado por: {task.createdBy?.username}</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Usuários Atribuídos</h3>
            <div className="flex flex-wrap gap-2">
              {task.assignedUsers.map((user) => (
                <Badge key={user.id} variant="secondary">
                  {user.username}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Comentários ({comments.length})</h3>
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{comment.author?.username}</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              ))}
            </div>

            <form onSubmit={commentForm.handleSubmit(onSubmitComment)} className="mt-4">
              <div className="flex gap-2">
                <Textarea
                  {...commentForm.register('content')}
                  placeholder="Adicionar comentário..."
                  className="flex-1"
                />
                <Button type="submit" disabled={loading}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              {commentForm.formState.errors.content && (
                <p className="text-sm text-red-500 mt-1">
                  {commentForm.formState.errors.content.message}
                </p>
              )}
            </form>
          </div>

          <div className="flex justify-between">
            <Button 
              variant="destructive" 
              onClick={() => {
                if (task && confirm('Tem certeza que deseja deletar esta tarefa?')) {
                  onDelete(task.id)
                  onClose()
                }
              }}
            >
              Deletar Tarefa
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Fechar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
