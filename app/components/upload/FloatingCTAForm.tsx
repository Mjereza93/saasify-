'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface FloatingCTAConfig {
  text: string;
  url: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  color: string;
  start_time_seconds: number;
  end_time_seconds: number;
}

interface FloatingCTAFormProps {
  onCTAChange: (config: string | null) => void;
}

const initialCTAState: FloatingCTAConfig = {
    text: 'Learn More',
    url: 'https://',
    position: 'bottom-right',
    color: '#007bff',
    start_time_seconds: 5,
    end_time_seconds: 20,
};

export default function FloatingCTAForm({ onCTAChange }: FloatingCTAFormProps) {
  const [cta, setCta] = useState<FloatingCTAConfig | null>(null);

  useEffect(() => {
    onCTAChange(cta ? JSON.stringify(cta) : null);
  }, [cta, onCTAChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      if (!cta) return;
      const { name, value } = e.target;
      setCta(prev => prev ? { ...prev, [name]: value } : null);
  };

  if (!cta) {
    return <Button onClick={() => setCta(initialCTAState)}>Add Floating CTA</Button>;
  }

  return (
    <div className="p-4 border rounded-lg space-y-4 relative">
        <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Floating CTA Button</h3>
            <Button variant="ghost" size="icon" onClick={() => setCta(null)}>
                <X className="h-4 w-4" />
            </Button>
        </div>

      <div>
        <Label htmlFor="cta-text">Button Text</Label>
        <Input id="cta-text" name="text" value={cta.text} onChange={handleInputChange} />
      </div>
      <div>
        <Label htmlFor="cta-url">Destination URL</Label>
        <Input id="cta-url" name="url" type="url" value={cta.url} onChange={handleInputChange} />
      </div>
      <div>
          <Label htmlFor="cta-color">Button Color</Label>
          <Input id="cta-color" name="color" type="color" value={cta.color} onChange={handleInputChange} className="h-10"/>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
            <Label htmlFor="cta-start">Start Time (sec)</Label>
            <Input id="cta-start" name="start_time_seconds" type="number" value={cta.start_time_seconds} onChange={handleInputChange} />
        </div>
        <div>
            <Label htmlFor="cta-end">End Time (sec)</Label>
            <Input id="cta-end" name="end_time_seconds" type="number" value={cta.end_time_seconds} onChange={handleInputChange} />
        </div>
      </div>
       <div>
        <Label htmlFor="cta-position">Position</Label>
        <select id="cta-position" name="position" value={cta.position} onChange={handleInputChange} className="w-full p-2 border rounded-md">
            <option value="bottom-right">Bottom Right</option>
            <option value="bottom-left">Bottom Left</option>
            <option value="top-right">Top Right</option>
            <option value="top-left">Top Left</option>
        </select>
      </div>
    </div>
  );
}
