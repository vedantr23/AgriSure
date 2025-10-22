
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_CONTRACTS } from '../constants';
import { Contract, ContractStatus } from '../types';

const ContractCard: React.FC<{ contract: Contract }> = ({ contract }) => {
    const navigate = useNavigate();
    const isProfit = contract.pnl >= 0;
    const statusColor = {
        Active: 'bg-blue-100 text-blue-800',
        Settled: 'bg-green-100 text-green-800',
        Expired: 'bg-gray-100 text-gray-800',
    };

    return (
        <div 
            className="bg-card rounded-lg shadow-md p-4 space-y-3 cursor-pointer"
            onClick={() => navigate(`/contract/${contract.id}`)}
        >
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg">{contract.crop}</h3>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor[contract.status]}`}>
                        {contract.status}
                    </span>
                </div>
                <div className={`text-right ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                    <div className="font-bold text-lg">{isProfit ? '+' : ''}₹{contract.pnl.toLocaleString()}</div>
                    <div className="text-xs">P&L</div>
                </div>
            </div>
            <div className="grid grid-cols-3 text-center text-sm border-t pt-2">
                <div>
                    <div className="text-text-secondary">Quantity</div>
                    <div className="font-semibold">{contract.quantity} q</div>
                </div>
                <div>
                    <div className="text-text-secondary">Locked Price</div>
                    <div className="font-semibold">₹{contract.priceLocked.toLocaleString()}</div>
                </div>
                <div>
                    <div className="text-text-secondary">Current Price</div>
                    <div className="font-semibold">₹{contract.currentPrice.toLocaleString()}</div>
                </div>
            </div>
        </div>
    );
};

export const PortfolioScreen: React.FC = () => {
    const [filter, setFilter] = useState<ContractStatus | 'All'>('All');
    
    const filteredContracts = MOCK_CONTRACTS.filter(c => filter === 'All' || c.status === filter);

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">My Contracts</h2>
            
            <div className="flex justify-center bg-gray-200 rounded-lg p-1">
                {(['All', 'Active', 'Settled', 'Expired'] as const).map(f => (
                    <button 
                        key={f} 
                        onClick={() => setFilter(f)} 
                        className={`w-1/4 py-2 text-sm font-semibold rounded-md transition-colors ${filter === f ? 'bg-white shadow text-primary' : 'text-text-secondary'}`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {filteredContracts.length > 0 ? (
                <div className="space-y-4">
                    {filteredContracts.map(contract => (
                        <ContractCard key={contract.id} contract={contract} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-text-secondary mt-8">No contracts found for this filter.</p>
            )}
        </div>
    );
};
