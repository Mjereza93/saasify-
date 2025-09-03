import RewardsDashboard from '@/components/rewards/RewardsDashboard';
import { Suspense } from 'react';

export default function RewardsPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">AdVibe Rewards Program</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Get rewarded for watching ads. The more you watch, the more you earn!
        </p>
      </header>

      <main className="flex justify-center">
        <Suspense fallback={<div>Loading rewards...</div>}>
          <RewardsDashboard />
        </Suspense>
      </main>

      <section className="mt-16 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold">How it Works</h2>
          <div className="mt-4 text-muted-foreground space-y-4">
            <p>
              1. Watch ads in your feed to earn points. You get 1 point for every ad you watch.
            </p>
            <p>
              2. You can earn points for up to 50 ads per day. Your daily limit resets at midnight UTC.
            </p>
            <p>
              3. Once you've collected enough points, you can redeem them for cash rewards via PayPal or for discounts on featured products.
            </p>
          </div>
      </section>
    </div>
  );
}
