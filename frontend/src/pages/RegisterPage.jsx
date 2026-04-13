import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../api/auth'
import Button from '../components/Button'
import Input from '../components/Input'
import Card from '../components/Card'
import { titleOptions, departmentOptions, stateOptions, sourceOptions } from '../api/formData'
import './RegisterPage.css'

export default function RegisterPage() {
    const navigate = useNavigate()

    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirm_password: '',
        first_name: '',
        last_name: '',
        title: '',
        phone_number: '',
        institute: '',
        department: '',
        location: '',
        state: '',
        how_did_you_hear_about_us: '',
    })

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)

        if (form.password !== form.confirm_password) {
            setError('Passwords do not match')
            setLoading(false)
            return
        }

        if (form.password.length < 4) {
            setError('Password must be at least 4 characters')
            setLoading(false)
            return
        }

        if (form.phone_number.length !== 10) {
            setError('Phone number must be exactly 10 digits')
            setLoading(false)
            return
        }

        try {
            const data = await registerUser(form)
            setSuccess(data.message || 'Registration successful! Please check your email.')

            setForm({
                username: '', email: '', password: '', confirm_password: '',
                first_name: '', last_name: '', title: '', phone_number: '',
                institute: '', department: '', location: '', state: '',
                how_did_you_hear_about_us: '',
            })
        } catch (err) {
            const msg = err.response?.data?.error || "Registration failed. Please try again."
            setError(msg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="register-page">
            <div className="register-container">
                <div className="register-hero">
                    <h1 className="register-hero-title">
                        Join<br />
                        <span className="gradient-text">FOSSEE Workshops</span>
                    </h1>
                    <p className="register-hero-subtitle">
                        Register as a coordinator to propose and book
                        FOSSEE workshops at your institution.
                    </p>
                    <div className="register-features">
                        <div className="feature-item">
                            <span className="material-icons-outlined feature-icon">event_available</span>
                            <div>
                                <h4>Book Workshops</h4>
                                <p>Schedule workshops at your convenience</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <span className="material-icons-outlined feature-icon">track_changes</span>
                            <div>
                                <h4>Track Status</h4>
                                <p>Monitor your bookings in real-time</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <span className="material-icons-outlined feature-icon">insights</span>
                            <div>
                                <h4>View Statistics</h4>
                                <p>Access workshop data across India</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="register-form-section">
                    <Card className="register-card">
                        <h2 className="register-title">Create your account</h2>
                        <p className="register-subtitle">
                            All fields are required
                        </p>

                        {error && (
                            <div className="register-alert register-alert-success animate-fade-in">
                                <span className="material-icons-outlined" style={{ fontSize: '18px' }}>error_outline</span>
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="register-alert register-alert-success animate-fade-in">
                                <span className="material-icons-outlined" style={{ fontSize: '18px' }}>check_circle_outline</span>
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="register-form">
                            <div className="form-section-label">Personal Information</div>
                            <div className="form-row">
                                <Input
                                    label="Title"
                                    as="select"
                                    name="title"
                                    options={titleOptions}
                                    value={form.title}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    label="First Name"
                                    name="first_name"
                                    placeholder="First name"
                                    value={form.first_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <Input
                                    label="Last Name"
                                    name="last_name"
                                    placeholder="Last name"
                                    value={form.last_name}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    label="Phone Number"
                                    name="phone_number"
                                    placeholder="10-digit phone number"
                                    value={form.phone_number}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-section-label">Institutional Information</div>
                            <Input
                                label="Institute"
                                name="institute"
                                placeholder="e.g., IIT Bombay"
                                value={form.institute}
                                onChange={handleChange}
                                required
                            />
                            <div className="form-row">
                                <Input
                                    label="Department"
                                    as="select"
                                    name="department"
                                    options={departmentOptions}
                                    value={form.department}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    label="State"
                                    as="select"
                                    name="state"
                                    options={stateOptions}
                                    value={form.state}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <Input
                                    label="City / Location"
                                    name="location"
                                    placeholder="e.g., Mumbai"
                                    value={form.location}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    label="How did you hear about us?"
                                    as="select"
                                    name="how_did_you_hear_about_us"
                                    options={sourceOptions}
                                    value={form.how_did_you_hear_about_us}
                                    onChange={handleChange}
                                />
                            </div>
                            {/* Section 3: Account Info */}
                            <div className="form-section-label">Account Details</div>
                            <Input
                                label="Username"
                                name="username"
                                placeholder="Choose a username"
                                value={form.username}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                label="Email"
                                type="email"
                                name="email"
                                placeholder="your@email.com"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                            <div className="form-row">
                                <Input
                                    label="Password"
                                    type="password"
                                    name="password"
                                    placeholder="Create a password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    label="Confirm Password"
                                    type="password"
                                    name="confirm_password"
                                    placeholder="Confirm your password"
                                    value={form.confirm_password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <Button type="submit" fullWidth size="lg" loading={loading}>
                                Create Account
                            </Button>
                        </form>

                        <p className="register-footer-text">
                            Already have an account?{' '}
                            <Link to="/login" className="register-link">
                                Sign in
                            </Link>
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    )
}