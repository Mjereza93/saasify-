'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Download, Eye, DollarSign } from 'lucide-react';

interface AppCardProps {
  app: {
    id: number;
    name: string;
    description: string;
    price: number;
    rating: number;
    downloads: number;
    views: number;
    category: string;
    image: string;
    author: string;
    featured?: boolean;
  };
  onPurchase?: (appId: number) => void;
  onPreview?: (appId: number) => void;
}

export default function AppCard({ app, onPurchase, onPreview }: AppCardProps) {
  return (
    <Card className="border-0 bg-white/60 backdrop-blur-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="aspect-video bg-gradient-to-br from-slate-100 to-blue-100 relative">
        <img 
          src={app.image} 
          alt={app.name}
          className="w-full h-full object-cover"
        />
        {app.featured && (
          <Badge className="absolute top-4 left-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            Featured
          </Badge>
        )}
      </div>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
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
            <div className="flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              {app.views}
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900">
            ${app.price}
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => onPurchase?.(app.id)}
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Purchase
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onPreview?.(app.id)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}