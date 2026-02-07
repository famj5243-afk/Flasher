'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, FileText, Activity, Key, LogOut, Moon, Sun, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { templatesAPI } from '@/lib/api';
import { formatDate, getCategoryLabel } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function TemplatesPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  useEffect(() => {
    loadTemplates();
  }, [categoryFilter]);

  const loadTemplates = async () => {
    try {
      setIsLoading(true);
      const params = categoryFilter ? { category: categoryFilter } : {};
      const { data } = await templatesAPI.list(params);
      setTemplates(data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        router.push('/auth/login');
      } else {
        toast.error('Failed to load templates');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      await templatesAPI.delete(id);
      toast.success('Template deleted successfully');
      loadTemplates();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete template');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    toast.success('Logged out successfully');
    router.push('/');
  };

  // Filter templates by search query
  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (template.description && template.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'CRYPTO_EDUCATION', label: 'Crypto Education' },
    { value: 'ECOMMERCE', label: 'E-commerce' },
    { value: 'BANKING', label: 'Banking' },
    { value: 'LOGISTICS', label: 'Logistics' },
    { value: 'CUSTOM', label: 'Custom' },
  ];

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
            <NavLink href="/templates" icon={<FileText />} active>Templates</NavLink>
            <NavLink href="/send" icon={<Mail />}>Send Email</NavLink>
            <NavLink href="/logs" icon={<Activity />}>Logs</NavLink>
            <NavLink href="/settings" icon={<Key />}>Settings</NavLink>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">Email Templates</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Create and manage your email templates
              </p>
            </div>
            <Link href="/templates/new">
              <Button className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create Template
              </Button>
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="sm:w-64">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="input w-full"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading templates...</p>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">No templates found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchQuery || categoryFilter ? 'Try adjusting your filters' : 'Create your first template to get started'}
            </p>
            <Link href="/templates/new">
              <Button>
                <Plus className="w-5 h-5 mr-2" />
                Create Template
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                        {template.name}
                      </h3>
                      {template.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                          {template.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Category Badge */}
                    <div className="flex items-center gap-2">
                      <Badge variant="category" category={template.category}>
                        {getCategoryLabel(template.category)}
                      </Badge>
                      {template.isPublic && (
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                          Public
                        </Badge>
                      )}
                    </div>

                    {/* Variables */}
                    {template.variables && template.variables.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap">
                        <span className="text-xs text-gray-500">Variables:</span>
                        {template.variables.slice(0, 3).map((variable: string) => (
                          <code key={variable} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            {`{{${variable}}}`}
                          </code>
                        ))}
                        {template.variables.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{template.variables.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Used {template.usageCount} times</span>
                      <span className="text-xs">{formatDate(template.createdAt)}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-3 border-t">
                      <Link href={`/templates/${template.id}`} className="flex-1">
                        <Button variant="secondary" size="sm" className="w-full">
                          View
                        </Button>
                      </Link>
                      <Link href={`/templates/${template.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(template.id, template.name)}
                      >
                        <Trash2 className="w-4 h-4 text-danger" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Educational Notice */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 <strong>Tip:</strong> All templates automatically include the educational disclaimer footer when used.
            Variables are replaced with actual values when sending emails.
          </p>
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
