'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, FileText, Activity, Key, LogOut, Moon, Sun, ArrowLeft, Edit, Trash2, Copy } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { templatesAPI } from '@/lib/api';
import { formatDate, getCategoryLabel } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function TemplateDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { theme, setTheme } = useTheme();
  const [template, setTemplate] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      loadTemplate();
    }
  }, [params.id]);

  const loadTemplate = async () => {
    try {
      setIsLoading(true);
      const { data } = await templatesAPI.get(params.id as string);
      setTemplate(data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        router.push('/auth/login');
      } else if (error.response?.status === 404) {
        toast.error('Template not found');
        router.push('/templates');
      } else {
        toast.error('Failed to load template');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!template) return;
    
    if (!confirm(`Are you sure you want to delete "${template.name}"?`)) {
      return;
    }

    try {
      await templatesAPI.delete(template.id);
      toast.success('Template deleted successfully');
      router.push('/templates');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete template');
    }
  };

  const handleCopyHtml = () => {
    if (template) {
      navigator.clipboard.writeText(template.bodyHtml);
      toast.success('HTML copied to clipboard');
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
            <NavLink href="/dashboard" icon={<Activity />}>Dashboard</NavLink>
            <NavLink href="/templates" icon={<FileText />} active>Templates</NavLink>
            <NavLink href="/send" icon={<Mail />}>Send Email</NavLink>
            <NavLink href="/logs" icon={<Activity />}>Logs</NavLink>
            <NavLink href="/settings" icon={<Key />}>Settings</NavLink>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <Link href="/templates">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Templates
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading template...</p>
          </div>
        ) : template ? (
          <div className="space-y-6">
            {/* Header Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold mb-2">{template.name}</h2>
                    {template.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {template.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3">
                      <Badge variant="category" category={template.category}>
                        {getCategoryLabel(template.category)}
                      </Badge>
                      {template.isPublic && (
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                          Public
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/templates/${template.id}/edit`}>
                      <Button variant="secondary">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Button variant="danger" onClick={handleDelete}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="font-medium">{formatDate(template.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="font-medium">{formatDate(template.updatedAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Usage Count</p>
                    <p className="font-medium">{template.usageCount} times</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Variables</p>
                    <p className="font-medium">{template.variables?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Variables */}
            {template.variables && template.variables.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Template Variables</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    These variables will be replaced with actual values when sending emails:
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {template.variables.map((variable: string) => (
                      <code
                        key={variable}
                        className="bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded text-sm font-mono"
                      >
                        {`{{${variable}}}`}
                      </code>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Subject */}
            <Card>
              <CardHeader>
                <CardTitle>Email Subject</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="font-mono text-sm bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  {template.subject}
                </p>
              </CardContent>
            </Card>

            {/* Body HTML */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Email Body (HTML)</CardTitle>
                <Button variant="ghost" size="sm" onClick={handleCopyHtml}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy HTML
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap break-words">
                  {template.bodyHtml}
                </pre>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Preview (with sample data)</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-white dark:bg-gray-900 border rounded-lg p-6">
                  <div className="mb-4 pb-4 border-b">
                    <p className="text-sm text-gray-500 mb-1">Subject:</p>
                    <p className="font-semibold">{template.subject.replace(/\{\{(\w+)\}\}/g, '[Sample $1]')}</p>
                  </div>
                  <div
                    className="prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: template.bodyHtml.replace(/\{\{(\w+)\}\}/g, '[Sample $1]')
                    }}
                  />
                  <div className="mt-6 pt-4 border-t text-xs text-gray-500">
                    <p className="italic">
                      This email is a simulation for educational purposes only and does not represent a real transaction.
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-500">
                  * Variables are shown as [Sample variable_name] in the preview
                </p>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-1">Use this template</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Send an email using this template
                    </p>
                  </div>
                  <Link href={`/send?templateId=${template.id}`}>
                    <Button>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">Template not found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The template you're looking for doesn't exist or has been deleted
            </p>
            <Link href="/templates">
              <Button>Back to Templates</Button>
            </Link>
          </div>
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
