'use client';

import { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import AdPlayer from '@/components/feed/AdPlayer';

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

const mockAds: Ad[] = [
  {
    id: '1',
    video_url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    title: 'Ad 1',
    description: 'This is the first ad.',
    cta_link: '#',
    cta_text: 'Learn More',
    user: {
      username: 'user1',
      avatar_url: 'https://github.com/shadcn.png',
    },
  },
  {
    id: '2',
    video_url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    title: 'Ad 2',
    description: 'This is the second ad.',
    cta_link: '#',
    cta_text: 'Shop Now',
    user: {
      username: 'user2',
      avatar_url: 'https://github.com/shadcn.png',
    },
  },
  {
    id: '3',
    video_url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    title: 'Ad 3',
    description: 'This is the third ad.',
    cta_link: '#',
    cta_text: 'Sign Up',
    user: {
      username: 'user3',
      avatar_url: 'https://github.com/shadcn.png',
    },
  },
];

export default function AdFeedPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    const fetchAds = async () => {
      const { data, error } = await supabase
        .from('ads')
        .select(`
          id,
          video_url,
          title,
          description,
          cta_link,
          cta_text,
          profiles (
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching ads:', error);
      } else {
        setAds(data as any);
      }
    };

    fetchAds();
  }, []);

  const handlers = useSwipeable({
    onSwipedUp: () => {
      if (currentAdIndex < ads.length - 1) {
        setCurrentAdIndex(currentAdIndex + 1);
      }
    },
    onSwipedDown: () => {
      if (currentAdIndex > 0) {
        setCurrentAdIndex(currentAdIndex - 1);
      }
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <div {...handlers} className="h-screen w-screen bg-black flex items-center justify-center">
      <AnimatePresence initial={false}>
        {ads.length > 0 && (
          <motion.div
            key={currentAdIndex}
            initial={{ y: 300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            <AdPlayer ad={ads[currentAdIndex]} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
