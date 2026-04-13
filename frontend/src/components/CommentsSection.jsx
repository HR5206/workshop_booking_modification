import { useState, useEffect } from 'react'
import { getComments, postComment } from '../api/workshops'
import { useAuth } from '../context/AuthContext'
import Button from './Button'
import Spinner from './Spinner'
import './CommentsSection.css'
export default function CommentsSection({ workshopId }) {
    const { user } = useAuth()
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // Form state
    const [newComment, setNewComment] = useState('')
    const [isPublic, setIsPublic] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const fetchComments = async () => {
        try {
            const data = await getComments(workshopId)
            setComments(data)
        } catch (err) {
            setError('Failed to load comments.')
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchComments()
    }, [workshopId])
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!newComment.trim()) return
        setSubmitting(true)
        try {
            await postComment({
                workshop: workshopId,
                comment: newComment,
                public: isPublic
            })
            // Reset form and refresh comments
            setNewComment('')
            await fetchComments()
        } catch (err) {
            alert('Failed to post comment. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }
    // Date formatting helper
    const formatDate = (dateString) => {
        const d = new Date(dateString)
        return d.toLocaleString()
    }
    return (
        <div className="comments-section">
            <h2 className="section-title">Discussion</h2>
            {/* Comment Form */}
            <form className="comment-form" onSubmit={handleSubmit}>
                <textarea
                    className="comment-input"
                    placeholder="Write a message here..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                />

                <div className="comment-form-actions">
                    <label className="checkbox-container">
                        <input
                            type="checkbox"
                            checked={isPublic}
                            onChange={(e) => setIsPublic(e.target.checked)}
                        />
                        <span className="checkmark"></span>
                        Is Public?
                    </label>

                    <Button
                        type="submit"
                        loading={submitting}
                        disabled={!newComment.trim()}
                    >
                        Post Message
                    </Button>
                </div>
            </form>
            {/* Comments List */}
            <div className="comments-list">
                {loading ? (
                    <Spinner size="md" />
                ) : error ? (
                    <p className="error-text">{error}</p>
                ) : comments.length === 0 ? (
                    <p className="no-comments">No messages yet. Start the conversation!</p>
                ) : (
                    comments.map(c => {
                        const isOwnComment = c.author?.id === user?.id

                        return (
                            <div key={c.id} className={`comment-bubble ${isOwnComment ? 'own-comment' : ''}`}>
                                <div className="comment-header">
                                    <strong>{c.author?.first_name} {c.author?.last_name}</strong>
                                    <span className="comment-date">{formatDate(c.created_date)}</span>
                                </div>
                                <div className="comment-text">
                                    {c.comment}
                                </div>
                                {!c.public && (
                                    <div className="comment-private-badge">
                                        <span className="material-icons-outlined">lock</span> Private
                                    </div>
                                )}
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}