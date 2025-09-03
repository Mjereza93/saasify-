import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// This function will be called at build time by Next.js if using static generation,
// or on each request if using server-side rendering.
async function getLeaderboardData() {
  // This needs to be an absolute URL when running on the server.
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/leaderboard`, {
    next: { revalidate: 60 }, // Revalidate data every 60 seconds
  });

  if (!res.ok) {
    // This will be caught by the error boundary
    throw new Error('Failed to fetch leaderboard data');
  }
  return res.json();
}

const LeaderboardTrophy = ({ rank }) => {
  if (rank === 1) return <span className="text-2xl">🥇</span>;
  if (rank === 2) return <span className="text-2xl">🥈</span>;
  if (rank === 3) return <span className="text-2xl">🥉</span>;
  return <span className="text-lg font-bold text-gray-400">{rank}</span>;
};

export default async function LeaderboardPage() {
  const leaderboardData = await getLeaderboardData();

  return (
    <div className="container mx-auto py-10 px-4">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Creator Leaderboard</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          See who's making the biggest impact on AdVibe!
        </p>
      </header>

      <main className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Top 100 Creators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaderboardData.map((creator, index) => (
                <div key={creator.user_id} className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-12 text-center">
                    <LeaderboardTrophy rank={creator.rank} />
                  </div>
                  <Avatar className="h-12 w-12 mx-4">
                    <AvatarImage src={creator.avatar_url} alt={creator.username} />
                    <AvatarFallback>{creator.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                    <p className="font-bold text-lg">{creator.username}</p>
                    <p className="text-sm text-muted-foreground">Score: {Math.round(creator.score).toLocaleString()}</p>
                  </div>
                  {creator.rank <= 3 && (
                     <Badge variant={creator.rank === 1 ? 'default' : 'secondary'}>Top Creator</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
