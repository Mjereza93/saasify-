'use client';

import { useState } from 'react';
import { Share2, X, Linkedin, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast"; // Assuming you use shadcn/ui toast

interface ShareButtonProps {
  adId: string;
  adTitle: string;
}

export default function ShareButton({ adId, adTitle }: ShareButtonProps) {
  const { toast } = useToast();
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async (platform: 'x' | 'linkedin' | 'copy') => {
    setIsSharing(true);
    const adUrl = `https://advibe.app/ad/${adId}`;

    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(adUrl);
        toast({
          title: "Link Copied!",
          description: "The ad link has been copied to your clipboard.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to copy link.",
          variant: "destructive",
        });
      }
      setIsSharing(false);
      return;
    }

    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, adId, message: `Check out this ad: ${adTitle}` }),
      });

      if (!response.ok) {
        throw new Error(`Failed to share to ${platform}`);
      }

      const result = await response.json();
      toast({
        title: "Shared Successfully!",
        description: result.message,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isSharing}>
          <Share2 className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleShare('x')}>
          <X className="mr-2 h-4 w-4" />
          <span>Share on X</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('linkedin')}>
          <Linkedin className="mr-2 h-4 w-4" />
          <span>Share on LinkedIn</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('copy')}>
          <LinkIcon className="mr-2 h-4 w-4" />
          <span>Copy Link</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
