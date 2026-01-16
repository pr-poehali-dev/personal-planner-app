import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import TasksTab from '@/components/TasksTab';
import CalendarTab from '@/components/CalendarTab';
import NotesTab from '@/components/NotesTab';
import ProjectsTab from '@/components/ProjectsTab';

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

          <TabsContent value="tasks">
            <TasksTab
              tasks={tasks}
              newTask={newTask}
              setNewTask={setNewTask}
              handleAddTask={handleAddTask}
              moveTask={moveTask}
              toggleSubtask={toggleSubtask}
              taskColors={taskColors}
              getColorClass={getColorClass}
              getPriorityColor={getPriorityColor}
              getPriorityLabel={getPriorityLabel}
            />
          </TabsContent>

          <TabsContent value="calendar">
            <CalendarTab
              events={events}
              newEvent={newEvent}
              setNewEvent={setNewEvent}
              handleAddEvent={handleAddEvent}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              taskColors={taskColors}
              getColorClass={getColorClass}
            />
          </TabsContent>

          <TabsContent value="notes">
            <NotesTab
              notes={notes}
              newNote={newNote}
              setNewNote={setNewNote}
              handleAddNote={handleAddNote}
              taskColors={taskColors}
              getColorClass={getColorClass}
            />
          </TabsContent>

          <TabsContent value="projects">
            <ProjectsTab getColorClass={getColorClass} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
