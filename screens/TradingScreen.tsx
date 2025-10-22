
import React, { useState, useEffect } from 'react';
import { Commodity } from '../types';
import { COMMODITIES, MOCK_PRICES } from '../constants';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TradingScreen: React.FC = () => {
    const navigate = useNavigate();
    const [crop, setCrop] = useState<Commodity>('Soybean');
    const [quantity, setQuantity] = useState<number>(1);
    const [duration, setDuration] = useState<number>(15);
    const [showModal, setShowModal] = useState(false);
    const [hedgeType, setHedgeType] = useState<'BUY' | 'SHORT'>('BUY');

    const currentPrice = MOCK_PRICES[crop];
    const predictedPrice = currentPrice + (Math.random() - 0.4) * 200; // Mock prediction
    const expectedGainLoss = (predictedPrice - currentPrice) * quantity * (hedgeType === 'BUY' ? 1 : -1);

    const handleHedge = (type: 'BUY' | 'SHORT') => {
        setHedgeType(type);
        setShowModal(true);
    };

    const confirmHedge = () => {
        setShowModal(false);
        alert('Hedge contract successfully created! (Simulated)');
        // In a real app, you'd add the contract to a global state/DB
        // and then navigate to the new contract's detail page.
        navigate('/portfolio');
    };

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Simulated Trading</h2>
            <div className="bg-card rounded-xl shadow-md p-6 space-y-4">
                <div>
                    <label htmlFor="crop" className="block text-sm font-medium text-text-secondary mb-1">Select Crop</label>
                    <select id="crop" value={crop} onChange={(e) => setCrop(e.target.value as Commodity)} className="w-full p-2 border border-gray-300 rounded-md">
                        {COMMODITIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-text-secondary mb-1">Quantity (quintals)</label>
                        <input type="number" id="quantity" value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))} className="w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label htmlFor="duration" className="block text-sm font-medium text-text-secondary mb-1">Duration (days)</label>
                        <select id="duration" value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full p-2 border border-gray-300 rounded-md">
                            <option>7</option>
                            <option>15</option>
                            <option>30</option>
                        </select>
                    </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                    <div className="flex justify-between"><span>Current Price:</span> <span className="font-semibold">₹{currentPrice.toLocaleString()}/q</span></div>
                    <div className="flex justify-between"><span>AI Predicted Price:</span> <span className="font-semibold">₹{predictedPrice.toFixed(2)}/q</span></div>
                    <div className="flex justify-between font-bold text-lg">
                        <span>Expected P/L:</span>
                        <span className={expectedGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {expectedGainLoss >= 0 ? '+' : ''}₹{expectedGainLoss.toFixed(2)}
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                    <button onClick={() => handleHedge('BUY')} className="flex items-center justify-center bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-colors">
                        <TrendingUp size={18} className="mr-2" /> BUY Hedge (Long)
                    </button>
                    <button onClick={() => handleHedge('SHORT')} className="flex items-center justify-center bg-red-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-600 transition-colors">
                        <TrendingDown size={18} className="mr-2" /> SHORT Hedge (Sell)
                    </button>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-20">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
                        <h3 className="text-lg font-bold mb-4">Confirm Hedge</h3>
                        <p className="text-sm text-text-secondary mb-4">
                            You are about to {hedgeType === 'BUY' ? 'BUY (Long)' : 'SHORT (Sell)'} a hedge for <span className="font-bold">{quantity} q</span> of <span className="font-bold">{crop}</span> at <span className="font-bold">₹{currentPrice.toLocaleString()}/q</span> for <span className="font-bold">{duration} days</span>.
                        </p>
                        <div className="flex justify-end space-x-2">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 rounded-md text-sm font-semibold">Cancel</button>
                            <button onClick={confirmHedge} className="px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold">Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
