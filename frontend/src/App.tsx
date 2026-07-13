import { lazy, Suspense, Component, ErrorInfo, ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout/Layout';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Estimates = lazy(() => import('./pages/Estimates'));
const EstimateEditor = lazy(() => import('./pages/EstimateEditor'));
const Catalog = lazy(() => import('./pages/Catalog'));
const Templates = lazy(() => import('./pages/Templates'));
const Settings = lazy(() => import('./pages/Settings'));

// ============================================
// Error logging utility
// ============================================
function logError(error: Error, errorInfo?: ErrorInfo, context?: string) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level: 'error',
    message: error.message,
    stack: error.stack,
    componentStack: errorInfo?.componentStack || null,
    context: context || 'unknown',
    url: window.location.href,
    userAgent: navigator.userAgent,
  };

  // Console for dev
  console.error('[Smeta Error]', logEntry);

  // Send to backend (fire and forget)
  fetch('/api/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(logEntry),
  }).catch(() => {});
}

// ============================================
// Error Boundary
// ============================================
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logError(error, errorInfo, 'ErrorBoundary');
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 max-w-md w-full text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">!</span>
            </div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Something went wrong</h2>
            <p className="text-sm text-slate-500 mb-4">
              An unexpected error occurred. Please refresh the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              Reload page
            </button>
            {this.state.error && (
              <details className="mt-4 text-left">
                <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-600">
                  Error details
                </summary>
                <pre className="mt-2 text-xs text-red-600 bg-red-50 p-3 rounded-lg overflow-auto max-h-40">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ============================================
// Page Loader
// ============================================
function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex items-center gap-3 text-slate-400">
        <div className="w-5 h-5 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
        <span className="text-sm font-medium">Loading...</span>
      </div>
    </div>
  );
}

// ============================================
// Global error listeners
// ============================================
window.addEventListener('error', (event) => {
  logError(event.error || new Error(event.message), undefined, 'window.error');
});

window.addEventListener('unhandledrejection', (event) => {
  const error = event.reason instanceof Error
    ? event.reason
    : new Error(String(event.reason));
  logError(error, undefined, 'unhandledrejection');
});

// ============================================
// App
// ============================================
function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Toaster position="top-right" toastOptions={{ duration: 2000 }} />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Suspense fallback={<PageLoader />}><Dashboard /></Suspense>} />
            <Route path="estimates" element={<Suspense fallback={<PageLoader />}><Estimates /></Suspense>} />
            <Route path="estimates/:id" element={<Suspense fallback={<PageLoader />}><EstimateEditor /></Suspense>} />
            <Route path="catalog" element={<Suspense fallback={<PageLoader />}><Catalog /></Suspense>} />
            <Route path="templates" element={<Suspense fallback={<PageLoader />}><Templates /></Suspense>} />
            <Route path="settings" element={<Suspense fallback={<PageLoader />}><Settings /></Suspense>} />
          </Route>
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
