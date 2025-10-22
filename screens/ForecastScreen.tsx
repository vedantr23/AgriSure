
import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, ComposedChart, Bar } from 'recharts';
import { Commodity, ForecastDataPoint, CandleStickDataPoint } from '../types';
import { COMMODITIES, MOCK_PRICES, generateForecastData, generateCandlestickData } from '../constants';
import { getAIForecastSummary } from '../services/geminiService';

type ChartType = 'Line' | 'Candlestick';
type ForecastPeriod = 7 | 15 | 30;

const CustomCandle = (props: any) => {
    const { x, y, width, height, payload } = props;
    const { open, high, low, close } = payload;
    
    if (high === low || high === undefined) return null;

    const isRising = close >= open;
    const color = isRising ? '#16a34a' : '#ef4444'; // green-600, red-500
    const wickX = x + width / 2;

    // Use height (pixel range of high-low) to calculate scaling ratio
    const yRatio = height / (high - low);
    const bodyTopY = y + (high - Math.max(open, close)) * yRatio;
    const bodyHeight = Math.abs(open - close) * yRatio;

    return (
        <g stroke={color} fill={color} strokeWidth={1}>
            {/* Wick */}
            <line x1={wickX} y1={y} x2={wickX} y2={y + height} />
            {/* Body */}
            <rect x={x} y={bodyTopY} width={width} height={Math.max(bodyHeight, 1)} />
        </g>
    );
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const isCandle = data.open !== undefined;
        return (
            <div className="bg-white p-2 border border-gray-300 rounded shadow-md text-sm">
                <p className="font-bold">{label}</p>
                {isCandle ? (
                    <>
                        <p>Open: <span className="font-semibold">{data.open}</span></p>
                        <p>High: <span className="font-semibold">{data.high}</span></p>
                        <p>Low: <span className="font-semibold">{data.low}</span></p>
                        <p>Close: <span className="font-semibold">{data.close}</span></p>
                    </>
                ) : (
                    <>
                       {payload.map((pld: any) => (
                           <div key={pld.dataKey} style={{ color: pld.color }}>
                               {`${pld.name}: ${pld.value}`}
                           </div>
                       ))}
                    </>
                )}
            </div>
        );
    }
    return null;
};

export const ForecastScreen: React.FC = () => {
    const [commodity, setCommodity] = useState<Commodity>('Soybean');
    const [period, setPeriod] = useState<ForecastPeriod>(7);
    const [chartType, setChartType] = useState<ChartType>('Line');
    const [forecastData, setForecastData] = useState<ForecastDataPoint[]>([]);
    const [candlestickData, setCandlestickData] = useState<CandleStickDataPoint[]>([]);
    const [aiSummary, setAiSummary] = useState('');
    
    const fetchChartData = useCallback(() => {
        const lineData = generateForecastData(period, MOCK_PRICES[commodity] || 5000);
        setForecastData(lineData);

        const candleData = generateCandlestickData(period, MOCK_PRICES[commodity] || 5000);
        setCandlestickData(candleData);
    }, [commodity, period]);
    
    const fetchAISummary = useCallback(async () => {
        try {
            const summary = await getAIForecastSummary(commodity, period);
            setAiSummary(summary);
        } catch (error)
{
            console.error("Failed to fetch AI summary:", error);
            setAiSummary("Could not load AI summary at this time.");
        }
    }, [commodity, period]);

    useEffect(() => {
        fetchChartData();
        fetchAISummary();
    }, [fetchChartData, fetchAISummary]);
    
    return (
        <div className="space-y-4">
            <div className="bg-card p-4 rounded-xl shadow-md">
                <label htmlFor="commodity" className="block text-sm font-medium text-text-secondary mb-1">Select Commodity</label>
                <select 
                    id="commodity"
                    value={commodity}
                    onChange={(e) => setCommodity(e.target.value as Commodity)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    {COMMODITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            <div className="flex justify-center bg-gray-200 rounded-lg p-1">
                {[7, 15, 30].map(p => (
                    <button key={p} onClick={() => setPeriod(p as ForecastPeriod)} className={`w-1/3 py-2 text-sm font-semibold rounded-md transition-colors ${period === p ? 'bg-white shadow text-primary' : 'text-text-secondary'}`}>
                        {p}-Day
                    </button>
                ))}
            </div>

            <div className="bg-card p-4 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Price Forecast</h3>
                    <div className="flex border border-gray-300 rounded-md">
                        <button onClick={() => setChartType('Line')} className={`px-3 py-1 text-sm rounded-l-md ${chartType === 'Line' ? 'bg-primary text-white' : 'bg-white'}`}>Line</button>
                        <button onClick={() => setChartType('Candlestick')} className={`px-3 py-1 text-sm rounded-r-md ${chartType === 'Candlestick' ? 'bg-primary text-white' : 'bg-white'}`}>Candle</button>
                    </div>
                </div>
                <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer>
                        {chartType === 'Line' ? (
                        <LineChart data={forecastData} margin={{ top: 5, right: 20, left: -15, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                            <YAxis domain={['dataMin - 50', 'dataMax + 50']} tick={{ fontSize: 10 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line type="monotone" dataKey="actual" name="Actual" stroke="#f97316" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="predicted" name="Predicted" stroke="#16a34a" strokeWidth={2} strokeDasharray="5 5" />
                        </LineChart>
                        ) : (
                        <ComposedChart data={candlestickData} margin={{ top: 5, right: 20, left: -15, bottom: 5 }}>
                             <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                            <YAxis domain={['dataMin - 100', 'dataMax + 100']} tick={{ fontSize: 10 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            {/* FIX: Corrected the dataKey for the Bar component to be a function returning a range, resolving a TypeScript error. */}
                            <Bar dataKey={(item: CandleStickDataPoint) => [item.low, item.high]} name="Price Range (O-H-L-C)" shape={<CustomCandle />} isAnimationActive={false}/>
                        </ComposedChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </div>

             <div className="bg-card p-4 rounded-xl shadow-md">
                <h3 className="text-lg font-bold mb-2">AI Insights</h3>
                <p className="text-sm text-text-secondary italic">"{aiSummary}"</p>
            </div>
        </div>
    );
};
