import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';

interface RealtimeData {
  transactions: any[];
  users: any[];
  reports: any[];
  analytics: {
    totalRevenue: number;
    totalExpenses: number;
    activeUsers: number;
    pendingReports: number;
    revenueGrowth: number;
    userGrowth: number;
  };
  notifications: Notification[];
}

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface RealtimeContextType {
  data: RealtimeData;
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  subscribe: (channel: string, callback: (data: any) => void) => () => void;
  emit: (event: string, data: any) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
};

interface RealtimeProviderProps {
  children: React.ReactNode;
}

export const RealtimeProvider: React.FC<RealtimeProviderProps> = ({ children }) => {
  const [data, setData] = useState<RealtimeData>({
    transactions: [],
    users: [],
    reports: [],
    analytics: {
      totalRevenue: 0,
      totalExpenses: 0,
      activeUsers: 0,
      pendingReports: 0,
      revenueGrowth: 0,
      userGrowth: 0,
    },
    notifications: [],
  });
  
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [subscribers, setSubscribers] = useState<Map<string, Set<(data: any) => void>>>(new Map());

  // Simulate WebSocket connection (in production, this would be a real WebSocket)
  const connectWebSocket = useCallback(() => {
    setConnectionStatus('connecting');
    
    // Simulate connection delay
    setTimeout(() => {
      setIsConnected(true);
      setConnectionStatus('connected');
      toast.success('Real-time connection established');
      
      // Start generating mock real-time data
      startMockDataGeneration();
    }, 1000);
  }, []);

  const startMockDataGeneration = () => {
    // Generate initial data
    generateInitialData();
    
    // Update data every 5 seconds
    const interval = setInterval(() => {
      updateRealtimeData();
    }, 5000);

    // Generate notifications periodically
    const notificationInterval = setInterval(() => {
      generateRandomNotification();
    }, 15000);

    return () => {
      clearInterval(interval);
      clearInterval(notificationInterval);
    };
  };

  const generateInitialData = () => {
    const initialData: RealtimeData = {
      transactions: generateMockTransactions(50),
      users: generateMockUsers(25),
      reports: generateMockReports(10),
      analytics: {
        totalRevenue: 15000000,
        totalExpenses: 11000000,
        activeUsers: 25,
        pendingReports: 3,
        revenueGrowth: 12.5,
        userGrowth: 8.3,
      },
      notifications: [],
    };
    
    setData(initialData);
  };

  const updateRealtimeData = () => {
    setData(prevData => {
      const newTransaction = generateRandomTransaction();
      const updatedTransactions = [newTransaction, ...prevData.transactions.slice(0, 49)];
      
      // Update analytics based on new data
      const totalRevenue = updatedTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const totalExpenses = updatedTransactions
        .filter(t => t.type === 'expenditure')
        .reduce((sum, t) => sum + t.amount, 0);

      const updatedAnalytics = {
        ...prevData.analytics,
        totalRevenue,
        totalExpenses,
        revenueGrowth: Math.random() * 20 - 5, // Random growth between -5% and 15%
        userGrowth: Math.random() * 15 - 2, // Random growth between -2% and 13%
      };

      const updatedData = {
        ...prevData,
        transactions: updatedTransactions,
        analytics: updatedAnalytics,
      };

      // Notify subscribers
      notifySubscribers('transactions', updatedData.transactions);
      notifySubscribers('analytics', updatedData.analytics);

      return updatedData;
    });
  };

  const generateRandomTransaction = () => {
    const types = ['income', 'expenditure'];
    const categories = ['Sales', 'Marketing', 'Operations', 'Admin', 'Transport', 'Utilities'];
    const amounts = [50000, 100000, 250000, 500000, 750000, 1000000, 1500000];
    
    return {
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: types[Math.floor(Math.random() * types.length)],
      amount: amounts[Math.floor(Math.random() * amounts.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      description: `Real-time ${types[Math.floor(Math.random() * types.length)]} transaction`,
      date: new Date().toISOString(),
      userId: `user_${Math.floor(Math.random() * 25) + 1}`,
    };
  };

  const generateMockTransactions = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `txn_${i + 1}`,
      type: Math.random() > 0.6 ? 'income' : 'expenditure',
      amount: Math.floor(Math.random() * 2000000) + 50000,
      category: ['Sales', 'Marketing', 'Operations', 'Admin'][Math.floor(Math.random() * 4)],
      description: `Transaction ${i + 1}`,
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      userId: `user_${Math.floor(Math.random() * 25) + 1}`,
    }));
  };

  const generateMockUsers = (count: number) => {
    const names = ['Adebayo Ogundimu', 'Fatima Abdullahi', 'Chinedu Okwu', 'Kemi Adebisi', 'Ibrahim Musa'];
    const businesses = ['Lagos Trading Co.', 'Northern Logistics', 'Tech Solutions Ltd', 'Fashion Hub', 'Agro Ventures'];
    
    return Array.from({ length: count }, (_, i) => ({
      id: `user_${i + 1}`,
      name: names[i % names.length] + ` ${i + 1}`,
      businessName: businesses[i % businesses.length] + ` ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: i === 0 ? 'admin' : 'user',
      isActive: Math.random() > 0.2,
      lastActive: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      joinedDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    }));
  };

  const generateMockReports = (count: number) => {
    const statuses = ['pending', 'reviewed', 'approved', 'rejected'];
    const reportTypes = ['monthly', 'quarterly', 'annual'];
    
    return Array.from({ length: count }, (_, i) => ({
      id: `report_${i + 1}`,
      userId: `user_${Math.floor(Math.random() * 25) + 1}`,
      reportType: reportTypes[Math.floor(Math.random() * reportTypes.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      submittedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      totalRevenue: Math.floor(Math.random() * 5000000) + 500000,
      totalExpenses: Math.floor(Math.random() * 3000000) + 300000,
    }));
  };

  const generateRandomNotification = () => {
    const notifications = [
      {
        type: 'info' as const,
        title: 'New Transaction',
        message: 'A new high-value transaction has been recorded',
      },
      {
        type: 'success' as const,
        title: 'Report Approved',
        message: 'Monthly report has been approved by admin',
      },
      {
        type: 'warning' as const,
        title: 'Budget Alert',
        message: 'Monthly budget threshold reached',
      },
      {
        type: 'error' as const,
        title: 'Payment Failed',
        message: 'Payment processing failed for transaction',
      },
    ];

    const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
    const newNotification: Notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...randomNotification,
      timestamp: new Date(),
      read: false,
    };

    setData(prevData => ({
      ...prevData,
      notifications: [newNotification, ...prevData.notifications.slice(0, 19)], // Keep last 20
    }));

    // Show toast notification
    toast[randomNotification.type](randomNotification.message);
  };

  const subscribe = useCallback((channel: string, callback: (data: any) => void) => {
    setSubscribers(prev => {
      const channelSubscribers = prev.get(channel) || new Set();
      channelSubscribers.add(callback);
      prev.set(channel, channelSubscribers);
      return new Map(prev);
    });

    // Return unsubscribe function
    return () => {
      setSubscribers(prev => {
        const channelSubscribers = prev.get(channel);
        if (channelSubscribers) {
          channelSubscribers.delete(callback);
          if (channelSubscribers.size === 0) {
            prev.delete(channel);
          }
        }
        return new Map(prev);
      });
    };
  }, []);

  const notifySubscribers = (channel: string, data: any) => {
    const channelSubscribers = subscribers.get(channel);
    if (channelSubscribers) {
      channelSubscribers.forEach(callback => callback(data));
    }
  };

  const emit = useCallback((event: string, data: any) => {
    // In a real implementation, this would send data through WebSocket
    console.log('Emitting event:', event, data);
  }, []);

  const markNotificationAsRead = useCallback((id: string) => {
    setData(prevData => ({
      ...prevData,
      notifications: prevData.notifications.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      ),
    }));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setData(prevData => ({
      ...prevData,
      notifications: [],
    }));
  }, []);

  useEffect(() => {
    connectWebSocket();
    
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [connectWebSocket]);

  const value: RealtimeContextType = {
    data,
    isConnected,
    connectionStatus,
    subscribe,
    emit,
    markNotificationAsRead,
    clearAllNotifications,
  };

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  );
};