export default function Footer() {
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

  const footerLinks = [
    { name: '关于我们', href: '#' },
    { name: '联系方式', href: '#' },
    { name: '使用条款', href: '#' },
    { name: '隐私政策', href: '#' },
  ];

  return (
    <footer style={{ backgroundColor: THEME_COLORS.secondary.light }}>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="flex flex-col items-center md:items-start">
            <span className="flex items-center space-x-2">
              <svg 
                className="w-8 h-8"
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
                className="text-xl font-bold"
                style={{
                  background: `linear-gradient(to right, ${THEME_COLORS.primary.main}, ${THEME_COLORS.primary.light})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Document Audit
              </span>
            </span>
            <p className="mt-4 text-sm text-gray-500 text-center md:text-left">
              为您提供专业的文档审计服务，让文档管理更轻松、更高效。
            </p>
          </div>

          {/* Links */}
          <div className="flex justify-center md:justify-start">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                快速链接
              </h3>
              <div className="flex flex-col space-y-2">
                {footerLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-base transition-colors duration-300"
                    style={{
                      color: THEME_COLORS.primary.dark,
                      ':hover': { color: THEME_COLORS.primary.main }
                    }}
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              联系我们
            </h3>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-500">
                邮箱：clint@airyyy.com
              </p>
              <p className="text-sm text-gray-500">
                电话：+86 183 0695 0733
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t" style={{ borderColor: THEME_COLORS.secondary.main }}>
          <p className="text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Document Audit. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}