import React, { useState } from 'react';
import { LANGUAGES, INDIAN_STATES, USER_ROLES } from '../constants';
import { Check, ChevronDown } from 'lucide-react';


interface LoginScreenProps {
  onLogin: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [selectedState, setSelectedState] = useState(INDIAN_STATES[0]);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length === 10 && selectedRole) {
      setStep(2);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '1234') { // Mock OTP
      onLogin();
    } else {
      alert('Invalid OTP. Please use 1234');
    }
  };

  const handleLanguageSelect = (lang: string) => {
    setSelectedLanguage(lang);
    setIsLangDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center mb-6">
          <img src="https://fastly.picsum.photos/id/18/2500/1667.jpg?hmac=JR0Z_jRs9rssQHZJ4b7xKF82kOj8-4Ackq75D_9Wmz8" alt="AgriSure Logo" className="w-20 h-20 rounded-full mb-3" />
          <h1 className="text-2xl font-bold text-primary">AgriSure</h1>
          <p className="text-text-secondary text-center mt-1 text-sm">Oilseeds Hedging for Price Risk Management</p>
        </div>

        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <div className="mb-4">
                <label htmlFor="language" className="block text-sm font-medium text-text-secondary mb-1">Select Language</label>
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                        className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary flex justify-between items-center"
                    >
                        <span>{selectedLanguage.split(' ')[0]}</span>
                        <ChevronDown size={16} className={`transition-transform ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isLangDropdownOpen && (
                        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                            {LANGUAGES.map(lang => {
                                const [name, nativeName] = lang.split(' ');
                                const isSelected = lang === selectedLanguage;
                                return (
                                    <li
                                        key={lang}
                                        onClick={() => handleLanguageSelect(lang)}
                                        className={`px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between ${isSelected ? 'bg-secondary text-white' : ''}`}
                                    >
                                        <span>
                                            {name} {nativeName && <span className="text-gray-500">{nativeName}</span>}
                                        </span>
                                        {isSelected && <Check size={16} />}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>
             <div className="mb-4">
                <label htmlFor="state" className="block text-sm font-medium text-text-secondary mb-1">Select State</label>
                <select 
                    id="state" 
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    {INDIAN_STATES.map(state => <option key={state} value={state}>{state}</option>)}
                </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-secondary mb-2">Select Role</label>
              <div className="grid grid-cols-2 gap-3">
                {USER_ROLES.map((role) => {
                  const isSelected = selectedRole === role.name;
                  const RoleIcon = role.icon;
                  return (
                    <button
                      type="button"
                      key={role.name}
                      onClick={() => setSelectedRole(role.name)}
                      className={`flex flex-col items-center justify-center p-3 border rounded-lg transition-all duration-200 ${
                        isSelected
                          ? 'bg-primary/10 border-primary text-primary ring-2 ring-primary'
                          : 'bg-gray-50 border-gray-200 text-text-secondary hover:bg-gray-100'
                      }`}
                    >
                      <RoleIcon size={28} className="mb-1" />
                      <span className="text-xs font-semibold">{role.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="phone" className="block text-sm font-medium text-text-secondary mb-1">Phone Number</label>
              <input 
                type="tel" 
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                maxLength={10}
                placeholder="Enter 10-digit number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <button 
                type="submit" 
                className="w-full bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-primary-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={!selectedRole || phoneNumber.length !== 10}
            >
              Send OTP
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <p className="text-center text-sm text-text-secondary mb-4">
              Enter the 4-digit OTP sent to +91 {phoneNumber}.
            </p>
            <div className="mb-4">
              <label htmlFor="otp" className="block text-sm font-medium text-text-secondary mb-1">OTP</label>
              <input 
                type="text" 
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={4}
                placeholder="_ _ _ _"
                className="w-full px-3 py-2 text-center tracking-[1em] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <button type="submit" className="w-full bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-primary-dark transition-colors">
              Verify & Continue
            </button>
            <button onClick={() => setStep(1)} type="button" className="w-full text-center text-sm text-primary mt-4">
              Change Number
            </button>
          </form>
        )}
      </div>
    </div>
  );
};