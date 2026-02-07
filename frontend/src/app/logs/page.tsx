'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, FileText, Activity, Key, LogOut, Moon, Sun, Search, ChevronLeft, ChevronRight, Eye, Download } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { logsAPI } from '@/lib/api';
import { formatDate, formatRelativeTime, getStatusColor } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function LogsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadLogs();
  }, [page, statusFilter]);

  const loadLogs = async () => {
    try {
      setIsLoading(true);
      const params: any = { page, limit: 20 };
      if (statusFilter) params.status = statusFilter;
      
      const { data } = await logsAPI.list(params);
      setLogs(data.logs || data);
      
      // Assuming API returns pagination info
      if (data.pagination) {
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        router.push('/auth/login');
      } else {
        toast.error('Failed to load logs');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = async (log: any) => {
    setSelectedLog(log);
    setShowDetailModal(true);
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['Date', 'Recipient', 'Template', 'Status', 'Subject'].join(','),
      ...filteredLogs.map(log => [
        formatDate(log.createdAt),
        log.recipientEmail,
        log.template?.name || 'N/A',
        log.status,
        log.renderedSubject || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email-logs-${new Date().toISOString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Logs exported successfully');
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    toast.success('Logged out successfully');
    router.push('/');
  };

  // Filter logs by search query
  const filteredLogs = logs.filter(log =>
    log.recipientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (log.template?.name && log.template.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (log.renderedSubject && log.renderedSubject.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const statuses = [
    { value: '', label: 'All Statuses' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'QUEUED', label: 'Queued' },
    { value: 'SENT', label: 'Sent' },
    { value: 'DELIVERED', label: 'Delivered' },
    { value: 'FAILED', label: 'Failed' },
    { value: 'BOUNCED', label: 'Bounced' },
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
            <NavLink href="/templates" icon={<FileText />}>Templates</NavLink>
            <NavLink href="/send" icon={<Mail />}>Send Email</NavLink>
            <NavLink href="/logs" icon={<Activity />} active>Logs</NavLink>
            <NavLink href="/settings" icon={<Key />}>Settings</NavLink>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">Email Logs</h2>
              <p className="text-gray-600 dark:text-gray-400">
                View history of all sent emails
              </p>
            </div>
            <Button onClick={handleExportCSV} variant="secondary" className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Export CSV
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by recipient, template, or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="input w-full"
              >
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Logs Table */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading logs...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Activity className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">No logs found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchQuery || statusFilter ? 'Try adjusting your filters' : 'Send your first email to see logs here'}
              </p>
              {!searchQuery && !statusFilter && (
                <Link href="/send">
                  <Button>
                    <Mail className="w-5 h-5 mr-2" />
                    Send Email
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900/50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Recipient
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Template
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subject
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                      {filteredLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div>
                              <p className="font-medium">{formatRelativeTime(log.createdAt)}</p>
                              <p className="text-xs text-gray-500">{formatDate(log.createdAt)}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {log.recipientEmail}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span className="line-clamp-1">
                              {log.template?.name || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span className="line-clamp-1 max-w-xs">
                              {log.renderedSubject || log.template?.subject || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Badge variant="status" status={log.status}>
                              {log.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(log)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Page {page} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Detail Modal */}
      {showDetailModal && selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Email Log Details</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowDetailModal(false)}>
                ✕
              </Button>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge variant="status" status={selectedLog.status}>
                    {selectedLog.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{formatDate(selectedLog.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Recipient</p>
                  <p className="font-medium">{selectedLog.recipientEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Template</p>
                  <p className="font-medium">{selectedLog.template?.name || 'N/A'}</p>
                </div>
              </div>

              {/* Subject */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Subject</p>
                <p className="font-medium">{selectedLog.renderedSubject || 'N/A'}</p>
              </div>

              {/* Variables */}
              {selectedLog.variables && Object.keys(selectedLog.variables).length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Variables Used</p>
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                    <pre className="text-sm overflow-x-auto">
                      {JSON.stringify(selectedLog.variables, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* Rendered Body */}
              {selectedLog.renderedBodyHtml && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Email Body</p>
                  <div className="border rounded-lg p-4 bg-white dark:bg-gray-900 max-h-96 overflow-y-auto">
                    <div
                      className="prose prose-sm dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: selectedLog.renderedBodyHtml }}
                    />
                  </div>
                </div>
              )}

              {/* Error Message */}
              {selectedLog.errorMessage && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Error Message</p>
                  <p className="text-sm text-danger bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                    {selectedLog.errorMessage}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t">
                <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
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
