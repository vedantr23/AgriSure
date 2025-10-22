
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert as AlertType } from '../types';
import { MOCK_ALERTS } from '../constants';
import { Bell, AlertTriangle } from 'lucide-react';

const AlertCard: React.FC<{ alert: AlertType }> = ({ alert }) => {
    const navigate = useNavigate();
    const isWarning = alert.title.toLowerCase().includes('drop');

    return (
        <div className={`bg-card rounded-lg shadow-md p-4 border-l-4 ${isWarning ? 'border-red-500' : 'border-blue-500'}`}>
            <div className="flex items-start">
                <div className={`mr-3 mt-1 ${isWarning ? 'text-red-500' : 'text-blue-500'}`}>
                    {isWarning ? <AlertTriangle /> : <Bell />}
                </div>
                <div className="flex-grow">
                    <h3 className="font-bold">{alert.title}</h3>
                    <p className="text-sm text-text-secondary mt-1">{alert.description}</p>
                    <div className="flex justify-between items-center mt-3">
                        <span className="text-xs text-gray-500">{alert.date}</span>
                        <button 
                            onClick={() => navigate('/forecast')}
                            className="text-sm font-semibold text-primary hover:underline"
                        >
                            View Forecast
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const AlertsScreen: React.FC = () => {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Market Alerts</h2>
            {MOCK_ALERTS.length > 0 ? (
                <div className="space-y-4">
                    {MOCK_ALERTS.map(alert => <AlertCard key={alert.id} alert={alert} />)}
                </div>
            ) : (
                <p className="text-center text-text-secondary mt-8">No new alerts.</p>
            )}
        </div>
    );
};
