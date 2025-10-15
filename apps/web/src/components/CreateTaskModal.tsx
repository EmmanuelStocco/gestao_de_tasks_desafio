import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CreateTaskDto, TaskPriority } from '@gestao-tarefas/types'
import api from '@/lib/api'
import toast from 'react-hot-toast'

const createTaskSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  deadline: z.string().min(1, 'Prazo é obrigatório'),
  priority: z.nativeEnum(TaskPriority),
  assignedUserIds: z.array(z.string()).optional(),
})

type CreateTaskForm = z.infer<typeof createTaskSchema>

interface CreateTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (taskData: any) => void
}

export function CreateTaskModal({ isOpen, onClose, onSuccess }: CreateTaskModalProps) {
  const form = useForm<CreateTaskForm>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      priority: TaskPriority.MEDIUM,
      assignedUserIds: [],
    },
  })

  const onSubmit = async (data: CreateTaskForm) => {
    try {
      const taskData = {
        ...data,
        deadline: new Date(data.deadline),
        assignedUserIds: data.assignedUserIds || [],
      }
      
      onSuccess(taskData)
      form.reset()
      onClose()
    } catch (error: any) {
      toast.error('Erro ao criar tarefa')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Criar Nova Tarefa</CardTitle>
          <CardDescription>
            Preencha os dados para criar uma nova tarefa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                {...form.register('title')}
                placeholder="Título da tarefa"
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div>
              <Textarea
                {...form.register('description')}
                placeholder="Descrição da tarefa"
                rows={4}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  {...form.register('deadline')}
                  type="datetime-local"
                />
                {form.formState.errors.deadline && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.deadline.message}
                  </p>
                )}
              </div>

              <div>
                <Select {...form.register('priority')}>
                  <option value={TaskPriority.LOW}>Baixa</option>
                  <option value={TaskPriority.MEDIUM}>Média</option>
                  <option value={TaskPriority.HIGH}>Alta</option>
                  <option value={TaskPriority.URGENT}>Urgente</option>
                </Select>
                {form.formState.errors.priority && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.priority.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                Criar Tarefa
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
