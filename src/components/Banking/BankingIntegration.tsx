import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Building, 
  Plus, 
  Sync, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Trash2,
  Eye,
  EyeOff,
  Shield,
  Zap,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';

interface BankConnection {
  id: string;
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountType: 'savings' | 'current' | 'credit';
  balance: number;
  currency: string;
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  lastSync: string;
  isActive: boolean;
  logo: string;
}

interface BankTransaction {
  id: string;
  connectionId: string;
  amount: number;
  type: 'debit' | 'credit';
  description: string;
  reference: string;
  date: string;
  balance: number;
  category?: string;
  isReconciled: boolean;
}

interface NigerianBank {
  name: string;
  code: string;
  logo: string;
  supported: boolean;
}

const BankingIntegration: React.FC = () => {
  const [connections, setConnections] = useState<BankConnection[]>([]);
  const [bankTransactions, setBankTransactions] = useState<BankTransaction[]>([]);
  const [showAddBank, setShowAddBank] = useState(false);
  const [selectedBank, setSelectedBank] = useState<NigerianBank | null>(null);
  const [credentials, setCredentials] = useState({ username: '', password: '', pin: '' });
  const [loading, setLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'reconciliation'>('overview');

  // Nigerian Banks
  const nigerianBanks: NigerianBank[] = [
    { name: 'Access Bank', code: '044', logo: '/banks/access.png', supported: true },
    { name: 'GTBank', code: '058', logo: '/banks/gtb.png', supported: true },
    { name: 'First Bank', code: '011', logo: '/banks/firstbank.png', supported: true },
    { name: 'UBA', code: '033', logo: '/banks/uba.png', supported: true },
    { name: 'Zenith Bank', code: '057', logo: '/banks/zenith.png', supported: true },
    { name: 'Fidelity Bank', code: '070', logo: '/banks/fidelity.png', supported: true },
    { name: 'FCMB', code: '214', logo: '/banks/fcmb.png', supported: true },
    { name: 'Sterling Bank', code: '232', logo: '/banks/sterling.png', supported: true },
    { name: 'Stanbic IBTC', code: '221', logo: '/banks/stanbic.png', supported: true },
    { name: 'Union Bank', code: '032', logo: '/banks/union.png', supported: true },
    { name: 'Wema Bank', code: '035', logo: '/banks/wema.png', supported: true },
    { name: 'Polaris Bank', code: '076', logo: '/banks/polaris.png', supported: true },
    { name: 'Kuda Bank', code: '50211', logo: '/banks/kuda.png', supported: true },
    { name: 'Opay', code: '999992', logo: '/banks/opay.png', supported: true },
    { name: 'PalmPay', code: '999991', logo: '/banks/palmpay.png', supported: true }
  ];

  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    // Mock bank connections
    const mockConnections: BankConnection[] = [
      {
        id: '1',
        bankName: 'GTBank',
        bankCode: '058',
        accountNumber: '0123456789',
        accountType: 'current',
        balance: 2500000,
        currency: 'NGN',
        status: 'connected',
        lastSync: new Date().toISOString(),
        isActive: true,
        logo: '/banks/gtb.png'
      },
      {
        id: '2',
        bankName: 'Access Bank',
        bankCode: '044',
        accountNumber: '0987654321',
        accountType: 'savings',
        balance: 1800000,
        currency: 'NGN',
        status: 'connected',
        lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        logo: '/banks/access.png'
      }
    ];

    // Mock bank transactions
    const mockTransactions: BankTransaction[] = [
      {
        id: '1',
        connectionId: '1',
        amount: 500000,
        type: 'credit',
        description: 'Customer Payment - Invoice #INV001',
        reference: 'TXN123456789',
        date: new Date().toISOString(),
        balance: 2500000,
        category: 'Sales',
        isReconciled: false
      },
      {
        id: '2',
        connectionId: '1',
        amount: 150000,
        type: 'debit',
        description: 'Office Rent Payment',
        reference: 'TXN123456788',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        balance: 2000000,
        category: 'Rent',
        isReconciled: true
      },
      {
        id: '3',
        connectionId: '2',
        amount: 75000,
        type: 'debit',
        description: 'Utility Bills Payment',
        reference: 'TXN123456787',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        balance: 1800000,
        category: 'Utilities',
        isReconciled: false
      }
    ];

    setConnections(mockConnections);
    setBankTransactions(mockTransactions);
  };

  const connectBank = async () => {
    if (!selectedBank) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newConnection: BankConnection = {
        id: Date.now().toString(),
        bankName: selectedBank.name,
        bankCode: selectedBank.code,
        accountNumber: '****' + Math.random().toString().slice(-4),
        accountType: 'current',
        balance: Math.floor(Math.random() * 5000000),
        currency: 'NGN',
        status: 'connected',
        lastSync: new Date().toISOString(),
        isActive: true,
        logo: selectedBank.logo
      };

      setConnections(prev => [...prev, newConnection]);
      setShowAddBank(false);
      setSelectedBank(null);
      setCredentials({ username: '', password: '', pin: '' });
    } catch (error) {
      console.error('Failed to connect bank:', error);
    } finally {
      setLoading(false);
    }
  };

  const syncBankAccount = async (connectionId: string) => {
    setConnections(prev => prev.map(conn => 
      conn.id === connectionId 
        ? { ...conn, status: 'syncing' as const }
        : conn
    ));

    try {
      // Simulate sync
      await new Promise(resolve => setTimeout(resolve, 3000));

      setConnections(prev => prev.map(conn => 
        conn.id === connectionId 
          ? { ...conn, status: 'connected' as const, lastSync: new Date().toISOString() }
          : conn
      ));

      // Add some new mock transactions
      const newTransactions: BankTransaction[] = [
        {
          id: Date.now().toString(),
          connectionId,
          amount: Math.floor(Math.random() * 200000) + 50000,
          type: Math.random() > 0.5 ? 'credit' : 'debit',
          description: 'New synced transaction',
          reference: 'TXN' + Date.now(),
          date: new Date().toISOString(),
          balance: Math.floor(Math.random() * 3000000),
          isReconciled: false
        }
      ];

      setBankTransactions(prev => [...newTransactions, ...prev]);
    } catch (error) {
      setConnections(prev => prev.map(conn => 
        conn.id === connectionId 
          ? { ...conn, status: 'error' as const }
          : conn
      ));
    }
  };

  const disconnectBank = (connectionId: string) => {
    setConnections(prev => prev.filter(conn => conn.id !== connectionId));
    setBankTransactions(prev => prev.filter(txn => txn.connectionId !== connectionId));
  };

  const reconcileTransaction = (transactionId: string) => {
    setBankTransactions(prev => prev.map(txn => 
      txn.id === transactionId 
        ? { ...txn, isReconciled: true }
        : txn
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="text-green-500" size={16} />;
      case 'syncing': return <RefreshCw className="text-blue-500 animate-spin" size={16} />;
      case 'error': return <AlertCircle className="text-red-500" size={16} />;
      default: return <Clock className="text-gray-500" size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-100';
      case 'syncing': return 'text-blue-600 bg-blue-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const totalBalance = connections.reduce((sum, conn) => sum + conn.balance, 0);
  const unreconciled = bankTransactions.filter(txn => !txn.isReconciled).length;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Building className="text-blue-600" size={28} />
            <span>Banking Integration</span>
          </h2>
          <p className="text-gray-600 mt-1">Connect and sync your Nigerian bank accounts</p>
        </div>
        
        <button
          onClick={() => setShowAddBank(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          <span>Connect Bank</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Connected Accounts</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">{connections.length}</p>
            </div>
            <Building className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Balance</p>
              <p className="text-2xl font-bold text-green-600 mt-2">{formatCurrency(totalBalance)}</p>
            </div>
            <CreditCard className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unreconciled</p>
              <p className="text-2xl font-bold text-yellow-600 mt-2">{unreconciled}</p>
            </div>
            <AlertCircle className="text-yellow-500" size={24} />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'transactions', label: 'Transactions' },
            { key: 'reconciliation', label: 'Reconciliation' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {connections.map((connection) => (
            <div key={connection.id} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Building className="text-gray-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{connection.bankName}</h3>
                    <p className="text-sm text-gray-500">****{connection.accountNumber.slice(-4)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(connection.status)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(connection.status)}`}>
                    {connection.status}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Type</span>
                  <span className="font-medium capitalize">{connection.accountType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Balance</span>
                  <span className="font-bold text-green-600">{formatCurrency(connection.balance)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Sync</span>
                  <span className="text-sm text-gray-500">
                    {format(new Date(connection.lastSync), 'MMM dd, HH:mm')}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2 mt-4 pt-4 border-t">
                <button
                  onClick={() => syncBankAccount(connection.id)}
                  disabled={connection.status === 'syncing'}
                  className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center space-x-1 disabled:opacity-50"
                >
                  <Sync size={14} />
                  <span>Sync</span>
                </button>
                <button
                  onClick={() => disconnectBank(connection.id)}
                  className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}

          {connections.length === 0 && (
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-8 text-center">
              <Building className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Bank Accounts Connected</h3>
              <p className="text-gray-500 mb-4">Connect your Nigerian bank accounts to automatically sync transactions</p>
              <button
                onClick={() => setShowAddBank(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Connect Your First Bank
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Bank Transactions</h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1">
                <Download size={14} />
                <span>Export</span>
              </button>
              <button className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1">
                <Upload size={14} />
                <span>Import</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {bankTransactions.length === 0 ? (
              <div className="p-8 text-center">
                <CreditCard className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Transactions</h3>
                <p className="text-gray-500">Bank transactions will appear here after syncing</p>
              </div>
            ) : (
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bankTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(new Date(transaction.date), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{transaction.description}</div>
                        <div className="text-sm text-gray-500">{transaction.reference}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.type === 'credit' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                        <span className={transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                          {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.isReconciled 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {transaction.isReconciled ? 'Reconciled' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {!transaction.isReconciled && (
                          <button
                            onClick={() => reconcileTransaction(transaction.id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Reconcile
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {activeTab === 'reconciliation' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reconciliation Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {bankTransactions.filter(t => t.isReconciled).length}
                </div>
                <div className="text-sm text-green-700">Reconciled</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{unreconciled}</div>
                <div className="text-sm text-yellow-700">Pending</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{bankTransactions.length}</div>
                <div className="text-sm text-blue-700">Total</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Unreconciled Transactions</h3>
            </div>
            <div className="p-4 space-y-4">
              {bankTransactions.filter(t => !t.isReconciled).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{transaction.description}</div>
                    <div className="text-sm text-gray-500">
                      {format(new Date(transaction.date), 'MMM dd, yyyy')} • {transaction.reference}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`font-semibold ${
                      transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </span>
                    <button
                      onClick={() => reconcileTransaction(transaction.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      Reconcile
                    </button>
                  </div>
                </div>
              ))}
              {unreconciled === 0 && (
                <div className="text-center py-8">
                  <CheckCircle className="mx-auto text-green-500 mb-2" size={48} />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">All Caught Up!</h3>
                  <p className="text-gray-500">All transactions have been reconciled</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Bank Modal */}
      {showAddBank && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">Connect Bank Account</h3>
                <button
                  onClick={() => setShowAddBank(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              {!selectedBank ? (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Select Your Bank</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {nigerianBanks.map((bank) => (
                      <button
                        key={bank.code}
                        onClick={() => setSelectedBank(bank)}
                        disabled={!bank.supported}
                        className={`p-4 border rounded-lg text-center transition-colors ${
                          bank.supported
                            ? 'hover:bg-blue-50 hover:border-blue-300'
                            : 'opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                          <Building className="text-gray-600" size={24} />
                        </div>
                        <div className="text-sm font-medium text-gray-900">{bank.name}</div>
                        {!bank.supported && (
                          <div className="text-xs text-gray-500 mt-1">Coming Soon</div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Building className="text-gray-600" size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{selectedBank.name}</h4>
                      <p className="text-sm text-gray-500">Enter your online banking credentials</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start space-x-2">
                      <Shield className="text-blue-600 flex-shrink-0 mt-0.5" size={16} />
                      <div className="text-sm text-blue-800">
                        <strong>Security Notice:</strong> Your credentials are encrypted and stored securely. 
                        We use bank-grade security to protect your information.
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Username/Customer ID
                      </label>
                      <input
                        type="text"
                        value={credentials.username}
                        onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your username"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCredentials ? 'text' : 'password'}
                          value={credentials.password}
                          onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCredentials(!showCredentials)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCredentials ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Transaction PIN (Optional)
                      </label>
                      <input
                        type={showCredentials ? 'text' : 'password'}
                        value={credentials.pin}
                        onChange={(e) => setCredentials(prev => ({ ...prev, pin: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your PIN"
                        maxLength={4}
                      />
                    </div>
                  </div>

                  <div className="flex space-x-4 mt-6">
                    <button
                      onClick={() => setSelectedBank(null)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={connectBank}
                      disabled={loading || !credentials.username || !credentials.password}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="animate-spin" size={16} />
                          <span>Connecting...</span>
                        </>
                      ) : (
                        <>
                          <Zap size={16} />
                          <span>Connect Account</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankingIntegration;