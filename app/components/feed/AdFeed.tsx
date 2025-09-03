'use client';

import { useState, useEffect } from 'react';
import AdPlayer from './AdPlayer'; // Assuming AdPlayer is in the same directory

interface Ad {
  id: string;
  video_url: string;
  title: string;
  description: string;
  profiles: {
    username: string;
    avatar_url: string;
  };
}

export default function AdFeed() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [activeTab, setActiveTab] = useState('trending');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAds() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/feed?type=${activeTab}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${activeTab} ads`);
        }
        const data = await response.json();
        setAds(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAds();
  }, [activeTab]);

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-full"><p>Loading ads...</p></div>;
    }
    if (error) {
      return <div className="flex justify-center items-center h-full"><p className="text-red-500">Error: {error}</p></div>;
    }
    if (ads.length === 0) {
      return <div className="flex justify-center items-center h-full"><p>No ads found in this category.</p></div>;
    }
    // This is a placeholder for a proper swipeable feed component (e.g., using react-swipeable or a carousel library)
    return ads.map((ad) => <AdPlayer key={ad.id} ad={ad} />);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-black text-white">
      <div className="flex justify-around p-4 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('trending')}
          className={`px-4 py-2 text-lg font-semibold ${activeTab === 'trending' ? 'text-white border-b-2 border-white' : 'text-gray-400'}`}
        >
          Trending
        </button>
        <button
          onClick={() => setActiveTab('featured')}
          className={`px-4 py-2 text-lg font-semibold ${activeTab === 'featured' ? 'text-white border-b-2 border-white' : 'text-gray-400'}`}
        >
          Featured
        </button>
        <button
          onClick={() => setActiveTab('editors_pick')}
          className={`px-4 py-2 text-lg font-semibold ${activeTab === 'editors_pick' ? 'text-white border-b-2 border-white' : 'text-gray-400'}`}
        >
          Editor's Pick
        </button>
      </div>
      <div className="flex-1 relative">
        {renderContent()}
      </div>
    </div>
  );
}
