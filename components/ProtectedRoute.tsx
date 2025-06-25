'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  redirectTo = '/auth' 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        router.push(redirectTo);
      } else if (!requireAuth && user) {
        router.push('/dashboard');
      }
    }
  }, [user, loading, requireAuth, redirectTo, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 mx-auto animate-pulse">
            <div className="w-4 h-4 bg-white rounded"></div>
          </div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return null; // Will redirect via useEffect
  }

  if (!requireAuth && user) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
}