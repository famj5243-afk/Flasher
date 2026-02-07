'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, FileText, Activity, Key, LogOut, Moon, Sun, Send, AlertCircle } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { templatesAPI, emailsAPI } from '@/lib/api';
import { getCategoryLabel } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function SendEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, setTheme } = useTheme();
  
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
  const [isSending, setIsSending] = useState(false);
  
  const [formData, setFormData] = useState({
    recipientEmail: '',
    replyToEmail: '',
    variables: {} as Record<string, string>,
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    const templateId = searchParams.get('templateId');
    if (templateId && templates.length > 0) {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        handleTemplateSelect(template);
      }
    }
  }, [searchParams, templates]);

  const loadTemplates = async () => {
    try {
      setIsLoadingTemplates(true);
      const { data } = await templatesAPI.list();
      setTemplates(data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        router.push('/auth/login');
      } else {
        toast.error('Failed to load templates');
      }
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
    // Initialize variables object
    if (template.variables && template.variables.length > 0) {
      const vars: Record<string, string> = {};
      template.variables.forEach((v: string) => {
        vars[v] = '';
      });
      setFormData(prev => ({ ...prev, variables: vars }));
    } else {
      setFormData(prev => ({ ...prev, variables: {} }));
    }
  };

  const handleVariableChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      variables: { ...prev.variables, [key]: value },
    }));
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTemplate) {
      toast.error('Please select a template');
      return;
    }

    if (!formData.recipientEmail) {
      toast.error('Please enter a recipient email');
      return;
    }

    // Check if all variables are filled
    if (selectedTemplate.variables && selectedTemplate.variables.length > 0) {
      const missingVars = selectedTemplate.variables.filter((v: string) => !formData.variables[v]);
      if (missingVars.length > 0) {
        toast.error(`Please fill in all variables: ${missingVars.join(', ')}`);
        return;
      }
    }

    try {
      setIsSending(true);
      await emailsAPI.send({
        templateId: selectedTemplate.id,
        recipientEmail: formData.recipientEmail,
        variables: formData.variables,
        replyToEmail: formData.replyToEmail || undefined,
      });
      toast.success('Email queued for sending!');
      
      // Reset form
      setFormData({
        recipientEmail: '',
        replyToEmail: '',
        variables: {},
      });
      setSelectedTemplate(null);
      
      // Redirect to logs after a short delay
      setTimeout(() => {
        router.push('/logs');
      }, 2000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send email');
    } finally {
      setIsSending(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    toast.success('Logged out successfully');
    router.push('/');
  };

  // Generate preview HTML
  const getPreviewHtml = () => {
    if (!selectedTemplate) return '';
    
    let html = selectedTemplate.bodyHtml;
    Object.entries(formData.variables).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      html = html.replace(regex, value || `[${key}]`);
    });
    return html;
  };

  const getPreviewSubject = () => {
    if (!selectedTemplate) return '';
    
    let subject = selectedTemplate.subject;
    Object.entries(formData.variables).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      subject = subject.replace(regex, value || `[${key}]`);
    });
    return subject;
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
            <NavLink href="/send" icon={<Mail />} active>Send Email</NavLink>
            <NavLink href="/logs" icon={<Activity />}>Logs</NavLink>
            <NavLink href="/settings" icon={<Key />}>Settings</NavLink>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Send Email</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Select a template and send a simulated email for educational purposes
          </p>
        </div>

        {/* Warning Banner */}
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              <p className="font-semibold mb-1">Educational Use Only</p>
              <p>
                All emails sent through this platform include a mandatory disclaimer stating this is a simulation.
                Only send to email addresses you own or have explicit permission to test with.
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column: Form */}
          <div className="space-y-6">
            {/* Template Selection */}
            <Card>
              <CardHeader>
                <CardTitle>1. Select Template</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {isLoadingTemplates ? (
                  <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-4 border-primary border-t-transparent"></div>
                  </div>
                ) : templates.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">No templates available</p>
                    <Link href="/templates/new">
                      <Button size="sm">Create Template</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        onClick={() => handleTemplateSelect(template)}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedTemplate?.id === template.id
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">{template.name}</h4>
                            {template.description && (
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                                {template.description}
                              </p>
                            )}
                          </div>
                          <Badge variant="category" category={template.category}>
                            {getCategoryLabel(template.category)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Email Details */}
            {selectedTemplate && (
              <form onSubmit={handleSendEmail}>
                <Card>
                  <CardHeader>
                    <CardTitle>2. Email Details</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Recipient Email <span className="text-danger">*</span>
                      </label>
                      <Input
                        type="email"
                        placeholder="recipient@example.com"
                        value={formData.recipientEmail}
                        onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                        required
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Email address to send the simulated email to
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Reply-To Email (Optional)
                      </label>
                      <Input
                        type="email"
                        placeholder="reply@example.com"
                        value={formData.replyToEmail}
                        onChange={(e) => setFormData({ ...formData, replyToEmail: e.target.value })}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Variables */}
                {selectedTemplate.variables && selectedTemplate.variables.length > 0 && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>3. Fill Variables</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      {selectedTemplate.variables.map((variable: string) => (
                        <div key={variable}>
                          <label className="block text-sm font-medium mb-2">
                            {variable} <span className="text-danger">*</span>
                          </label>
                          <Input
                            type="text"
                            placeholder={`Enter ${variable}`}
                            value={formData.variables[variable] || ''}
                            onChange={(e) => handleVariableChange(variable, e.target.value)}
                            required
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Send Button */}
                <Card className="mt-6">
                  <CardContent className="p-6">
                    <Button
                      type="submit"
                      disabled={isSending}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      {isSending ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Email
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </form>
            )}
          </div>

          {/* Right Column: Preview */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Email Preview</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {!selectedTemplate ? (
                  <div className="text-center py-12 text-gray-500">
                    <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Select a template to see preview</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Subject Preview */}
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Subject:</p>
                      <p className="font-semibold">{getPreviewSubject()}</p>
                    </div>

                    {/* Body Preview */}
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">Body:</p>
                      <div className="border rounded-lg p-4 bg-white dark:bg-gray-900 max-h-96 overflow-y-auto">
                        <div
                          className="prose prose-sm dark:prose-invert max-w-none"
                          dangerouslySetInnerHTML={{ __html: getPreviewHtml() }}
                        />
                        <div className="mt-6 pt-4 border-t text-xs text-gray-500 italic">
                          This email is a simulation for educational purposes only and does not represent a real transaction.
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="text-xs text-gray-500">
                      <p>* Variables shown in brackets [] need to be filled</p>
                      <p className="mt-1">* Educational disclaimer will be automatically added</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
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
