'use client';

import { useState, useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Save, 
  Play, 
  Settings, 
  Zap, 
  Database, 
  Layout, 
  Users, 
  CreditCard, 
  Brain,
  FileText,
  BarChart3,
  Mail,
  Calendar,
  Map
} from 'lucide-react';
import Link from 'next/link';

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'User Registration' },
    position: { x: 250, y: 25 },
  },
  {
    id: '2',
    data: { label: 'Dashboard' },
    position: { x: 100, y: 125 },
  },
  {
    id: '3',
    data: { label: 'User Profile' },
    position: { x: 400, y: 125 },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
];

const componentCategories = [
  {
    name: 'Layout',
    icon: Layout,
    components: [
      { name: 'Header', description: 'Navigation header with menu' },
      { name: 'Sidebar', description: 'Collapsible navigation sidebar' },
      { name: 'Footer', description: 'Page footer with links' },
      { name: 'Container', description: 'Content wrapper container' }
    ]
  },
  {
    name: 'Forms',
    icon: FileText,
    components: [
      { name: 'Login Form', description: 'User authentication form' },
      { name: 'Contact Form', description: 'Contact/support form' },
      { name: 'Survey Form', description: 'Multi-step survey builder' },
      { name: 'Payment Form', description: 'Stripe payment integration' }
    ]
  },
  {
    name: 'Data',
    icon: Database,
    components: [
      { name: 'Data Table', description: 'Sortable data grid' },
      { name: 'User List', description: 'User management interface' },
      { name: 'API Connector', description: 'External API integration' },
      { name: 'Database Query', description: 'Custom database queries' }
    ]
  },
  {
    name: 'AI Features',
    icon: Brain,
    components: [
      { name: 'ChatGPT Widget', description: 'OpenAI chat interface' },
      { name: 'Claude Assistant', description: 'Anthropic AI integration' },
      { name: 'Text Generator', description: 'AI content generation' },
      { name: 'Image Generator', description: 'AI image creation tool' }
    ]
  },
  {
    name: 'Analytics',
    icon: BarChart3,
    components: [
      { name: 'Chart Widget', description: 'Interactive data charts' },
      { name: 'Metrics Dashboard', description: 'KPI tracking dashboard' },
      { name: 'User Analytics', description: 'User behavior tracking' },
      { name: 'Revenue Chart', description: 'Financial performance metrics' }
    ]
  }
];

export default function Builder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedComponent, setSelectedComponent] = useState(null);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SaaSify AI
                </span>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <h1 className="text-lg font-semibold text-slate-900">App Builder</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Play className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                Deploy
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Component Panel */}
        <div className="w-80 bg-white border-r border-slate-200 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Components</h2>
            <Tabs defaultValue="components" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="components">Components</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="components" className="space-y-4 mt-4">
                {componentCategories.map((category) => (
                  <Card key={category.name} className="border-slate-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center">
                        <category.icon className="h-4 w-4 mr-2" />
                        {category.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {category.components.map((component) => (
                        <div
                          key={component.name}
                          className="p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData('application/reactflow', component.name);
                            e.dataTransfer.effectAllowed = 'move';
                          }}
                        >
                          <h4 className="font-medium text-sm text-slate-900">{component.name}</h4>
                          <p className="text-xs text-slate-500 mt-1">{component.description}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">App Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-slate-700">App Name</label>
                      <input 
                        type="text" 
                        className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md text-sm"
                        placeholder="My Awesome App"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Description</label>
                      <textarea 
                        className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md text-sm"
                        rows={3}
                        placeholder="App description..."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Domain</label>
                      <input 
                        type="text" 
                        className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md text-sm"
                        placeholder="myapp.saasify.com"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Integrations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Stripe</Badge>
                      <span className="text-sm text-slate-600">Payment processing</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">OpenAI</Badge>
                      <span className="text-sm text-slate-600">AI features</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Supabase</Badge>
                      <span className="text-sm text-slate-600">Database & Auth</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 relative">
          <div className="absolute top-4 left-4 z-10">
            <Card className="bg-white/90 backdrop-blur-sm border-slate-200">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <span>Drag components from the sidebar to build your app</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            className="bg-gradient-to-br from-slate-50 to-blue-50"
            onDrop={(event) => {
              event.preventDefault();
              const type = event.dataTransfer.getData('application/reactflow');
              if (type) {
                const position = {
                  x: event.clientX - 250,
                  y: event.clientY - 100,
                };
                const newNode = {
                  id: `${nodes.length + 1}`,
                  type: 'default',
                  position,
                  data: { label: type },
                };
                setNodes((nds) => nds.concat(newNode));
              }
            }}
            onDragOver={(event) => {
              event.preventDefault();
              event.dataTransfer.dropEffect = 'move';
            }}
          >
            <Controls />
            <MiniMap />
            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>
        </div>

        {/* Properties Panel */}
        <div className="w-80 bg-white border-l border-slate-200 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Properties</h2>
            
            {selectedComponent ? (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Component Properties</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-slate-700">Label</label>
                      <input 
                        type="text" 
                        className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md text-sm"
                        defaultValue={selectedComponent}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Width</label>
                      <input 
                        type="text" 
                        className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md text-sm"
                        placeholder="100%"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Height</label>
                      <input 
                        type="text" 
                        className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md text-sm"
                        placeholder="auto"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <Settings className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">
                    Select a component to edit its properties
                  </p>
                </CardContent>
              </Card>
            )}

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Database className="h-4 w-4 mr-2" />
                  Connect Database
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Setup Payments
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Configure Auth
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Brain className="h-4 w-4 mr-2" />
                  Add AI Features
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}