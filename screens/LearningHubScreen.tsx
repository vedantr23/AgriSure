
import React from 'react';
import { LearningModule } from '../types';
import { MOCK_LEARNING_MODULES } from '../constants';
import { Video, Image as ImageIcon, FileAudio, Lock, CheckCircle, PlayCircle, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const ModuleCard: React.FC<{ module: LearningModule }> = ({ module }) => {
    const icons = {
        'Video': <Video className="text-red-500" />,
        'Infographic': <ImageIcon className="text-blue-500" />,
        'Audio + Quiz': <FileAudio className="text-purple-500" />,
    };

    const statusInfo = {
        'Completed': { icon: <CheckCircle className="text-green-500" />, text: 'Completed', button: 'Review' },
        'Start': { icon: <PlayCircle className="text-primary" />, text: 'Ready to Start', button: 'Start' },
        'Locked': { icon: <Lock className="text-gray-500" />, text: 'Locked', button: 'Locked' },
    };
    
    const currentStatus = statusInfo[module.status];

    return (
        <div className="bg-card rounded-lg shadow-md p-4 flex items-center space-x-4">
            <div className="p-3 bg-gray-100 rounded-lg">
                {icons[module.type]}
            </div>
            <div className="flex-grow">
                <h3 className="font-bold">{module.title}</h3>
                <div className="flex items-center text-sm text-text-secondary mt-1">
                    {currentStatus.icon}
                    <span className="ml-1.5">{currentStatus.text}</span>
                </div>
            </div>
            <button
                className={`px-4 py-2 text-sm font-semibold rounded-md ${module.status === 'Locked' ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-primary text-white'}`}
                disabled={module.status === 'Locked'}
            >
                {currentStatus.button}
            </button>
        </div>
    );
};

export const LearningHubScreen: React.FC = () => {
    const completedCount = MOCK_LEARNING_MODULES.filter(m => m.status === 'Completed').length;
    const totalCount = MOCK_LEARNING_MODULES.length;
    const progress = (completedCount / totalCount) * 100;

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Learning Hub</h2>

            <div className="bg-card rounded-xl shadow-md p-4">
                 <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                        <Shield className="text-primary" size={24}/>
                    </div>
                    <div className="flex-grow">
                        <h3 className="font-bold text-lg">Simulated Trading Module</h3>
                        <p className="text-sm text-text-secondary">Practice buy/sell without real money to understand risk management.</p>
                    </div>
                </div>
                <Link to="/learn/trading-simulator" className="mt-4 block w-full text-center bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-primary-dark transition-colors">
                    Start Practicing
                </Link>
            </div>

            <div className="bg-card rounded-lg shadow-md p-4">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Your Progress</h3>
                    <span className="font-bold text-primary">{completedCount} / {totalCount} Modules</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
            <div className="space-y-3">
                {MOCK_LEARNING_MODULES.map(module => (
                    <ModuleCard key={module.id} module={module} />
                ))}
            </div>
        </div>
    );
};
