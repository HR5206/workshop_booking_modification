import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ProposeWorkshopPage from './pages/ProposeWorkshopPage'
import WorkshopDetailsPage from './pages/WorkshopDetailsPage'
import WorkshopTypesPage from './pages/WorkshopTypesPage'
import StatsPage from './pages/StatsPage'
import ProfilePage from './pages/ProfilePage'

function PlaceholderPage({ title, icon }) {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{icon}</div>
      <h1 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1.75rem' }}>
        {title}
      </h1>
      <p style={{ color: 'var(--text-muted)' }}>
        This page will be built in a later part.
      </p>
    </div>
  )
}


export default function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: '#94a3b8',
      }}>
        Loading...
      </div>
    )
  }

  return (
    <Routes>
      <Route path='/login' element={
        user ? <Navigate to="/dashboard" /> : <LoginPage />
      } />
      <Route path='/register' element={
        user ? <Navigate to="/dashboard" /> : <RegisterPage />
      } />
      <Route path='/dashboard' element={
        <ProtectedRoute>
          <Layout><DashboardPage /></Layout>
        </ProtectedRoute>
      } />
      <Route path='/propose' element={
        <ProtectedRoute>
          <Layout><ProposeWorkshopPage /></Layout>
        </ProtectedRoute>
      } />
      <Route path='/workshop-types' element={
        <ProtectedRoute>
          <Layout><WorkshopTypesPage /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/statistics" element={
        <ProtectedRoute>
          <Layout><StatsPage /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/workshops/:id" element={
        <ProtectedRoute>
          <Layout><WorkshopDetailsPage /></Layout>
        </ProtectedRoute>
      } />

      <Route path='/profile' element={
        <ProtectedRoute>
          <Layout><ProfilePage /></Layout>
        </ProtectedRoute>
      } />
      <Route path='*' element={
        <Navigate to={user ? "/dashboard" : "/login"} replace />
      } />

    </Routes>
  )
}