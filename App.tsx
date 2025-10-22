

import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LoginScreen } from './screens/LoginScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ForecastScreen } from './screens/ForecastScreen';
import { PortfolioScreen } from './screens/PortfolioScreen';
import { ContractDetailScreen } from './screens/ContractDetailScreen';
import { IoTVerificationScreen } from './screens/IoTVerificationScreen';
import { AlertsScreen } from './screens/AlertsScreen';
import { LearningHubScreen } from './screens/LearningHubScreen';
import { MarketScreen } from './screens/MarketScreen';
import { LedgerScreen } from './screens/LedgerScreen';
import { SimulatedTradingScreen } from './screens/SimulatedTradingScreen';
import { DecisionSupportScreen } from './screens/DecisionSupportScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { InsuranceScreen } from './screens/InsuranceScreen';
import { FeedbackScreen } from './screens/FeedbackScreen';


const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    if (!isAuthenticated) {
        return <LoginScreen onLogin={handleLogin} />;
    }

    return (
        <HashRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<HomeScreen />} />
                    <Route path="/market" element={<MarketScreen />} />
                    <Route path="/forecast" element={<ForecastScreen />} />
                    <Route path="/portfolio" element={<PortfolioScreen />} />
                    <Route path="/contract/:id" element={<ContractDetailScreen />} />
                    <Route path="/iot-verify/:id" element={<IoTVerificationScreen />} />
                    <Route path="/alerts" element={<AlertsScreen />} />
                    <Route path="/learn" element={<LearningHubScreen />} />
                    <Route path="/learn/trading-simulator" element={<SimulatedTradingScreen />} />
                    <Route path="/ledger" element={<LedgerScreen />} />
                    <Route path="/dss" element={<DecisionSupportScreen />} />
                    <Route path="/profile" element={<ProfileScreen />} />
                    <Route path="/insurance" element={<InsuranceScreen />} />
                    <Route path="/feedback" element={<FeedbackScreen />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Layout>
        </HashRouter>
    );
};

export default App;