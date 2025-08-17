'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Gift } from 'lucide-react';

export default function RewardsDashboard() {
  const [points, setPoints] = useState(0);
  const [dailyViews, setDailyViews] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRewardsData() {
      try {
        const response = await fetch('/api/rewards');
        if (!response.ok) {
          throw new Error('Failed to fetch rewards data');
        }
        const data = await response.json();
        setPoints(data.points);
        setDailyViews(data.daily_views_count);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRewardsData();
  }, []);

  const handleRedeem = () => {
    alert('Redemption feature coming soon!');
    // In a real implementation, you would call a POST endpoint to /api/rewards/redeem
  };

  if (isLoading) {
    return <div>Loading rewards...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Gift className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle>Your Rewards</CardTitle>
            <CardDescription>Earn points by watching ads.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center my-8">
          <p className="text-sm text-muted-foreground">Total Points</p>
          <p className="text-5xl font-bold">{points.toLocaleString()}</p>
        </div>

        <div className="space-y-4">
            <div>
                <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium">Daily Ad View Limit</p>
                    <p className="text-sm text-muted-foreground">{dailyViews} / 50</p>
                </div>
                <Progress value={(dailyViews / 50) * 100} />
            </div>

            <Button onClick={handleRedeem} className="w-full" disabled={points < 1000}>
              Redeem 1,000 Points for $10
            </Button>
            <p className="text-xs text-center text-muted-foreground">
                Minimum 1,000 points required for redemption.
            </p>
        </div>
      </CardContent>
    </Card>
  );
}
