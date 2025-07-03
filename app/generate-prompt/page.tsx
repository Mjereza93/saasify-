'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, Loader2, Sparkles } from 'lucide-react';

const projectTypes = [
  'To-Do App',
  'Portfolio Website',
  'E-Commerce Store',
  'Blog Platform',
  'Social Media App',
  'Dashboard/Analytics',
  'Landing Page',
  'REST API',
  'Chat Application',
  'File Upload Service'
];

const aiTools = [
  { value: 'chatgpt', label: 'ChatGPT' },
  { value: 'claude', label: 'Claude' },
  { value: 'cursor', label: 'Cursor' }
];

const techStackOptions = [
  { id: 'react', label: 'React' },
  { id: 'nextjs', label: 'Next.js' },
  { id: 'vue', label: 'Vue.js' },
  { id: 'angular', label: 'Angular' },
  { id: 'tailwind', label: 'Tailwind CSS' },
  { id: 'bootstrap', label: 'Bootstrap' },
  { id: 'supabase', label: 'Supabase' },
  { id: 'firebase', label: 'Firebase' },
  { id: 'postgresql', label: 'PostgreSQL' },
  { id: 'mongodb', label: 'MongoDB' },
  { id: 'express', label: 'Express.js' },
  { id: 'nodejs', label: 'Node.js' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'python', label: 'Python' },
  { id: 'django', label: 'Django' },
  { id: 'fastapi', label: 'FastAPI' }
];

export default function GeneratePromptPage() {
  const [projectType, setProjectType] = useState('');
  const [features, setFeatures] = useState('');
  const [aiTool, setAiTool] = useState('');
  const [techStack, setTechStack] = useState<string[]>([]);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleTechStackChange = (techId: string, checked: boolean) => {
    if (checked) {
      setTechStack(prev => [...prev, techId]);
    } else {
      setTechStack(prev => prev.filter(id => id !== techId));
    }
  };

  const validateForm = () => {
    if (!projectType) {
      setError('Please select a project type');
      return false;
    }
    if (!features.trim()) {
      setError('Please describe the desired features');
      return false;
    }
    if (!aiTool) {
      setError('Please select an AI tool');
      return false;
    }
    if (techStack.length === 0) {
      setError('Please select at least one technology');
      return false;
    }
    return true;
  };

  const generatePrompt = async () => {
    setError('');
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Format tech stack for display
      const selectedTechs = techStack.map(id => 
        techStackOptions.find(tech => tech.id === id)?.label
      ).join(', ');

      // Create the formatted prompt
      const prompt = `Generate ${selectedTechs} code for a ${projectType} with the following features: ${features}. Ensure the code is responsive, well-commented, follows best practices, and includes proper error handling. Structure the response with clear file organization and include setup instructions.`;

      // Simulate API call to OpenAI (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, you would call OpenAI API here:
      // const response = await fetch('/api/generate-prompt', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ prompt, aiTool })
      // });
      // const data = await response.json();
      
      setGeneratedPrompt(prompt);
      
    } catch (err) {
      setError('Failed to generate prompt. Please try again.');
      console.error('Error generating prompt:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <Sparkles className="h-8 w-8 text-purple-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">
              Generate Prompt
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Create tailored coding prompts for your projects. Select your requirements and get a perfectly formatted prompt for your AI assistant.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card>
            <CardHeader>
              <CardTitle>Project Requirements</CardTitle>
              <CardDescription>
                Fill out the details to generate a customized coding prompt
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Project Type */}
              <div className="space-y-2">
                <Label htmlFor="project-type">Project Type *</Label>
                <Select value={projectType} onValueChange={setProjectType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Desired Features */}
              <div className="space-y-2">
                <Label htmlFor="features">Desired Features *</Label>
                <Textarea
                  id="features"
                  placeholder="e.g., user login, dark mode, payment integration, responsive design, database integration..."
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  rows={4}
                />
              </div>

              {/* AI Tool */}
              <div className="space-y-2">
                <Label htmlFor="ai-tool">Preferred AI Tool *</Label>
                <Select value={aiTool} onValueChange={setAiTool}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select AI tool" />
                  </SelectTrigger>
                  <SelectContent>
                    {aiTools.map((tool) => (
                      <SelectItem key={tool.value} value={tool.value}>
                        {tool.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tech Stack */}
              <div className="space-y-3">
                <Label>Tech Stack * (Select all that apply)</Label>
                <div className="grid grid-cols-2 gap-3">
                  {techStackOptions.map((tech) => (
                    <div key={tech.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={tech.id}
                        checked={techStack.includes(tech.id)}
                        onCheckedChange={(checked) => 
                          handleTechStackChange(tech.id, checked as boolean)
                        }
                      />
                      <Label 
                        htmlFor={tech.id} 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {tech.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Generate Button */}
              <Button 
                onClick={generatePrompt} 
                className="w-full" 
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Prompt
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Prompt Section */}
          <Card>
            <CardHeader>
              <CardTitle>Generated Prompt</CardTitle>
              <CardDescription>
                Your customized coding prompt will appear here
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedPrompt ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {generatedPrompt}
                    </p>
                  </div>
                  <Button 
                    onClick={copyToClipboard}
                    variant="outline" 
                    className="w-full"
                    disabled={copied}
                  >
                    {copied ? (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy to Clipboard
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No prompt generated yet
                  </h3>
                  <p className="text-gray-500">
                    Fill out the form and click "Generate Prompt" to create your customized coding prompt.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features Preview */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How it works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold text-lg">1</span>
                </div>
                <h3 className="font-semibold mb-2">Fill Requirements</h3>
                <p className="text-sm text-gray-600">
                  Select your project type, features, and tech stack preferences.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold text-lg">2</span>
                </div>
                <h3 className="font-semibold mb-2">Generate Prompt</h3>
                <p className="text-sm text-gray-600">
                  Our AI creates a tailored prompt based on your specifications.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-indigo-600 font-bold text-lg">3</span>
                </div>
                <h3 className="font-semibold mb-2">Copy & Use</h3>
                <p className="text-sm text-gray-600">
                  Copy the prompt and use it with your preferred AI coding assistant.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}