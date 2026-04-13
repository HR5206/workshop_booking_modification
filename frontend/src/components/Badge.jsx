import './Badge.css'

export default function Badge({ children, status = 'default' }) {
    return (
        <span className={`badge badge-${status}`}>
            {children}
        </span>
    )
}

export function getStatusBadge(statusCode) {
    switch (statusCode) {
        case 0: return { label: 'Pending', status: 'warning' }
        case 1: return { label: 'Accepted', status: 'success' }
        case 2: return { label: 'Deleted', status: 'error' }
        default: return { label: 'Unknown', status: 'default' }
    }
}