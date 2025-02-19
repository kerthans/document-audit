import { useRouter } from 'next/router';
import Link from 'next/link';
import { useScroll } from '../../hooks/useScroll';
import { useState, useEffect } from 'react';

const THEME_COLORS = {
  primary: {
    main: '#4F46E5',
    light: '#8A7CFF',
    dark: '#321FAB',
    contrastText: '#FFFFFF'
  },
  secondary: {
    main: '#E3E3FF',
    light: '#FFFFFF',
    dark: '#C0C0FF',
    contrastText: '#333333'
  }
};

export default function Header() {
  const router = useRouter();
  const { scrollY } = useScroll();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: '主页', href: '/' },
    { name: '功能', href: '#features' },
    { name: '流程', href: '#how-it-works' },
    { name: '评价', href: '#testimonials' },
  ];

  const handleNavClick = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleRouteChange = () => setIsMenuOpen(false);
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router]);

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrollY > 0 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}
      style={{
        borderBottom: scrollY > 0 ? `1px solid ${THEME_COLORS.secondary.main}` : 'none'
      }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/">
              <span className="flex items-center space-x-2 cursor-pointer group">
                <svg 
                  className={`w-8 h-8 transition-colors duration-300`}
                  style={{ color: THEME_COLORS.primary.main }}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
                <span 
                  className="text-xl font-bold transition-colors duration-300"
                  style={{
                    background: `linear-gradient(to right, ${THEME_COLORS.primary.main}, ${THEME_COLORS.primary.light})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Document Audit
                </span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={handleNavClick}
                className="relative text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-300 group"
              >
                {item.name}
                <span 
                  className="absolute bottom-0 left-0 w-full h-0.5 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                  style={{ backgroundColor: THEME_COLORS.primary.main }}
                />
              </a>
            ))}
            <Link href="/audit">
              <span 
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 cursor-pointer hover:shadow-lg transform hover:-translate-y-0.5"
                style={{
                  backgroundColor: THEME_COLORS.primary.main,
                  color: THEME_COLORS.primary.contrastText
                }}
              >
                开始使用
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md transition-colors duration-300"
              style={{ color: THEME_COLORS.primary.main }}
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden animate-fadeIn">
            <div 
              className="px-2 pt-2 pb-3 space-y-1 sm:px-3 rounded-lg shadow-lg"
              style={{ backgroundColor: THEME_COLORS.secondary.light }}
            >
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={handleNavClick}
                  className="block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300"
                  style={{
                    color: THEME_COLORS.primary.dark,
                    backgroundColor: 'transparent',
                    hover: {
                      backgroundColor: THEME_COLORS.secondary.main
                    }
                  }}
                >
                  {item.name}
                </a>
              ))}
              <Link href="/audit">
                <span 
                  className="block w-full text-center px-4 py-2 rounded-md text-base font-medium transition-all duration-300"
                  style={{
                    backgroundColor: THEME_COLORS.primary.main,
                    color: THEME_COLORS.primary.contrastText
                  }}
                >
                  开始使用
                </span>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}