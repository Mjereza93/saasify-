'use client';

import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, Play, Pause } from 'lucide-react';

interface Ad {
  id: string;
  video_url: string; // This will be the Cloudflare Stream UID
  title: string;
  description: string;
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

  const constructStreamUrl = (uid: string) => `https://customer-${process.env.NEXT_PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE}.cloudflarestream.com/${uid}/iframe`;

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

  // Auto-play when the ad changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  }, [ad]);

  return (
    <div className="h-full w-full relative flex items-center justify-center snap-start" onClick={togglePlay}>
      <video
        ref={videoRef}
        src={`https://customer-${process.env.NEXT_PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE}.cloudflarestream.com/${ad.video_url}/manifest/video.m3u8`}
        loop
        playsInline // Important for mobile browsers
        className="h-full w-full object-cover"
      />

      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <Play className="h-24 w-24 text-white opacity-80" />
        </div>
      )}

      <div className="absolute bottom-0 left-0 w-full p-4 text-white bg-gradient-to-t from-black/60 to-transparent">
        <div className="flex items-center mb-2">
          <Avatar>
            <AvatarImage src={ad.profiles.avatar_url} />
            <AvatarFallback>{ad.profiles.username.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <p className="ml-3 font-bold text-lg">{ad.profiles.username}</p>
        </div>
        <h2 className="text-xl font-bold">{ad.title}</h2>
        <p className="text-sm mt-1">{ad.description}</p>
      </div>

      <div className="absolute right-2 bottom-24 flex flex-col items-center space-y-6">
        <Button variant="ghost" size="icon" className="text-white h-12 w-12">
          <Heart className="h-8 w-8" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white h-12 w-12">
          <MessageCircle className="h-8 w-8" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white h-12 w-12">
          <Share2 className="h-8 w-8" />
        </Button>
      </div>
    </div>
  );
}
