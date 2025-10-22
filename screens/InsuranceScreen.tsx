
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Shield, Check, Calculator, FileText, ChevronDown, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { COMMODITIES } from '../constants';
import { Commodity } from '../types';

const ConfirmationAnimation: React.FC = () => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <style>{`
            @keyframes confirm-scale-in {
                0% { transform: scale(0.7); opacity: 0; }
                100% { transform: scale(1); opacity: 1; }
            }
            .animate-confirm-in { animation: confirm-scale-in 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }
        `}</style>
        <div className="animate-confirm-in text-center">
            <CheckCircle className="text-green-500 mx-auto" size={128} strokeWidth={1.5} />
        </div>
    </div>
);


export const InsuranceScreen: React.FC = () => {
    const navigate = useNavigate();
    const [crop, setCrop] = useState<Commodity>('Soybean');
    const [sumInsured, setSumInsured] = useState(50000);
    const [premium, setPremium] = useState(0);
    const [isEligibilityOpen, setIsEligibilityOpen] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    useEffect(() => {
        // Mock premium calculation (e.g., 2% for Kharif crops)
        const premiumRate = 0.02;
        setPremium(sumInsured * premiumRate);
    }, [sumInsured, crop]);

    useEffect(() => {
        if (showConfirmation) {
            const timer = setTimeout(() => {
                setShowConfirmation(false);
            }, 2000); // Hide after 2 seconds
            return () => clearTimeout(timer);
        }
    }, [showConfirmation]);

    const handleConfirmInsurance = () => {
        setShowConfirmation(true);
        // In a real app, you would submit the insurance application here
    };

    return (
        <div className="space-y-6">
            {showConfirmation && <ConfirmationAnimation />}
            <button onClick={() => navigate(-1)} className="flex items-center text-primary font-semibold mb-4">
                <ArrowLeft size={18} className="mr-1" />
                Back
            </button>
            <h2 className="text-2xl font-bold">Crop Insurance</h2>
            <p className="text-text-secondary">Protect your crops against unforeseen events with government-backed insurance schemes.</p>
            
             {/* Government Schemes */}
            <div className="bg-card rounded-xl shadow-md p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center"><FileText size={20} className="mr-2 text-primary" />Government Schemes</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-bold">Pradhan Mantri Fasal Bima Yojana (PMFBY)</h4>
                    <p className="text-sm text-text-secondary mt-1">PMFBY aims to provide a comprehensive insurance cover against failure of the crop thus helping in stabilising the income of the farmers.</p>
                </div>
            </div>

            {/* Premium Calculator */}
            <div className="bg-card rounded-xl shadow-md p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center"><Calculator size={20} className="mr-2 text-primary" />Estimate Your Premium</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                     <div>
                        <label htmlFor="crop-select" className="block text-sm font-medium text-text-secondary mb-1">Select Crop</label>
                        <select id="crop-select" value={crop} onChange={(e) => setCrop(e.target.value as Commodity)} className="w-full p-2 border border-gray-300 rounded-md">
                            {COMMODITIES.map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="sum-insured" className="block text-sm font-medium text-text-secondary mb-1">Sum Insured (₹)</label>
                        <input
                            type="number"
                            id="sum-insured"
                            value={sumInsured}
                            onChange={(e) => setSumInsured(Number(e.target.value))}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                </div>
                <div className="bg-primary/10 text-primary p-4 rounded-lg text-center">
                    <p className="text-sm">Your Estimated Premium is</p>
                    <p className="text-3xl font-bold">₹{premium.toLocaleString()}</p>
                    <p className="text-xs mt-1">(Farmer's Share for Kharif Season)</p>
                </div>
            </div>
            
            {/* Eligibility */}
             <div className="bg-card rounded-xl shadow-md p-6">
                <button 
                    onClick={() => setIsEligibilityOpen(!isEligibilityOpen)}
                    className="w-full flex justify-between items-center text-left"
                >
                    <h3 className="font-bold text-lg flex items-center"><Check size={20} className="mr-2 text-primary" />Eligibility Checklist</h3>
                    <ChevronDown size={20} className={`text-text-secondary transition-transform ${isEligibilityOpen ? 'rotate-180' : ''}`} />
                </button>
                 {isEligibilityOpen && (
                    <div className="mt-4 space-y-2 text-text-secondary animate-fade-in">
                        <style>{`
                            @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
                            .animate-fade-in { animation: fade-in 0.5s; }
                        `}</style>
                        <ul className="space-y-2">
                            <li className="flex items-start"><Check className="text-green-500 mr-2 mt-1 flex-shrink-0" /><span>All farmers including sharecroppers and tenant farmers growing notified crops in the notified areas are eligible.</span></li>
                            <li className="flex items-start"><Check className="text-green-500 mr-2 mt-1 flex-shrink-0" /><span>Compulsory for loanee farmers availing Seasonal Agricultural Operations (SAO) loans.</span></li>
                            <li className="flex items-start"><Check className="text-green-500 mr-2 mt-1 flex-shrink-0" /><span>Voluntary for non-loanee farmers.</span></li>
                        </ul>
                    </div>
                 )}
            </div>

            {/* Claim Flow */}
             <div className="bg-card rounded-xl shadow-md p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center"><FileText size={20} className="mr-2 text-primary" />Simplified Claim Flow</h3>
                <div className="flex flex-col md:flex-row justify-around items-center text-center space-y-4 md:space-y-0">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2"><Shield size={32} className="text-blue-600"/></div>
                        <p className="font-semibold">1. Crop Loss</p>
                        <p className="text-xs text-text-secondary">Due to non-preventable risks</p>
                    </div>
                    <div className="text-gray-300 font-bold text-2xl">→</div>
                     <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2"><p className="text-blue-600 font-bold text-lg">₹</p></div>
                        <p className="font-semibold">2. Sum Insured</p>
                        <p className="text-xs text-text-secondary">Assessment by officials</p>
                    </div>
                    <div className="text-gray-300 font-bold text-2xl">→</div>
                     <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2"><p className="text-blue-600 font-bold text-lg">💸</p></div>
                        <p className="font-semibold">3. Compensation</p>
                        <p className="text-xs text-text-secondary">Directly to bank account</p>
                    </div>
                </div>
            </div>

            <button 
                onClick={handleConfirmInsurance} 
                className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center"
            >
                <CheckCircle size={20} className="mr-2"/> Confirm Insurance
            </button>
        </div>
    );
};
