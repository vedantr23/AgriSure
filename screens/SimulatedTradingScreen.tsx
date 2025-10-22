
import React, { useState } from 'react';
import { Commodity } from '../types';
import { COMMODITIES, MOCK_PRICES } from '../constants';
import { TrendingUp, TrendingDown, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SimulatedTradingScreen: React.FC = () => {
    const navigate = useNavigate();
    const [crop, setCrop] = useState<Commodity>('Soybean');
    const [quantity, setQuantity] = useState<number>(10);
    const [duration, setDuration] = useState<number>(7);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [hedgeType, setHedgeType] = useState<'BUY' | 'SHORT'>('BUY');

    const currentPrice = MOCK_PRICES[crop];
    // Consistent mock prediction for a better user experience during a session
    const predictedPrice = React.useMemo(() => currentPrice + (Math.random() - 0.4) * (currentPrice * 0.05), [crop, currentPrice]);
    const expectedGainLoss = (predictedPrice - currentPrice) * quantity;

    const handleHedge = (type: 'BUY' | 'SHORT') => {
        setHedgeType(type);
        setShowConfirmModal(true);
    };

    const confirmHedge = () => {
        setShowConfirmModal(false);
        setShowSuccessModal(true);
    };

    const closeSuccessModal = () => {
        setShowSuccessModal(false);
        // Reset form for next practice trade
        setQuantity(10);
        setDuration(7);
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Simulated Trading Module</h2>
            <div className="bg-card rounded-xl shadow-md p-6 space-y-4">
                <p className="text-sm text-text-secondary -mt-2">Practice hedging without using real money to understand risk management.</p>
                <div>
                    <label htmlFor="crop" className="block text-sm font-medium text-text-secondary mb-1">Crop</label>
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
                    <div className="flex justify-between"><span>Current Market Price:</span> <span className="font-semibold">₹{currentPrice.toLocaleString()}/q</span></div>
                    <div className="flex justify-between"><span>Predicted Price:</span> <span className="font-semibold">₹{predictedPrice.toFixed(2)}/q</span></div>
                    <div className="flex justify-between font-bold text-lg">
                        <span>Expected Gain/Loss:</span>
                        <span className={expectedGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}>
                             {hedgeType === 'BUY' ? (expectedGainLoss >= 0 ? '+' : '-') : (expectedGainLoss >= 0 ? '-' : '+')}₹{Math.abs(expectedGainLoss).toFixed(2)}
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                    <button onClick={() => handleHedge('BUY')} className="flex items-center justify-center bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-colors">
                        <TrendingUp size={18} className="mr-2" /> BUY Hedge
                    </button>
                    <button onClick={() => handleHedge('SHORT')} className="flex items-center justify-center bg-red-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-600 transition-colors">
                        <TrendingDown size={18} className="mr-2" /> SELL Hedge
                    </button>
                </div>
            </div>

            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-20">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
                        <h3 className="text-lg font-bold mb-4">Confirm Hedge Simulation</h3>
                        <p className="text-sm text-text-secondary mb-4">
                            You are about to simulate a <span className="font-bold">{hedgeType === 'BUY' ? 'BUY (Long)' : 'SELL (Short)'}</span> hedge for <span className="font-bold">{quantity} q</span> of <span className="font-bold">{crop}</span> at <span className="font-bold">₹{currentPrice.toLocaleString()}/q</span> for <span className="font-bold">{duration} days</span>.
                        </p>
                        <div className="flex justify-end space-x-2">
                            <button onClick={() => setShowConfirmModal(false)} className="px-4 py-2 bg-gray-200 rounded-md text-sm font-semibold">Cancel</button>
                            <button onClick={confirmHedge} className="px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold">Confirm</button>
                        </div>
                    </div>
                </div>
            )}
            
            {showSuccessModal && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-20">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm text-center">
                        <CheckCircle className="text-green-500 mx-auto" size={48} />
                        <h3 className="text-lg font-bold my-3">Hedge Placed Successfully</h3>
                        <p className="text-sm text-text-secondary mb-4">
                            “You hedged {quantity} quintals of {crop} at ₹{currentPrice.toLocaleString()}/q for {duration} days.”
                        </p>
                        <button onClick={closeSuccessModal} className="w-full px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold">Practice Again</button>
                    </div>
                </div>
            )}
        </div>
    );
};
