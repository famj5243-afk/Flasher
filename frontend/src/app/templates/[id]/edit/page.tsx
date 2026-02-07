'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, FileText, Activity, Key, LogOut, Moon, Sun, ArrowLeft, Save, Info } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { templatesAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function EditTemplatePage() {
  const router = useRouter();
  const params = useParams();
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subject: '',
    bodyHtml: '',
    category: 'CUSTOM',
    isPublic: false,
  });

  useEffect(() => {
    if (params.id) {
      loadTemplate();
    }
  }, [params.id]);

  const loadTemplate = async () => {
    try {
      setIsLoading(true);
      const { data } = await templatesAPI.get(params.id as string);
      setFormData({
        name: data.name,
        description: data.description || '',
        subject: data.subject,
        bodyHtml: data.bodyHtml,
        category: data.category,
        isPublic: data.isPublic,
      });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.subject || !formData.bodyHtml) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      await templatesAPI.update(params.id as string, formData);
      toast.success('Template updated successfully!');
      router.push(`/templates/${params.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update template');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    toast.success('Logged out successfully');
    router.push('/');
  };

  const categories = [
    { value: 'CUSTOM', label: 'Custom' },
    { value: 'CRYPTO_EDUCATION', label: 'Crypto Education' },
    { value: 'ECOMMERCE', label: 'E-commerce' },
    { value: 'BANKING', label: 'Banking' },
    { value: 'LOGISTICS', label: 'Logistics' },
  ];

  const sampleVariables = '{{name}}, {{email}}, {{amount}}, {{date}}, {{reference_id}}';

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
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link href={`/templates/${params.id}`}>
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Template
            </Button>
          </Link>
          <h2 className="text-3xl font-bold mb-2">Edit Email Template</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Update your email template content and settings
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading template...</p>
          </div>
        ) : (
          <>
            {/* Info Box */}
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-semibold mb-1">Using Variables</p>
                  <p>Insert variables in your template using double curly braces, e.g., <code className="bg-blue-100 dark:bg-blue-900/40 px-1 rounded">{'{{name}}'}</code></p>
                  <p className="mt-1">Common variables: {sampleVariables}</p>
                  <p className="mt-1 text-xs">All emails automatically include the educational disclaimer footer.</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <Card>
                <CardContent className="p-6 space-y-6">
                  {/* Template Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Template Name <span className="text-danger">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g., Welcome Email"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Description
                    </label>
                    <textarea
                      placeholder="Describe what this template is used for..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="input w-full h-20 resize-none"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Category <span className="text-danger">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="input w-full"
                      required
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email Subject <span className="text-danger">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g., Welcome to {{company_name}}"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">You can use variables in the subject line too</p>
                  </div>

                  {/* Body HTML */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email Body (HTML) <span className="text-danger">*</span>
                    </label>
                    <textarea
                      placeholder="Enter your email HTML template..."
                      value={formData.bodyHtml}
                      onChange={(e) => setFormData({ ...formData, bodyHtml: e.target.value })}
                      className="input w-full h-64 resize-y font-mono text-sm"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      HTML content of the email. Variables will be replaced when sending.
                    </p>
                  </div>

                  {/* Public Toggle */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={formData.isPublic}
                      onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                      className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary"
                    />
                    <label htmlFor="isPublic" className="text-sm font-medium cursor-pointer">
                      Make this template public (visible to other users)
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-4 border-t">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Link href={`/templates/${params.id}`}>
                      <Button type="button" variant="secondary">
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </form>
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
