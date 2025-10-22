import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_CONTRACTS } from '../constants';
import { Contract } from '../types';
import { 
    ArrowLeft, Wifi, MapPin, Weight, Droplets, Thermometer, Camera,
    RefreshCw, CheckCircle, AlertTriangle, ShieldCheck
} from 'lucide-react';

// A new state to manage the entire verification flow
type VerificationStatus = 'pending' | 'settled';

export const IoTVerificationScreen: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const [contract, setContract] = useState<Contract | null>(null);
    const [status, setStatus] = useState<VerificationStatus>('pending');
    
    // Section 2 Inputs
    const [location, setLocation] = useState<string | null>(null);
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);
    const [weight, setWeight] = useState('');
    const [moisture, setMoisture] = useState('12');
    const [temperature, setTemperature] = useState('29');
    const [photo, setPhoto] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    
    // Section 3 Sensor Data
    const [sensorData, setSensorData] = useState({
        deviceId: 'IOT-SILO-102',
        moisture: '12.1%',
        temp: '29.2°C',
        timestamp: '22 Oct 2025, 10:30 AM',
        synced: true,
    });

    useEffect(() => {
        const foundContract = MOCK_CONTRACTS.find(c => c.id === id);
        if (foundContract) {
            setContract(foundContract);
        }
    }, [id]);

    const handleGetLocation = () => {
        setIsFetchingLocation(true);
        // Simulate fetching GPS and reverse geocoding
        setTimeout(() => {
            setLocation('Indore, Madhya Pradesh');
            setIsFetchingLocation(false);
        }, 1500);
    };

    const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhoto(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleConfirmDelivery = () => {
        // Basic validation
        if (!location || !weight || !moisture || !temperature || !photo) {
            alert("Please fill all verification inputs.");
            return;
        }
        setStatus('settled');
    };
    
    const handleRefreshIot = () => {
      // Simulate refreshing data
      setSensorData(prev => ({...prev, synced: false}));
      setTimeout(() => {
        setSensorData({
          deviceId: 'IOT-SILO-102',
          moisture: `${(12 + Math.random()).toFixed(1)}%`,
          temp: `${(29 + Math.random()).toFixed(1)}°C`,
          timestamp: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
          synced: true,
        });
      }, 1000);
    };

    if (!contract) {
        return <div className="text-center p-8">Loading Contract Details...</div>;
    }

    const verificationSummary = {
        quantity: weight === `${contract.quantity * 100}`,
        moisture: parseFloat(moisture) < 15,
        location: !!location,
        timestamp: true,
    };
    const confidenceScore = Object.values(verificationSummary).filter(Boolean).length / Object.values(verificationSummary).length * 100;


    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <button onClick={() => navigate(-1)} className="flex items-center text-primary font-semibold">
                    <ArrowLeft size={18} className="mr-1" />
                    Back
                </button>
                <h2 className="text-xl font-bold text-center">IoT Stock Verification</h2>
                <div className="flex items-center text-sm text-green-600 font-semibold">
                    <Wifi size={16} className="mr-1.5" />
                    IoT Connected
                </div>
            </div>

            <div className="bg-card rounded-xl shadow-md p-6 space-y-6">
                {/* Section 1: Crop & Contract Info */}
                <div className="border-b pb-4">
                    <h3 className="font-bold text-lg mb-2">Crop & Contract Info</h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <p><strong>Crop:</strong> {contract.crop}</p>
                        <p><strong>Contract ID:</strong> {contract.id}</p>
                        <p><strong>Type:</strong> <span className={contract.hedgeType === 'Long' ? 'font-bold text-green-600' : 'font-bold text-red-600'}>{contract.hedgeType} Hedge</span></p>
                        <p><strong>Quantity:</strong> {contract.quantity} quintals</p>
                        <p><strong>Status:</strong> <span className="font-semibold text-orange-500">Pending Verification</span></p>
                    </div>
                </div>

                {status !== 'settled' ? (
                    <>
                        <div className="lg:grid lg:grid-cols-2 lg:gap-6 space-y-6 lg:space-y-0">
                            {/* Section 2: Stock Verification Inputs */}
                            <div>
                                <h3 className="font-bold text-lg mb-3">Stock Verification Inputs</h3>
                                <div className="space-y-4">
                                    {/* GPS Location */}
                                    <div className="flex items-center space-x-3">
                                        <MapPin size={20} className="text-primary flex-shrink-0" />
                                        <div className="flex-grow">
                                            <p className="text-sm font-semibold">GPS Location</p>
                                            {location && <p className="text-sm text-gray-600 bg-gray-100 p-1 rounded">{location}</p>}
                                        </div>
                                        <button onClick={handleGetLocation} disabled={isFetchingLocation} className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400">
                                            {isFetchingLocation ? 'Fetching...' : 'Get Location'}
                                        </button>
                                    </div>
                                    {/* Weight */}
                                    <div className="flex items-center space-x-3">
                                        <Weight size={20} className="text-primary flex-shrink-0" />
                                        <label htmlFor="weight" className="text-sm font-semibold flex-grow">Weight Measurement (kg)</label>
                                        <input type="number" id="weight" value={weight} onChange={e => setWeight(e.target.value)} placeholder={`e.g., ${contract.quantity * 100}`} className="w-32 p-1.5 border border-gray-300 rounded-md text-sm" />
                                    </div>
                                    {/* Moisture */}
                                    <div className="flex items-center space-x-3">
                                        <Droplets size={20} className="text-primary flex-shrink-0" />
                                        <label htmlFor="moisture" className="text-sm font-semibold flex-grow">Moisture Level (%)</label>
                                        <input type="number" id="moisture" value={moisture} onChange={e => setMoisture(e.target.value)} className="w-32 p-1.5 border border-gray-300 rounded-md text-sm" />
                                        {/* FIX: Wrap lucide icon in a span to apply the title attribute for tooltips. */}
                                        {parseFloat(moisture) >= 15 && <span title="Moisture level is high"><AlertTriangle size={16} className="text-red-500" /></span>}
                                    </div>
                                    {/* Temperature */}
                                    <div className="flex items-center space-x-3">
                                        <Thermometer size={20} className="text-primary flex-shrink-0" />
                                        <label htmlFor="temperature" className="text-sm font-semibold flex-grow">Storage Temperature (°C)</label>
                                        <input type="number" id="temperature" value={temperature} onChange={e => setTemperature(e.target.value)} className="w-32 p-1.5 border border-gray-300 rounded-md text-sm" />
                                        {/* FIX: Wrap lucide icon in a span to apply the title attribute for tooltips. */}
                                        {parseFloat(temperature) > 35 && <span title="Temperature is high"><AlertTriangle size={16} className="text-red-500" /></span>}
                                    </div>
                                    {/* Photo Upload */}
                                    <div className="flex items-start space-x-3">
                                        <Camera size={20} className="text-primary flex-shrink-0 mt-1" />
                                        <div className="flex-grow">
                                            <p className="text-sm font-semibold">Upload Photo of Stock</p>
                                            {photo && <img src={photo} alt="Stock Preview" className="mt-2 w-32 h-32 object-cover rounded-md border" />}
                                        </div>
                                        <button onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600">
                                            {photo ? 'Change' : 'Upload'}
                                        </button>
                                        <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden" />
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Sensor Data Summary */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-bold text-lg">Sensor Data Summary</h3>
                                    <button onClick={handleRefreshIot} className="flex items-center px-2 py-1 text-xs bg-gray-200 rounded-md"><RefreshCw size={12} className="mr-1" /> Refresh</button>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-1">
                                    <p><strong>Device ID:</strong> {sensorData.deviceId}</p>
                                    <p><strong>Moisture Sensor:</strong> {sensorData.moisture}</p>
                                    <p><strong>Temp Sensor:</strong> {sensorData.temp}</p>
                                    <p><strong>Timestamp:</strong> {sensorData.timestamp}</p>
                                    <p><strong>Data Status:</strong> {sensorData.synced ? <span className="text-green-600 font-semibold">✅ Synced</span> : 'Syncing...'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Verification Result */}
                        <div className="border-t pt-4">
                            <h3 className="font-bold text-lg mb-2">Verification Result</h3>
                            <div className="bg-blue-50 p-3 rounded-lg space-y-1.5">
                                <h4 className="font-semibold flex items-center"><ShieldCheck size={18} className="mr-2 text-blue-600"/>Verification Summary:</h4>
                                <ul className="text-sm list-inside pl-2">
                                    <li className="flex items-center">{verificationSummary.quantity ? <CheckCircle size={14} className="text-green-600 mr-2"/> : <AlertTriangle size={14} className="text-red-500 mr-2"/>} Stock quantity {verificationSummary.quantity ? '' : 'not'} verified</li>
                                    <li className="flex items-center">{verificationSummary.moisture ? <CheckCircle size={14} className="text-green-600 mr-2"/> : <AlertTriangle size={14} className="text-red-500 mr-2"/>} Moisture within safe limit</li>
                                    <li className="flex items-center">{verificationSummary.location ? <CheckCircle size={14} className="text-green-600 mr-2"/> : <AlertTriangle size={14} className="text-red-500 mr-2"/>} Geo-location {verificationSummary.location ? '' : 'not'} matched</li>
                                    <li className="flex items-center">{verificationSummary.timestamp ? <CheckCircle size={14} className="text-green-600 mr-2"/> : <AlertTriangle size={14} className="text-red-500 mr-2"/>} Data timestamp verified</li>
                                </ul>
                                <div className="pt-2 text-center">
                                    <p className="font-bold">Confidence Score: <span className="text-primary text-xl">{confidenceScore.toFixed(0)}%</span></p>
                                </div>
                            </div>
                             <button onClick={handleConfirmDelivery} className="w-full mt-4 bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark flex items-center justify-center">
                                <CheckCircle size={18} className="mr-2"/> Confirm Delivery
                            </button>
                        </div>
                    </>
                ) : (
                    /* Section 5: Blockchain Settlement */
                    <div className="border-t pt-4 text-center">
                        <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
                        <h3 className="font-bold text-lg text-green-700">Contract Settled</h3>
                        <p className="text-text-secondary mt-2">
                            🧾 “Contract {contract.id} successfully verified and settled.”
                        </p>
                        <div className="mt-4">
                             <p className="font-semibold text-text-secondary">🔗 Blockchain Hash:</p>
                             <p className="text-xs text-gray-600 break-all bg-gray-100 p-2 rounded mt-1 font-mono">{contract.contractHash}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};