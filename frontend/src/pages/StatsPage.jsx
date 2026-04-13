import { useState, useEffect } from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'
import { getWorkshopStats } from '../api/workshops'
import Card from '../components/Card'
import Spinner from '../components/Spinner'
import './StatsPage.css'


ChartJS.register(
    CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement
)

export default function StatsPage() {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // Filter states
    const [filters, setFilters] = useState({
        timeframe: 'all', // all, 7d, 30d, 90d
        state: 'all'
    })

    const [openDropdown, setOpenDropdown] = useState(null) // 'timeframe' or 'state'

    const fetchStats = async () => {
        setLoading(true)
        try {
            const params = {}
            if (filters.state !== 'all') {
                params.state = filters.state
            }

            if (filters.timeframe !== 'all') {
                const now = new Date()
                const toDate = now.toISOString().split('T')[0]
                const fromDateObj = new Date()
                
                if (filters.timeframe === '7d') fromDateObj.setDate(now.getDate() - 7)
                if (filters.timeframe === '30d') fromDateObj.setDate(now.getDate() - 30)
                if (filters.timeframe === '90d') fromDateObj.setDate(now.getDate() - 90)
                
                params.from_date = fromDateObj.toISOString().split('T')[0]
                params.to_date = toDate
            }

            const data = await getWorkshopStats(params)
            setStats(data)
        } catch (err) {
            setError('Failed to load statistics.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStats()
    }, [filters])

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }))
        setOpenDropdown(null)
    }

    const toggleDropdown = (name) => {
        setOpenDropdown(openDropdown === name ? null : name)
    }

    // Helper to get humans readable label for timeframe
    const getTimeframeLabel = () => {
        if (filters.timeframe === '7d') return 'Last 7 days'
        if (filters.timeframe === '30d') return 'Last 30 days'
        if (filters.timeframe === '90d') return 'Last 90 days'
        return 'All-time'
    }

    if (loading && !stats) {
        return (
            <div className="stats-loading">
                <Spinner size="lg" text="Crunching the numbers..." />
            </div>
        )
    }

    if (error || !stats) {
        return (
            <div className="stats-error">
                <span className="material-icons-outlined">error_outline</span>
                {error || 'Unable to load statistics.'}
            </div>
        )
    }

    const stateLabels = stats.chart_data?.states || []
    const stateData = stats.chart_data?.state_counts || []
    
    // Aesthetic Chart JS styles
    const barChartData = {
        labels: stateLabels,
        datasets: [
            {
                label: 'Accepted Workshops',
                data: stateData,
                backgroundColor: 'rgba(37, 99, 235, 0.8)', // Primary-600
                borderColor: 'rgba(37, 99, 235, 1)',
                borderWidth: 0,
                borderRadius: 8,
                barThickness: 24,
            }
        ]
    }

    const typeLabels = stats.chart_data?.types || []
    const typeData = stats.chart_data?.type_counts || []
    
    const doughnutChartData = {
        labels: typeLabels,
        datasets: [
            {
                data: typeData,
                backgroundColor: [
                    '#2563eb', // Primary
                    '#10b981', // Emerald
                    '#f59e0b', // Amber
                    '#ef4444', // Red
                    '#8b5cf6', // Violet
                    '#ec4899', // Pink
                ],
                borderWidth: 0,
            }
        ]
    }

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'bottom' }
        },
        scales: {
            x: { grid: { display: false } },
            y: { grid: { color: 'rgba(0,0,0,0.03)' }, border: { display: false } }
        }
    }

    // Calculated stats
    const topTechIndex = typeData.indexOf(Math.max(...(typeData.length ? typeData : [0])))
    const topTech = typeLabels[topTechIndex] || 'None'
    const activeStates = stateLabels.length

    // Final Guard for data integrity
    if (!stats || !stats.chart_data) {
        return (
            <div className="stats-empty">
                <Spinner size="md" text="Waiting for data structures..." />
            </div>
        )
    }

    return (
        <div className="dashboard-layout animate-fade-in">
            <div className="dashboard-topbar">
                <h1 className="dashboard-title">Reports</h1>
                
                <div className="dashboard-filters">
                    {/* Timeframe Filter */}
                    <div className="dropdown-container">
                        <div className="filter-pill" onClick={() => toggleDropdown('timeframe')}>
                            Timeframe: <strong>{getTimeframeLabel()}</strong>
                            <span className="material-icons-outlined">arrow_drop_down</span>
                        </div>
                        {openDropdown === 'timeframe' && (
                            <div className="filter-dropdown animate-fade-in">
                                <div className={`dropdown-item ${filters.timeframe === 'all' ? 'active' : ''}`} onClick={() => handleFilterChange('timeframe', 'all')}>All-time</div>
                                <div className={`dropdown-item ${filters.timeframe === '7d' ? 'active' : ''}`} onClick={() => handleFilterChange('timeframe', '7d')}>Last 7 days</div>
                                <div className={`dropdown-item ${filters.timeframe === '30d' ? 'active' : ''}`} onClick={() => handleFilterChange('timeframe', '30d')}>Last 30 days</div>
                                <div className={`dropdown-item ${filters.timeframe === '90d' ? 'active' : ''}`} onClick={() => handleFilterChange('timeframe', '90d')}>Last 90 days</div>
                            </div>
                        )}
                    </div>

                    {/* Region Filter */}
                    <div className="dropdown-container">
                        <div className="filter-pill" onClick={() => toggleDropdown('state')}>
                            Region: <strong>{filters.state === 'all' ? 'All' : filters.state}</strong>
                            <span className="material-icons-outlined">arrow_drop_down</span>
                        </div>
                        {openDropdown === 'state' && (
                            <div className="filter-dropdown animate-fade-in">
                                <div className={`dropdown-item ${filters.state === 'all' ? 'active' : ''}`} onClick={() => handleFilterChange('state', 'all')}>All Regions</div>
                                {stats?.chart_data?.states?.map(s => (
                                    <div 
                                        key={s} 
                                        className={`dropdown-item ${filters.state === s ? 'active' : ''}`} 
                                        onClick={() => handleFilterChange('state', s)}
                                    >
                                        {s}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {stats.total_count === 0 ? (
                <div className="stats-empty">
                    <span className="material-icons-outlined">insert_chart_outlined</span>
                    <h3>No Data Available</h3>
                    <p>There are no accepted workshops found for the selected criteria.</p>
                </div>
            ) : (
                <>
                    <div className="kpi-grid">
                        <Card className="kpi-card">
                            <span className="kpi-label">Active States</span>
                            <div className="kpi-value">{activeStates}</div>
                        </Card>
                        <Card className="kpi-card">
                            <span className="kpi-label">Total Workshops</span>
                            <div className="kpi-value">{stats.total_count}</div>
                        </Card>
                        <Card className="kpi-card">
                            <span className="kpi-label">Top Technology</span>
                            <div className="kpi-value kpi-text">{topTech}</div>
                        </Card>
                    </div>

                    <div className="charts-grid-modern">
                        <Card className="chart-card-modern stretch-span">
                            <h3 className="chart-title">Activity by State</h3>
                            <div className="bar-chart-container">
                                <Bar data={barChartData} options={chartOptions} />
                            </div>
                        </Card>
                        <Card className="chart-card-modern">
                            <h3 className="chart-title">Strongest Topics</h3>
                            <div className="doughnut-chart-container">
                                <Doughnut data={doughnutChartData} options={{...chartOptions, scales: {}}} />
                            </div>
                        </Card>
                    </div>
                </>
            )}
        </div>
    )
}