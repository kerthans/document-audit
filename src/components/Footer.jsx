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

  const contactInfo = [
    { 
      id: 'email',
      label: '邮箱',
      value: 'clint@airyyy.com',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'phone',
      label: '电话',
      value: '18306950733',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      )
    }
  ];

  const footerLinks = [
    { name: '关于我们', href: '#' },
    { name: '联系方式', href: '#' },
    { name: '使用条款', href: '#' }
  ];

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
          {/* Contact Information */}
          <div className="flex flex-col space-y-3">
            {contactInfo.map((info) => (
              <div
                key={info.id}
                onClick={() => handleCopy(info.value)}
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 cursor-pointer group 
                          transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span className="text-primary-600 group-hover:text-primary-700 transition-colors duration-300">
                  {info.icon}
                </span>
                <span className="font-medium">{info.label}:</span>
                <span className="relative">
                  {info.value}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 transform scale-x-0 
                                 group-hover:scale-x-100 transition-transform duration-300"
                        style={{ backgroundColor: THEME_COLORS.primary.main }}
                  />
                </span>
                <span className="opacity-0 group-hover:opacity-100 text-xs text-gray-500 transition-opacity duration-300">
                  点击复制
                </span>
              </div>
            ))}
          </div>

          {/* Links */}
          <div className="flex space-x-6">
            {footerLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="relative text-gray-500 hover:text-gray-700 transition-colors duration-300 group"
              >
                <span>{link.name}</span>
                <span 
                  className="absolute bottom-0 left-0 w-full h-0.5 transform scale-x-0 
                           group-hover:scale-x-100 transition-transform duration-300"
                  style={{ backgroundColor: THEME_COLORS.primary.main }}
                />
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Document Audit. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}