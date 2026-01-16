import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';

interface ProjectsTabProps {
  getColorClass: (color: string) => string;
}

const ProjectsTab = ({ getColorClass }: ProjectsTabProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
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
    </div>
  );
};

export default ProjectsTab;
