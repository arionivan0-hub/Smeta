import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, FileText, Package, Layers, Globe, Menu, ChevronLeft } from 'lucide-react';

export default function Layout() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { path: '/', label: t('nav.dashboard'), icon: LayoutDashboard },
    { path: '/estimates', label: t('nav.estimates'), icon: FileText },
    { path: '/catalog', label: t('nav.catalog'), icon: Package },
    { path: '/templates', label: t('nav.templates'), icon: Layers },
  ];

  const languages = [
    { code: 'es', label: 'ES' },
    { code: 'ru', label: 'RU' },
    { code: 'en', label: 'EN' },
  ];

  const sidebarWidth = collapsed ? 'w-16' : 'w-60';

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 ${sidebarWidth} bg-white border-r border-slate-200/80 flex flex-col transition-all duration-200 ease-in-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className={`h-16 flex items-center border-b border-slate-200/80 ${collapsed ? 'justify-center px-2' : 'px-5'}`}>
          {!collapsed && (
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm shadow-blue-500/20">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-sm font-bold text-slate-900 tracking-tight">Smeta</h1>
                <p className="text-[10px] text-slate-400 truncate">{t('app.subtitle')}</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm shadow-blue-500/20">
              <span className="text-white font-bold text-sm">S</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2.5 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                  collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'
                } ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 shadow-sm shadow-blue-500/5'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Language switcher */}
        <div className={`p-3 border-t border-slate-200/80 ${collapsed ? 'flex justify-center' : ''}`}>
          {!collapsed ? (
            <div className="flex items-center gap-2">
              <Globe size={14} className="text-slate-400 flex-shrink-0" />
              <div className="flex gap-0.5 bg-slate-100 rounded-lg p-0.5">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => i18n.changeLanguage(lang.code)}
                    className={`px-2 py-1 text-[11px] rounded-md font-semibold transition-all ${
                      i18n.language === lang.code
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-0.5">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => i18n.changeLanguage(lang.code)}
                  className={`px-1 py-1 text-[10px] rounded font-bold transition-all ${
                    i18n.language === lang.code
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-white border border-slate-200 rounded-full items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-300 shadow-sm transition-all"
        >
          <ChevronLeft size={12} className={`transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden h-14 bg-white border-b border-slate-200/80 flex items-center px-4 gap-3 sticky top-0 z-30">
          <button onClick={() => setMobileOpen(true)} className="text-slate-500 hover:text-slate-700">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">S</span>
            </div>
            <span className="text-sm font-bold text-slate-900">Smeta</span>
          </div>
        </div>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
