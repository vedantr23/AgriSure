
import React, { useState } from 'react';
import { ArrowLeft, User, Banknote, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfileInput = ({ label, value, id, type = "text" }: { label: string; value: string; id: string; type?: string }) => {
    const [currentValue, setCurrentValue] = useState(value);
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-text-secondary">{label}</label>
            <input
                type={type}
                id={id}
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
        </div>
    );
};

export const ProfileScreen: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            <button onClick={() => navigate(-1)} className="flex items-center text-primary font-semibold mb-4">
                <ArrowLeft size={18} className="mr-1" />
                Back
            </button>

            <h2 className="text-2xl font-bold">My Profile</h2>

            {/* Personal Details */}
            <div className="bg-card rounded-xl shadow-md p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center"><User size={20} className="mr-2 text-primary" />Personal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ProfileInput label="Full Name" id="fullName" value="Ankit Sharma" />
                    <ProfileInput label="Contact Number" id="contact" value="+91 98765 43210" />
                    <ProfileInput label="Role" id="role" value="Farmer" />
                    <ProfileInput label="Preferred Language" id="language" value="English" />
                </div>
            </div>

            {/* Bank Information */}
            <div className="bg-card rounded-xl shadow-md p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center"><Banknote size={20} className="mr-2 text-primary" />Bank Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ProfileInput label="Bank Name" id="bankName" value="State Bank of India" />
                    <ProfileInput label="Account Number" id="accountNumber" value="**** **** 1234" />
                    <ProfileInput label="IFSC Code" id="ifsc" value="SBIN0005678" />
                </div>
            </div>

            {/* FPO Details */}
            <div className="bg-card rounded-xl shadow-md p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center"><Building size={20} className="mr-2 text-primary" />FPO Details</h3>
                <div className="space-y-4">
                    <ProfileInput label="FPO Name" id="fpoName" value="Sahyadri Farmers Producer Co." />
                    <ProfileInput label="FPO Registration ID" id="fpoId" value="FPO-MH-12345" />
                </div>
            </div>
             <button className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors">
                Save Changes
            </button>
        </div>
    );
};