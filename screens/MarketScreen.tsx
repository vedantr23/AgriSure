import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Eye, ArrowUp, ArrowDown, X, BarChart, LineChart as LineChartIcon, Maximize, Power, PowerOff } from 'lucide-react';
import { generateCandlestickData } from '../constants';
import { TickerData, MarketData, CandleStickDataPoint } from '../types';
import { ComposedChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Bar, Brush, LineChart, Line } from 'recharts';
import { marketDataService } from '../services/marketDataService';

const Ticker: React.FC<{ item: TickerData }> = ({ item }) => {
    const isPositive = item.changePercent >= 0;
    return (
        <div className="flex-shrink-0 flex items-center space-x-2 p-2 border-r border-gray-200">
            <div>
                <p className="font-bold text-sm">{item.symbol}</p>
                <p className="text-xs text-text-secondary">{item.expiry}</p>
            </div>
            <div>
                <p className="font-semibold text-sm">{item.price.toFixed(2)}</p>
                <div className={`flex items-center text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                    <span>{Math.abs(item.changePercent).toFixed(2)}%</span>
                </div>
            </div>
        </div>
    );
};

const CustomCandle = (props: any) => {
    const { x, y, width, height, payload } = props;
    if (!payload) return null;
    const { open, high, low, close } = payload;
    
    if (high === low || high === undefined) return null;

    const isRising = close >= open;
    const color = isRising ? '#16a34a' : '#ef4444'; // green-600, red-500
    const wickX = x + width / 2;

    const yRatio = (high - low) > 0 ? height / (high - low) : 0;
    const bodyTopY = y + (high - Math.max(open, close)) * yRatio;
    const bodyHeight = Math.abs(open - close) * yRatio;

    return (
        <g>
            <line x1={wickX} y1={y} x2={wickX} y2={y + height} stroke={color} strokeWidth={1} />
            <rect 
                x={x} 
                y={bodyTopY} 
                width={width} 
                height={Math.max(bodyHeight, 1)} 
                fill={color} 
            />
        </g>
    );
};


const CustomTooltip = ({ active, payload, label, chartType }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white p-2 border border-gray-300 rounded shadow-md text-sm text-text-primary">
                <p className="font-bold mb-1">{new Date(label).toLocaleDateString()}</p>
                {chartType === 'Candlestick' ? (
                    <>
                        <p>Open: <span className="font-semibold">{data.open}</span></p>
                        <p>High: <span className="font-semibold">{data.high}</span></p>
                        <p>Low: <span className="font-semibold">{data.low}</span></p>
                        <p>Close: <span className="font-semibold">{data.close}</span></p>
                    </>
                ) : (
                     <p>Price: <span className="font-semibold">{data.close}</span></p>
                )}
            </div>
        );
    }
    return null;
};


const ChartModal: React.FC<{ item: MarketData; onClose: () => void; }> = ({ item, onClose }) => {
    const [chartData, setChartData] = useState<CandleStickDataPoint[]>([]);
    const [chartType, setChartType] = useState<'Candlestick' | 'Line'>('Candlestick');

    useEffect(() => {
        setChartData(generateCandlestickData(90, item.ltp));
    }, [item]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white text-text-primary w-full h-full max-w-6xl max-h-[90vh] rounded-lg shadow-2xl flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-3 border-b border-gray-200">
                    <h3 className="font-bold text-lg">{item.productName} ({item.expiryDate})</h3>
                    <div className="flex items-center space-x-4">
                         <a href="https://www.tradingview.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-primary">
                            Track all markets on TradingView
                        </a>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex items-center p-2 space-x-2 border-b border-gray-200 text-sm text-gray-600">
                    {['1m', '5m', '30m', '1h'].map(t => <button key={t} className="px-2 py-1 rounded hover:bg-gray-100">{t}</button>)}
                    <div className="h-5 border-l border-gray-300 mx-2"></div>
                    <button onClick={() => setChartType('Candlestick')} className={`p-2 rounded ${chartType === 'Candlestick' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'}`}><BarChart size={18} /></button>
                    <button onClick={() => setChartType('Line')} className={`p-2 rounded ${chartType === 'Line' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'}`}><LineChartIcon size={18} /></button>
                    <div className="h-5 border-l border-gray-300 mx-2"></div>
                    <button className="px-2 py-1 rounded hover:bg-gray-100">Indicators</button>
                    <div className="flex-grow"></div>
                     <button className="p-2 rounded hover:bg-gray-100"><Maximize size={18} /></button>
                </div>
                
                {/* Chart */}
                <div className="flex-grow p-2">
                    <ResponsiveContainer width="100%" height="100%">
                        {chartType === 'Candlestick' ? (
                            <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: -25, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6b7280' }} />
                                <YAxis domain={['dataMin - 100', 'dataMax + 100']} tick={{ fontSize: 10, fill: '#6b7280' }} orientation="right" />
                                <Tooltip content={<CustomTooltip chartType="Candlestick" />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
                                <Bar dataKey={(item: CandleStickDataPoint) => [item.low, item.high]} name="Price Range" shape={<CustomCandle />} isAnimationActive={false} />
                                <Brush dataKey="date" height={30} stroke="#e5e7eb" fill="#f9fafb" travellerWidth={15} />
                            </ComposedChart>
                        ) : (
                             <LineChart data={chartData} margin={{ top: 5, right: 20, left: -25, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6b7280' }} />
                                <YAxis domain={['dataMin - 100', 'dataMax + 100']} tick={{ fontSize: 10, fill: '#6b7280' }} orientation="right" />
                                <Tooltip content={<CustomTooltip chartType="Line" />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
                                <Line type="monotone" dataKey="close" stroke="#16a34a" strokeWidth={2} dot={false} name="Price"/>
                                <Brush dataKey="date" height={30} stroke="#e5e7eb" fill="#f9fafb" travellerWidth={15} />
                            </LineChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export const MarketScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'FUTURES' | 'OPTIONS'>('FUTURES');
    const [searchQuery, setSearchQuery] = useState('');
    const [isChartModalOpen, setIsChartModalOpen] = useState(false);
    const [selectedMarketItem, setSelectedMarketItem] = useState<MarketData | null>(null);
    const [isLive, setIsLive] = useState(true);

    const [tickerData, setTickerData] = useState<TickerData[]>([]);
    const [marketData, setMarketData] = useState<MarketData[]>([]);
    const [priceChanges, setPriceChanges] = useState<Record<string, 'up' | 'down'>>({});
    const prevMarketDataRef = useRef<MarketData[]>([]);

    useEffect(() => {
        if (isLive) {
            marketDataService.startRealtimeUpdates((newTickerData, newMarketData) => {
                const changes: Record<string, 'up' | 'down'> = {};
                newMarketData.forEach((newItem) => {
                    const oldItem = prevMarketDataRef.current.find(p => p.symbol === newItem.symbol && p.expiryDate === newItem.expiryDate);
                    if (oldItem) {
                        const key = `${newItem.symbol}-${newItem.expiryDate}`;
                        if (newItem.ltp > oldItem.ltp) {
                            changes[key] = 'up';
                        } else if (newItem.ltp < oldItem.ltp) {
                            changes[key] = 'down';
                        }
                    }
                });
    
                setTickerData(newTickerData);
                setMarketData(newMarketData);
                setPriceChanges(changes);
                prevMarketDataRef.current = newMarketData;
    
                setTimeout(() => setPriceChanges({}), 500);
            });
        } else {
            marketDataService.stopRealtimeUpdates();
        }

        return () => {
            marketDataService.stopRealtimeUpdates();
        };
    }, [isLive]);

    useEffect(() => {
        const { tickerData: initialTicker, marketData: initialMarket } = marketDataService.getInitialData();
        setTickerData(initialTicker);
        setMarketData(initialMarket);
        prevMarketDataRef.current = initialMarket;
    }, []);


    const handleOpenChart = (item: MarketData) => {
        setSelectedMarketItem(item);
        setIsChartModalOpen(true);
    };

    const handleCloseChart = () => {
        setIsChartModalOpen(false);
        setSelectedMarketItem(null);
    };

    const filteredData = useMemo(() => {
        if (!searchQuery) return marketData;
        return marketData.filter(item =>
            item.productName.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, marketData]);

    const TableRow: React.FC<{ item: MarketData }> = ({ item }) => {
        const isChangePositive = item.change >= 0;
        const priceChangeKey = `${item.symbol}-${item.expiryDate}`;
        const changeStatus = priceChanges[priceChangeKey];
        const flashClass = changeStatus === 'up' ? 'bg-green-100' : changeStatus === 'down' ? 'bg-red-100' : '';

        return (
            <tr className={`border-b border-gray-200 hover:bg-gray-50 text-sm transition-colors duration-500 ${flashClass}`}>
                <td className="p-2 font-semibold text-primary sticky left-0 bg-white hover:bg-gray-50 z-10">
                    <p>{item.productName}</p>
                    <p className="text-xs text-text-secondary font-normal">{item.expiryDate}</p>
                </td>
                <td className="p-2 text-right">{item.open.toFixed(2)}</td>
                <td className="p-2 text-right">{item.low.toFixed(2)}</td>
                <td className="p-2 text-right font-bold">{item.ltp.toFixed(2)}</td>
                <td className="p-2 text-right">{item.high.toFixed(2)}</td>
                <td className="p-2 text-right">{item.close.toFixed(2)}</td>
                <td className={`p-2 text-right font-semibold ${isChangePositive ? 'text-green-600' : 'text-red-600'}`}>
                    {item.change.toFixed(2)}
                </td>
                <td className={`p-2 text-right font-semibold ${isChangePositive ? 'text-green-600' : 'text-red-600'}`}>
                    {item.changePercent.toFixed(2)}
                </td>
                <td className="p-2 text-right">{item.atp.toFixed(2)}</td>
                <td className="p-2 text-right">{item.spotPrice.toFixed(2)}</td>
                <td className="p-2 text-center text-xs text-text-secondary whitespace-pre">{item.spotPriceDateTime.replace(' | ', '\n')}</td>
                <td className="p-2 text-right">{item.bestBuy?.toFixed(2) || '-'}</td>
                <td className="p-2 text-right">{item.bestSell?.toFixed(2) || '-'}</td>
                <td className="p-2 text-right font-bold">{item.oi.toLocaleString()}</td>
                <td className="p-2 text-center sticky right-0 bg-white hover:bg-gray-50 z-10">
                    <button onClick={() => handleOpenChart(item)} className="text-text-secondary hover:text-primary">
                        <Eye size={18} />
                    </button>
                </td>
            </tr>
        );
    };

    return (
        <div className="space-y-4">
            <style>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .scrolling-wrapper {
                    display: flex;
                    width: fit-content;
                    animation: scroll 40s linear infinite;
                }
                .ticker-container:hover .scrolling-wrapper {
                    animation-play-state: paused;
                }
            `}</style>
             <div className="bg-white rounded-lg shadow-sm -mx-4 -mt-4 ticker-container overflow-hidden">
                <div className="scrolling-wrapper">
                    {[...tickerData, ...tickerData].map((item, index) => <Ticker key={`${item.symbol}-${item.expiry}-${index}`} item={item} />)}
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <button
                    onClick={() => setActiveTab('FUTURES')}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg ${activeTab === 'FUTURES' ? 'bg-white shadow text-primary' : 'bg-transparent text-text-secondary'}`}
                >
                    FUTURES
                </button>
                <button
                    onClick={() => setActiveTab('OPTIONS')}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg ${activeTab === 'OPTIONS' ? 'bg-white shadow text-primary' : 'bg-transparent text-text-secondary'}`}
                >
                    OPTIONS
                </button>
            </div>

            <div className="flex justify-between items-center gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search commodity..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                 <button 
                    onClick={() => setIsLive(!isLive)}
                    className={`flex items-center space-x-2 px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${isLive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                >
                    {isLive ? <Power size={14}/> : <PowerOff size={14}/>}
                    <span>{isLive ? 'LIVE' : 'OFFLINE'}</span>
                 </button>
            </div>
            
            {activeTab === 'FUTURES' ? (
                <div className="w-full overflow-x-auto bg-card rounded-lg shadow-md">
                    <table className="w-full whitespace-nowrap text-left">
                        <thead className="bg-gray-100 text-xs text-text-secondary uppercase">
                            <tr>
                                <th className="p-2 font-semibold sticky left-0 bg-gray-100 z-20">Product Name/Symbol</th>
                                <th className="p-2 font-semibold text-right">Open</th>
                                <th className="p-2 font-semibold text-right">Low</th>
                                <th className="p-2 font-semibold text-right">LTP</th>
                                <th className="p-2 font-semibold text-right">High</th>
                                <th className="p-2 font-semibold text-right">Close</th>
                                <th className="p-2 font-semibold text-right">Change</th>
                                <th className="p-2 font-semibold text-right">Change(%)</th>
                                <th className="p-2 font-semibold text-right">ATP</th>
                                <th className="p-2 font-semibold text-right">Spot Price</th>
                                <th className="p-2 font-semibold text-center">Spot Price Date|Time</th>
                                <th className="p-2 font-semibold text-right">Best Buy</th>
                                <th className="p-2 font-semibold text-right">Best Sell</th>
                                <th className="p-2 font-semibold text-right">OI</th>
                                <th className="p-2 font-semibold text-center sticky right-0 bg-gray-100 z-20">Charts</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item, index) => <TableRow key={`${item.symbol}-${item.expiryDate}-${index}`} item={item} />)}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center p-8 bg-card rounded-lg shadow-md">
                    <p className="text-text-secondary">Options data is not available yet.</p>
                </div>
            )}
            {isChartModalOpen && selectedMarketItem && (
                <ChartModal item={selectedMarketItem} onClose={handleCloseChart} />
            )}
        </div>
    );
};