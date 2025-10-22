

import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, BarChart2, FileText, Bell, BookOpen, Menu, Activity } from 'lucide-react';
import { ChatBot } from './ChatBot';
import { SideMenu } from './SideMenu';


interface LayoutProps {
  children: React.ReactNode;
}

interface HeaderProps {
    onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    return (
        <header className="bg-white shadow-md sticky top-0 z-10">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <img src="https://fastly.picsum.photos/id/18/2500/1667.jpg?hmac=JR0Z_jRs9rssQHZJ4b7xKF82kOj8-4Ackq75D_9Wmz8" alt="AgriSure Logo" className="w-8 h-8 rounded-full" />
                    <h1 className="text-xl font-bold text-primary">AgriSure</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <NavLink to="/alerts">
                        <Bell className="text-gray-600 hover:text-primary" />
                    </NavLink>
                    <button onClick={onMenuClick}>
                        <Menu className="text-gray-600 hover:text-primary" />
                    </button>
                </div>
            </div>
        </header>
    );
};

const BottomNav: React.FC = () => {
    const location = useLocation();
    const navItems = [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/market', icon: Activity, label: 'Market' },
        { path: '/portfolio', icon: FileText, label: 'Contracts' },
        { path: '/forecast', icon: BarChart2, label: 'Forecast' },
        { path: '/learn', icon: BookOpen, label: 'Learn' },
    ];

    const isNavItemActive = (path: string) => {
        if (location.pathname.startsWith('/contract/') && path === '/portfolio') return true;
        if (location.pathname.startsWith('/profile') && path === '/profile') return true;
        if (location.pathname.startsWith('/insurance') && path === '/insurance') return true;
        return location.pathname === path;
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-t-md border-t border-gray-200 z-10 md:hidden">
            <div className="container mx-auto flex justify-around">
                {navItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={() =>
                            `flex flex-col items-center justify-center w-1/5 py-2 text-sm transition-colors duration-200 ${
                                isNavItemActive(item.path)
                                ? 'text-primary' 
                                : 'text-text-secondary hover:text-primary'
                            }`
                        }
                    >
                        <item.icon size={24} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};


export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // UPDATE: Manage chatbot state here to be controlled from SideMenu
    const [isChatOpen, setIsChatOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background text-text-primary">
            <Header onMenuClick={() => setIsMenuOpen(true)} />
            <main className="container mx-auto p-4 pb-20 md:pb-4 max-w-7xl">
                {children}
            </main>
            <BottomNav />
            {/* UPDATE: Pass state and handler to ChatBot */}
            <ChatBot isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
            {/* UPDATE: Pass chat opener handler to SideMenu */}
            <SideMenu 
                isOpen={isMenuOpen} 
                onClose={() => setIsMenuOpen(false)} 
                onOpenChat={() => setIsChatOpen(true)}
            />
        </div>
    );
};