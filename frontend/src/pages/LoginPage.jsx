import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from '../components/Button'
import Input from '../components/Input'
import Card from '../components/Card'
import './LoginPage.css'

export default function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        setError('')
        setLoading(true)

        try {
            await login(username, password)
            navigate('/dashboard')
        } catch (err) {
            const msg = err.response?.data?.error || 'Login failed. Please try again.'
            setError(msg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-hero">
                    <h1 className="login-hero-title">
                        FOSSEE<br />
                        <span className="gradient-text">Workshop Portal</span>
                    </h1>
                    <div className="login-hero-stats">
                        <div className="hero-stat">
                            <span className="hero-stat-icon">🎓</span>
                            <span className="hero-stat-label">Workshops</span>
                        </div>
                        <div className="hero-stat">
                            <span className="hero-stat-icon">👥</span>
                            <span className="hero-stat-label">Coordinators</span>
                        </div>
                        <div className="hero-stat">
                            <span className="hero-stat-icon">📊</span>
                            <span className="hero-stat-label">Statistics</span>
                        </div>
                    </div>
                </div>

                <div className="login-form-section">
                    <Card className="login-card">
                        <h2 className="login-title">Welcome back</h2>
                        <p className="login-subtitle">Sign in to your account</p>

                        {error && (
                            <div className="login-error animate-fade-in">
                                <span className="material-icons-outlined" style={{ fontSize: '18px' }}>error_outline</span>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="login-form">
                            <Input
                                label="Username"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <Input
                                label="Password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <Button
                                type="submit"
                                fullWidth
                                size="lg"
                                loading={loading}
                            >
                                Sign In
                            </Button>
                        </form>
                        <p className="login-footer-text">
                            Don't have an account?{' '}
                            <Link to="/register" className="login-link">
                                Register as Coordinator
                            </Link>
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    )
}