import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import userService from '../services/userService';
import PasswordInput from '../components/PasswordInput';
import '../styles/App.css';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    username: '',
    email: ''
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await userService.getProfile();
      setProfileData({ username: data.username, email: data.email });
    } catch (err) {
      setMessage('Failed to fetch profile');
      setMessageType('error');
    }
  };

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await userService.updateProfile(profileData);
      setMessage('Profile updated successfully!');
      setMessageType('success');
      // Refresh user data
      fetchProfile();
    } catch (err) {
      setMessage('Failed to update profile');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await userService.changePassword(passwordData);
      setMessage('Password changed successfully! Please login again with your new password.');
      setMessageType('success');
      setPasswordData({ oldPassword: '', newPassword: '' });
      
      // Log out user after password change
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to change password');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>My Profile</h1>
          <p>Manage your account settings</p>
        </div>
        <div className="user-info">
          <span>{user?.role}</span>
        </div>
      </div>

      <div className="profile-form">
        {message && (
          <div className={messageType === 'success' ? 'success-message' : 'error-message'}>
            {message}
          </div>
        )}
        
        <div className="profile-section">
          <h3>Account Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Username</label>
              <input type="text" value={user?.username || ''} disabled />
            </div>
            <div className="form-group">
              <label>Role</label>
              <input type="text" value={user?.role || ''} disabled />
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile}>
          <h3>Update Profile</h3>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={profileData.username}
              onChange={handleProfileChange}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profileData.email}
              onChange={handleProfileChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>

        <form onSubmit={handleChangePassword} style={{ marginTop: '40px' }}>
          <h3>Change Password</h3>
          <input
            type="hidden"
            name="username"
            value={user?.username || ''}
            autoComplete="username"
            readOnly
          />
          <div className="form-group">
            <label htmlFor="oldPassword">Current Password</label>
            <PasswordInput
              id="oldPassword"
              name="oldPassword"
              value={passwordData.oldPassword}
              onChange={handlePasswordChange}
              placeholder="Enter current password"
              autoComplete="current-password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <PasswordInput
              id="newPassword"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="Enter new password (min 6 characters)"
              autoComplete="new-password"
              required
              minLength="6"
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;