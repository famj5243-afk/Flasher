'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, FileText, Activity, Key, LogOut, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { emailsAPI, logsAPI } from '@/lib/api';
import { formatRelativeTime } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [stats, setStats] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsRes, logsRes] = await Promise.all([
        emailsAPI.getStats(),
        logsAPI.getRecent(5),
      ]);
      setStats(statsRes.data);
      setRecentActivity(logsRes.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        router.push('/auth/login');
      } else {
        toast.error('Failed to load dashboard data');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    toast.success('Logged out successfully');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--background))]">
      {/* Header */}
      <header className="bg-[rgb(var(--surface))] border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-lg">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold">EduNotify Sim</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-[rgb(var(--surface))] border-b">
        <div className="container mx-auto px-4">
          <div className="flex gap-6 overflow-x-auto">
            <NavLink href="/dashboard" icon={<Activity />} active>Dashboard</NavLink>
            <NavLink href="/templates" icon={<FileText />}>Templates</NavLink>
            <NavLink href="/send" icon={<Mail />}>Send Email</NavLink>
            <NavLink href="/logs" icon={<Activity />}>Logs</NavLink>
            <NavLink href="/settings" icon={<Key />}>Settings</NavLink>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Overview of your email activity
          </p>
        </div>

        {/* Stats Cards */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Total Emails"
                value={stats?.total || 0}
                color="bg-blue-500"
              />
              <StatsCard
                title="Sent Successfully"
                value={stats?.sent || 0}
                color="bg-green-500"
              />
              <StatsCard
                title="Failed"
                value={stats?.failed || 0}
                color="bg-red-500"
              />
              <StatsCard
                title="Success Rate"
                value={`${stats?.successRate || 0}%`}
                color="bg-purple-500"
              />
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivity.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No emails sent yet</p>
                    <Link href="/send">
                      <Button className="mt-4" size="sm">Send Your First Email</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivity.map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-4 border rounded hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <div className="flex-1">
                          <p className="font-medium">{log.subject}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            To: {log.recipientEmail}
                          </p>
                          {log.template && (
                            <p className="text-xs text-gray-500 mt-1">
                              Template: {log.template.name}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <Badge variant="status" status={log.status}>
                            {log.status}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatRelativeTime(log.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Educational Notice */}
            <div className="mt-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-lg">
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                ⚠️ Educational Platform Notice
              </h3>
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                This platform is designed strictly for educational and testing purposes. All emails automatically include a 
                mandatory disclaimer footer and [SIMULATION] prefix in the subject line. Do not use this platform to impersonate 
                real companies or send misleading communications.
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function NavLink({ href, icon, children, active = false }: any) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
        active
          ? 'border-primary text-primary font-medium'
          : 'border-transparent hover:border-gray-300 text-gray-600 dark:text-gray-400'
      }`}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}

function StatsCard({ title, value, color }: any) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          <div className={`w-12 h-12 ${color} rounded-lg opacity-20`}></div>
        </div>
      </CardContent>
    </Card>
  );
}
