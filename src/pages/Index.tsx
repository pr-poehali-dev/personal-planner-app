import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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

interface Note {
  id: string;
  title: string;
  content: string;
  notebook: string;
  color: string;
  date: Date;
}

interface Event {
  id: string;
  title: string;
  date: Date;
  color: string;
  type: string;
}

const taskColors = [
  { value: 'purple', label: 'Фиолетовый', class: 'bg-gradient-to-br from-purple-500 to-purple-600' },
  { value: 'pink', label: 'Розовый', class: 'bg-gradient-to-br from-pink-500 to-pink-600' },
  { value: 'orange', label: 'Оранжевый', class: 'bg-gradient-to-br from-orange-500 to-orange-600' },
  { value: 'blue', label: 'Голубой', class: 'bg-gradient-to-br from-blue-500 to-blue-600' },
  { value: 'green', label: 'Зелёный', class: 'bg-gradient-to-br from-green-500 to-green-600' },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState('tasks');
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Разработать дизайн приложения',
      description: 'Создать макеты основных экранов',
      status: 'in-progress',
      priority: 'high',
      color: 'purple',
      date: new Date(2026, 0, 20),
      subtasks: [
        { id: '1-1', title: 'Главный экран', completed: true },
        { id: '1-2', title: 'Страница задач', completed: false },
      ],
    },
    {
      id: '2',
      title: 'Написать техническое задание',
      description: 'Описать требования к проекту',
      status: 'todo',
      priority: 'medium',
      color: 'pink',
      subtasks: [],
    },
    {
      id: '3',
      title: 'Созвониться с командой',
      description: 'Обсудить прогресс',
      status: 'done',
      priority: 'low',
      color: 'blue',
      date: new Date(2026, 0, 16),
      subtasks: [],
    },
  ]);

  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Идеи для проекта',
      content: 'Добавить возможность совместной работы над задачами...',
      notebook: 'Работа',
      color: 'purple',
      date: new Date(2026, 0, 15),
    },
    {
      id: '2',
      title: 'Список покупок',
      content: 'Молоко, хлеб, яйца, фрукты',
      notebook: 'Личное',
      color: 'orange',
      date: new Date(2026, 0, 16),
    },
  ]);

  const [events, setEvents] = useState<Event[]>([
    { id: '1', title: 'Встреча с клиентом', date: new Date(2026, 0, 18), color: 'purple', type: 'Работа' },
    { id: '2', title: 'День рождения друга', date: new Date(2026, 0, 22), color: 'pink', type: 'Личное' },
    { id: '3', title: 'Дедлайн проекта', date: new Date(2026, 0, 25), color: 'orange', type: 'Работа' },
  ]);

  const [newTask, setNewTask] = useState({ title: '', description: '', color: 'purple', priority: 'medium' as const, status: 'todo' as const });
  const [newNote, setNewNote] = useState({ title: '', content: '', notebook: 'Работа', color: 'purple' });
  const [newEvent, setNewEvent] = useState({ title: '', date: new Date(), color: 'purple', type: 'Работа' });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const getColorClass = (color: string) => {
    const colorObj = taskColors.find((c) => c.value === color);
    return colorObj?.class || taskColors[0].class;
  };

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      setTasks([...tasks, { ...newTask, id: Date.now().toString(), subtasks: [] }]);
      setNewTask({ title: '', description: '', color: 'purple', priority: 'medium', status: 'todo' });
    }
  };

  const handleAddNote = () => {
    if (newNote.title.trim()) {
      setNotes([...notes, { ...newNote, id: Date.now().toString(), date: new Date() }]);
      setNewNote({ title: '', content: '', notebook: 'Работа', color: 'purple' });
    }
  };

  const handleAddEvent = () => {
    if (newEvent.title.trim()) {
      setEvents([...events, { ...newEvent, id: Date.now().toString() }]);
      setNewEvent({ title: '', date: new Date(), color: 'purple', type: 'Работа' });
    }
  };

  const moveTask = (taskId: string, newStatus: 'todo' | 'in-progress' | 'done') => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)));
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map((st) => (st.id === subtaskId ? { ...st, completed: !st.completed } : st)),
            }
          : task
      )
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return '';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Высокий';
      case 'medium':
        return 'Средний';
      case 'low':
        return 'Низкий';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="container mx-auto p-6 max-w-7xl">
        <header className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              Мой Ежедневник ✨
            </h1>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg">
              <Icon name="Settings" className="mr-2" size={18} />
              Настройки
            </Button>
          </div>
          <p className="text-muted-foreground text-lg">Организуй свою жизнь творчески и вдохновенно</p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-14 bg-white/60 backdrop-blur-sm shadow-lg rounded-2xl">
            <TabsTrigger value="tasks" className="text-base font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-xl">
              <Icon name="CheckSquare" className="mr-2" size={18} />
              Задачи
            </TabsTrigger>
            <TabsTrigger value="calendar" className="text-base font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-orange-500 data-[state=active]:text-white rounded-xl">
              <Icon name="Calendar" className="mr-2" size={18} />
              Календарь
            </TabsTrigger>
            <TabsTrigger value="notes" className="text-base font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-xl">
              <Icon name="FileText" className="mr-2" size={18} />
              Заметки
            </TabsTrigger>
            <TabsTrigger value="projects" className="text-base font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-xl">
              <Icon name="FolderKanban" className="mr-2" size={18} />
              Проекты
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-6 animate-fade-in">
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
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-800">Календарь событий</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-semibold shadow-lg hover-scale">
                    <Icon name="Plus" className="mr-2" size={18} />
                    Новое событие
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Создать событие</DialogTitle>
                    <DialogDescription>Добавьте новое событие в календарь</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="event-title">Название</Label>
                      <Input
                        id="event-title"
                        placeholder="Название события"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Дата</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <Icon name="Calendar" className="mr-2" size={16} />
                              {format(newEvent.date, 'dd.MM.yyyy', { locale: ru })}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={newEvent.date} onSelect={(date) => date && setNewEvent({ ...newEvent, date })} locale={ru} />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="event-type">Тип</Label>
                        <Select value={newEvent.type} onValueChange={(value) => setNewEvent({ ...newEvent, type: value })}>
                          <SelectTrigger id="event-type">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Работа">Работа</SelectItem>
                            <SelectItem value="Личное">Личное</SelectItem>
                            <SelectItem value="Здоровье">Здоровье</SelectItem>
                            <SelectItem value="Обучение">Обучение</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Цвет</Label>
                      <div className="flex gap-2">
                        {taskColors.map((color) => (
                          <button
                            key={color.value}
                            onClick={() => setNewEvent({ ...newEvent, color: color.value })}
                            className={cn('w-10 h-10 rounded-lg transition-all hover-scale', getColorClass(color.value), newEvent.color === color.value && 'ring-4 ring-offset-2 ring-gray-400')}
                          />
                        ))}
                      </div>
                    </div>
                    <Button onClick={handleAddEvent} className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600">
                      Создать событие
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Выберите дату</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Calendar mode="single" selected={selectedDate} onSelect={(date) => date && setSelectedDate(date)} locale={ru} className="rounded-xl border shadow-sm" />
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-800">Предстоящие события</h3>
                <div className="space-y-3">
                  {events
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .map((event) => (
                      <Card key={event.id} className="hover-scale shadow-md hover:shadow-xl transition-all duration-200 border-l-4 overflow-hidden" style={{ borderLeftColor: `hsl(var(--${event.color}))` }}>
                        <div className={cn('h-2', getColorClass(event.color))} />
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg font-bold">{event.title}</CardTitle>
                              <CardDescription className="flex items-center gap-2 mt-2">
                                <Icon name="Calendar" size={14} />
                                {format(event.date, 'dd MMMM yyyy', { locale: ru })}
                              </CardDescription>
                            </div>
                            <Badge className={cn('text-xs', getColorClass(event.color), 'text-white border-0')}>{event.type}</Badge>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-800">Заметки и блокноты</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 text-white font-semibold shadow-lg hover-scale">
                    <Icon name="Plus" className="mr-2" size={18} />
                    Новая заметка
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Создать заметку</DialogTitle>
                    <DialogDescription>Добавьте новую заметку в блокнот</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="note-title">Заголовок</Label>
                      <Input
                        id="note-title"
                        placeholder="Заголовок заметки"
                        value={newNote.title}
                        onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="note-content">Содержание</Label>
                      <Textarea
                        id="note-content"
                        placeholder="Содержание заметки"
                        value={newNote.content}
                        onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                        rows={6}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="note-notebook">Блокнот</Label>
                        <Select value={newNote.notebook} onValueChange={(value) => setNewNote({ ...newNote, notebook: value })}>
                          <SelectTrigger id="note-notebook">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Работа">Работа</SelectItem>
                            <SelectItem value="Личное">Личное</SelectItem>
                            <SelectItem value="Идеи">Идеи</SelectItem>
                            <SelectItem value="Обучение">Обучение</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Цвет</Label>
                        <Select value={newNote.color} onValueChange={(value) => setNewNote({ ...newNote, color: value })}>
                          <SelectTrigger>
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
                    <Button onClick={handleAddNote} className="w-full bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600">
                      Создать заметку
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note) => (
                <Card key={note.id} className="hover-scale shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden group">
                  <div className={cn('h-3', getColorClass(note.color))} />
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        <Icon name="Folder" size={12} className="mr-1" />
                        {note.notebook}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{format(note.date, 'dd.MM.yyyy', { locale: ru })}</span>
                    </div>
                    <CardTitle className="text-xl font-bold">{note.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-4">{note.content}</p>
                    <Button variant="ghost" size="sm" className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Icon name="Edit" size={14} className="mr-2" />
                      Редактировать
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-800">Проекты и шаблоны</h2>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold shadow-lg hover-scale">
                <Icon name="Plus" className="mr-2" size={18} />
                Новый проект
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Запуск продукта', progress: 75, tasks: 12, color: 'purple', icon: 'Rocket' },
                { name: 'Разработка сайта', progress: 45, tasks: 8, color: 'pink', icon: 'Code' },
                { name: 'Маркетинговая кампания', progress: 90, tasks: 15, color: 'orange', icon: 'Megaphone' },
                { name: 'Обучение команды', progress: 30, tasks: 6, color: 'blue', icon: 'GraduationCap' },
                { name: 'Редизайн бренда', progress: 60, tasks: 10, color: 'green', icon: 'Palette' },
              ].map((project, index) => (
                <Card key={index} className="hover-scale shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden group">
                  <div className={cn('h-3', getColorClass(project.color))} />
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center text-white', getColorClass(project.color))}>
                        <Icon name={project.icon as any} size={24} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg font-bold">{project.name}</CardTitle>
                        <CardDescription className="text-xs">{project.tasks} задач</CardDescription>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Прогресс</span>
                        <span className="font-bold text-gray-800">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div className={cn('h-full rounded-full transition-all duration-300', getColorClass(project.color))} style={{ width: `${project.progress}%` }} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" size="sm" className="w-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <Icon name="ExternalLink" size={14} className="mr-2" />
                      Открыть проект
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Быстрые шаблоны</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Чек-лист', icon: 'ListChecks', color: 'purple' },
                  { name: 'Таблица', icon: 'Table', color: 'pink' },
                  { name: 'База данных', icon: 'Database', color: 'orange' },
                  { name: 'Галерея', icon: 'Images', color: 'blue' },
                ].map((template, index) => (
                  <Card key={index} className="hover-scale cursor-pointer shadow-md hover:shadow-xl transition-all duration-200 group">
                    <CardContent className="flex flex-col items-center justify-center p-6 gap-3">
                      <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center text-white', getColorClass(template.color))}>
                        <Icon name={template.icon as any} size={32} />
                      </div>
                      <span className="font-semibold text-gray-800 text-center">{template.name}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
