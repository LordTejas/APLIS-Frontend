import React, { useState } from 'react';
import useSession from '@/app/hooks/useSession';
import { FaUser, FaEnvelope, FaLock, FaUserTag } from 'react-icons/fa';
import toast from 'react-hot-toast';

const SettingsView = () => {
  const { session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: session?.user?.username || '',
    email: session?.user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Add validation
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      // Add your update user API call here
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
        
        <div className="mb-8">
          <div className="w-24 h-24 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-white font-bold">
              {session?.user?.username?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <h2 className="text-center text-xl font-semibold">
            {session?.user?.username}
          </h2>
          <p className="text-center text-gray-500">
            {session?.user?.role}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Username Field */}
            <div className="relative">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <FaUser className="mr-2" />
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full p-3 border rounded-md bg-gray-50"
              />
            </div>

            {/* Email Field */}
            <div className="relative">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <FaEnvelope className="mr-2" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full p-3 border rounded-md bg-gray-50"
              />
            </div>

            {/* Role Field */}
            <div className="relative">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <FaUserTag className="mr-2" />
                Role
              </label>
              <input
                type="text"
                value={session?.user?.role}
                disabled
                className="w-full p-3 border rounded-md bg-gray-50"
              />
            </div>
          </div>

          {isEditing && (
            <div className="space-y-4 border-t pt-4 mt-6">
              <h3 className="text-lg font-semibold mb-4">Change Password</h3>
              
              {/* Current Password */}
              <div className="relative">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FaLock className="mr-2" />
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-md"
                />
              </div>

              {/* New Password */}
              <div className="relative">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FaLock className="mr-2" />
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-md"
                />
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FaLock className="mr-2" />
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-md"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4 mt-6">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsView;