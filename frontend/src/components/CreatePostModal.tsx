import React, { useState } from 'react';
import { X, ImagePlus } from 'lucide-react';
import api from '../services/api';
import './CreatePostModal.css';

interface CreatePostModalProps {
  onClose: () => void;
  onPostCreated: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose, onPostCreated }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const userId = localStorage.getItem('userId');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !file) return;
    setLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('image', file);
    formData.append('description', description);

    try {
      await api.post(`/posts/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onPostCreated();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear el post');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setError('');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create new post</h2>
          <button className="modal-close-btn" onClick={onClose}><X size={24} /></button>
        </div>

        {error && <div className="modal-error">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="image-preview-box">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="image-preview" />
            ) : (
              <div className="image-placeholder">
                <ImagePlus size={48} />
                <p>Select an image below</p>
              </div>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            className="input-field"
            onChange={handleFileChange}
            required
            style={{ padding: '0.5rem' }}
          />

          <textarea
            className="input-field post-caption-input"
            placeholder="Write a caption..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />

          <button type="submit" className="btn btn-primary modal-submit" disabled={loading}>
            {loading ? 'Posting...' : 'Share'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
