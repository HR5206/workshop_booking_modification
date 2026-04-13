import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getWorkshopTypes, createWorkshop } from '../api/workshops'
import Button from '../components/Button'
import Input from '../components/Input'
import Card from '../components/Card'
import Spinner from '../components/Spinner'
import './ProposeWorkshopPage.css'

export default function ProposeWorkshopPage() {
    const navigate = useNavigate()

    const [workshopTypes, setWorkshopTypes] = useState([])
    const [loadingTypes, setLoadingTypes] = useState(true)

    const [form, setForm] = useState({
        workshop_type_id: '',
        date: '',
        tnc_accepted: false,
    })

    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const data = await getWorkshopTypes()
                setWorkshopTypes(data)
            } catch (err) {
                setError('Failed to load workshop types. Please refresh the page.')
            } finally {
                setLoadingTypes(false)
            }
        }
        fetchTypes()
    }, [])

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
        setForm({ ...form, [e.target.name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!form.tnc_accepted) {
            setError('You must accept the Terms and Conditions to propose a workshop.')
            return
        }

        setLoadingSubmit(true)

        try {
            await createWorkshop(form)

            navigate('/dashboard')
        } catch (err) {
            const msg = err.response?.data?.error || 'Failed to propose workshop. Please check your inputs.'
            setError(msg)
        } finally {
            setLoadingSubmit(false)
        }
    }

    const minDate = new Date()
    minDate.setDate(minDate.getDate() + 15)
    const minDateStr = minDate.toISOString().split('T')[0]

    if (loadingTypes) {
        return (
            <div className='propose-loading'>
                <Spinner size="lg" text="Loading workshop types..." />
            </div>
        )
    }

    return (
        <div className="propose-page animate-fade-in">
            <div className="propose-header">
                <h1 className="propose-title">Propose a Workshop</h1>
                <p className="propose-subtitle">
                    Select a technology and date. Please note that requests must be made
                    at least 15 days in advance.
                </p>
            </div>

            <div className="propose-content">
                <Card className="propose-card">
                    {error && (
                        <div className="propose-error">
                            <span className="material-icons-outlined">error_outline</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="propose-form">
                        <div className="form-group mb-4">
                            <label className="input-label">Workshop Type</label>
                            <select
                                className="input-field"
                                name="workshop_type_id"
                                value={form.workshop_type_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select a workshop type...</option>
                                {workshopTypes.map(type => (
                                    <option key={type.id} value={type.id}>
                                        {type.name} (Duration: {type.details})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group mb-6">
                            <Input
                                label="Proposed Date"
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={handleChange}
                                min={minDateStr}
                                required
                            />
                            <p className="helper-text">
                                Workshops can only be scheduled at least 15 days from today.
                            </p>
                        </div>
                        <div className="tnc-box mb-6">
                            <label className="checkbox-container">
                                <input
                                    type="checkbox"
                                    name="tnc_accepted"
                                    checked={form.tnc_accepted}
                                    onChange={handleChange}
                                    required
                                />
                                <span className="checkmark"></span>
                                <span className="tnc-text">
                                    I accept the <a href="#" target="_blank">Terms and Conditions</a> and confirm
                                    that the management of my institution is aware of this FOSSEE workshop proposal.
                                </span>
                            </label>
                        </div>
                        <Button
                            type="submit"
                            size="lg"
                            fullWidth
                            loading={loadingSubmit}
                        >
                            Submit Proposal
                        </Button>
                    </form>
                </Card>

                <div className="propose-info">
                    <Card padding={false} className="info-card">
                        <div className="info-header">
                            <span className="material-icons-outlined">info</span>
                            <h3>What happens next?</h3>
                        </div>
                        <ul className="info-list">
                            <li>Your request will appear as <strong>Pending</strong> in your dashboard.</li>
                            <li>A FOSSEE Instructor will review and accept the request.</li>
                            <li>Once accepted, the status changes to <strong>Accepted</strong>.</li>
                            <li>You will then be able to invite participants.</li>
                        </ul>
                    </Card>
                </div>
            </div>
        </div >
    )
}