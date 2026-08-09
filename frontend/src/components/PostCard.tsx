import React, { useState } from 'react';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './PostCard.css';

interface Comment {
  text: string;
  user: { username: string };
}

interface PostProps {
  key?: string | number;
  post: {
    id: number;
    caption: string;
    imageUrl: string;
    numLikes: number;
    hasLiked?: boolean;
    comments?: Comment[];
    user: {
      username: string;
      id: number;
    };
  };
}

const PostCard: React.FC<PostProps> = ({ post }) => {
  const [likesCount, setLikesCount] = useState(post.numLikes || 0);
  const [liked, setLiked] = useState(post.hasLiked || false);
  const [comments, setComments] = useState<Comment[]>(post.comments || []);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userId = localStorage.getItem('userId');
  const currentUsername = localStorage.getItem('username');

  const handleLike = async () => {
    if (!userId) return;
    try {
      const res = await api.post(`/posts/${post.id}/like?userId=${userId}`);
      if (res.data.success) {
        setLikesCount(res.data.likes);
        setLiked(!liked);
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !commentText.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await api.post(`/posts/${post.id}/comment`, {
        userId,
        text: commentText
      });
      if (res.data.success) {
        setComments([...comments, { text: commentText, user: { username: currentUsername || 'You' } }]);
        setCommentText('');
      }
    } catch (err) {
      console.error('Error adding comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card post-card animate-fade-in">
      <div className="post-header">
        <div className="post-avatar">
          {post.user.username.charAt(0).toUpperCase()}
        </div>
        <Link to={`/profile/${post.user.username}`} className="post-username">
          {post.user.username}
        </Link>
      </div>
      
      {post.imageUrl && (
        <div className="post-image-container">
          <img src={post.imageUrl} alt="Post content" className="post-image" />
        </div>
      )}
      
      <div className="post-actions">
        <button 
          className={`post-action-btn ${liked ? 'liked' : ''}`} 
          title="Like"
          onClick={handleLike}
        >
          <Heart size={24} fill={liked ? 'currentColor' : 'none'} />
          <span>{likesCount}</span>
        </button>
        <button 
          className="post-action-btn" 
          title="Comment"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle size={24} />
          <span>{comments.length}</span>
        </button>
      </div>
      
      <div className="post-content">
        <Link to={`/profile/${post.user.username}`} className="post-caption-username">
          {post.user.username}
        </Link>
        <span className="post-caption">{post.caption}</span>
      </div>

      {showComments && (
        <div className="post-comments-section">
          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="no-comments">No comments yet.</p>
            ) : (
              comments.map((c, idx) => (
                <div key={idx} className="comment-item">
                  <span className="comment-username">{c.user.username}</span>
                  <span className="comment-text">{c.text}</span>
                </div>
              ))
            )}
          </div>
          
          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <input 
              type="text" 
              placeholder="Add a comment..." 
              className="comment-input"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={isSubmitting}
            />
            <button 
              type="submit" 
              className="comment-submit-btn" 
              disabled={!commentText.trim() || isSubmitting}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PostCard;
