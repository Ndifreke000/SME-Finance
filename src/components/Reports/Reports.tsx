import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { FileText, Download, TrendingUp, TrendingDown, BarChart3, Users, Eye, CheckCircle, Clock, AlertCircle, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';
import EmptyState from '../Layout/EmptyState';
import { useAuth } from '../../contexts/AuthContext';

interface UserReport {
  id: string;
  userId: string;
  userName: string;
  businessName: string;
  reportType: 'monthly' | 'quarterly' | 'annual';
  period: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  submittedDate: string;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  transactionCount: number;
  categories: { name: string; amount: number; color: string }[];
}

const Reports: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState<UserReport | null>(null);

  // Mock data for user reports - in a real app, this would come from an API
  const userReports: UserReport[] = [
    {
      id: '1',
      userId: 'user1',
      userName: 'Adebayo Ogundimu',
      businessName: 'Lagos Trading Co.',
      reportType: 'monthly',
      period: 'November 2024',
      status: 'pending',
      submittedDate: '2024-12-01',
      totalRevenue: 2500000,
      totalExpenses: 1800000,
      netProfit: 700000,
      transactionCount: 45,
      categories: [
        { name: 'Sales', amount: 2500000, color: '#10B981' },
        { name: 'Operations', amount: 1200000, color: '#EF4444' },
        { name: 'Marketing', amount: 400000, color: '#F59E0B' },
        { name: 'Admin', amount: 200000, color: '#8B5CF6' }
      ]
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Fatima Abdullahi',
      businessName: 'Northern Logistics',
      reportType: 'monthly',
      period: 'November 2024',
      status: 'reviewed',
      submittedDate: '2024-11-28',
      totalRevenue: 1800000,
      totalExpenses: 1400000,
      netProfit: 400000,
      transactionCount: 32,
      categories: [
        { name: 'Transport', amount: 1800000, color: '#10B981' },
        { name: 'Fuel', amount: 800000, color: '#EF4444' },
        { name: 'Maintenance', amount: 400000, color: '#F59E0B' },
        { name: 'Insurance', amount: 200000, color: '#8B5CF6' }
      ]
    },
    {
      id: '3',
      userId: 'user3',
      userName: 'Chinedu Okwu',
      businessName: 'Tech Solutions Ltd',
      reportType: 'quarterly',
      period: 'Q4 2024',
      status: 'approved',
      submittedDate: '2024-11-25',
      totalRevenue: 5200000,
      totalExpenses: 3800000,
      netProfit: 1400000,
      transactionCount: 128,
      categories: [
        { name: 'Software Sales', amount: 5200000, color: '#10B981' },
        { name: 'Development', amount: 2000000, color: '#EF4444' },
        { name: 'Infrastructure', amount: 1200000, color: '#F59E0B' },
        { name: 'Operations', amount: 600000, color: '#8B5CF6' }
      ]
    },
    {
      id: '4',
      userId: 'user4',
      userName: 'Kemi Adebisi',
      businessName: 'Fashion Hub',
      reportType: 'monthly',
      period: 'October 2024',
      status: 'rejected',
      submittedDate: '2024-11-20',
      totalRevenue: 950000,
      totalExpenses: 720000,
      netProfit: 230000,
      transactionCount: 28,
      categories: [
        { name: 'Sales', amount: 950000, color: '#10B981' },
        { name: 'Inventory', amount: 500000, color: '#EF4444' },
        { name: 'Rent', amount: 120000, color: '#F59E0B' },
        { name: 'Utilities', amount: 100000, color: '#8B5CF6' }
      ]
    }
  ];

  const filteredReports = userReports.filter(report => {
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesSearch = report.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.businessName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={16} />;
      case 'reviewed': return <Eye size={16} />;
      case 'approved': return <CheckCircle size={16} />;
      case 'rejected': return <AlertCircle size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const totalReports = userReports.length;
  const pendingReports = userReports.filter(r => r.status === 'pending').length;
  const approvedReports = userReports.filter(r => r.status === 'approved').length;
  const totalRevenue = userReports.reduce((sum, r) => sum + r.totalRevenue, 0);

  const statusDistribution = [
    { name: 'Pending', value: userReports.filter(r => r.status === 'pending').length, color: '#F59E0B' },
    { name: 'Reviewed', value: userReports.filter(r => r.status === 'reviewed').length, color: '#3B82F6' },
    { name: 'Approved', value: userReports.filter(r => r.status === 'approved').length, color: '#10B981' },
    { name: 'Rejected', value: userReports.filter(r => r.status === 'rejected').length, color: '#EF4444' }
  ];

  const monthlyData = [
    { month: 'Jul 2024', reports: 12, revenue: 8500000 },
    { month: 'Aug 2024', reports: 15, revenue: 9200000 },
    { month: 'Sep 2024', reports: 18, revenue: 10100000 },
    { month: 'Oct 2024', reports: 22, revenue: 11800000 },
    { month: 'Nov 2024', reports: 25, revenue: 12500000 },
    { month: 'Dec 2024', reports: 28, revenue: 13200000 }
  ];

  const updateReportStatus = (reportId: string, newStatus: string) => {
    // In a real app, this would make an API call
    console.log(`Updating report ${reportId} to status: ${newStatus}`);
    // For demo purposes, we'll just show an alert
    alert(`Report status updated to: ${newStatus}`);
  };

  if (user?.role !== 'admin') {
    return (
      <div className="p-4 sm:p-6">
        <div className="bg-white rounded-xl shadow-sm border">
          <EmptyState
            icon={AlertCircle}
            title="Access Denied"
            description="Only administrators can access the reports section"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Reports Dashboard</h2>
          <p className="text-gray-600 mt-1">Monitor and review user-submitted financial reports</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 w-full sm:w-auto">
            <Download size={16} />
            <span>Export All</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'reports'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            User Reports
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'analytics'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Analytics
          </button>
        </nav>
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Reports</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">{totalReports}</p>
                </div>
                <FileText className="text-blue-500" size={24} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-yellow-600 mt-2">{pendingReports}</p>
                </div>
                <Clock className="text-yellow-500" size={24} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">{approvedReports}</p>
                </div>
                <CheckCircle className="text-green-500" size={24} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">
                    ₦{(totalRevenue / 1000000).toFixed(1)}M
                  </p>
                </div>
                <TrendingUp className="text-green-500" size={24} />
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Report Status Distribution */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Status Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {statusDistribution.map((entry, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: entry.color }}
                    ></div>
                    <span className="text-sm text-gray-600">{entry.name} ({entry.value})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Trends */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Report Trends</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="reports"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      name="Reports Submitted"
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'reports' && (
        <>
          {/* Filters */}
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by user or business name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Reports Table */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User/Business
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Report Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Period
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{report.userName}</div>
                          <div className="text-sm text-gray-500">{report.businessName}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 capitalize">{report.reportType}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {report.period}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        ₦{report.totalRevenue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {getStatusIcon(report.status)}
                          <span className="ml-1 capitalize">{report.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(report.submittedDate), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedReport(report)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </button>
                          {report.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateReportStatus(report.id, 'approved')}
                                className="text-green-600 hover:text-green-900"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => updateReportStatus(report.id, 'rejected')}
                                className="text-red-600 hover:text-red-900"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trends */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue Trends</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `₦${(value / 1000000)}M`} />
                  <Tooltip formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#10B981" name="Total Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Report Submission Trends */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Submission Trends</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="reports"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    name="Reports Submitted"
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedReport.businessName} - {selectedReport.period}
                </h3>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-green-600 font-medium">Total Revenue</div>
                  <div className="text-2xl font-bold text-green-700">
                    ₦{selectedReport.totalRevenue.toLocaleString()}
                  </div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-sm text-red-600 font-medium">Total Expenses</div>
                  <div className="text-2xl font-bold text-red-700">
                    ₦{selectedReport.totalExpenses.toLocaleString()}
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium">Net Profit</div>
                  <div className="text-2xl font-bold text-blue-700">
                    ₦{selectedReport.netProfit.toLocaleString()}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                {selectedReport.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        updateReportStatus(selectedReport.id, 'approved');
                        setSelectedReport(null);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        updateReportStatus(selectedReport.id, 'rejected');
                        setSelectedReport(null);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;