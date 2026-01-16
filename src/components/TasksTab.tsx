import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  color: string;
  date?: Date;
  subtasks: { id: string; title: string; completed: boolean }[];
}

interface TasksTabProps {
  tasks: Task[];
  newTask: { title: string; description: string; color: string; priority: 'low' | 'medium' | 'high'; status: 'todo' | 'in-progress' | 'done' };
  setNewTask: (task: any) => void;
  handleAddTask: () => void;
  moveTask: (taskId: string, newStatus: 'todo' | 'in-progress' | 'done') => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  taskColors: { value: string; label: string; class: string }[];
  getColorClass: (color: string) => string;
  getPriorityColor: (priority: string) => string;
  getPriorityLabel: (priority: string) => string;
}

const TasksTab = ({
  tasks,
  newTask,
  setNewTask,
  handleAddTask,
  moveTask,
  toggleSubtask,
  taskColors,
  getColorClass,
  getPriorityColor,
  getPriorityLabel,
}: TasksTabProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Канбан-доска</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg hover-scale">
              <Icon name="Plus" className="mr-2" size={18} />
              Новая задача
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Создать задачу</DialogTitle>
              <DialogDescription>Добавьте новую задачу в ваш ежедневник</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="task-title">Название</Label>
                <Input
                  id="task-title"
                  placeholder="Название задачи"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-description">Описание</Label>
                <Textarea
                  id="task-description"
                  placeholder="Описание задачи"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="task-priority">Приоритет</Label>
                  <Select value={newTask.priority} onValueChange={(value: any) => setNewTask({ ...newTask, priority: value })}>
                    <SelectTrigger id="task-priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Низкий</SelectItem>
                      <SelectItem value="medium">Средний</SelectItem>
                      <SelectItem value="high">Высокий</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="task-color">Цвет</Label>
                  <Select value={newTask.color} onValueChange={(value) => setNewTask({ ...newTask, color: value })}>
                    <SelectTrigger id="task-color">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {taskColors.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div className={cn('w-4 h-4 rounded', color.class)} />
                            {color.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleAddTask} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                Создать задачу
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['todo', 'in-progress', 'done'].map((status) => (
          <div key={status} className="space-y-4">
            <div className="flex items-center gap-2">
              <div className={cn('w-3 h-3 rounded-full', status === 'todo' ? 'bg-gray-400' : status === 'in-progress' ? 'bg-blue-500' : 'bg-green-500')} />
              <h3 className="text-xl font-bold text-gray-700">
                {status === 'todo' ? 'К выполнению' : status === 'in-progress' ? 'В процессе' : 'Выполнено'}
              </h3>
              <Badge variant="secondary" className="ml-auto">
                {tasks.filter((t) => t.status === status).length}
              </Badge>
            </div>
            <div className="space-y-3">
              {tasks
                .filter((task) => task.status === status)
                .map((task) => (
                  <Card key={task.id} className="group hover-scale cursor-move shadow-md hover:shadow-xl transition-all duration-200 border-2 overflow-hidden">
                    <div className={cn('h-2', getColorClass(task.color))} />
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg font-bold text-gray-800">{task.title}</CardTitle>
                        <Badge className={cn('text-xs border', getPriorityColor(task.priority))}>{getPriorityLabel(task.priority)}</Badge>
                      </div>
                      {task.description && <CardDescription className="text-sm">{task.description}</CardDescription>}
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {task.date && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Icon name="Calendar" size={14} />
                          {format(task.date, 'dd MMMM yyyy', { locale: ru })}
                        </div>
                      )}
                      {task.subtasks.length > 0 && (
                        <div className="space-y-2">
                          {task.subtasks.map((subtask) => (
                            <label key={subtask.id} className="flex items-center gap-2 cursor-pointer group/subtask">
                              <input
                                type="checkbox"
                                checked={subtask.completed}
                                onChange={() => toggleSubtask(task.id, subtask.id)}
                                className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                              />
                              <span className={cn('text-sm group-hover/subtask:text-purple-600 transition-colors', subtask.completed && 'line-through text-muted-foreground')}>
                                {subtask.title}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {status !== 'todo' && (
                          <Button size="sm" variant="outline" onClick={() => moveTask(task.id, status === 'in-progress' ? 'todo' : 'in-progress')} className="text-xs">
                            <Icon name="ChevronLeft" size={14} />
                          </Button>
                        )}
                        {status !== 'done' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => moveTask(task.id, status === 'todo' ? 'in-progress' : 'done')}
                            className="text-xs flex-1"
                          >
                            {status === 'todo' ? 'Начать' : 'Завершить'}
                            <Icon name="ChevronRight" size={14} className="ml-1" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasksTab;
