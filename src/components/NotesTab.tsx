import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

interface Note {
  id: string;
  title: string;
  content: string;
  notebook: string;
  color: string;
  date: Date;
}

interface NotesTabProps {
  notes: Note[];
  newNote: { title: string; content: string; notebook: string; color: string };
  setNewNote: (note: any) => void;
  handleAddNote: () => void;
  taskColors: { value: string; label: string; class: string }[];
  getColorClass: (color: string) => string;
}

const NotesTab = ({ notes, newNote, setNewNote, handleAddNote, taskColors, getColorClass }: NotesTabProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
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
    </div>
  );
};

export default NotesTab;
