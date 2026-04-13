import './Card.css'

export default function Card({
    children,
    title,
    subtitle,
    hoverable = false,
    className = '',
    padding = true,
    ...props
}) {
    return (
        <div
            className={`card ${hoverable ? 'card-hoverable' : ''} ${className}`}
            {...props}
        >
            {(title || subtitle) && (
                <div className='card-header'>
                    {title && <h3 className='card-title'>{title}</h3>}
                    {subtitle && <p className='card-subtitle'>{subtitle}</p>}
                </div>
            )}
            <div className={padding ? 'card-body' : ''}>
                {children}
            </div>
        </div>
    )
}