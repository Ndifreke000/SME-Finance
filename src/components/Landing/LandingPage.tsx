import React, { useState } from 'react';
import { 
  Calculator, 
  BarChart3, 
  CreditCard, 
  Shield, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Menu,
  X,
  Star,
  DollarSign,
  PieChart,
  FileText,
  Smartphone,
  Globe
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const services = [
    {
      icon: BarChart3,
      title: "Financial Analytics & Reporting",
      description: "Comprehensive financial reports, profit/loss analysis, and business intelligence dashboards to track your SME's performance.",
      features: ["Monthly/Quarterly Reports", "Profit & Loss Analysis", "Cash Flow Tracking", "Performance Metrics"]
    },
    {
      icon: Calculator,
      title: "Naira Currency Calculator",
      description: "Advanced currency conversion and calculation tools specifically designed for Nigerian businesses and international trade.",
      features: ["Real-time Exchange Rates", "Multi-currency Support", "Transaction Calculations", "Historical Rate Data"]
    },
    {
      icon: CreditCard,
      title: "Payment Processing",
      description: "Secure payment gateway integration with support for local and international payment methods for your business.",
      features: ["Stripe Integration", "Local Payment Methods", "Secure Transactions", "Payment Analytics"]
    },
    {
      icon: PieChart,
      title: "Budget Management",
      description: "Smart budgeting tools to help you plan, track, and optimize your business expenses and revenue streams.",
      features: ["Budget Planning", "Expense Tracking", "Revenue Forecasting", "Cost Optimization"]
    },
    {
      icon: FileText,
      title: "Transaction Management",
      description: "Complete transaction tracking system for all your business income and expenditure with detailed categorization.",
      features: ["Income Tracking", "Expense Management", "Transaction Categories", "Receipt Management"]
    },
    {
      icon: Shield,
      title: "Admin Dashboard",
      description: "Powerful administrative tools for business owners to monitor operations, manage users, and access detailed reports.",
      features: ["User Management", "Business Analytics", "Report Generation", "System Monitoring"]
    }
  ];

  const testimonials = [
    {
      name: "Adebayo Ogundimu",
      business: "Lagos Trading Co.",
      rating: 5,
      comment: "SME Finance has transformed how we manage our business finances. The reporting features are exceptional!"
    },
    {
      name: "Fatima Abdullahi",
      business: "Northern Logistics",
      rating: 5,
      comment: "The Naira calculator and payment processing have streamlined our operations significantly."
    },
    {
      name: "Chinedu Okwu",
      business: "Tech Solutions Ltd",
      rating: 5,
      comment: "Best financial management platform for Nigerian SMEs. Highly recommended!"
    }
  ];

  const stats = [
    { number: "500+", label: "SMEs Served" },
    { number: "₦2.5B+", label: "Transactions Processed" },
    { number: "99.9%", label: "Uptime Guarantee" },
    { number: "24/7", label: "Customer Support" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <DollarSign className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">SME Finance</span>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#services" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">Services</a>
                <a href="#features" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">Features</a>
                <a href="#testimonials" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">Testimonials</a>
                <button
                  onClick={onGetStarted}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </button>
              </div>
            </div>
            
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900 p-2"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#services" className="block px-3 py-2 text-gray-600 hover:text-blue-600">Services</a>
              <a href="#features" className="block px-3 py-2 text-gray-600 hover:text-blue-600">Features</a>
              <a href="#testimonials" className="block px-3 py-2 text-gray-600 hover:text-blue-600">Testimonials</a>
              <button
                onClick={onGetStarted}
                className="w-full text-left bg-blue-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Complete Financial Management for
              <span className="text-blue-600 block">Nigerian SMEs</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Streamline your business finances with our comprehensive platform featuring analytics, 
              payment processing, budgeting, and specialized tools for Nigerian small and medium enterprises.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onGetStarted}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                Start Free Trial
                <ArrowRight className="ml-2" size={20} />
              </button>
              <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive financial solutions designed specifically for Nigerian SMEs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm border hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <service.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 ml-4">{service.title}</h3>
                </div>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose SME Finance?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built specifically for Nigerian businesses with local expertise and global standards
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Local Expertise</h3>
              <p className="text-gray-600">Built by Nigerians for Nigerian businesses with deep understanding of local market needs.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Bank-Level Security</h3>
              <p className="text-gray-600">Enterprise-grade security with encryption and compliance with international standards.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Mobile Optimized</h3>
              <p className="text-gray-600">Fully responsive design that works perfectly on all devices and screen sizes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Trusted by hundreds of Nigerian SMEs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm border">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.comment}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.business}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Business Finances?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join hundreds of Nigerian SMEs already using our platform to streamline their financial operations.
          </p>
          <button
            onClick={onGetStarted}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            Start Your Free Trial Today
            <ArrowRight className="ml-2" size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <DollarSign className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-bold">SME Finance</span>
              </div>
              <p className="text-gray-400">
                Empowering Nigerian SMEs with comprehensive financial management solutions.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Financial Analytics</li>
                <li>Payment Processing</li>
                <li>Budget Management</li>
                <li>Currency Calculator</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Documentation</li>
                <li>API Reference</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Security</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SME Finance. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;