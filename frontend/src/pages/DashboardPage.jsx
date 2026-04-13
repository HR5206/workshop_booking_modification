import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getWorkshops } from '../api/workshops'
import { useAuth } from '../context/AuthContext'
import Card from '../components/Card'
import Badge, { getStatusBadge } from '../components/Badge'
import Spinner from '../components/Spinner'
import './DashboardPage.css'

export default function DashboardPage() {
    const { user } = useAuth()

    const [workshops, setWorkshops] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchWorkshops = async () => {
            try {
                const data = await getWorkshops()
                setWorkshops(data)
            } catch (err) {
                setError('Failed to fetch workshops. Please try again later.')
            } finally {
                setLoading(false)
            }
        }

        fetchWorkshops()
    }, [])

    if (loading) {
        return (
            <div className="dashboard-loading">
                <Spinner size="lg" text="Loading your dashboard..." />
            </div>
        )
    }

    if (error) {
        return (
            <div className="dashboard-error">
                <span className="material-icons-outlined">error_outline</span>
                {error}
            </div>
        )
    }

    return (
        <div className="dashboard-page">
            <div className="dashboard-header animate-fade-in">
                <div>
                    <h1>
                        Welcome, {user?.first_name || user?.username}! 👋
                    </h1>
                    <p className="dashboard-subtitle">
                        {user?.is_instructor ? "Here you can review pending requests or view your assigned workshops." : "Here are the workshops you have proposed."}
                    </p>
                </div>

                {!user?.is_instructor && (
                    <Link to="/propose" className="btn btn-primary">
                        <span className="material-icons-outlined">add</span>
                        Propose New Workshop
                    </Link>
                )}
            </div>

            {workshops.length === 0 ? (
                <div className="dashboard-empty animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="empty-icon">📅</div>
                    <h3>No workshops found</h3>
                    <p>You haven't proposed any workshops yet. Click the button above to get started.</p>
                </div>
            ) : (
                <div className="workshop-grid">
                    {workshops.map((ws, index) => {
                        const badgeInfo = getStatusBadge(ws.status)
                        return (
                            <Link
                                to={`/workshops/${ws.id}`}
                                key={ws.id}
                                className='workshop-card-link'
                            >
                                <Card padding={false} hoverable className="workshop-card animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                                    <div className="workshop-card-header">
                                        <div className="ws-type">
                                            <span className="material-icons-outlined">computer</span>
                                            {ws.workshop_type?.name}
                                        </div>
                                        <Badge status={badgeInfo.status}>
                                            {badgeInfo.label}
                                        </Badge>

                                        <div className="workshop-card-body">
                                            <h3 className="ws-title">
                                                {ws.workshop_type?.name} Workshop
                                            </h3>
                                            <div className="ws-meta-item">
                                                <span className="material-icons-outlined">event</span>
                                                {ws.date}
                                            </div>
                                            <div className="ws-meta-item">
                                                <span className="material-icons-outlined">tag</span>
                                                {ws.uid}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

