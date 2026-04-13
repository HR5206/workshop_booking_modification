import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getWorkshopTypes } from '../api/workshops'
import Card from '../components/Card'
import Spinner from '../components/Spinner'
import './WorkshopTypesPage.css'
export default function WorkshopTypesPage() {
    const [types, setTypes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    useEffect(() => {
        const fetchTypes = async () => {
            try {
                // Anyone can fetch these
                const data = await getWorkshopTypes()
                setTypes(data)
            } catch (err) {
                setError('Failed to load workshop types.')
            } finally {
                setLoading(false)
            }
        }
        fetchTypes()
    }, [])
    if (loading) {
        return (
            <div className="types-loading">
                <Spinner size="lg" text="Loading workshop categories..." />
            </div>
        )
    }
    if (error) {
        return (
            <div className="types-error">
                <span className="material-icons-outlined">error_outline</span>
                {error}
            </div>
        )
    }
    return (
        <div className="types-page animate-fade-in">
            <div className="types-header">
                <h1 className="types-title">Available Workshop Technologies</h1>
                <p className="types-subtitle">
                    Explore the open-source software workshops provided by the FOSSEE project.
                    Register as a coordinator to propose a workshop at your institution.
                </p>
            </div>
            {types.length === 0 ? (
                <div className="types-empty">
                    <span className="material-icons-outlined empty-icon">menu_book</span>
                    <h3>No Workshops Available Yet</h3>
                    <p>Check back later for new offerings.</p>
                </div>
            ) : (
                <div className="types-grid">
                    {types.map((type, index) => (
                        <Card
                            key={type.id}
                            hoverable
                            className="type-card animate-fade-in"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="type-card-header">
                                <div className="type-icon">
                                    <span className="material-icons-outlined">code</span>
                                </div>
                                <div className="type-duration">
                                    <span className="material-icons-outlined" style={{ fontSize: '16px' }}>schedule</span>
                                    {type.duration} Day(s)
                                </div>
                            </div>

                            <div className="type-card-body">
                                <h3 className="type-name">{type.name}</h3>
                                <p className="type-description">
                                    {type.description}
                                </p>
                            </div>
                            <div className="type-card-footer">
                                <Link to="/propose" className="type-propose-btn">
                                    Propose This <span className="material-icons-outlined">arrow_forward</span>
                                </Link>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}