'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Code2, Users, DollarSign, BarChart3, Settings, Zap, Globe, Brain, Rocket, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { getUserApps, App } from '@/lib/supabase';
import ProtectedRoute from '@/components/ProtectedRoute';

const stats = [
  {
    title: "Total Apps",
    value: "0",
    change: "Get started",
    icon: Code2
  },
  {
    title: "Active Users",
    value: "0",
    change: "Publish your first app",
    icon: Users
  },
  {
    title: "Monthly Revenue",
    value: "$0",
    change: "Start earning",
    icon: DollarSign
  },
  {
    title: "Conversion Rate",
    value: "0%",
    change: "Track performance",
    icon: BarChart3
  }
];

function DashboardContent() {
  const { user, profile, signOut } = useAuth();
  const [userApps, setUserApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserApps = async () => {
      try {
        const apps = await getUserApps();
        setUserApps(apps);
      } catch (error) {
        console.error('Error fetching user apps:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserApps();
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Update stats based on actual data
  const updatedStats = [
    {
      ...stats[0],
      value: userApps.length.toString(),
      change: userApps.length === 0 ? "Create your first app" : `+${userApps.length} total`
    },
    ...stats.slice(1)
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SaaSify AI
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">
                Welcome, {profile?.full_name || user?.email}
              </span>
              <Badge variant="outline" className="capitalize">
                {profile?.plan || 'starter'}
              </Badge>
              <Button variant="outline" asChild>
                <Link href="/marketplace">Marketplace</Link>
              </Button>
              <Button asChild>
                <Link href="/builder">
                  <Plus className="h-4 w-4 mr-2" />
                  New App
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
          <p className="text-slate-600">Manage your SaaS applications and track your success</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {updatedStats.map((stat) => (
            <Card key={stat.title} className="border-0 bg-white/60 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <p className="text-xs text-slate-500 mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Apps List */}
          <div className="lg:col-span-2">
            <Card className="border-0 bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Your Applications</CardTitle>
                    <CardDescription>Manage and monitor your SaaS apps</CardDescription>
                  </div>
                  <Button asChild>
                    <Link href="/builder">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-slate-500 mt-2">Loading your apps...</p>
                  </div>
                ) : userApps.length === 0 ? (
                  <div className="text-center py-12">
                    <Code2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No apps yet</h3>
                    <p className="text-slate-500 mb-4">Create your first SaaS application to get started</p>
                    <Button asChild>
                      <Link href="/builder">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First App
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userApps.map((app) => (
                      <div key={app.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-slate-900">{app.name}</h3>
                            <p className="text-sm text-slate-600">{app.description || 'No description'}</p>
                          </div>
                          <Badge variant={app.status === 'published' ? 'default' : 'secondary'} className="capitalize">
                            {app.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center text-sm text-slate-500">
                          <div className="flex space-x-4">
                            <span>Category: {app.category}</span>
                            <span>Created: {new Date(app.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-3">
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/builder?app=${app.id}`}>Edit</Link>
                          </Button>
                          <Button size="sm" variant="outline">
                            <BarChart3 className="h-3 w-3 mr-1" />
                            Analytics
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="h-3 w-3 mr-1" />
                            Settings
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-0 bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/builder">
                    <Code2 className="h-4 w-4 mr-2" />
                    App Builder
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/marketplace">
                    <Globe className="h-4 w-4 mr-2" />
                    Browse Marketplace
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Brain className="h-4 w-4 mr-2" />
                  AI Features
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Rocket className="h-4 w-4 mr-2" />
                  Deploy App
                </Button>
              </CardContent>
            </Card>

            {/* Account Info */}
            <Card className="border-0 bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Account</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Plan:</span>
                    <Badge variant="outline" className="capitalize">
                      {profile?.plan || 'starter'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Email:</span>
                    <span className="text-slate-900">{user?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Member since:</span>
                    <span className="text-slate-900">
                      {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upgrade Plan */}
            <Card className="border-0 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <CardHeader>
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription className="text-blue-100">
                  Unlock advanced features and build unlimited apps
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-white text-blue-600 hover:bg-slate-100">
                  Upgrade Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}