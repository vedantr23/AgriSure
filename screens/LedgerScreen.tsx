
import React, { useState, useEffect } from 'react';
import { MOCK_CONTRACTS } from '../constants';
import { Contract } from '../types';
import { ShieldCheck, FileDown, Hash, X, CheckCircle, FileText } from 'lucide-react';

const VerificationAnimation: React.FC = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <style>{`
            @keyframes scale-in {
                0% { transform: scale(0.5); opacity: 0; }
                100% { transform: scale(1); opacity: 1; }
            }
            .animate-scale-in { animation: scale-in 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }
        `}</style>
        <div className="animate-scale-in">
            <CheckCircle className="text-green-500" size={128} strokeWidth={1.5} />
        </div>
    </div>
);

const VerificationModal: React.FC<{ contract: Contract; onClose: () => void }> = ({ contract, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg mx-auto animate-scale-in" style={{ animationName: 'scale-in', animationDuration: '0.3s' }}>
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                             <h2 className="text-xl font-bold text-primary">Hash Verification View</h2>
                             <p className="text-sm text-text-secondary">Ensuring transparent, tamper-proof trade records.</p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X size={24}/></button>
                    </div>

                    <div className="bg-green-50 border-l-4 border-green-500 text-green-800 p-4 rounded-md my-4">
                        <div className="flex">
                            <div className="py-1"><ShieldCheck className="h-6 w-6 text-green-500 mr-3"/></div>
                            <div>
                                <p className="font-bold">Hash Verified</p>
                                <p className="text-sm">This contract's integrity is confirmed on the ledger.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-2 text-sm border-t border-b py-4">
                        <p className="font-semibold text-text-secondary">Auto-generated forward e-contract</p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                            <p><strong>Contract ID:</strong> {contract.id}</p>
                            <p><strong>Type:</strong> <span className={contract.hedgeType === 'Long' ? 'font-bold text-green-600' : 'font-bold text-red-600'}>{contract.hedgeType === 'Long' ? 'BUY' : 'SELL'}</span></p>
                            <p><strong>Crop:</strong> {contract.crop}</p>
                            <p><strong>Quantity:</strong> {contract.quantity} q</p>
                            <p><strong>Locked Price:</strong> ₹{contract.priceLocked.toLocaleString()}/q</p>
                            <p><strong>Expiry:</strong> {contract.expiryDate}</p>
                            <p><strong>Status:</strong> {contract.status}</p>
                        </div>
                        <div className="pt-2">
                             <p><strong>Blockchain Hash:</strong></p>
                             <p className="text-xs text-gray-600 break-all bg-gray-100 p-2 rounded mt-1 font-mono">{contract.contractHash}</p>
                        </div>
                    </div>

                    <div className="text-xs text-text-secondary mt-4 space-y-2">
                        <p><strong>Note:</strong> Smart Contract (simulated on Polygon testnet or JSON ledger).</p>
                        <p><strong>Context:</strong> Linked to IoT verification for settlement trigger.</p>
                    </div>

                </div>
                <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3 rounded-b-lg">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm font-semibold hover:bg-gray-300">Close</button>
                    <button className="flex items-center px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-dark">
                        <FileText size={16} className="mr-2"/>
                        Export contract PDF
                    </button>
                </div>
            </div>
        </div>
    );
};


const ContractLedgerCard: React.FC<{ contract: Contract; onVerify: (contract: Contract) => void }> = ({ contract, onVerify }) => {

  const handleExport = () => {
    alert(`Exporting PDF for Contract #${contract.id}...\n\n(This is a simulated action)`);
  };
  
  const hedgeTypeLabel = contract.hedgeType === 'Long' ? 'BUY' : 'SELL';
  const hedgeTypeColor = hedgeTypeLabel === 'BUY' ? 'text-green-600' : 'text-red-600';

  return (
    <div className="bg-card rounded-lg shadow-md p-4 space-y-3 border-l-4 border-primary">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg">{contract.crop}</h3>
          <p className="text-xs text-text-secondary">Contract ID: {contract.id}</p>
        </div>
        <div className={`text-right font-bold ${hedgeTypeColor}`}>
          {hedgeTypeLabel}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div><span className="text-text-secondary">Quantity:</span> <span className="font-semibold">{contract.quantity} q</span></div>
        <div><span className="text-text-secondary">Locked Price:</span> <span className="font-semibold">₹{contract.priceLocked.toLocaleString()}/q</span></div>
        <div><span className="text-text-secondary">Expiry:</span> <span className="font-semibold">{contract.expiryDate}</span></div>
        <div><span className="text-text-secondary">Status:</span> <span className="font-semibold">{contract.status}</span></div>
      </div>
      
      <div className="pt-3 border-t">
        <h4 className="text-sm font-semibold text-text-secondary mb-1 flex items-center">
            <Hash size={14} className="mr-1.5"/> Blockchain Hash
        </h4>
        <p className="text-xs text-gray-600 bg-gray-100 p-2 rounded break-all">{contract.contractHash}</p>
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        <button onClick={() => onVerify(contract)} className="flex items-center px-3 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
          <ShieldCheck size={16} className="mr-1.5" />
          Verify Hash
        </button>
        <button onClick={handleExport} className="flex items-center px-3 py-1.5 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
          <FileDown size={16} className="mr-1.5" />
          Export PDF
        </button>
      </div>
    </div>
  );
};

export const LedgerScreen: React.FC = () => {
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let timer: number;
    if (showAnimation) {
      // Set a timer to hide animation and show modal
      timer = window.setTimeout(() => {
        setShowAnimation(false);
        setIsModalOpen(true);
      }, 4000); // 4 seconds
    }
    // Cleanup timer on component unmount or if effect re-runs
    return () => clearTimeout(timer);
  }, [showAnimation]);
  
  const handleStartVerification = (contract: Contract) => {
    setSelectedContract(contract);
    setShowAnimation(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContract(null);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">E-Contract & Blockchain Ledger</h2>
      <p className="text-sm text-text-secondary">
        Ensuring transparent, tamper-proof trade records through a simulated ledger.
      </p>
      <div className="space-y-4">
        {MOCK_CONTRACTS.map(contract => (
          <ContractLedgerCard 
            key={contract.id} 
            contract={contract} 
            onVerify={handleStartVerification} 
          />
        ))}
      </div>
      
      {showAnimation && <VerificationAnimation />}
      
      {isModalOpen && selectedContract && (
        <VerificationModal contract={selectedContract} onClose={handleCloseModal} />
      )}
    </div>
  );
};
