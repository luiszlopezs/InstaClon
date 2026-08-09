import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import PostCard from '../components/PostCard';
import EditProfileModal from '../components/EditProfileModal';
import './Profile.css';

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  
  const currentUser = localStorage.getItem('username');
  const navigate = useNavigate();

  const isOwnProfile = currentUser === username;

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const profileRes = await api.get(`/profile/${username}`);
        setProfile(profileRes.data);
        
        if (profileRes.data && profileRes.data.user) {
          const currentUserId = localStorage.getItem('userId');
          const postsRes = await api.get(`/posts?userId=${profileRes.data.user.id}${currentUserId ? `&currentUserId=${currentUserId}` : ''}`);
          setPosts(postsRes.data);
        }

        if (!isOwnProfile && currentUser) {
          const followRes = await api.get(`/follow/status?from=${currentUser}&to=${username}`);
          setIsFollowing(followRes.data.following);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    const loadProfile = () => {
      if (username) {
        fetchProfileData();
      }
    };
    loadProfile();
  }, [username, currentUser, isOwnProfile]);

  const handleFollowToggle = async () => {
    if (!currentUser) return;
    
    try {
      if (isFollowing) {
        await api.post('/follow/unfollow', { fromUsername: currentUser, toUsername: username });
        setProfile((prev: any) => ({ ...prev, followers: prev.followers - 1 }));
      } else {
        await api.post('/follow/follow', { fromUsername: currentUser, toUsername: username });
        setProfile((prev: any) => ({ ...prev, followers: prev.followers + 1 }));
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    navigate('/login');
    window.location.reload();
  };

  if (loading) return <div className="profile-loading">Loading profile...</div>;
  if (!profile) return <div className="profile-not-found">Profile not found</div>;

  return (
    <div className="profile-container animate-fade-in">
      <div className="profile-header card">
        <div className="profile-info-top">
          <div className="profile-picture">
            {profile.profilePicture && profile.profilePicture !== 'default.jpg' ? (
               <img src={profile.profilePicture.startsWith('http') ? profile.profilePicture : `${api.defaults.baseURL}${profile.profilePicture}`} alt="Profile" />
            ) : (
               <div className="profile-avatar-placeholder">
                 {username?.charAt(0).toUpperCase()}
               </div>
            )}
          </div>
          
          <div className="profile-stats-container">
            <h2 className="profile-username">{profile.user?.username || username}</h2>
            
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-number">{profile.numPosts || posts.length}</span>
                <span className="stat-label">posts</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{profile.followers}</span>
                <span className="stat-label">followers</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{profile.following}</span>
                <span className="stat-label">following</span>
              </div>
            </div>
            
            <div className="profile-actions">
              {isOwnProfile ? (
                <>
                  <button className="btn btn-secondary" onClick={() => setShowEditProfile(true)}>Edit Profile</button>
                  <button className="btn btn-secondary" style={{color: 'var(--danger-color)'}} onClick={handleLogout}>Log Out</button>
                </>
              ) : (
                <button 
                  className={`btn ${isFollowing ? 'btn-secondary' : 'btn-primary'}`} 
                  onClick={handleFollowToggle}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="profile-bio">
          <p>{profile.bio || "No bio yet."}</p>
        </div>
      </div>

      <div className="profile-posts-grid">
        {posts.length === 0 ? (
          <div className="profile-no-posts">No posts yet</div>
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
                  username: profile.user?.username || username || 'Unknown',
                  id: profile.user?.id || 0
                }
              }} 
            />
          ))
        )}
      </div>

      {showEditProfile && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEditProfile(false)}
          onSaved={() => window.location.reload()}
        />
      )}
    </div>
  );
};

export default Profile;
