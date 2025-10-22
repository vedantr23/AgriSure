

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Eye, ArrowUpRight, ArrowDownRight, TrendingUp, Shield, GraduationCap, BarChart2, Leaf, Check, Package, Newspaper } from 'lucide-react';
import { MarketMover } from '../types';
import { 
    MOCK_TOP_GAINERS_FUTURES, MOCK_TOP_LOSERS_FUTURES, 
    MOCK_TOP_GAINERS_OPTIONS, MOCK_TOP_LOSERS_OPTIONS, 
    generateForecastData, 
    MOCK_PRICES,
    MOCK_AGRI_NEWS
} from '../constants';


const DashboardCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; linkTo?: string; linkText?: string; className?: string }> = ({ title, icon, children, linkTo, linkText, className = '' }) => (
    <div className={`bg-card rounded-xl shadow-md p-4 flex flex-col ${className}`}>
        <div className="flex items-center mb-3">
            {icon}
            <h3 className="font-bold text-text-primary ml-2">{title}</h3>
        </div>
        <div className="flex-grow">{children}</div>
        {linkTo && linkText && (
            <Link to={linkTo} className="mt-4 text-sm font-semibold text-primary hover:underline self-start flex items-center">
                {linkText} <Eye size={14} className="ml-1" />
            </Link>
        )}
    </div>
);

const MarketMovers: React.FC = () => {
    const [mainTab, setMainTab] = useState<'gainers' | 'losers'>('gainers');
    const [subTab, setSubTab] = useState<'futures' | 'options'>('futures');

    let data: MarketMover[] = [];
    if (mainTab === 'gainers' && subTab === 'futures') data = MOCK_TOP_GAINERS_FUTURES;
    else if (mainTab === 'gainers' && subTab === 'options') data = MOCK_TOP_GAINERS_OPTIONS;
    else if (mainTab === 'losers' && subTab === 'futures') data = MOCK_TOP_LOSERS_FUTURES;
    else data = MOCK_TOP_LOSERS_OPTIONS;

    return (
        <div className="h-full flex flex-col">
            <div className="flex border-b border-gray-200">
                <button 
                    onClick={() => setMainTab('gainers')}
                    className={`flex-1 py-2 text-sm font-semibold ${mainTab === 'gainers' ? 'border-b-2 border-green-500 text-green-600' : 'text-text-secondary'}`}
                >
                    Top Gainers
                </button>
                <button 
                    onClick={() => setMainTab('losers')}
                    className={`flex-1 py-2 text-sm font-semibold ${mainTab === 'losers' ? 'border-b-2 border-red-500 text-red-600' : 'text-text-secondary'}`}
                >
                    Top Losers
                </button>
            </div>
            <div className="flex justify-center p-1 bg-gray-100 rounded-md my-2">
                <button 
                    onClick={() => setSubTab('futures')}
                    className={`flex-1 px-2 py-1 text-xs rounded-md flex items-center justify-center ${subTab === 'futures' ? 'bg-white shadow text-primary font-bold' : 'text-text-secondary'}`}
                >
                   <Check size={12} className="mr-1"/> Futures
                </button>
                <button 
                    onClick={() => setSubTab('options')}
                    className={`flex-1 px-2 py-1 text-xs rounded-md flex items-center justify-center ${subTab === 'options' ? 'bg-white shadow text-primary font-bold' : 'text-text-secondary'}`}
                >
                   <Package size={12} className="mr-1"/> Options
                </button>
            </div>
            <div className="flex-grow overflow-y-auto pr-1">
                <div className="text-xs text-text-secondary grid grid-cols-3 mb-1">
                    <span>Contract</span>
                    <span className="text-right">LTP</span>
                    <span className="text-right">Change(%)</span>
                </div>
                <div className="space-y-2">
                    {data.map((item, index) => (
                         <div key={index} className="grid grid-cols-3 text-sm items-center p-1 rounded-md hover:bg-gray-50">
                            <div className="flex items-center">
                                <Package size={14} className="mr-2 text-text-secondary"/>
                                <span className="font-semibold text-text-primary truncate">{item.contract}</span>
                            </div>
                            <span className="text-right font-mono">{item.ltp.toFixed(2)}</span>
                            <span className={`text-right font-semibold ${mainTab === 'gainers' ? 'text-green-600' : 'text-red-600'}`}>
                                {mainTab === 'gainers' ? '+' : ''}{item.changePercent.toFixed(2)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const NewsTicker: React.FC = () => {
    const newsItems = MOCK_AGRI_NEWS.map((news, index) => (
        <span key={index} className="mx-8 text-sm">{news}</span>
    ));

    return (
        <div className="bg-primary/90 text-white rounded-lg shadow-md p-2 flex items-center overflow-hidden">
            <style>{`
                @keyframes news-scroll {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                }
                .animate-news-scroll {
                    animation: news-scroll 5s linear infinite;
                }
            `}</style>
            <div className="flex-shrink-0 flex items-center pr-4 mr-4 border-r border-green-400">
                <Newspaper size={18} className="mr-2" />
                <span className="font-bold text-sm whitespace-nowrap">Agri Updates</span>
            </div>
            <div className="flex-grow group overflow-hidden">
                <div className="flex group-hover:[animation-play-state:paused] animate-news-scroll">
                    {/* Render the list twice for a seamless loop */}
                    <div className="flex-shrink-0 flex items-center whitespace-nowrap">{newsItems}</div>
                    <div className="flex-shrink-0 flex items-center whitespace-nowrap">{newsItems}</div>
                </div>
            </div>
        </div>
    );
};


export const HomeScreen: React.FC = () => {
  const forecastData = generateForecastData(7, MOCK_PRICES.Soybean).map(d => ({
      name: new Date(d.date).toLocaleString('en-US', { month: 'short', day: 'numeric' }),
      price: d.predicted,
  }));

  return (
    <div className="space-y-6">
        <NewsTicker />
        <div className="lg:grid lg:grid-cols-3 lg:gap-6 space-y-6 lg:space-y-0">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-[#FBFBF8] rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 text-left min-h-[280px] flex flex-col justify-between">
                    <div>
                        <div className="flex items-center mb-2">
                            <Leaf size={32} className="text-green-900" />
                            <h2 className="text-3xl font-bold text-green-900 ml-3 tracking-tight">AgriSure DSS</h2>
                        </div>
                        <p className="text-lg text-gray-800 mt-2 font-serif italic">“India’s first Hedging Decision Engine”</p>
                        <p className="text-base text-gray-700 mt-4 max-w-md">
                            Get intelligent recommendations that translate complex data into a simple action.
                        </p>
                    </div>
                    <div className="flex justify-between items-end mt-4">
                        <div className="text-center">
                            <p className="text-sm text-text-secondary">HOI-X™ Score</p>
                            <p className="text-5xl font-bold text-orange-500">82</p>
                        </div>
                        <Link to="/dss" className="bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-primary-dark transition-colors">
                            Open DSS
                        </Link>
                    </div>
                </div>
                <DashboardCard 
                    title="Market Snapshot" 
                    icon={<BarChart2 className="text-purple-500" />}
                    linkTo="/market"
                    linkText="View Charts"
                    className="lg:h-[380px]"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                        <div className="space-y-4 pr-4 border-r border-gray-200">
                            <h4 className="font-bold text-center text-text-secondary">Key Prices</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50">
                                    <span className="font-semibold">Soybean</span>
                                    <div className="flex items-center text-green-600">
                                        <span className="font-bold">₹4,250</span>
                                        <ArrowUpRight size={16} className="ml-1" />
                                        <span className="text-sm">1.2%</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50">
                                    <span className="font-semibold">Mustard Seed</span>
                                    <div className="flex items-center text-red-600">
                                        <span className="font-bold">₹5,800</span>
                                        <ArrowDownRight size={16} className="ml-1" />
                                        <span className="text-sm">0.6%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <MarketMovers />
                    </div>
                </DashboardCard>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
                 <DashboardCard title="7-Day Forecast" icon={<TrendingUp className="text-green-500" />} linkTo="/forecast" linkText="See Full Forecast">
                    <div style={{ width: '100%', height: 150 }}>
                        <ResponsiveContainer>
                            <LineChart data={forecastData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                <YAxis domain={['dataMin - 20', 'dataMax + 20']} tick={{ fontSize: 10 }} />
                                <Tooltip />
                                <Line type="monotone" dataKey="price" stroke="#16a34a" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </DashboardCard>
          
                <div className="grid grid-cols-2 gap-4">
                    <Link to="/learn/trading-simulator" className="bg-primary text-white text-center rounded-xl shadow-md p-4 flex flex-col items-center justify-center hover:bg-primary-dark transition-colors h-28">
                        <Shield size={24} className="mb-2"/>
                        <span className="font-bold">Place Hedge</span>
                    </Link>
                    <Link to="/learn" className="bg-secondary text-white text-center rounded-xl shadow-md p-4 flex flex-col items-center justify-center hover:bg-orange-600 transition-colors h-28">
                        <GraduationCap size={24} className="mb-2"/>
                        <span className="font-bold">Learning Hub</span>
                    </Link>
                </div>
            </div>
        </div>
    </div>
  );
};