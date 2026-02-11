// Temporary placeholder components during migration to Tailwind CSS
import React from 'react';
import { Link } from 'react-router-dom';

// Layout Components
export const LayoutContainer = ({ children }) => (
  <div className="flex min-h-screen bg-gray-50">{children}</div>
);

export const Sidebar = ({ children }) => (
  <aside className="w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col md:flex hidden">
    {children}
  </aside>
);

export const SidebarHeader = ({ children }) => (
  <div className="p-6 border-b border-gray-200">{children}</div>
);

export const Logo = ({ children }) => (
  <h1 className="text-xl font-bold text-brand-600 m-0">{children}</h1>
);

export const Navigation = ({ children }) => (
  <nav className="flex-1 py-4">{children}</nav>
);

export const NavItem = ({ children, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full px-6 py-3 border-none text-left cursor-pointer text-sm transition-all ${
      active 
        ? 'bg-gray-100 text-brand-600 font-semibold' 
        : 'bg-transparent text-gray-700 font-normal hover:bg-gray-100 hover:text-brand-600'
    }`}
  >
    {children}
  </button>
);

export const NavItemIcon = ({ children }) => (
  <span className="mr-2">{children}</span>
);

export const SidebarFooter = ({ children }) => (
  <div className="p-6 border-t border-gray-200">{children}</div>
);

export const UserInfo = ({ children }) => (
  <div className="mb-4">{children}</div>
);

export const UserName = ({ children }) => (
  <p className="text-sm font-semibold text-gray-900 m-0 mb-1">{children}</p>
);

export const UserEmail = ({ children }) => (
  <p className="text-xs text-gray-500 m-0">{children}</p>
);

export const AdminBadge = ({ children }) => (
  <div className="text-xs text-blue-500 font-semibold mt-1">{children}</div>
);

export const LogoutButton = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-700 rounded-md cursor-pointer text-xs transition-all hover:bg-gray-50 hover:border-gray-400"
  >
    {children}
  </button>
);

export const MainContent = ({ children }) => (
  <main className="flex-1 flex flex-col overflow-hidden">{children}</main>
);

export const TopBar = ({ children }) => (
  <header className="bg-white border-b border-gray-200 p-4 shadow-sm md:hidden">
    {children}
  </header>
);

export const MobileMenuButton = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="p-2 border-none bg-transparent text-gray-700 cursor-pointer"
  >
    {children}
  </button>
);

export const ContentArea = ({ children }) => (
  <div className="flex-1 p-6 overflow-y-auto">{children}</div>
);

// Modal Components
export const Modal = ({ children }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    {children}
  </div>
);

export const ModalContent = ({ children }) => (
  <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
    {children}
  </div>
);

export const ModalHeader = ({ children }) => (
  <div className="p-6 border-b border-gray-200 flex justify-between items-center">
    {children}
  </div>
);

export const ModalTitle = ({ children }) => (
  <h2 className="text-xl font-bold text-gray-900 m-0">{children}</h2>
);

export const CloseButton = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="bg-none border-none text-xl cursor-pointer text-gray-500 hover:text-gray-700"
  >
    {children}
  </button>
);

export const ModalBody = ({ children }) => (
  <div className="p-6">{children}</div>
);

export const ModalFooter = ({ children }) => (
  <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
    {children}
  </div>
);

// Form Components
export const Form = ({ children, onSubmit }) => (
  <form onSubmit={onSubmit} className="flex flex-col gap-6">
    {children}
  </form>
);

export const Section = ({ children }) => (
  <div className="border-b border-gray-200 pb-6 mb-6 last:border-b-0 last:pb-0 last:mb-0">
    {children}
  </div>
);

export const SectionTitle = ({ children }) => (
  <h3 className="text-lg font-semibold text-gray-800 m-0 mb-4">{children}</h3>
);

export const InputRow = ({ children, columns }) => (
  <div className={`grid gap-4 md:${columns || 'grid-cols-2'} grid-cols-1 mb-4`}>
    {children}
  </div>
);

export const InputGroup = ({ children, standalone }) => (
  <div className={`flex flex-col gap-2 ${standalone ? 'mb-4' : ''}`}>{children}</div>
);

export const Label = ({ children, htmlFor }) => (
  <label htmlFor={htmlFor} className="text-sm font-semibold text-gray-700">
    {children}
  </label>
);

export const Input = ({ error, ...props }) => (
  <input
    {...props}
    className={`p-3 border rounded-md text-base transition-all focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 ${
      error ? 'border-red-500' : 'border-gray-300'
    }`}
  />
);

export const Select = ({ children, error, ...props }) => (
  <select
    {...props}
    className={`p-3 border rounded-md text-base bg-white transition-all focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 ${
      error ? 'border-red-500' : 'border-gray-300'
    }`}
  >
    {children}
  </select>
);

export const TextArea = ({ ...props }) => (
  <textarea
    {...props}
    className="p-3 border border-gray-300 rounded-md text-base resize-y min-h-[60px] transition-all focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
  />
);

export const CheckboxContainer = ({ children }) => (
  <div className="flex items-center gap-2 mb-4">{children}</div>
);

export const Checkbox = ({ ...props }) => (
  <input {...props} type="checkbox" className="w-4 h-4" />
);

export const Button = ({ children, variant, size, onClick, disabled, ...props }) => {
  const baseClasses = "rounded-md font-semibold cursor-pointer transition-all border-none";
  const sizeClasses = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-4 py-3 text-sm';
  
  let variantClasses = '';
  if (variant === 'primary') {
    variantClasses = 'bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-60';
  } else if (variant === 'secondary') {
    variantClasses = 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50';
  } else if (variant === 'danger') {
    variantClasses = 'bg-red-600 text-white hover:bg-red-700 disabled:opacity-60';
  } else {
    variantClasses = 'bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-60';
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${disabled ? 'cursor-not-allowed' : ''}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const ErrorMessage = ({ children }) => (
  <div className="bg-red-50 text-red-600 p-3 rounded-md border border-red-200 text-sm mb-4">
    {children}
  </div>
);

export const ErrorText = ({ children }) => (
  <div className="text-red-500 text-xs">{children}</div>
);

export const SharingSection = ({ children }) => (
  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
    {children}
  </div>
);

export const SharingItem = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end mb-4 last:mb-0">
    {children}
  </div>
);

// Auth Page Components
export const PageContainer = ({ children }) => (
  <div className="min-h-screen flex flex-col justify-between bg-gray-50">
    {children}
  </div>
);

export const AuthMainContent = ({ children }) => (
  <div className="flex items-center justify-center flex-1 p-6">
    {children}
  </div>
);

export const AuthCard = ({ children }) => (
  <div className="bg-white p-8 rounded-lg border-2 border-brand-600 shadow-2xl shadow-brand-600/25 w-full max-w-md">
    {children}
  </div>
);

export const AuthLogo = ({ children }) => (
  <h1 className="text-center text-3xl font-bold text-brand-600 mb-6">
    {children}
  </h1>
);

export const AuthForm = ({ children, ...props }) => (
  <form className="flex flex-col gap-4" {...props}>
    {children}
  </form>
);

export const AuthInputGroup = ({ children }) => (
  <div className="flex flex-col">
    {children}
  </div>
);

export const AuthInputRow = ({ children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    {children}
  </div>
);

export const AuthLabel = ({ children, ...props }) => (
  <label className="text-sm font-semibold text-gray-700 mb-2" {...props}>
    {children}
  </label>
);

export const AuthInput = ({ ...props }) => (
  <input 
    className="p-3 border border-gray-300 rounded-md text-base transition-all focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 invalid:border-red-500"
    {...props}
  />
);

export const AuthSelect = ({ children, ...props }) => (
  <select 
    className="p-3 border border-gray-300 rounded-md text-base transition-all bg-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
    {...props}
  >
    {children}
  </select>
);

export const AuthButton = ({ children, disabled, ...props }) => (
  <button 
    className={`p-3 rounded-md text-base font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-400 ${
      disabled 
        ? 'bg-gray-400 text-white cursor-not-allowed' 
        : 'bg-brand-600 text-white cursor-pointer hover:bg-brand-700'
    }`}
    disabled={disabled}
    {...props}
  >
    {children}
  </button>
);

export const AuthErrorMessage = ({ children }) => (
  <div className="bg-red-50 text-red-600 p-3 rounded-md border border-red-200 text-sm mb-4">
    {children}
  </div>
);

export const AuthLinkContainer = ({ children }) => (
  <div className="text-center mt-4">
    {children}
  </div>
);

export const AuthStyledLink = ({ children, ...props }) => (
  <Link className="text-brand-600 no-underline text-sm hover:underline" {...props}>
    {children}
  </Link>
);