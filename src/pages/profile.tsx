import React, { useState } from 'react';
import Layout from '../components/Layout';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState({
    fullName: 'User Name',
    email: 'user@exemplo.com',
    clubName: 'Sample Club',
    position: 'Member',
    phoneNumber: '(11) 99999-9999',
    country: 'Brasil',
    role: 'registered_user'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Profile update logic will be connected here
    setUser(formData);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  return (
    <Layout title="My Profile">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-rotary-blue mb-6">My Profile</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user.fullName}</h2>
              <p className="text-gray-600">{user.clubName} - {user.position}</p>
            </div>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="btn-secondary px-4 py-2"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rotary-blue"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rotary-blue"
                  />
                </div>

                <div>
                  <label htmlFor="clubName" className="block text-sm font-medium text-gray-700 mb-1">
                    Club Rotary
                  </label>
                  <input
                    type="text"
                    id="clubName"
                    name="clubName"
                    value={formData.clubName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rotary-blue"
                  />
                </div>

                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                    Role/Position
                  </label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rotary-blue"
                  />
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rotary-blue"
                  />
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country/Region
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rotary-blue"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-4 py-2"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Personal Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {user.fullName}</p>
                  <p><span className="font-medium">Email:</span> {user.email}</p>
                  <p><span className="font-medium">Phone:</span> {user.phoneNumber}</p>
                  <p><span className="font-medium">Country/Region:</span> {user.country}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Club Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Club:</span> {user.clubName}</p>
                  <p><span className="font-medium">Role:</span> {user.position}</p>
                  <p><span className="font-medium">User Type:</span> {user.role === 'admin' ? 'Administrator' : user.role === 'club_manager' ? 'Club Manager' : 'Registered Member'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-rotary-blue mb-4">Recent Activity</h2>
            <ul className="space-y-3">
              {[1, 2, 3].map((item) => (
                <li key={item} className="flex items-start">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Project created: Sample Project {item}</p>
                    <p className="text-xs text-gray-500">2 days ago</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-rotary-blue mb-4">Recent Projects</h2>
            <div className="space-y-3">
              {[1, 2].map((item) => (
                <div key={item} className="flex items-start border-b pb-3">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex-shrink-0" />
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-900">Sample Project {item}</h3>
                    <p className="text-sm text-gray-500">Sample Club</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                      Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;