import './Input.css'

export default function Input({
    label,
    type = 'text',
    error,
    as,
    options = [],
    fullWidth = true,
    ...props
}) {
    const inputClass = `input-field ${error ? 'input-error' : ''}`

    return (
        <div className={`input-group ${fullWidth ? 'input-full' : ''}`}>
            {label && <label className="input-label">{label}</label>}

            {as === 'select' ? (
                <select className={inputClass} {...props}>
                    <option value="">Select...</option>
                    {options.map(opt => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            ) : as === 'textarea' ? (
                <textarea className={inputClass} rows={4} {...props} />
            ) : (
                <input type={type} className={inputClass} {...props} />
            )}
            {error && <span className="input-error-text">{error}</span>}
        </div >
    )
}