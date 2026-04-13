import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getWorkshop, acceptWorkshop } from '../api/workshops'
import { useAuth } from '../context/AuthContext'
import Badge, { getStatusBadge } from '../components/Badge'
import Button from '../components/Button'
import Spinner from '../components/Spinner'
import Card from '../components/Card'
import './WorkshopDetailsPage.css'
import CommentsSection from '../components/CommentsSection'

export default function WorkshopDetailsPage() {
    const { id } = useParams()
    const { user } = useAuth()
    const navigate = useNavigate()

    const [workshop, setWorkshop] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [accepting, setAccepting] = useState(false)

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                // The API call to get a single workshop by ID
                const data = await getWorkshop(id)
                setWorkshop(data)
            } catch (err) {
                setError('Failed to load workshop details.')
            } finally {
                setLoading(false)
            }
        }
        fetchDetails()
    }, [id])

    const handleAcceptWorkshop = async () => {
        setAccepting(true)
        try {
            await acceptWorkshop(id)
            // Re-fetch the page data after accepting
            const data = await getWorkshop(id)
            setWorkshop(data)
        } catch (err) {
            alert('Failed to accept workshop. Please try again.')
        } finally {
            setAccepting(false)
        }
    }

    if (loading) {
        return (
            <div className="details-loading">
                <Spinner size="lg" text="Loading workshop..." />
            </div>
        )
    }

    if (error || !workshop) {
        return (
            <div className="details-error">
                <span className="material-icons-outlined">error</span>
                {error || 'Workshop not found.'}
                <Button onClick={() => navigate('/dashboard')} style={{ marginTop: '1rem' }}>
                    Back to Dashboard
                </Button>
            </div>
        )
    }

    const badgeInfo = getStatusBadge(workshop.status)
    const isPending = workshop.status === 0

    return (
        <div className="details-page animate-fade-in">
            <div className="details-page-inner">
                <div style={{ marginBottom: '1.5rem', marginLeft: '-0.5rem' }}>
                    <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                        <span className="material-icons-outlined">arrow_back</span>
                        Back
                    </Button>
                </div>
                <div className="details-header">
                    <div>
                        <h1 className="details-title">
                            {workshop.workshop_type?.name} Workshop
                        </h1>
                        <div className="details-meta">
                            <span className="meta-item">
                                <span className="material-icons-outlined">tag</span>
                                UID: {workshop.uid}
                            </span>
                        </div>
                    </div>
                    <Badge size="lg" status={badgeInfo.status}>
                        {badgeInfo.label}
                    </Badge>
                </div>
                <div className="details-content">
                    <Card className="info-card-block">
                        <h2 className="section-title">Schedule Information</h2>
                        <div className="info-grid">
                            <div className="info-field">
                                <label>Proposed Date</label>
                                <p>{workshop.date}</p>
                            </div>
                            <div className="info-field">
                                <label>Duration</label>
                                <p>{workshop.workshop_type?.details}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="info-card-block">
                        <h2 className="section-title">Personnel</h2>
                        <div className="info-grid">
                            <div className="info-field">
                                <label>Coordinator</label>
                                <p>{workshop.coordinator?.first_name} {workshop.coordinator?.last_name}</p>
                                <span className="info-subtext">{workshop.coordinator?.email}</span>
                            </div>
                            <div className="info-field">
                                <label>Instructor</label>
                                <p>
                                    {workshop.instructor 
                                        ? ((workshop.instructor.first_name || workshop.instructor.last_name) 
                                            ? `${workshop.instructor.first_name} ${workshop.instructor.last_name}` 
                                            : workshop.instructor.username)
                                        : 'Not Assigned Yet'}
                                </p>
                                {workshop.instructor?.email && (
                                    <span className="info-subtext">{workshop.instructor.email}</span>
                                )}
                            </div>
                        </div>
                    </Card>

                    {user?.is_instructor && isPending && (
                        <Card className="action-card success-border">
                            <div className="action-card-content">
                                <div>
                                    <h3>Accept this Workshop?</h3>
                                    <p>By accepting, you will be assigned as the official instructor for this workshop.</p>
                                </div>
                                <Button
                                    onClick={handleAcceptWorkshop}
                                    loading={accepting}
                                    size="lg"
                                >
                                    Accept & Assign to me
                                </Button>
                            </div>
                        </Card>
                    )}
                    <Card className="info-card-block">
                        <CommentsSection workshopId={workshop.id} />
                    </Card>
                </div>
            </div>
        </div>
    )
}
