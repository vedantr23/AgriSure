

import React from 'react';
import { NavLink } from 'react-router-dom';
import { X, UserCircle, Home, FileText, Bot, Shield, MessageSquare } from 'lucide-react';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChat: () => void;
}

const menuItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/profile', label: 'Profile', icon: UserCircle },
    { path: '/portfolio', label: 'My Contracts', icon: FileText },
    { path: '/insurance', label: 'Insurance', icon: Shield },
];

export const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose, onOpenChat }) => {
  const handleSupportClick = () => {
    onClose();
    onOpenChat();
  };
    
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      ></div>

      <div 
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="menu-heading"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 id="menu-heading" className="font-bold text-lg">Menu</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Close menu">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 flex items-center space-x-4 border-b">
          <UserCircle size={48} className="text-gray-400" />
          <div>
            <p className="font-bold">Ankit Sharma</p>
            <p className="text-sm text-text-secondary">Farmer</p>
          </div>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map(item => (
                <li key={item.path}>
                    <NavLink 
                        to={item.path} 
                        onClick={onClose}
                        className={({ isActive }) => `flex items-center p-3 rounded-lg text-text-primary hover:bg-gray-100 ${isActive ? 'bg-primary/10 text-primary font-semibold' : ''}`}
                    >
                        <item.icon size={20} className="mr-3" />
                        <span>{item.label}</span>
                    </NavLink>
                </li>
            ))}
            <li>
                 <button 
                    onClick={handleSupportClick}
                    className="w-full flex items-center p-3 rounded-lg text-text-primary hover:bg-gray-100"
                >
                    <Bot size={20} className="mr-3" />
                    <span>Community & Support</span>
                </button>
            </li>
             <li>
                <NavLink 
                    to="/feedback"
                    onClick={onClose}
                    className={({ isActive }) => `flex items-center p-3 rounded-lg text-text-primary hover:bg-gray-100 ${isActive ? 'bg-primary/10 text-primary font-semibold' : ''}`}
                >
                    <MessageSquare size={20} className="mr-3" />
                    <span>Feedback</span>
                </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};