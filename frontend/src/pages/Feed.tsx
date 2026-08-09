import React, { useState, useEffect } from 'react';
import api from '../services/api';
import PostCard from '../components/PostCard';
import './Feed.css';

const Feed = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await api.get(`/posts${userId ? `?userId=${userId}` : ''}`);
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="feed-loading animate-fade-in">Loading posts...</div>;
  }

  return (
    <div className="feed-container animate-fade-in">
      <div className="feed-posts">
        {posts.length === 0 ? (
          <div className="feed-empty">No posts available. Be the first to post!</div>
        ) : (
          posts.map(post => (
            <PostCard 
              key={post.id} 
              post={{
                id: post.id,
                caption: post.description || post.caption, 
                imageUrl: (post.imageUrl || post.photo_url || post.url)?.startsWith('http') 
                          ? (post.imageUrl || post.photo_url || post.url) 
                          : `${api.defaults.baseURL}${post.imageUrl || post.photo_url || post.url}`, 
                numLikes: post.likes || post.numLikes || 0,
                hasLiked: post.hasLiked || false,
                comments: post.comments || [],
                user: {
                  username: post.user?.username || post.username || 'Unknown',
                  id: post.user?.id || post.userId || 0
                }
              }} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;
