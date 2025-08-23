import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {Suspense} from 'react';
import {Route, Routes} from 'react-router-dom';
import './App.css';
import {AppProviders} from './providers';
import AppRoutes from './routes/AppRoutes';
import './css/variables.scss';
import './css/base.scss';

// Import WebSocket test utility for development
if (process.env.NODE_ENV === 'development') {
    import('./utils/WebSocketTest').then(() => {
        console.log('🧪 WebSocket testing utilities loaded. Use window.testWebSocket in console.')
    })
}


/**
 * Main App Component
 * Uses React Router v6 for routing with route configurations
 * Includes Suspense for lazy-loaded components
 */
const App = () => {
    return (
        <AppProviders>
            <Suspense fallback={<div className="d-flex justify-content-center p-3">Loading...</div>}>
                <Routes>
                    {AppRoutes.map((route, index) => (
                        <Route
                            key={route.path || index}
                            path={route.path}
                            element={route.element}
                            index={route.index}
                        />
                    ))}
                </Routes>
            </Suspense>
        </AppProviders>
    )
}

export default App