'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Layout, 
  FileText, 
  Database, 
  Brain, 
  BarChart3, 
  Users,
  Mail,
  CreditCard,
  Calendar,
  Map,
  Settings
} from 'lucide-react';

interface Component {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: any;
  config: any;
}

const COMPONENT_LIBRARY: Component[] = [
  {
    id: 'header',
    name: 'Header',
    description: 'Navigation header with menu',
    category: 'Layout',
    icon: Layout,
    config: { type: 'header', props: {} }
  },
  {
    id: 'login-form',
    name: 'Login Form',
    description: 'User authentication form',
    category: 'Forms',
    icon: FileText,
    config: { type: 'form', subtype: 'login', props: {} }
  },
  {
    id: 'data-table',
    name: 'Data Table',
    description: 'Sortable data grid',
    category: 'Data',
    icon: Database,
    config: { type: 'table', props: {} }
  },
  {
    id: 'chatgpt-widget',
    name: 'ChatGPT Widget',
    description: 'OpenAI chat interface',
    category: 'AI Features',
    icon: Brain,
    config: { type: 'ai', subtype: 'chatgpt', props: {} }
  },
  {
    id: 'chart-widget',
    name: 'Chart Widget',
    description: 'Interactive data charts',
    category: 'Analytics',
    icon: BarChart3,
    config: { type: 'chart', props: {} }
  }
];

interface ComponentPaletteProps {
  onComponentDrag: (component: Component) => void;
}

export default function ComponentPalette({ onComponentDrag }: ComponentPaletteProps) {
  const categories = [...new Set(COMPONENT_LIBRARY.map(c => c.category))];

  return (
    <div className="space-y-4">
      {categories.map((category) => {
        const categoryComponents = COMPONENT_LIBRARY.filter(c => c.category === category);
        
        return (
          <Card key={category} className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <Layout className="h-4 w-4 mr-2" />
                {category}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categoryComponents.map((component) => (
                <div
                  key={component.id}
                  className="p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('application/json', JSON.stringify(component));
                    e.dataTransfer.effectAllowed = 'copy';
                    onComponentDrag(component);
                  }}
                >
                  <div className="flex items-start space-x-2">
                    <component.icon className="h-4 w-4 text-slate-500 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-slate-900">{component.name}</h4>
                      <p className="text-xs text-slate-500 mt-1">{component.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}