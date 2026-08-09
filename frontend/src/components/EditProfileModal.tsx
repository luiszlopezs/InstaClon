import React, { useState } from 'react';
import { X } from 'lucide-react';
import api from '../services/api';
import './CreatePostModal.css';

interface EditProfileModalProps {
  profile: any;
  onClose: () => void;
  onSaved: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ profile, onClose, onSaved }) => {
  const [bio, setBio] = useState(profile?.bio || '');
  const [profilePictureUrl, setProfilePictureUrl] = useState(profile?.profilePicture || '');
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const username = localStorage.getItem('username');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;
    setLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('username', username);
    formData.append('bio', bio);
    if (profilePictureFile) {
      formData.append('profilePicture', profilePictureFile);
    }

    try {
      await api.post('/profile/update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setProfilePictureFile(selected);
      setProfilePictureUrl(URL.createObjectURL(selected));
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Profile</h2>
          <button className="modal-close-btn" onClick={onClose}><X size={24} /></button>
        </div>

        {error && <div className="modal-error">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div>
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>
              Profile picture
            </label>
            <div className="image-preview-box" style={{ height: '120px', marginBottom: '0.5rem' }}>
              {profilePictureUrl ? (
                <img src={profilePictureUrl} alt="Preview" className="image-preview" />
              ) : (
                <div className="image-placeholder" style={{ fontSize: '0.85rem' }}>
                  <span style={{ fontSize: '2.5rem' }}>{username?.charAt(0).toUpperCase()}</span>
                  <p>No picture set</p>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              className="input-field"
              onChange={handleFileChange}
              style={{ padding: '0.5rem' }}
            />
          </div>

          <div>
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>
              Bio
            </label>
            <textarea
              className="input-field post-caption-input"
              placeholder="Tell something about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              maxLength={150}
            />
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{bio.length}/150</span>
          </div>

          <button type="submit" className="btn btn-primary modal-submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
