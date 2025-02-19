export default function Button({ children, className, ...props }) {
    return (
      <button
        className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }