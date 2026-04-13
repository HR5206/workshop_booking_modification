import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requireInstructor = false }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                fontFamily: 'Inter, sans-serif',
                color: '#64748b'
            }}>
                Loading...
            </div>
        )
    }

    if (!user) {
        return <Navigate to='/login' replace />;
    }

    if (requireInstructor && !user.is_instructor) {
        return <Navigate to="/dashboard" replace />
    }

    return children;
}