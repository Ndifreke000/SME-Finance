# 🚀 SME Finance - Quick Setup Guide

## ⚡ One-Minute Setup

```bash
# 1️⃣ Clone & Navigate
git clone https://github.com/your-username/SME-Finance.git
cd SME-Finance

# 2️⃣ Install Dependencies
npm install

# 3️⃣ Start Development Server
npm run dev

# 🎉 Open http://localhost:5173
```

## 📋 Prerequisites

| Requirement | Version | Check Command |
|-------------|---------|---------------|
| **Node.js** | 18+ | `node --version` |
| **npm** | 9+ | `npm --version` |
| **Git** | Latest | `git --version` |

## 🎯 Available Commands

```bash
# 🔧 Development
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build

# 🧹 Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking

# 📦 Dependencies
npm install          # Install all dependencies
npm update           # Update dependencies
```

## 🌟 First Run Experience

### 1. **Landing Page** 🏠
- Professional marketing page
- Service descriptions
- Client testimonials

### 2. **Authentication** 🔐
- Click "Get Started"
- Register or Login
- Demo credentials available

### 3. **Real-time Dashboard** 📊
- Live data updates
- Interactive charts
- Connection status

### 4. **Explore Features** 🎯
- AI Insights (NEW badge)
- Banking Integration
- Transaction Management

## 🔧 Configuration

### Environment Variables (Optional)
```bash
# Create .env file
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_STRIPE_KEY=pk_test_...
REACT_APP_WEBSOCKET_URL=ws://localhost:3001
```

### Tailwind CSS
```javascript
// tailwind.config.js - Already configured
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
}
```

## 🎨 Customization

### 🎯 Brand Colors
```css
/* src/index.css */
:root {
  --primary: #3B82F6;    /* Blue */
  --success: #10B981;    /* Green */
  --warning: #F59E0B;    /* Yellow */
  --danger: #EF4444;     /* Red */
}
```

### 🏢 Company Branding
```typescript
// Update in src/components/Layout/Sidebar.tsx
<h1 className="text-xl font-bold">Your Company</h1>
<p className="text-slate-400 text-sm mt-1">Your Tagline</p>
```

## 🚀 Deployment

### 🌐 Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### 🔥 Netlify
```bash
# Build
npm run build

# Deploy dist/ folder to Netlify
```

### 🐳 Docker
```dockerfile
# Dockerfile (create this)
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

## 🔍 Troubleshooting

### ❌ Common Issues

| Issue | Solution |
|-------|----------|
| **Port 5173 in use** | `npm run dev -- --port 3000` |
| **Node version error** | Update to Node.js 18+ |
| **Dependencies error** | `rm -rf node_modules && npm install` |
| **Build fails** | Check TypeScript errors with `npm run type-check` |

### 🐛 Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev

# Check bundle size
npm run build -- --analyze
```

## 📱 Mobile Testing

```bash
# Get your local IP
ipconfig getifaddr en0  # macOS
hostname -I             # Linux

# Access from mobile
http://YOUR_IP:5173
```

## 🎯 Performance Tips

### ⚡ Optimization
- **Lazy Loading**: Components load on demand
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Use WebP format
- **Bundle Analysis**: Check with `npm run build`

### 📊 Monitoring
```javascript
// Add to main.tsx for performance monitoring
if (process.env.NODE_ENV === 'production') {
  // Add analytics code
}
```

## 🔐 Security Checklist

- [ ] Update default credentials
- [ ] Enable HTTPS in production
- [ ] Set up environment variables
- [ ] Configure CORS properly
- [ ] Add rate limiting
- [ ] Enable CSP headers

## 🎉 What's Next?

### 🚀 Immediate Steps
1. **Customize branding** (colors, logo, company name)
2. **Set up backend** (see WORLD_CLASS_ROADMAP.md)
3. **Connect real APIs** (banking, payments)
4. **Deploy to production**

### 📈 Growth Features
1. **Mobile app** development
2. **Advanced AI** integration
3. **Multi-user** support
4. **Enterprise** features

## 🆘 Need Help?

- 📖 **Documentation**: Check PROJECT_STRUCTURE.md
- 🗺️ **Roadmap**: See WORLD_CLASS_ROADMAP.md
- 🐛 **Issues**: Create GitHub issue
- 💬 **Discussions**: GitHub Discussions

---

<div align="center">

**🎯 Ready to build the future of Nigerian SME finance!**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/SME-Finance)

</div>