import { Commodity, Contract, Alert, LearningModule, ForecastDataPoint, CandleStickDataPoint, MarketMover } from './types';
import { Tractor, Users, Landmark, HeartHandshake } from 'lucide-react';

export const LANGUAGES = ['English', 'हिन्दी', 'मराठी', 'తెలుగు', 'தமிழ்'];
export const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", 
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", 
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", 
    "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadwee", "Puducherry"
];

export const USER_ROLES = [
  { name: 'Farmer', icon: Tractor },
  { name: 'FPO', icon: Users },
  { name: 'Ministry', icon: Landmark },
  { name: 'NGO', icon: HeartHandshake },
];


export const COMMODITIES: Commodity[] = [
    'Soybean', 
    'Mustard Seed', 
    'Groundnut', 
    'Sunflower Seed',
    'Castor Seed', 
    'Cotton Seed', 
    'Kusum Seed', 
    'Linseed', 
    'Neem Seed', 
    'Nigar Seed', 
    'Peanut Kernel', 
    'Pongam Seed', 
    'Rapeseed', 
    'Sal Seed', 
    'Sesame Seed',
];

export const MOCK_PRICES: Record<Commodity, number> = {
  Soybean: 4250,
  Groundnut: 6500,
  'Sunflower Seed': 5200,
  'Mustard Seed': 5800,
  'Peanut Kernel': 6500,
  'Castor Seed': 6700,
  'Cotton Seed': 2850,
  'Kusum Seed': 7200,
  'Linseed': 5500,
  'Neem Seed': 2300,
  'Nigar Seed': 9000,
  'Pongam Seed': 3500,
  'Rapeseed': 5900,
  'Sal Seed': 1200,
  'Sesame Seed': 12500,
};

export const MOCK_CONTRACTS: Contract[] = [
  {
    id: 'C001',
    crop: 'Soybean',
    quantity: 5,
    priceLocked: 4250,
    currentPrice: 4300,
    hedgeType: 'Long',
    expiryDate: '2024-08-15',
    status: 'Active',
    pnl: 250,
    contractHash: '0xABCD1234567890ABCDEF1234567890ABCDEF1234'
  },
  {
    id: 'C002',
    crop: 'Mustard Seed',
    quantity: 3,
    priceLocked: 5700,
    currentPrice: 5500,
    hedgeType: 'Short',
    expiryDate: '2024-07-20',
    status: 'Settled',
    pnl: -600,
    contractHash: '0xBCDE234567890ABCDEF1234567890ABCDEF12345'
  },
  {
    id: 'C003',
    crop: 'Groundnut',
    quantity: 10,
    priceLocked: 6500,
    currentPrice: 6650,
    hedgeType: 'Long',
    expiryDate: '2024-09-01',
    status: 'Active',
    pnl: 1500,
    contractHash: '0xEFGH34567890ABCDEF1234567890ABCDEF123456'
  },
  {
    id: 'C004',
    crop: 'Sunflower Seed',
    quantity: 8,
    priceLocked: 5300,
    currentPrice: 5200,
    hedgeType: 'Short',
    expiryDate: '2024-08-25',
    status: 'Active',
    pnl: 800,
    contractHash: '0xGHIJ4567890ABCDEF1234567890ABCDEF1234567'
  }
];

export const MOCK_ALERTS: Alert[] = [
    { id: 'A01', commodity: 'Mustard Seed', title: 'Mustard HOI-X > 80', description: 'High hedging opportunity detected. Consider placing a short hedge.', date: '2024-07-28' },
    { id: 'A02', commodity: 'Soybean', title: 'Soybean Expected Drop 5%', description: 'AI predicts a significant price drop in the next week due to favorable weather.', date: '2024-07-27' },
];

export const MOCK_LEARNING_MODULES: LearningModule[] = [
    { id: 'L01', title: 'What is Hedging?', type: 'Video', status: 'Completed' },
    { id: 'L02', title: 'Futures vs Forwards', type: 'Infographic', status: 'Start' },
    { id: 'L03', title: 'Using AgriSure for Trading', type: 'Audio + Quiz', status: 'Locked' },
    { id: 'L04', title: 'Understanding Market Volatility', type: 'Video', status: 'Start' },
    { id: 'L05', title: 'Risk Management Strategies', type: 'Audio + Quiz', status: 'Locked' },
    { id: 'L06', title: 'How to Read Price Charts', type: 'Infographic', status: 'Locked' },
];

export const MOCK_TOP_GAINERS_FUTURES: MarketMover[] = [
    { contract: "Rapeseed - Dec25", ltp: 5980.00, changePercent: 1.51 },
    { contract: "Mustard Seed - May26", ltp: 5854.00, changePercent: 0.77 },
    { contract: "Soybean - Nov25", ltp: 4395.00, changePercent: 0.67 },
    { contract: "Groundnut - Nov25", ltp: 6532.00, changePercent: 0.17 },
];

export const MOCK_TOP_LOSERS_FUTURES: MarketMover[] = [
    { contract: "Cotton Seed - Dec25", ltp: 2860.00, changePercent: -1.21 },
    { contract: "Castor Seed - Nov25", ltp: 6750.00, changePercent: -0.85 },
    { contract: "Soybean - Dec25", ltp: 4230.00, changePercent: -0.47 },
];

export const MOCK_TOP_GAINERS_OPTIONS: MarketMover[] = [
    { contract: "Soybean Call - Nov25", ltp: 35.50, changePercent: 25.32 },
    { contract: "Mustard Seed Call - Nov25", ltp: 102.00, changePercent: 18.11 },
];

export const MOCK_TOP_LOSERS_OPTIONS: MarketMover[] = [
    { contract: "Soybean Put - Oct25", ltp: 21.00, changePercent: -56.25 },
    { contract: "Mustard Seed Put - Oct25", ltp: 65.50, changePercent: -30.32 },
    { contract: "Rapeseed Put - Oct25", ltp: 70.50, changePercent: -29.15 },
    { contract: "Groundnut Put - Oct25", ltp: 4.00, changePercent: -11.11 },
];

export const MOCK_AGRI_NEWS: string[] = [
    "Soybean MSP raised by 3% for the upcoming Kharif season.",
    "Favorable monsoon forecasts boost crop yield predictions across central India.",
    "Global demand for soybean oil expected to surge in Q4.",
    "New government subsidy announced for drip irrigation systems.",
    "Mustard seed futures hit a 3-month high on strong export demand.",
    "Agri-tech startups receive record funding in the latest quarter.",
    "Weather patterns in South America could impact global oilseed supply chain.",
    "Report shows a 5% increase in domestic consumption of sunflower oil.",
    "Warehousing capacity for oilseeds increased by 10% in key states.",
    "New trade agreement opens up European markets for Indian rapeseed."
];


export const generateForecastData = (days: number, basePrice: number): ForecastDataPoint[] => {
    const data: ForecastDataPoint[] = [];
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - Math.min(days, 7)); // Start with some historical data

    for (let i = 0; i < days + 7; i++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const fluctuation = (Math.random() - 0.45) * (basePrice * 0.02);
        const newPrice = data.length > 0 ? data[data.length - 1].predicted + fluctuation : basePrice + fluctuation;
        
        data.push({
            date: dateStr,
            predicted: Math.round(newPrice),
            actual: i < 7 ? Math.round(newPrice + (Math.random() - 0.5) * (basePrice * 0.01)) : null,
        });
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return data;
};

export const generateCandlestickData = (days: number, basePrice: number): CandleStickDataPoint[] => {
    const data: CandleStickDataPoint[] = [];
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - days);
    
    let lastClose = basePrice;

    for (let i = 0; i < days; i++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const open = lastClose + (Math.random() - 0.5) * 20;
        const close = open + (Math.random() - 0.5) * 50;
        const high = Math.max(open, close) + Math.random() * 30;
        const low = Math.min(open, close) - Math.random() * 30;
        
        data.push({
            date: dateStr,
            open: Math.round(open),
            high: Math.round(high),
            low: Math.round(low),
            close: Math.round(close),
        });
        lastClose = close;
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return data;
};