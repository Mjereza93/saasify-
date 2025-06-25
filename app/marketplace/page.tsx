'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Star, Download, Eye, DollarSign, Zap, Filter, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const marketplaceApps = [
  {
    id: 1,
    name: "TaskFlow Pro",
    description: "Complete project management solution with team collaboration",
    price: 299,
    rating: 4.8,
    downloads: 1234,
    views: 5678,
    category: "Productivity",
    image: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400",
    author: "Sarah Johnson",
    featured: true
  },
  {
    id: 2,
    name: "AI Content Studio",
    description: "GPT-powered content creation and management platform",
    price: 199,
    rating: 4.9,
    downloads: 2156,
    views: 8901,
    category: "AI & ML",
    image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400",
    author: "Mike Chen",
    featured: true
  },
  {
    id: 3,
    name: "E-commerce Dashboard",
    description: "Complete online store management with analytics",
    price: 399,
    rating: 4.7,
    downloads: 876,
    views: 3421,
    category: "E-commerce",
    image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400",
    author: "Lisa Rodriguez",
    featured: false
  },
  {
    id: 4,
    name: "CRM Plus",
    description: "Customer relationship management with automation",
    price: 249,
    rating: 4.6,
    downloads: 1543,
    views: 6789,
    category: "Business",
    image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400",
    author: "David Kim",
    featured: false
  },
  {
    id: 5,
    name: "Learning Hub",
    description: "Online course platform with student tracking",
    price: 179,
    rating: 4.5,
    downloads: 987,
    views: 4567,
    category: "Education",
    image: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400",
    author: "Emma Wilson",
    featured: false
  },
  {
    id: 6,
    name: "Finance Tracker",
    description: "Personal and business financial management tool",
    price: 149,
    rating: 4.4,
    downloads: 654,
    views: 2345,
    category: "Finance",
    image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400",
    author: "Alex Thompson",
    featured: false
  }
];

const categories = ["All", "Productivity", "AI & ML", "E-commerce", "Business", "Education", "Finance"];

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');

  const filteredApps = marketplaceApps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredApps = marketplaceApps.filter(app => app.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SaaSify AI
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button asChild>
                <Link href="/builder">Create App</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            SaaS App Marketplace
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Discover, purchase, and customize professionally built SaaS applications for your business needs
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <Card className="border-0 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search apps..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Apps */}
        {featuredApps.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-2xl font-bold text-slate-900">Featured Apps</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredApps.map((app) => (
                <Card key={app.id} className="border-0 bg-white/60 backdrop-blur-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 relative">
                    <img 
                      src={app.image} 
                      alt={app.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-4 left-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      Featured
                    </Badge>
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{app.name}</CardTitle>
                        <CardDescription className="text-sm text-slate-600">
                          by {app.author}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">{app.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 mb-4">{app.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4 text-sm text-slate-500">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          {app.rating}
                        </div>
                        <div className="flex items-center">
                          <Download className="h-4 w-4 mr-1" />
                          {app.downloads}
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {app.views}
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-slate-900">
                        ${app.price}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button className="flex-1">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Purchase
                      </Button>
                      <Button variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Apps Grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">All Apps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApps.map((app) => (
              <Card key={app.id} className="border-0 bg-white/60 backdrop-blur-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-slate-100 to-blue-100">
                  <img 
                    src={app.image} 
                    alt={app.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg">{app.name}</CardTitle>
                    <Badge variant="outline" className="text-xs">{app.category}</Badge>
                  </div>
                  <CardDescription className="text-sm text-slate-600">
                    by {app.author}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-sm mb-4">{app.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3 text-xs text-slate-500">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 mr-1" />
                        {app.rating}
                      </div>
                      <div className="flex items-center">
                        <Download className="h-3 w-3 mr-1" />
                        {app.downloads}
                      </div>
                    </div>
                    <div className="text-xl font-bold text-slate-900">
                      ${app.price}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      Purchase
                    </Button>
                    <Button size="sm" variant="outline">
                      Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sell Your App CTA */}
        <Card className="border-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Sell Your App?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join thousands of developers earning passive income by selling their SaaS applications. 
              We handle payments, hosting, and customer support while you earn 90% of every sale.
            </p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100" asChild>
              <Link href="/builder">
                Create & Sell Your App
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}