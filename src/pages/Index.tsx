import { useState, useEffect } from 'react';
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

const API_TASKS = 'https://functions.poehali.dev/f07380a6-e4a9-4d17-a481-1617b26e6970';
const API_NOTES = 'https://functions.poehali.dev/d1d343b3-0134-4ac5-a63f-faea0afbb90f';
const API_EVENTS = 'https://functions.poehali.dev/398daed3-ac6f-47c7-9edb-27271cd7d5d9';

const Index = () => {
  const [activeTab, setActiveTab] = useState('tasks');
  const [tasks, setTasks] = useState<Task[]>([]);

  const [notes, setNotes] = useState<Note[]>([]);

  const [events, setEvents] = useState<Event[]>([]);

  const [newTask, setNewTask] = useState({ title: '', description: '', color: 'purple', priority: 'medium' as const, status: 'todo' as const });
  const [newNote, setNewNote] = useState({ title: '', content: '', notebook: 'Работа', color: 'purple' });
  const [newEvent, setNewEvent] = useState({ title: '', date: new Date(), color: 'purple', type: 'Работа' });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const getColorClass = (color: string) => {
    const colorObj = taskColors.find((c) => c.value === color);
    return colorObj?.class || taskColors[0].class;
  };

  useEffect(() => {
    fetchTasks();
    fetchNotes();
    fetchEvents();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(API_TASKS);
      const data = await response.json();
      setTasks(data.map((t: any) => ({
        ...t,
        id: t.id.toString(),
        date: t.due_date ? new Date(t.due_date) : undefined,
        subtasks: t.subtasks || []
      })));
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await fetch(API_NOTES);
      const data = await response.json();
      setNotes(data.map((n: any) => ({
        ...n,
        id: n.id.toString(),
        date: new Date(n.created_at)
      })));
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch(API_EVENTS);
      const data = await response.json();
      setEvents(data.map((e: any) => ({
        ...e,
        id: e.id.toString(),
        date: new Date(e.event_date),
        type: e.event_type
      })));
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleAddTask = async () => {
    if (newTask.title.trim()) {
      try {
        const response = await fetch(API_TASKS, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: newTask.title,
            description: newTask.description,
            status: newTask.status,
            priority: newTask.priority,
            color: newTask.color,
            subtasks: []
          })
        });
        if (response.ok) {
          await fetchTasks();
          setNewTask({ title: '', description: '', color: 'purple', priority: 'medium', status: 'todo' });
        }
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  const handleAddNote = async () => {
    if (newNote.title.trim()) {
      try {
        const response = await fetch(API_NOTES, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newNote)
        });
        if (response.ok) {
          await fetchNotes();
          setNewNote({ title: '', content: '', notebook: 'Работа', color: 'purple' });
        }
      } catch (error) {
        console.error('Error adding note:', error);
      }
    }
  };

  const handleAddEvent = async () => {
    if (newEvent.title.trim()) {
      try {
        const response = await fetch(API_EVENTS, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: newEvent.title,
            event_date: newEvent.date.toISOString(),
            color: newEvent.color,
            event_type: newEvent.type
          })
        });
        if (response.ok) {
          await fetchEvents();
          setNewEvent({ title: '', date: new Date(), color: 'purple', type: 'Работа' });
        }
      } catch (error) {
        console.error('Error adding event:', error);
      }
    }
  };

  const moveTask = async (taskId: string, newStatus: 'todo' | 'in-progress' | 'done') => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    try {
      const response = await fetch(API_TASKS, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.dumps({
          id: parseInt(taskId),
          title: task.title,
          description: task.description,
          status: newStatus,
          priority: task.priority,
          color: task.color,
          due_date: task.date?.toISOString()
        })
      });
      if (response.ok) {
        await fetchTasks();
      }
    } catch (error) {
      console.error('Error moving task:', error);
    }
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