import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, Info, TrendingUp, MessageCircle, Gavel, CloudRain, Thermometer, Leaf, Droplets,
    Shield, HelpCircle, Map, BarChart, FileDown, LocateFixed, Compass, BookOpen, Bell, CheckCircle, X, Newspaper, Twitter
} from 'lucide-react';

// Declare Leaflet to TypeScript
declare const L: any;

const LeafletMap = ({ markers, center, zoom, getMarkerIcon, getTooltipContent }: { markers: any[], center: [number, number], zoom: number, getMarkerIcon: (marker: any) => any, getTooltipContent: (marker: any) => string }) => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<any | null>(null);

    // This effect handles the MAP LIFECYCYCLE: creation and destruction.
    useEffect(() => {
        // Only run if the container is available and the map isn't already initialized.
        if (mapContainerRef.current && !mapRef.current) {
            const map = L.map(mapContainerRef.current).setView(center, zoom);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            mapRef.current = map;
        }

        // The cleanup function is the key to fixing the overlap issue.
        // It runs when the component is unmounted.
        return () => {
            if (mapRef.current) {
                mapRef.current.remove(); // This properly destroys the Leaflet map instance.
                mapRef.current = null;
            }
        };
    }, []); // Empty dependency array ensures this runs only ONCE on mount and cleans up on unmount.

    // This separate effect handles UPDATING THE MARKERS if they change.
    useEffect(() => {
        if (mapRef.current) {
            // Clear existing markers before adding new ones
            mapRef.current.eachLayer((layer: any) => {
                if (layer instanceof L.Marker) {
                    mapRef.current.removeLayer(layer);
                }
            });

            // Add new markers from props
            markers.forEach(marker => {
                const icon = getMarkerIcon(marker);
                const leafletMarker = L.marker([marker.lat, marker.lng], { icon }).addTo(mapRef.current);
                leafletMarker.bindTooltip(getTooltipContent(marker), {
                    permanent: false,
                    direction: 'top',
                    offset: [0, -10],
                    className: 'leaflet-tooltip-custom'
                });
            });
        }
    }, [markers, getMarkerIcon, getTooltipContent]); // Re-run only when marker data changes.
    
    // Separate effect to update view if center/zoom props change dynamically
    useEffect(() => {
        if(mapRef.current) {
            mapRef.current.setView(center, zoom);
        }
    }, [center, zoom]);


    return (
      <>
        <style>{`
          .leaflet-tooltip-custom {
            background-color: white;
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 8px;
            font-size: 12px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          }
          .agrivol-marker {
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 0 5px rgba(0,0,0,0.5);
          }
          .weather-marker {
             background-color: #2563eb; /* bg-blue-600 */
             border-radius: 50%;
             border: 2px solid white;
             display: flex;
             align-items: center;
             justify-content: center;
          }
        `}</style>
        <div ref={mapContainerRef} className="w-full h-full" />
      </>
    );
};

const ExplainScoreModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <style>{`
                @keyframes explain-fade-in { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
                .animate-explain-in { animation: explain-fade-in 0.3s ease-out; }
            `}</style>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-auto animate-explain-in flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-primary">Explaining the Score: Behavioral Hedging Index</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X size={24} /></button>
                </div>
                <div className="p-6 overflow-y-auto space-y-4">
                    <p className="text-sm text-text-secondary">The HOI-X™ score is calculated by analyzing multiple real-time data points to determine the "market mood" and identify hedging opportunities. Here's a breakdown of today's sentiment:</p>
                    
                    <div className="space-y-3">
                        {/* News Sentiment */}
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <h4 className="font-bold flex items-center mb-2"><Newspaper size={18} className="mr-2 text-blue-600"/>Live News Sentiment: <span className="ml-2 text-green-600 font-semibold">Positive</span></h4>
                            <ul className="list-disc list-inside text-sm space-y-1 text-text-secondary">
                                <li>"Global demand for soybean oil expected to surge."</li>
                                <li>"Favorable monsoon forecasts boost crop yield predictions."</li>
                                <li>"Export policies remain stable, encouraging trade."</li>
                            </ul>
                        </div>
                        {/* Twitter Sentiment */}
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <h4 className="font-bold flex items-center mb-2"><Twitter size={18} className="mr-2 text-sky-500"/>Social Media Trends: <span className="ml-2 text-green-600 font-semibold">Bullish</span></h4>
                            <ul className="list-disc list-inside text-sm space-y-1 text-text-secondary">
                                <li>Trending: #SoybeanFutures prices see upward momentum.</li>
                                <li>Market influencers predict a strong quarter for oilseeds.</li>
                            </ul>
                        </div>
                        {/* Ministry Updates */}
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <h4 className="font-bold flex items-center mb-2"><Gavel size={18} className="mr-2 text-gray-700"/>Agri Ministry Updates: <span className="ml-2 text-gray-600 font-semibold">Neutral</span></h4>
                            <ul className="list-disc list-inside text-sm space-y-1 text-text-secondary">
                                <li>"No immediate changes to MSP for oilseeds announced."</li>
                                <li>"Committee to review storage infrastructure subsidies next month."</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                        <h4 className="font-bold mb-2">How It Works:</h4>
                        <p className="text-sm text-text-secondary">Our AI performs sentiment analysis on thousands of data points from news sites, social media, and government portals. This "market mood" is combined with AI price forecasts and your farm's data to generate one simple, actionable score.</p>
                    </div>
                </div>
                <div className="bg-gray-50 px-6 py-3 flex justify-end rounded-b-lg">
                    <button onClick={onClose} className="px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-dark">Got it</button>
                </div>
            </div>
        </div>
    );
};

const CompareRegionsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg mx-auto animate-explain-in flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-bold text-primary">Compare Regional Volatility</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X size={24} /></button>
            </div>
            <div className="p-6">
                <p className="text-sm text-text-secondary mb-4">Comparing AgriVol Index and Average HOI-X™ for key districts.</p>
                <div className="space-y-4">
                    {agriVolDistricts.filter(d => ['Indore', 'Jaipur', 'Nagpur'].includes(d.name)).map(district => (
                        <div key={district.id}>
                            <p className="font-bold">{district.name}</p>
                            <div className="grid grid-cols-2 gap-2 text-sm mt-1">
                                <div>
                                    <p className="text-xs text-text-secondary">AgriVol Score</p>
                                    <div className="w-full bg-gray-200 rounded-full h-4">
                                        <div className="bg-purple-500 h-4 rounded-full" style={{ width: `${district.agriVol}%` }}><span className="text-xs text-white pl-2">{district.agriVol}</span></div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-text-secondary">Avg. HOI-X Score</p>
                                     <div className="w-full bg-gray-200 rounded-full h-4">
                                        <div className="bg-orange-500 h-4 rounded-full" style={{ width: `${district.agriVol + 5}%` }}><span className="text-xs text-white pl-2">{district.agriVol + 5}</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-gray-50 px-6 py-3 flex justify-end rounded-b-lg">
                <button onClick={onClose} className="px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-dark">Close</button>
            </div>
        </div>
    </div>
);

const UpdateSuccessCard: React.FC = () => (
    <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50 p-4">
        <style>{`
            @keyframes scale-in-subtle {
                0% { opacity: 0; transform: scale(0.95); }
                100% { opacity: 1; transform: scale(1); }
            }
            .animate-scale-in-subtle { animation: scale-in-subtle 0.3s ease-out; }
        `}</style>
        <div className="bg-white p-6 rounded-lg shadow-xl flex items-center space-x-4 animate-scale-in-subtle">
            <CheckCircle className="text-green-500" size={32} />
            <p className="text-lg font-semibold text-text-primary">Data updated Successfully</p>
        </div>
    </div>
);


const DSSCard: React.FC<{ children: React.ReactNode, title: string, icon: React.ReactNode }> = ({ children, title, icon }) => (
    <div className="bg-card rounded-xl shadow-md">
        <div className="p-4 border-b border-gray-200">
            <div className="flex items-center">
                {icon}
                <h3 className="font-bold text-text-primary ml-2 text-lg">{title}</h3>
            </div>
        </div>
        <div className="p-4">
            {children}
        </div>
    </div>
);

type DistrictWeatherData = {
    id: string;
    name: string;
    lat: number;
    lng: number;
    rain: string;
    temp: string;
    risk: string;
    riskColor: string;
};

const simulatedDistricts: DistrictWeatherData[] = [
    { id: 'd1', name: 'Indore', lat: 22.7196, lng: 75.8577, rain: 'Moderate Rain', temp: '32°C', risk: 'High Risk', riskColor: 'text-red-600' },
    { id: 'd2', name: 'Jaipur', lat: 26.9124, lng: 75.7873, rain: 'Light Rain', temp: '35°C', risk: 'Low Risk', riskColor: 'text-green-600' },
    { id: 'd3', name: 'Latur', lat: 18.4088, lng: 76.5604, rain: 'No Rain', temp: '33°C', risk: 'Stable', riskColor: 'text-gray-600' },
    { id: 'd4', name: 'Bhopal', lat: 23.2599, lng: 77.4126, rain: 'Heavy Rain', temp: '29°C', risk: 'Very High Risk', riskColor: 'text-red-800' },
    { id: 'd5', name: 'New Delhi', lat: 28.6139, lng: 77.2090, rain: 'Trace', temp: '36°C', risk: 'Low Risk', riskColor: 'text-green-600' },
];


const WeatherMapModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {

    const getWeatherMarkerIcon = () => L.divIcon({
        className: 'weather-marker',
        html: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 16.2A4.5 4.5 0 0 0 17.5 8h-1.8A7 7 0 1 0 4 14.9"/></svg>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });

    const getWeatherTooltipContent = (marker: DistrictWeatherData) => `
        <div class="font-bold text-base">${marker.name}</div>
        <div><strong>Rain:</strong> ${marker.rain}</div>
        <div><strong>Temp:</strong> ${marker.temp}</div>
        <div><strong>Status:</strong> <span class="font-bold ${marker.riskColor}">${marker.risk}</span></div>
    `;

    return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <style>{`
            @keyframes dss-fade-in { 0% { opacity: 0; transform: scale(0.95); } 100% { opacity: 1; transform: scale(1); } }
            .animate-dss-fade-in { animation: dss-fade-in 0.2s ease-out; }
        `}</style>
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[80vh] mx-auto animate-dss-fade-in flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-bold">State Weather Map (Simulated)</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X size={24} /></button>
            </div>
            <div className="p-4 flex-grow relative">
                <LeafletMap 
                    markers={simulatedDistricts}
                    center={[22.5937, 78.9629]}
                    zoom={5}
                    getMarkerIcon={getWeatherMarkerIcon}
                    getTooltipContent={getWeatherTooltipContent}
                />
            </div>
             <div className="bg-gray-50 px-6 py-3 flex justify-end rounded-b-lg">
                <button onClick={onClose} className="px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-dark">Close</button>
            </div>
        </div>
    </div>
)};

type AgriVolDistrict = {
    id: string;
    name: string;
    lat: number;
    lng: number;
    agriVol: number;
    avgPrice: number;
    recommendation: string;
};

const agriVolDistricts: AgriVolDistrict[] = [
    { id: 'av1', name: 'Indore', lat: 22.7196, lng: 75.8577, agriVol: 74, avgPrice: 4250, recommendation: 'Hedge Now' },
    { id: 'av2', name: 'Jaipur', lat: 26.9124, lng: 75.7873, agriVol: 48, avgPrice: 4190, recommendation: 'Watch' },
    { id: 'av3', name: 'Latur', lat: 18.4088, lng: 76.5604, agriVol: 32, avgPrice: 4280, recommendation: 'Hold' },
    { id: 'av4', name: 'Nagpur', lat: 21.1458, lng: 79.0882, agriVol: 65, avgPrice: 4210, recommendation: 'Partial Hedge' },
];


export const DecisionSupportScreen: React.FC = () => {
    const navigate = useNavigate();
    const [isWeatherMapOpen, setIsWeatherMapOpen] = useState(false);
    const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);
    const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
    const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
    const [mapCenter, setMapCenter] = useState<[number, number]>([22.5937, 78.9629]);
    const [mapZoom, setMapZoom] = useState(5);

    useEffect(() => {
        if (showUpdateSuccess) {
            const timer = setTimeout(() => setShowUpdateSuccess(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [showUpdateSuccess]);
    
    const getAgriVolColor = (agriVol: number) => {
        if (agriVol > 70) return '#ef4444'; // red-500
        if (agriVol > 40) return '#f59e0b'; // amber-500
        return '#22c55e'; // green-500
    };

    const getAgriVolMarkerIcon = (marker: AgriVolDistrict) => {
        const color = getAgriVolColor(marker.agriVol);
        return L.divIcon({
            className: '',
            html: `<div class="agrivol-marker" style="background-color: ${color}; width: 20px; height: 20px;"></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
        });
    };
    
    const getAgriVolTooltipContent = (marker: AgriVolDistrict) => `
        <div class="font-bold text-base">${marker.name}</div>
        <div><strong>Avg Price:</strong> ₹${marker.avgPrice.toLocaleString()}</div>
        <div><strong>AgriVol:</strong> <span class="font-bold">${marker.agriVol}</span></div>
        <div class="mt-1 pt-1 border-t"><strong>Recommend:</strong> <span class="font-bold text-primary">${marker.recommendation}</span></div>
    `;

    const handleUpdateFarmData = () => {
        setShowUpdateSuccess(true);
    };
    
    const handleMyDistrict = () => {
        setMapCenter([21.1458, 79.0882]); // Nagpur
        setMapZoom(8);
    };

    const handleExport = () => {
        alert("Report exported successfully! (Simulated)");
    };

    return (
        <div className="space-y-6">
            {isWeatherMapOpen && <WeatherMapModal onClose={() => setIsWeatherMapOpen(false)} />}
            {isExplainModalOpen && <ExplainScoreModal onClose={() => setIsExplainModalOpen(false)} />}
            {isCompareModalOpen && <CompareRegionsModal onClose={() => setIsCompareModalOpen(false)} />}
            {showUpdateSuccess && <UpdateSuccessCard />}
            
            {/* Header */}
            <div className="flex justify-between items-center">
                <button onClick={() => navigate(-1)} className="flex items-center text-primary font-semibold">
                    <ArrowLeft size={18} className="mr-1" />
                    Back
                </button>
                <h2 className="text-xl font-bold text-center">Decision Support System</h2>
                <button onClick={() => alert("Info clicked!")} className="text-text-secondary">
                    <Info size={20} />
                </button>
            </div>

            {/* 1. HOI-X™ + Sentiment Fusion Engine */}
            <DSSCard title="HOI-X™ + Sentiment Fusion Engine" icon={<Shield className="text-blue-500" />}>
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-shrink-0 text-center">
                        <div className="relative w-32 h-32">
                            <svg className="w-full h-full" viewBox="0 0 36 36">
                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e6e6e6" strokeWidth="3"></path>
                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f97316" strokeWidth="3" strokeDasharray="82, 100" transform="rotate(90 18 18)"></path>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                <span className="text-4xl font-bold text-orange-500">82</span>
                                <span className="text-xs font-semibold text-text-secondary">HOI-X™</span>
                                <span className="text-[10px] text-text-secondary leading-tight mt-1 px-1">Hedging Opportunity Index</span>
                            </div>
                        </div>
                        <p className="font-bold text-orange-500 mt-2">High Hedging Opportunity</p>
                    </div>
                    <div className="flex-grow w-full">
                        <div className="grid grid-cols-3 gap-2 text-center mb-4">
                            <div className="bg-gray-100 p-2 rounded-lg">
                                <p className="text-xs text-text-secondary">Price Forecast</p>
                                <p className="font-bold text-green-600 flex items-center justify-center"><TrendingUp size={14} className="mr-1"/>+4.8%</p>
                            </div>
                            <div className="bg-gray-100 p-2 rounded-lg">
                                <p className="text-xs text-text-secondary">Market Sentiment</p>
                                <p className="font-bold text-green-600 flex items-center justify-center"><MessageCircle size={14} className="mr-1"/>Positive</p>
                            </div>
                            <div className="bg-gray-100 p-2 rounded-lg">
                                <p className="text-xs text-text-secondary">Policy Impact</p>
                                <p className="font-bold text-gray-600 flex items-center justify-center"><Gavel size={14} className="mr-1"/>Neutral</p>
                            </div>
                        </div>
                        <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm italic">
                            💡 “Soybean prices expected to rise by 4.8%. Market sentiment bullish. Hedge 60% of your stock within 7 days.”
                        </div>
                    </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                    <button onClick={() => navigate('/market')} className="px-3 py-1.5 text-sm bg-primary text-white rounded-md">Simulate Hedge</button>
                    <button onClick={() => setIsExplainModalOpen(true)} className="px-3 py-1.5 text-sm bg-gray-200 rounded-md flex items-center"><HelpCircle size={14} className="mr-1"/>Explain</button>
                </div>
            </DSSCard>

            {/* 2. Weather & Yield Intelligence */}
            <DSSCard title="Weather & Yield Intelligence" icon={<CloudRain className="text-cyan-500" />}>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                    <div className="bg-gray-100 p-2 rounded-lg">
                        <p className="text-xs text-text-secondary flex items-center justify-center"><CloudRain size={14} className="mr-1"/>Rain Forecast</p>
                        <p className="font-semibold">Light rain in 3 days</p>
                        <p className="text-xs font-bold text-yellow-600">(⚠ Moderate Risk)</p>
                    </div>
                    <div className="bg-gray-100 p-2 rounded-lg">
                        <p className="text-xs text-text-secondary flex items-center justify-center"><Thermometer size={14} className="mr-1"/>Temperature</p>
                        <p className="font-semibold">33°C</p>
                        <p className="text-xs font-bold text-gray-500">(Normal)</p>
                    </div>
                     <div className="bg-gray-100 p-2 rounded-lg">
                        <p className="text-xs text-text-secondary flex items-center justify-center"><Leaf size={14} className="mr-1"/>NDVI Crop Health</p>
                        <p className="font-semibold">0.82</p>
                        <p className="text-xs font-bold text-green-600">(Good)</p>
                    </div>
                     <div className="bg-gray-100 p-2 rounded-lg">
                        <p className="text-xs text-text-secondary flex items-center justify-center"><Droplets size={14} className="mr-1"/>Moisture Level</p>
                        <p className="font-semibold">18%</p>
                        <p className="text-xs font-bold text-blue-600">(Ideal)</p>
                    </div>
                </div>
                <div className="bg-yellow-50 text-yellow-800 p-3 rounded-lg text-sm mt-4 text-center">
                    “Moderate rainfall expected — store stock safely and hedge 30% early.”
                </div>
                 <div className="flex justify-end space-x-2 mt-4">
                    <button onClick={() => setIsWeatherMapOpen(true)} className="px-3 py-1.5 text-sm bg-primary text-white rounded-md">View Weather Map</button>
                    <button onClick={handleUpdateFarmData} className="px-3 py-1.5 text-sm bg-gray-200 rounded-md">Update Farm Data</button>
                </div>
            </DSSCard>

            {/* 3. AgriVol Index + Geo-Map Visualization */}
            <DSSCard title="AgriVol Index + Geo-Spatial Hedging Map" icon={<Map className="text-purple-500" />}>
                <div className="relative h-96 w-full rounded-lg overflow-hidden border mb-4">
                    <LeafletMap 
                        markers={agriVolDistricts}
                        center={mapCenter}
                        zoom={mapZoom}
                        getMarkerIcon={getAgriVolMarkerIcon}
                        getTooltipContent={getAgriVolTooltipContent}
                    />
                </div>
                <div className="flex justify-center space-x-4 text-xs mb-4">
                    <span className="flex items-center"><span className="w-3 h-3 bg-green-500 rounded-full mr-1.5"></span>0-40 Stable</span>
                    <span className="flex items-center"><span className="w-3 h-3 bg-yellow-500 rounded-full mr-1.5"></span>41-70 Volatile</span>
                    <span className="flex items-center"><span className="w-3 h-3 bg-red-500 rounded-full mr-1.5"></span>71-100 High Risk</span>
                </div>
                <div className="w-full overflow-x-auto mt-4">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 font-semibold">District</th>
                                <th className="p-2 font-semibold text-center">AgriVol Score</th>
                                <th className="p-2 font-semibold">Volatility</th>
                                <th className="p-2 font-semibold">Recommendation</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b">
                                <td className="p-2 font-semibold">Indore</td>
                                <td className="p-2 text-center font-bold text-red-600">74</td>
                                <td className="p-2"><span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">High</span></td>
                                <td className="p-2 font-semibold text-red-600">Hedge Now</td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-2 font-semibold">Jaipur</td>
                                <td className="p-2 text-center font-bold text-yellow-600">48</td>
                                <td className="p-2"><span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Moderate</span></td>
                                <td className="p-2 font-semibold text-yellow-600">Watch</td>
                            </tr>
                            <tr>
                                <td className="p-2 font-semibold">Latur</td>
                                <td className="p-2 text-center font-bold text-green-600">32</td>
                                <td className="p-2"><span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Stable</span></td>
                                <td className="p-2 font-semibold text-green-600">Hold</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4">
                    <button onClick={handleMyDistrict} className="flex items-center justify-center text-sm bg-gray-200 rounded-md py-2"><LocateFixed size={16} className="mr-2"/>My District</button>
                    <button onClick={() => setIsCompareModalOpen(true)} className="flex items-center justify-center text-sm bg-gray-200 rounded-md py-2"><BarChart size={16} className="mr-2"/>Compare</button>
                    <button onClick={handleExport} className="flex items-center justify-center text-sm bg-gray-200 rounded-md py-2"><FileDown size={16} className="mr-2"/>Export</button>
                </div>
            </DSSCard>

            {/* Final Recommendation Card */}
            <div className="bg-card rounded-xl shadow-lg p-4 border-2 border-primary">
                <div className="text-center">
                    <h3 className="font-bold text-lg mb-2 flex items-center justify-center"><Compass size={20} className="mr-2"/>AI Recommendation</h3>
                    <p className="text-xl font-bold text-primary">“Hedge 60% of your soybean stock within 7 days.”</p>
                    <div className="my-3 inline-flex items-center bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
                        <CheckCircle size={16} className="mr-1.5"/> Confidence: 86%
                    </div>
                    <p className="text-sm text-text-secondary">
                        <span className="font-semibold">Reason:</span> Positive sentiment, rising price forecast, moderate rain risk.
                    </p>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4">
                    <button onClick={() => navigate('/market')} className="text-sm bg-primary text-white rounded-md py-2">Simulate Hedge</button>
                    <button onClick={() => navigate('/portfolio')} className="flex items-center justify-center text-sm bg-gray-200 rounded-md py-2"><BookOpen size={16} className="mr-1"/>Contracts</button>
                    <button onClick={() => navigate('/alerts')} className="flex items-center justify-center text-sm bg-gray-200 rounded-md py-2"><Bell size={16} className="mr-1"/>Set Alert</button>
                </div>
            </div>
        </div>
    );
};