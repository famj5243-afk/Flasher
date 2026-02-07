'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, FileText, Activity, Key, LogOut, Moon, Sun, Plus, Copy, Trash2, Eye, EyeOff } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { apiKeysAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function APIKeysPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [showKey, setShowKey] = useState<string | null>(null);

  useEffect(() => {
    loadAPIKeys();
  }, []);

  const loadAPIKeys = async () => {
    try {
      setIsLoading(true);
      const { data } = await apiKeysAPI.list();
      setApiKeys(data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        router.push('/auth/login');
      } else {
        toast.error('Failed to load API keys');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newKeyName.trim()) {
      toast.error('Please enter a name for the API key');
      return;
    }

    try {
      setIsCreating(true);
      const { data } = await apiKeysAPI.create({ name: newKeyName });
      
      // Store the newly created key to show once
      setNewlyCreatedKey(data.key);
      setNewKeyName('');
      setShowCreateForm(false);
      
      toast.success('API key created successfully!');
      loadAPIKeys();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create API key');
    } finally {
      setIsCreating(false);
    }
  };

  const handleRevokeKey = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to revoke the API key "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await apiKeysAPI.revoke(id);
      toast.success('API key revoked successfully');
      loadAPIKeys();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to revoke API key');
    }
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('API key copied to clipboard');
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
            <NavLink href="/dashboard" icon={<Activity />}>Dashboard</NavLink>
            <NavLink href="/templates" icon={<FileText />}>Templates</NavLink>
            <NavLink href="/send" icon={<Mail />}>Send Email</NavLink>
            <NavLink href="/logs" icon={<Activity />}>Logs</NavLink>
            <NavLink href="/settings" icon={<Key />} active>Settings</NavLink>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Settings</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Settings Navigation */}
        <div className="flex gap-4 mb-6 border-b">
          <Link
            href="/settings"
            className="px-4 py-2 border-b-2 border-transparent hover:border-gray-300 text-gray-600 dark:text-gray-400"
          >
            Profile
          </Link>
          <Link
            href="/settings/api-keys"
            className="px-4 py-2 border-b-2 border-primary text-primary font-medium"
          >
            API Keys
          </Link>
        </div>

        {/* Newly Created Key Alert */}
        {newlyCreatedKey && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-start gap-3">
              <Key className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-green-800 dark:text-green-200 mb-2">
                  API Key Created Successfully
                </p>
                <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                  Make sure to copy your API key now. You won't be able to see it again!
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-white dark:bg-gray-900 border border-green-300 dark:border-green-700 px-3 py-2 rounded text-sm font-mono">
                    {newlyCreatedKey}
                  </code>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleCopyKey(newlyCreatedKey)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setNewlyCreatedKey(null)}
                  >
                    ✕
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* API Keys List */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>API Keys</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Manage API keys for external integrations
                </p>
              </div>
              {!showCreateForm && (
                <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Key
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-6">
              {/* Create Form */}
              {showCreateForm && (
                <form onSubmit={handleCreateKey} className="mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <h3 className="font-semibold mb-3">Create New API Key</h3>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="API Key Name (e.g., Production App)"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      className="flex-1"
                      autoFocus
                    />
                    <Button
                      type="submit"
                      disabled={isCreating}
                    >
                      {isCreating ? 'Creating...' : 'Create'}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setShowCreateForm(false);
                        setNewKeyName('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}

              {/* Keys List */}
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-4 border-primary border-t-transparent"></div>
                  <p className="mt-3 text-gray-600 dark:text-gray-400">Loading API keys...</p>
                </div>
              ) : apiKeys.length === 0 ? (
                <div className="text-center py-8">
                  <Key className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">No API keys yet</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Create an API key to integrate with external applications
                  </p>
                  {!showCreateForm && (
                    <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2 mx-auto">
                      <Plus className="w-4 h-4" />
                      Create Your First Key
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {apiKeys.map((apiKey) => (
                    <div
                      key={apiKey.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{apiKey.name}</h3>
                          {apiKey.isRevoked ? (
                            <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                              Revoked
                            </Badge>
                          ) : (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              Active
                            </Badge>
                          )}
                        </div>
                        
                        {/* Masked Key */}
                        <div className="flex items-center gap-2 mb-2">
                          <code className="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded font-mono">
                            {showKey === apiKey.id ? apiKey.keyPrefix + '...' + (apiKey.lastFour || '****') : '••••••••••••••••'}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowKey(showKey === apiKey.id ? null : apiKey.id)}
                          >
                            {showKey === apiKey.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>Created: {formatDate(apiKey.createdAt)}</span>
                          {apiKey.lastUsedAt && (
                            <span>Last used: {formatDate(apiKey.lastUsedAt)}</span>
                          )}
                          {apiKey.usageCount !== undefined && (
                            <span>Used {apiKey.usageCount} times</span>
                          )}
                        </div>
                      </div>

                      {!apiKey.isRevoked && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleRevokeKey(apiKey.id, apiKey.name)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Revoke
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* API Documentation */}
          <Card>
            <CardHeader>
              <CardTitle>Using API Keys</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Authentication</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Include your API key in the request header:
                  </p>
                  <pre className="bg-gray-50 dark:bg-gray-900 p-3 rounded text-sm overflow-x-auto">
{`Authorization: Bearer YOUR_API_KEY`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Example: Send Email</h4>
                  <pre className="bg-gray-50 dark:bg-gray-900 p-3 rounded text-sm overflow-x-auto">
{`curl -X POST http://localhost:4000/api/v1/emails/send \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "templateId": "template-id",
    "recipientEmail": "user@example.com",
    "variables": {
      "name": "John Doe",
      "amount": "100.00"
    }
  }'`}
                  </pre>
                </div>

                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    📚 For complete API documentation, see <Link href="/api-docs" className="underline">API Documentation</Link>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
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
