import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Lightbulb, 
  Target, 
  DollarSign,
  Calendar,
  BarChart3,
  PieChart,
  Zap,
  RefreshCw,
  ChevronRight,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AIInsight {
  id: string;
  type: 'spending_pattern' | 'revenue_forecast' | 'cost_optimization' | 'cash_flow_prediction' | 'anomaly_detection';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  recommendations: string[];
  data: any;
  createdAt: string;
  status: 'new' | 'viewed' | 'acted_upon';
}

interface Prediction {
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
  confidence: number;
}

const AIInsights: React.FC = () => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);
  const [activeTab, setActiveTab] = useState<'insights' | 'predictions' | 'recommendations'>('insights');

  useEffect(() => {
    generateMockInsights();
    generateMockPredictions();
  }, []);

  const generateMockInsights = () => {
    const mockInsights: AIInsight[] = [
      {
        id: '1',
        type: 'spending_pattern',
        title: 'Unusual Spending Pattern Detected',
        description: 'Your marketing expenses have increased by 45% compared to last month, significantly above the typical 10-15% monthly variation.',
        confidence: 0.87,
        impact: 'high',
        actionable: true,
        recommendations: [
          'Review marketing campaign ROI for the past month',
          'Consider setting up budget alerts for marketing category',
          'Analyze which marketing channels are driving the highest costs'
        ],
        data: {
          category: 'Marketing',
          increase: 45,
          amount: 450000,
          previousAmount: 310000
        },
        createdAt: new Date().toISOString(),
        status: 'new'
      },
      {
        id: '2',
        type: 'revenue_forecast',
        title: 'Revenue Growth Opportunity',
        description: 'Based on current trends, you could increase revenue by 23% by optimizing your peak sales periods and inventory management.',
        confidence: 0.92,
        impact: 'high',
        actionable: true,
        recommendations: [
          'Increase inventory during identified peak periods',
          'Implement dynamic pricing strategies',
          'Focus marketing efforts on high-conversion periods'
        ],
        data: {
          potentialIncrease: 23,
          currentRevenue: 2500000,
          projectedRevenue: 3075000
        },
        createdAt: new Date().toISOString(),
        status: 'new'
      },
      {
        id: '3',
        type: 'cost_optimization',
        title: 'Cost Reduction Opportunity',
        description: 'Analysis shows you could reduce operational costs by ₦180,000 monthly by optimizing supplier contracts and reducing redundant subscriptions.',
        confidence: 0.78,
        impact: 'medium',
        actionable: true,
        recommendations: [
          'Renegotiate supplier contracts for better rates',
          'Audit and cancel unused software subscriptions',
          'Consolidate similar services to reduce costs'
        ],
        data: {
          potentialSavings: 180000,
          categories: ['Suppliers', 'Software', 'Utilities']
        },
        createdAt: new Date().toISOString(),
        status: 'viewed'
      },
      {
        id: '4',
        type: 'cash_flow_prediction',
        title: 'Cash Flow Alert',
        description: 'Predicted cash flow shortage in 6 weeks based on current spending patterns and seasonal revenue trends.',
        confidence: 0.84,
        impact: 'high',
        actionable: true,
        recommendations: [
          'Accelerate accounts receivable collection',
          'Delay non-critical expenses',
          'Consider short-term financing options'
        ],
        data: {
          shortfallDate: '2024-02-15',
          estimatedShortfall: 320000,
          currentCashFlow: 850000
        },
        createdAt: new Date().toISOString(),
        status: 'new'
      },
      {
        id: '5',
        type: 'anomaly_detection',
        title: 'Transaction Anomaly Detected',
        description: 'Detected 3 transactions that deviate significantly from your normal spending patterns, potentially indicating errors or fraud.',
        confidence: 0.95,
        impact: 'medium',
        actionable: true,
        recommendations: [
          'Review flagged transactions for accuracy',
          'Verify with team members who made these transactions',
          'Consider implementing transaction approval workflows'
        ],
        data: {
          anomalousTransactions: 3,
          totalAmount: 125000,
          categories: ['Office Supplies', 'Travel', 'Equipment']
        },
        createdAt: new Date().toISOString(),
        status: 'new'
      }
    ];

    setInsights(mockInsights);
    setLoading(false);
  };

  const generateMockPredictions = () => {
    const mockPredictions: Prediction[] = [
      { period: 'Jan 2024', revenue: 2800000, expenses: 2100000, profit: 700000, confidence: 0.89 },
      { period: 'Feb 2024', revenue: 3200000, expenses: 2300000, profit: 900000, confidence: 0.85 },
      { period: 'Mar 2024', revenue: 3500000, expenses: 2400000, profit: 1100000, confidence: 0.82 },
      { period: 'Apr 2024', revenue: 3300000, expenses: 2350000, profit: 950000, confidence: 0.78 },
      { period: 'May 2024', revenue: 3600000, expenses: 2500000, profit: 1100000, confidence: 0.75 },
      { period: 'Jun 2024', revenue: 3800000, expenses: 2600000, profit: 1200000, confidence: 0.72 }
    ];

    setPredictions(mockPredictions);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'spending_pattern': return <BarChart3 size={20} />;
      case 'revenue_forecast': return <TrendingUp size={20} />;
      case 'cost_optimization': return <Target size={20} />;
      case 'cash_flow_prediction': return <DollarSign size={20} />;
      case 'anomaly_detection': return <AlertTriangle size={20} />;
      default: return <Brain size={20} />;
    }
  };

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const markAsActedUpon = (insightId: string) => {
    setInsights(prev => prev.map(insight => 
      insight.id === insightId 
        ? { ...insight, status: 'acted_upon' as const }
        : insight
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Brain className="text-blue-600" size={28} />
            <span>AI Financial Insights</span>
          </h2>
          <p className="text-gray-600 mt-1">AI-powered analysis and recommendations for your business</p>
        </div>
        
        <button
          onClick={() => {
            setLoading(true);
            setTimeout(() => {
              generateMockInsights();
              generateMockPredictions();
            }, 1000);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <RefreshCw size={16} />
          <span>Refresh Insights</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'insights', label: 'AI Insights', icon: Lightbulb },
            { key: 'predictions', label: 'Predictions', icon: TrendingUp },
            { key: 'recommendations', label: 'Recommendations', icon: Target }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Insights List */}
          <div className="lg:col-span-2 space-y-4">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className={`bg-white rounded-xl shadow-sm border p-6 cursor-pointer transition-all hover:shadow-md ${
                  selectedInsight?.id === insight.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedInsight(insight)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                      {getInsightIcon(insight.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{insight.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(insight.impact)}`}>
                          {insight.impact} impact
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{insight.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Confidence: {(insight.confidence * 100).toFixed(0)}%</span>
                          <span>•</span>
                          <span>{insight.recommendations.length} recommendations</span>
                        </div>
                        {insight.status === 'acted_upon' ? (
                          <CheckCircle className="text-green-500" size={16} />
                        ) : (
                          <ChevronRight className="text-gray-400" size={16} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Insight Detail Panel */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            {selectedInsight ? (
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                    {getInsightIcon(selectedInsight.type)}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedInsight.title}</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Analysis</h4>
                    <p className="text-gray-600 text-sm">{selectedInsight.description}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
                    <ul className="space-y-2">
                      {selectedInsight.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                          <Zap className="text-yellow-500 flex-shrink-0 mt-0.5" size={14} />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">Confidence Level</span>
                      <span className="text-sm text-gray-600">{(selectedInsight.confidence * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${selectedInsight.confidence * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {selectedInsight.status !== 'acted_upon' && (
                    <button
                      onClick={() => markAsActedUpon(selectedInsight.id)}
                      className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <CheckCircle size={16} />
                      <span>Mark as Acted Upon</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Brain className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Insight</h3>
                <p className="text-gray-500">Click on any insight to view detailed analysis and recommendations</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'predictions' && (
        <div className="space-y-6">
          {/* Prediction Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">6-Month Financial Predictions</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={predictions}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip formatter={(value: number) => [formatCurrency(value), '']} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10B981"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    name="Predicted Revenue"
                  />
                  <Area
                    type="monotone"
                    dataKey="profit"
                    stroke="#3B82F6"
                    fillOpacity={1}
                    fill="url(#colorProfit)"
                    name="Predicted Profit"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Prediction Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {predictions.slice(0, 3).map((prediction, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{prediction.period}</h3>
                  <span className="text-sm text-gray-500">
                    {(prediction.confidence * 100).toFixed(0)}% confidence
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Revenue</span>
                    <span className="font-semibold text-green-600">{formatCurrency(prediction.revenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expenses</span>
                    <span className="font-semibold text-red-600">{formatCurrency(prediction.expenses)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-gray-900 font-medium">Profit</span>
                    <span className="font-bold text-blue-600">{formatCurrency(prediction.profit)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'recommendations' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {insights.filter(i => i.actionable).map((insight) => (
            <div key={insight.id} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                  {getInsightIcon(insight.type)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{insight.title}</h3>
                  <div className="space-y-2">
                    {insight.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={16} />
                        <span className="text-gray-600 text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(insight.impact)}`}>
                        {insight.impact} impact
                      </span>
                      <button
                        onClick={() => markAsActedUpon(insight.id)}
                        className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                          insight.status === 'acted_upon'
                            ? 'bg-green-100 text-green-700 cursor-not-allowed'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                        disabled={insight.status === 'acted_upon'}
                      >
                        {insight.status === 'acted_upon' ? 'Completed' : 'Take Action'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIInsights;