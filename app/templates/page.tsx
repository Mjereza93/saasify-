'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const templates = [
  {
    id: 1,
    name: "E-commerce Store",
    description: "Complete online store with shopping cart, payment processing, and inventory management.",
    category: "E-commerce",
    difficulty: "Intermediate",
    image: "/api/placeholder/400/250"
  },
  {
    id: 2,
    name: "SaaS Dashboard",
    description: "Modern SaaS application dashboard with user management, analytics, and billing.",
    category: "SaaS",
    difficulty: "Advanced",
    image: "/api/placeholder/400/250"
  },
  {
    id: 3,
    name: "Portfolio Website",
    description: "Professional portfolio template for developers, designers, and creatives.",
    category: "Portfolio",
    difficulty: "Beginner",
    image: "/api/placeholder/400/250"
  },
  {
    id: 4,
    name: "Blog Platform",
    description: "Full-featured blog with content management, comments, and SEO optimization.",
    category: "Content",
    difficulty: "Intermediate",
    image: "/api/placeholder/400/250"
  },
  {
    id: 5,
    name: "Learning Management System",
    description: "Online learning platform with courses, progress tracking, and certificates.",
    category: "Education",
    difficulty: "Advanced",
    image: "/api/placeholder/400/250"
  },
  {
    id: 6,
    name: "Social Media App",
    description: "Social networking platform with posts, followers, messaging, and real-time updates.",
    category: "Social",
    difficulty: "Advanced",
    image: "/api/placeholder/400/250"
  }
];

const categories = ["All", "E-commerce", "SaaS", "Portfolio", "Content", "Education", "Social"];

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Project Templates
          </h1>
          <p className="text-gray-600">
            Get started quickly with our professionally designed templates
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "All" ? "default" : "outline"}
                size="sm"
                className="mb-2"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-purple-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span className="text-sm text-purple-600 font-medium">Template Preview</span>
                </div>
              </div>
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {template.difficulty}
                  </Badge>
                </div>
                <Badge variant="outline" className="w-fit text-xs">
                  {template.category}
                </Badge>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {template.description}
                </CardDescription>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    Use Template
                  </Button>
                  <Button size="sm" variant="outline">
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">
                Can't find what you're looking for?
              </h2>
              <p className="text-purple-100 mb-6">
                Create a custom template or request one from our community
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg">
                  Create Custom Template
                </Button>
                <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-purple-600">
                  Request Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}