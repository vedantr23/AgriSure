import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_CONTRACTS } from '../constants';
import { ArrowLeft, CheckCircle, Clock, Link as LinkIcon, Truck, Coins } from 'lucide-react';

const SettleAnimation: React.FC = () => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <style>{`
            @keyframes settle-scale-in {
                0% { transform: scale(0.7); opacity: 0; }
                100% { transform: scale(1); opacity: 1; }
            }
            .animate-settle-in { animation: settle-scale-in 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }
        `}</style>
        <div className="animate-settle-in text-center bg-white p-8 rounded-lg shadow-xl">
            <CheckCircle className="text-green-500 mx-auto" size={80} strokeWidth={1.5} />
            <p className="text-xl font-bold text-text-primary mt-4">Contract Settled Successfully</p>
        </div>
    </div>
);


export const ContractDetailScreen: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const contract = MOCK_CONTRACTS.find(c => c.id === id);
    const [showSettleAnimation, setShowSettleAnimation] = useState(false);

    useEffect(() => {
        if (showSettleAnimation) {
            const timer = setTimeout(() => {
                setShowSettleAnimation(false);
                // In a real app, you might navigate away or refetch data here
            }, 2000); // Animation disappears after 2 seconds
            return () => clearTimeout(timer);
        }
    }, [showSettleAnimation]);

    const handleSettleContract = () => {
        setShowSettleAnimation(true);
        // In a real app, you'd also send an API request to update the contract status.
    };

    if (!contract) {
        return <div className="text-center p-8">Contract not found.</div>;
    }

    const isProfit = contract.pnl >= 0;
    const statusInfo = {
        Active: { color: 'blue', icon: Clock },
        Settled: { color: 'green', icon: CheckCircle },
        Expired: { color: 'gray', icon: Clock },
    };
    const StatusIcon = statusInfo[contract.status].icon;

    return (
        <div className="space-y-4">
            {showSettleAnimation && <SettleAnimation />}

            <button onClick={() => navigate('/portfolio')} className="flex items-center text-primary font-semibold">
                <ArrowLeft size={18} className="mr-1" />
                Back to Portfolio
            </button>

            <div className="bg-card rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <div>
                        <h2 className="text-2xl font-bold">{contract.crop} Hedge</h2>
                        <span className={`inline-flex items-center text-${statusInfo[contract.status].color}-600`}>
                            <StatusIcon size={16} className="mr-1.5" />
                            {contract.status}
                        </span>
                    </div>
                    <div className={`text-right ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                        <div className="font-bold text-2xl">{isProfit ? '+' : ''}₹{contract.pnl.toLocaleString()}</div>
                        <div className="text-sm">Profit / Loss</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-text-secondary">Quantity:</span> <span className="font-semibold">{contract.quantity} quintals</span></div>
                    <div><span className="text-text-secondary">Hedge Type:</span> <span className="font-semibold">{contract.hedgeType}</span></div>
                    <div><span className="text-text-secondary">Locked Price:</span> <span className="font-semibold">₹{contract.priceLocked.toLocaleString()}/q</span></div>
                    <div><span className="text-text-secondary">Current Price:</span> <span className="font-semibold">₹{contract.currentPrice.toLocaleString()}/q</span></div>
                    <div><span className="text-text-secondary">Expiry Date:</span> <span className="font-semibold">{contract.expiryDate}</span></div>
                </div>

                <div className="mt-6 pt-4 border-t">
                    <h3 className="font-semibold mb-2">Contract Hash (Simulated)</h3>
                    <div className="flex items-center bg-gray-100 p-2 rounded-md">
                        <LinkIcon size={16} className="text-text-secondary mr-2" />
                        <p className="text-xs text-gray-700 break-all">{contract.contractHash}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button 
                    onClick={() => navigate(`/iot-verify/${contract.id}`)}
                    className="flex items-center justify-center bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
                    disabled={contract.status !== 'Active'}
                >
                    <Truck size={18} className="mr-2" /> Verify Stock (IoT)
                </button>
                <button 
                    onClick={handleSettleContract}
                    className="flex items-center justify-center bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400"
                    disabled={contract.status !== 'Active'}
                >
                    <Coins size={18} className="mr-2" /> Settle Contract
                </button>
            </div>
        </div>
    );
};