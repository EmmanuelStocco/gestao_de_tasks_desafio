import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Task, TaskPriority, TaskStatus } from '@gestao-tarefas/types'
import { Calendar, User, MessageCircle } from 'lucide-react'

interface TaskCardProps {
  task: Task
  onView: (task: Task) => void
}

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

export function TaskCard({ task, onView }: TaskCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onView(task)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{task.title}</CardTitle>
          <div className="flex gap-2">
            <Badge className={priorityColors[task.priority]}>
              {task.priority}
            </Badge>
            <Badge className={statusColors[task.status]}>
              {task.status}
            </Badge>
          </div>
        </div>
        <CardDescription className="line-clamp-2">
          {task.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{new Date(task.deadline).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{task.assignedUsers.length} usuário(s) atribuído(s)</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            <span>{task.comments?.length || 0} comentário(s)</span>
          </div>
        </div>
        <Button className="w-full mt-4" variant="outline">
          Ver Detalhes
        </Button>
      </CardContent>
    </Card>
  )
}
