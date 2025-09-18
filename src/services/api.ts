// API Service Layer for Backend Integration
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { toast } from 'react-hot-toast';

interface ApiConfig {
  baseURL: string;
  timeout: number;
  retries: number;
}

interface User {
  id: string;
  email: string;
  name: string;
  businessName: string;
  role: 'admin' | 'user' | 'accountant';
  subscription: 'free' | 'pro' | 'enterprise';
  isActive: boolean;
  createdAt: string;
  lastLogin: string;
}

interface Transaction {
  id: string;
  userId: string;
  type: 'income' | 'expenditure';
  amount: number;
  currency: string;
  category: string;
  subcategory?: string;
  description: string;
  date: string;
  paymentMethod: string;
  reference?: string;
  attachments?: string[];
  tags?: string[];
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    endDate?: string;
  };
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

interface Budget {
  id: string;
  userId: string;
  name: string;
  category: string;
  amount: number;
  currency: string;
  period: 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate: string;
  spent: number;
  remaining: number;
  alerts: {
    threshold: number;
    enabled: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

interface Report {
  id: string;
  userId: string;
  type: 'profit_loss' | 'cash_flow' | 'balance_sheet' | 'tax_summary';
  period: {
    start: string;
    end: string;
  };
  data: any;
  status: 'generating' | 'completed' | 'failed';
  format: 'pdf' | 'excel' | 'csv';
  downloadUrl?: string;
  createdAt: string;
}

interface AIInsight {
  id: string;
  userId: string;
  type: 'spending_pattern' | 'revenue_forecast' | 'cost_optimization' | 'cash_flow_prediction';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  recommendations: string[];
  data: any;
  createdAt: string;
}

class ApiService {
  private api: AxiosInstance;
  private config: ApiConfig;

  constructor() {
    this.config = {
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
      timeout: 30000,
      retries: 3,
    };

    this.api = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor for auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              const response = await this.refreshAuthToken(refreshToken);
              localStorage.setItem('authToken', response.data.accessToken);
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
          }
        }

        // Handle different error types
        if (error.response?.status >= 500) {
          toast.error('Server error. Please try again later.');
        } else if (error.response?.status === 429) {
          toast.error('Too many requests. Please slow down.');
        } else if (error.code === 'NETWORK_ERROR') {
          toast.error('Network error. Check your connection.');
        }

        return Promise.reject(error);
      }
    );
  }

  // Authentication
  async login(email: string, password: string): Promise<{ user: User; tokens: any }> {
    const response = await this.api.post('/auth/login', { email, password });
    return response.data;
  }

  async register(userData: {
    email: string;
    password: string;
    name: string;
    businessName: string;
  }): Promise<{ user: User; tokens: any }> {
    const response = await this.api.post('/auth/register', userData);
    return response.data;
  }

  async refreshAuthToken(refreshToken: string): Promise<AxiosResponse> {
    return this.api.post('/auth/refresh', { refreshToken });
  }

  async logout(): Promise<void> {
    await this.api.post('/auth/logout');
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  }

  // User Management
  async getCurrentUser(): Promise<User> {
    const response = await this.api.get('/users/me');
    return response.data;
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await this.api.put('/users/me', userData);
    return response.data;
  }

  async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await this.api.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  // Transactions
  async getTransactions(params?: {
    page?: number;
    limit?: number;
    type?: 'income' | 'expenditure';
    category?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  }): Promise<{ transactions: Transaction[]; total: number; pages: number }> {
    const response = await this.api.get('/transactions', { params });
    return response.data;
  }

  async createTransaction(transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
    const response = await this.api.post('/transactions', transaction);
    return response.data;
  }

  async updateTransaction(id: string, transaction: Partial<Transaction>): Promise<Transaction> {
    const response = await this.api.put(`/transactions/${id}`, transaction);
    return response.data;
  }

  async deleteTransaction(id: string): Promise<void> {
    await this.api.delete(`/transactions/${id}`);
  }

  async bulkImportTransactions(file: File): Promise<{ imported: number; errors: any[] }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await this.api.post('/transactions/bulk-import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  // Budgets
  async getBudgets(): Promise<Budget[]> {
    const response = await this.api.get('/budgets');
    return response.data;
  }

  async createBudget(budget: Omit<Budget, 'id' | 'userId' | 'spent' | 'remaining' | 'createdAt' | 'updatedAt'>): Promise<Budget> {
    const response = await this.api.post('/budgets', budget);
    return response.data;
  }

  async updateBudget(id: string, budget: Partial<Budget>): Promise<Budget> {
    const response = await this.api.put(`/budgets/${id}`, budget);
    return response.data;
  }

  async deleteBudget(id: string): Promise<void> {
    await this.api.delete(`/budgets/${id}`);
  }

  // Reports
  async generateReport(type: Report['type'], period: Report['period'], format: Report['format']): Promise<Report> {
    const response = await this.api.post('/reports/generate', { type, period, format });
    return response.data;
  }

  async getReports(): Promise<Report[]> {
    const response = await this.api.get('/reports');
    return response.data;
  }

  async downloadReport(id: string): Promise<Blob> {
    const response = await this.api.get(`/reports/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  }

  // AI Insights
  async getAIInsights(): Promise<AIInsight[]> {
    const response = await this.api.get('/ai/insights');
    return response.data;
  }

  async generateAIInsight(type: AIInsight['type']): Promise<AIInsight> {
    const response = await this.api.post('/ai/insights/generate', { type });
    return response.data;
  }

  // Analytics
  async getAnalytics(period: { start: string; end: string }): Promise<{
    revenue: { total: number; growth: number; trend: any[] };
    expenses: { total: number; growth: number; trend: any[] };
    profit: { total: number; margin: number; trend: any[] };
    categories: { name: string; amount: number; percentage: number }[];
    cashFlow: any[];
    predictions: {
      nextMonthRevenue: number;
      nextMonthExpenses: number;
      confidence: number;
    };
  }> {
    const response = await this.api.get('/analytics', { params: period });
    return response.data;
  }

  // Banking Integration
  async connectBank(bankCode: string, credentials: any): Promise<{ connectionId: string; status: string }> {
    const response = await this.api.post('/banking/connect', { bankCode, credentials });
    return response.data;
  }

  async syncBankTransactions(connectionId: string): Promise<{ synced: number; new: number }> {
    const response = await this.api.post(`/banking/sync/${connectionId}`);
    return response.data;
  }

  async getBankConnections(): Promise<any[]> {
    const response = await this.api.get('/banking/connections');
    return response.data;
  }

  // Currency & Exchange Rates
  async getExchangeRates(baseCurrency: string = 'NGN'): Promise<{ [key: string]: number }> {
    const response = await this.api.get(`/currency/rates?base=${baseCurrency}`);
    return response.data;
  }

  async convertCurrency(amount: number, from: string, to: string): Promise<{ converted: number; rate: number }> {
    const response = await this.api.get(`/currency/convert?amount=${amount}&from=${from}&to=${to}`);
    return response.data;
  }

  // Notifications
  async getNotifications(): Promise<any[]> {
    const response = await this.api.get('/notifications');
    return response.data;
  }

  async markNotificationRead(id: string): Promise<void> {
    await this.api.put(`/notifications/${id}/read`);
  }

  // Subscription & Billing
  async getSubscription(): Promise<any> {
    const response = await this.api.get('/subscription');
    return response.data;
  }

  async upgradeSubscription(plan: string): Promise<{ paymentUrl: string }> {
    const response = await this.api.post('/subscription/upgrade', { plan });
    return response.data;
  }

  // Tax & Compliance
  async getTaxSummary(year: number): Promise<any> {
    const response = await this.api.get(`/tax/summary/${year}`);
    return response.data;
  }

  async generateTaxReport(year: number, format: 'pdf' | 'excel'): Promise<{ downloadUrl: string }> {
    const response = await this.api.post('/tax/report', { year, format });
    return response.data;
  }

  // Backup & Export
  async exportData(format: 'json' | 'csv' | 'excel'): Promise<{ downloadUrl: string }> {
    const response = await this.api.post('/export', { format });
    return response.data;
  }

  async createBackup(): Promise<{ backupId: string; downloadUrl: string }> {
    const response = await this.api.post('/backup');
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;