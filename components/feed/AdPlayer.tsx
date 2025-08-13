'use client';

import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, Play, Pause } from 'lucide-react';

interface Ad {
  id: string;
  video_url: string;
  title: string;
  description: string;
  cta_link: string;
  cta_text: string;
  profiles: {
    username: string;
    avatar_url: string;
  };
}

interface AdPlayerProps {
  ad: Ad;
}

export default function AdPlayer({ ad }: AdPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  }, [ad]);

  return (
    <div className="h-full w-full relative" onClick={togglePlay}>
      <video
        ref={videoRef}
        src={ad.video_url}
        loop
        className="h-full w-full object-cover"
      />

      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <Play className="h-20 w-20 text-white" />
        </div>
      )}

      <div className="absolute bottom-0 left-0 w-full p-4 text-white bg-gradient-to-t from-black/50 to-transparent">
        <div className="flex items-center mb-2">
          <Avatar>
            <AvatarImage src={ad.profiles.avatar_url} />
            <AvatarFallback>{ad.profiles.username.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <p className="ml-2 font-bold">{ad.profiles.username}</p>
        </div>
        <h2 className="text-lg font-bold">{ad.title}</h2>
        <p className="text-sm">{ad.description}</p>
        <Button asChild className="mt-4">
          <a href={ad.cta_link} target="_blank" rel="noopener noreferrer">
            {ad.cta_text}
          </a>
        </Button>
      </div>

      <div className="absolute right-4 bottom-20 flex flex-col items-center space-y-4">
        <Button variant="ghost" size="icon" className="text-white">
          <Heart className="h-8 w-8" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white">
          <MessageCircle className="h-8 w-8" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white">
          <Share2 className="h-8 w-8" />
        </Button>
      </div>
    </div>
  );
}
