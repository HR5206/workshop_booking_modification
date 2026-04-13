import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Layout.css'

export default function Layout({ children }) {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
    const closeSidebar = () => setIsSidebarOpen(false)

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    return (
        <div className="layout">
            {/* Mobile Header */}
            <header className="mobile-header">
                <button className="menu-toggle" onClick={toggleSidebar}>
                    <span className="material-icons-outlined">
                        {isSidebarOpen ? 'close' : 'menu'}
                    </span>
                </button>
                <NavLink to="/dashboard" className="mobile-brand">
                    <h2>FOSSEE</h2>
                </NavLink>
                <div style={{ width: '40px' }}></div> {/* Spacer for balance */}
            </header>

            {/* Backdrop */}
            {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

            <aside className={`app-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <NavLink to="/dashboard" className="sidebar-brand" onClick={closeSidebar}>
                        <h2>F O S S E E</h2>
                    </NavLink>
                </div>

                <div className="sidebar-nav">
                    <NavLink to="/dashboard" className="sidebar-link" onClick={closeSidebar}>
                        <span className="material-icons-outlined nav-icon">bar_chart</span>
                        Reports
                    </NavLink>

                    <NavLink to="/workshop-types" className="sidebar-link" onClick={closeSidebar}>
                        <span className="material-icons-outlined nav-icon">library_books</span>
                        Library
                    </NavLink>

                    {!user?.is_instructor && (
                        <NavLink to="/propose" className="sidebar-link" onClick={closeSidebar}>
                            <span className="material-icons-outlined nav-icon">group_add</span>
                            Propose Workshop
                        </NavLink>
                    )}

                    <NavLink to="/statistics" className="sidebar-link" onClick={closeSidebar}>
                        <span className="material-icons-outlined nav-icon">insights</span>
                        Global Stats
                    </NavLink>
                </div>
                
                <div className="sidebar-footer">
                    <div className="sidebar-section-title">Support</div>
                    
                    <NavLink to="/profile" className="sidebar-link" onClick={closeSidebar}>
                        <span className="material-icons-outlined nav-icon">person</span>
                        My Profile
                    </NavLink>

                    <button onClick={() => { handleLogout(); closeSidebar(); }} className="sidebar-link logout-btn">
                        <span className="material-icons-outlined nav-icon">logout</span>
                        Logout
                    </button>
                    
                    {user && (
                        <div className="sidebar-user-info">
                             <div className="user-avatar">
                                 {(user?.first_name?.[0] || user?.username?.[0] || '?').toUpperCase()}
                             </div>
                             <div className="user-details">
                                 <span className="user-name">
                                     {user?.first_name || user?.username}
                                 </span>
                                 <span className="user-role">
                                     {user?.is_instructor ? 'Instructor' : 'Coordinator'}
                                 </span>
                             </div>
                        </div>
                    )}
                </div>
            </aside>

            <main className="main-content">
                {children}
            </main>
        </div>
    )
}