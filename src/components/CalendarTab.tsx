import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Icon from '@/components/ui/icon';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface Event {
  id: string;
  title: string;
  date: Date;
  color: string;
  type: string;
}

interface CalendarTabProps {
  events: Event[];
  newEvent: { title: string; date: Date; color: string; type: string };
  setNewEvent: (event: any) => void;
  handleAddEvent: () => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  taskColors: { value: string; label: string; class: string }[];
  getColorClass: (color: string) => string;
}

const CalendarTab = ({
  events,
  newEvent,
  setNewEvent,
  handleAddEvent,
  selectedDate,
  setSelectedDate,
  taskColors,
  getColorClass,
}: CalendarTabProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
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
    </div>
  );
};

export default CalendarTab;
