import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './app/AppLayout';
import DashboardPage from './pages/app/DashboardPage';
import OrdersPage from './pages/app/OrdersPage';
import OrderDetailPage from './pages/app/OrderDetailPage';
import DocumentsPage from './pages/app/DocumentsPage';
import AiExtractionPage from './pages/app/AiExtractionPage';
import DocumentComparisonPage from './pages/app/DocumentComparisonPage';
import CompliancePage from './pages/app/CompliancePage';
import ComplianceReviewPage from './pages/app/ComplianceReviewPage';
import ShipmentsPage from './pages/app/ShipmentsPage';
import ShipmentDetailPage from './pages/app/ShipmentDetailPage';
import FinancePage from './pages/app/FinancePage';
import AnalyticsPage from './pages/app/AnalyticsPage';

function App() {
    return (
        <AuthProvider>
            <Router>
                <ScrollToTop />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route
                        path="/app"
                        element={
                            <ProtectedRoute>
                                <AppLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<DashboardPage />} />
                        <Route path="orders" element={<OrdersPage />} />
                        <Route path="orders/:orderId" element={<OrderDetailPage />} />
                        <Route path="documents" element={<DocumentsPage />} />
                        <Route path="ai-extraction" element={<AiExtractionPage />} />
                        <Route path="comparison" element={<DocumentComparisonPage />} />
                        <Route path="compliance" element={<CompliancePage />} />
                        <Route path="compliance/:orderId" element={<ComplianceReviewPage />} />
                        <Route path="shipments" element={<ShipmentsPage />} />
                        <Route path="shipments/:orderId" element={<ShipmentDetailPage />} />
                        <Route path="finance" element={<FinancePage />} />
                        <Route path="analytics" element={<AnalyticsPage />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
