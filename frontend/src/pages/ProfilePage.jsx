import { useState, useEffect } from 'react'
import { getMyProfile, updateProfile } from '../api/workshops'
import { useAuth } from '../context/AuthContext'
import Card from '../components/Card'
import Input from '../components/Input'
import Button from '../components/Button'
import Spinner from '../components/Spinner'
import './ProfilePage.css'
export default function ProfilePage() {
    const { user } = useAuth()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    // Editable form state
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        title: '',
        phone_number: '',
        institute: '',
        department: '',
        location: '',
        state: ''
    })
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getMyProfile()
                setProfile(data)

                // Initialize form with backend data
                setForm({
                    first_name: data.user?.first_name || '',
                    last_name: data.user?.last_name || '',
                    title: data.title || '',
                    phone_number: data.phone_number || '',
                    institute: data.institute || '',
                    department: data.department || '',
                    location: data.location || '',
                    state: data.state || ''
                })
            } catch (err) {
                setMessage({ type: 'error', text: 'Failed to load profile data.' })
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [])
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        setMessage({ type: '', text: '' })
        try {
            const updatedData = await updateProfile(form)
            setProfile(updatedData)
            setMessage({ type: 'success', text: 'Profile updated successfully!' })
        } catch (err) {
            setMessage({
                type: 'error',
                text: err.response?.data?.error || 'Failed to update profile.'
            })
        } finally {
            setSaving(false)
        }
    }
    if (loading) {
        return (
            <div className="profile-loading">
                <Spinner size="lg" text="Loading profile..." />
            </div>
        )
    }
    return (
        <div className="profile-page animate-fade-in">
            <div className="profile-header">
                <h1 className="profile-title">My Profile</h1>
                <p className="profile-subtitle">
                    Manage your personal information and institutional details.
                </p>
            </div>
            <div className="profile-content">
                {/* ── Read Only Info Sidebar ── */}
                <div className="profile-sidebar">
                    <Card className="user-card text-center">
                        <div className="avatar">
                            {profile?.user?.first_name?.[0] || user?.username?.[0] || '?'}
                        </div>
                        <h2 className="profile-name">
                            {profile?.user?.first_name} {profile?.user?.last_name}
                        </h2>
                        <p className="profile-role">
                            {user?.is_instructor ? 'FOSSEE Instructor' : 'Workshop Coordinator'}
                        </p>

                        <div className="user-stats">
                            <div className="stat-item">
                                <span className="stat-value">{profile?.workshops_count || 0}</span>
                                <span className="stat-label">Workshops</span>
                            </div>
                        </div>
                        <div className="user-detail-list">
                            <div className="detail-row">
                                <span className="material-icons-outlined">email</span>
                                {profile?.user?.email}
                            </div>
                            <div className="detail-row">
                                <span className="material-icons-outlined">person</span>
                                {profile?.user?.username}
                            </div>
                        </div>
                    </Card>
                </div>
                {/* ── Editable Form ── */}
                <div className="profile-main">
                    <Card>
                        <h3 className="section-title">Edit Details</h3>

                        {message.text && (
                            <div className={`alert alert-${message.type}`}>
                                <span className="material-icons-outlined">
                                    {message.type === 'success' ? 'check_circle' : 'error'}
                                </span>
                                {message.text}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="profile-form">
                            <div className="form-grid">
                                <Input label="Title" name="title" value={form.title} onChange={handleChange} />
                                <Input label="Phone Number" name="phone_number" value={form.phone_number} onChange={handleChange} />

                                <Input label="First Name" name="first_name" value={form.first_name} onChange={handleChange} required />
                                <Input label="Last Name" name="last_name" value={form.last_name} onChange={handleChange} required />

                                <Input label="Institute" name="institute" value={form.institute} onChange={handleChange} required />
                                <Input label="Department" name="department" value={form.department} onChange={handleChange} required />

                                <Input label="City / Location" name="location" value={form.location} onChange={handleChange} required />
                                <Input label="State" name="state" value={form.state} onChange={handleChange} required />
                            </div>
                            <div className="form-actions">
                                <Button type="submit" loading={saving} size="lg">
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    )
}
