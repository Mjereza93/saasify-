'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Users, 
  Code2, 
  DollarSign, 
  BarChart3, 
  Settings, 
  Zap, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

const adminStats = [
  {
    title: "Total Users",
    value: "12,456",
    change: "+8.2% from last month",
    icon: Users,
    color: "text-blue-600"
  },
  {
    title: "Active Apps",
    value: "3,742",
    change: "+12.5% from last month",
    icon: Code2,
    color: "text-green-600"
  },
  {
    title: "Monthly Revenue",
    value: "$284,567",
    change: "+23.1% from last month",
    icon: DollarSign,
    color: "text-purple-600"
  },
  {
    title: "Commission Earned",
    value: "$28,456",
    change: "+18.7% from last month",
    icon: TrendingUp,
    color: "text-orange-600"
  }
];

const recentUsers = [
  { id: 1, name: "Sarah Johnson", email: "sarah@example.com", plan: "Pro", status: "active", joined: "2 days ago" },
  { id: 2, name: "Mike Chen", email: "mike@example.com", plan: "Enterprise", status: "active", joined: "1 week ago" },
  { id: 3, name: "Lisa Rodriguez", email: "lisa@example.com", plan: "Starter", status: "pending", joined: "3 days ago" },
  { id: 4, name: "David Kim", email: "david@example.com", plan: "Pro", status: "active", joined: "5 days ago" },
  { id: 5, name: "Emma Wilson", email: "emma@example.com", plan: "Starter", status: "active", joined: "1 week ago" }
];

const recentApps = [
  { id: 1, name: "TaskFlow Pro", author: "Sarah Johnson", category: "Productivity", status: "published", revenue: "$2,340" },
  { id: 2, name: "AI Content Studio", author: "Mike Chen", category: "AI & ML", status: "published", revenue: "$4,290" },
  { id: 3, name: "E-commerce Dashboard", author: "Lisa Rodriguez", category: "E-commerce", status: "review", revenue: "$0" },
  { id: 4, name: "CRM Plus", author: "David Kim", category: "Business", status: "published", revenue: "$1,890" },
  { id: 5, name: "Learning Hub", author: "Emma Wilson", category: "Education", status: "draft", revenue: "$0" }
];

const recentTransactions = [
  { id: 1, user: "John Doe", app: "TaskFlow Pro", amount: "$299", commission: "$29.90", date: "2 hours ago" },
  { id: 2, user: "Jane Smith", app: "AI Content Studio", amount: "$199", commission: "$19.90", date: "4 hours ago" },
  { id: 3, user: "Bob Wilson", app: "CRM Plus", amount: "$249", commission: "$24.90", date: "6 hours ago" },
  { id: 4, user: "Alice Brown", app: "Learning Hub", amount: "$179", commission: "$17.90", date: "8 hours ago" },
  { id: 5, user: "Tom Davis", app: "Finance Tracker", amount: "$149", commission: "$14.90", date: "12 hours ago" }
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

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
                SaaSify AI Admin
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                Admin Access
              </Badge>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
          <p className="text-slate-600">Manage platform users, applications, and transactions</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {adminStats.map((stat) => (
            <Card key={stat.title} className="border-0 bg-white/60 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <p className="text-xs text-green-600 mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="apps">Apps</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="border-0 bg-white/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                  <CardDescription>Latest platform registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentUsers.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900">{user.name}</p>
                          <p className="text-sm text-slate-500">{user.email}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                            {user.status}
                          </Badge>
                          <p className="text-xs text-slate-500 mt-1">{user.joined}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Apps */}
              <Card className="border-0 bg-white/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Recent Apps</CardTitle>
                  <CardDescription>Latest app submissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentApps.slice(0, 5).map((app) => (
                      <div key={app.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900">{app.name}</p>
                          <p className="text-sm text-slate-500">by {app.author}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={
                            app.status === 'published' ? 'default' :
                            app.status === 'review' ? 'secondary' : 'outline'
                          }>
                            {app.status}
                          </Badge>
                          <p className="text-xs text-slate-500 mt-1">{app.revenue}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="border-0 bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage platform users and their subscriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-slate-500">{user.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.plan}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {user.status === 'active' ? (
                              <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                            )}
                            {user.status}
                          </div>
                        </TableCell>
                        <TableCell>{user.joined}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">Edit</Button>
                            <Button size="sm" variant="outline">Suspend</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="apps" className="space-y-6">
            <Card className="border-0 bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>App Management</CardTitle>
                <CardDescription>Review and manage marketplace applications</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>App</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentApps.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{app.name}</p>
                            <p className="text-sm text-slate-500">by {app.author}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{app.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {app.status === 'published' ? (
                              <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                            ) : app.status === 'review' ? (
                              <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                            ) : (
                              <XCircle className="h-4 w-4 text-slate-400 mr-2" />
                            )}
                            {app.status}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{app.revenue}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">Review</Button>
                            <Button size="sm" variant="outline">Approve</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card className="border-0 bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Marketplace sales and commission tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>App</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Commission</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.user}</TableCell>
                        <TableCell>{transaction.app}</TableCell>
                        <TableCell className="font-medium text-green-600">{transaction.amount}</TableCell>
                        <TableCell className="font-medium text-blue-600">{transaction.commission}</TableCell>
                        <TableCell className="text-slate-500">{transaction.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}