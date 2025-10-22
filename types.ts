
export type Commodity = 'Soybean' | 'Groundnut' | 'Sunflower Seed' | 'Castor Seed' | 'Cotton Seed' | 'Kusum Seed' | 'Linseed' | 'Mustard Seed' | 'Neem Seed' | 'Nigar Seed' | 'Peanut Kernel' | 'Pongam Seed' | 'Rapeseed' | 'Sal Seed' | 'Sesame Seed';

export type ContractStatus = 'Active' | 'Settled' | 'Expired';

export type HedgeType = 'Long' | 'Short';

export interface Contract {
  id: string;
  crop: Commodity;
  quantity: number; // in quintals
  priceLocked: number;
  currentPrice: number;
  hedgeType: HedgeType;
  expiryDate: string;
  status: ContractStatus;
  pnl: number;
  contractHash: string;
}

export interface Alert {
  id: string;
  commodity: Commodity;
  title: string;
  description: string;
  date: string;
}

export type LearningModuleType = 'Video' | 'Infographic' | 'Audio + Quiz';
export type LearningModuleStatus = 'Completed' | 'Start' | 'Locked';

export interface LearningModule {
  id: string;
  title: string;
  type: LearningModuleType;
  status: LearningModuleStatus;
}

export interface ForecastDataPoint {
  date: string;
  predicted: number;
  actual: number | null;
}

export interface CandleStickDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface TickerData {
  symbol: string;
  expiry?: string;
  price: number;
  changePercent: number;
}

export interface MarketData {
  productName: string;
  symbol: string;
  expiryDate: string;
  open: number;
  low: number;
  ltp: number;
  high: number;
  close: number;
  change: number;
  changePercent: number;
  atp: number;
  spotPrice: number;
  spotPriceDateTime: string;
  bestBuy: number | null;
  bestSell: number | null;
  oi: number;
}

export interface MarketMover {
  contract: string;
  ltp: number;
  changePercent: number;
}