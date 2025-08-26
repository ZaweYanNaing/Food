import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Edit, Save, X, LogOut, Settings, Heart, BookOpen, Download, Globe, MapPin } from 'lucide-react';
import {Button} from '../../components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';
import UserRecipes from '../../components/UserRecipes';
import UserFavorites from '../../components/UserFavorites';
import UserActivity from '../../components/UserActivity';

type TabType = 'profile' | 'recipes' | 'favorites' | 'activity';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userStats, setUserStats] = useState({
    recipesShared: 0,
    recipesLiked: 0,
    recipesSaved: 0,
    resourcesDownloaded: 0,
    communityPoints: 0
  });
  
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    bio: '',
    location: '',
    website: ''
  });
  
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserProfile();
      loadUserStats();
    }
  }, [user]);

  const loadUserProfile = async () => {
    console.log('Loading user profile...');
    try {
      const response = await apiService.getProfile(user?.id);
      console.log('Profile API response:', response);
      if (response.success && response.data) {
        const userData = response.data;
        setProfileData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          bio: userData.bio || '',
          location: userData.location || '',
          website: userData.website || ''
        });
        
        // Set profile image if available
        if (userData.profile_image) {
          setProfileImage(userData.profile_image);
        }
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const loadUserStats = async () => {
    console.log('Loading user stats...');
    try {
      const response = await apiService.getUserStats(user?.id || 1);
      console.log('Stats API response:', response);
      if (response.success && response.data) {
        setUserStats(response.data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      console.log('=== Saving profile data ===');
      console.log('Profile data to save:', profileData);
      console.log('Current user ID:', user?.id);
      
      const response = await apiService.updateProfile({
        ...profileData,
        profile_image: profileImage || undefined, // Include the current profile image, convert null to undefined
        user_id: user?.id || 1 // Include the user ID
      });
      
      console.log('Profile update response:', response);
      
      if (response.success) {
        setIsEditing(false);
        // Reload profile and stats
        await loadUserProfile();
        await loadUserStats();
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile: ' + (response.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Profile update error:', error);
      alert('Failed to update profile: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

 

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Please select a JPG, PNG, or GIF image.');
      return;
    }

    // Validate file size (20MB limit)
    if (file.size > 20 * 1024 * 1024) {
      alert('File size too large. Please select an image smaller than 20MB.');
      return;
    }

    setIsUploadingImage(true);
    try {
      console.log('=== Starting profile image upload ===');
      console.log('File:', file.name, 'Size:', file.size, 'Type:', file.type);
      console.log('User ID:', user?.id);
      console.log('Current token:', localStorage.getItem('token'));
      
      const response = await apiService.uploadProfileImage(file, user?.id || 1);
      
      console.log('Upload response:', response);
      
      if (response.success && response.data) {
        setProfileImage(response.data.profile_image);
        // Reload profile to get updated data
        await loadUserProfile();
        alert('Profile image uploaded successfully!');
      } else {
        const errorMessage = response.message || 'Failed to upload image';
        console.error('Upload failed:', errorMessage);
        alert('Failed to upload image: ' + errorMessage);
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert('Failed to upload image: ' + errorMessage);
    } finally {
      setIsUploadingImage(false);
      // Reset the file input
      event.target.value = '';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">Please log in to view your profile.</p>
          <Button onClick={() => navigate('/login')}>Go to Login</Button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'recipes', label: 'My Recipes', icon: BookOpen },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'activity', label: 'Activity', icon: Download }
  ];

  const renderTabContent = () => {
    try {
      switch (activeTab) {
        case 'profile':
          return (
            <div className="space-y-6">
              {/* Profile Image Section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Picture</h2>
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    {profileImage ? (
                      <img 
                        src={`http://localhost:8080${profileImage}`} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-lg object-cover shadow-lg"
                        onError={() => {
                          console.error('Failed to load profile image:', profileImage);
                          setProfileImage(null);
                        }}
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center shadow-lg">
                        <User className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    
                    {isEditing && (
                      <label className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 cursor-pointer shadow-lg hover:bg-gray-50 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={isUploadingImage}
                        />
                        {isUploadingImage ? (
                          <div className="w-4 h-4 animate-spin rounded-full border-b-2 border-[#78C841]"></div>
                        ) : (
                          <Edit className="w-4 h-4 text-[#78C841]" />
                        )}
                      </label>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Update Profile Picture</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Upload a new profile picture. Supported formats: JPG, PNG, GIF. Maximum size: 20MB.
                    </p>
                    {isEditing && (
                      <label className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#78C841] hover:bg-[#78C841]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#78C841] cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={isUploadingImage}
                        />
                        {isUploadingImage ? 'Uploading...' : 'Choose Image'}
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="firstName"
                        value={profileData.firstName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#78C841] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="lastName"
                        value={profileData.lastName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#78C841] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#78C841] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="location"
                        value={profileData.location}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="City, State"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#78C841] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="url"
                        name="website"
                        value={profileData.website}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="https://example.com"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#78C841] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      rows={3}
                      value={profileData.bio}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Tell us about yourself and your cooking journey..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#78C841] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        case 'recipes':
          return <UserRecipes userId={user?.id || 1} />;
        case 'favorites':
          return <UserFavorites userId={user?.id || 1} />;
        case 'activity':
          return <UserActivity userId={user?.id || 1} />;
        default:
          return (
            <div className="text-center py-8">
              <p className="text-gray-600">Select a tab to view content</p>
            </div>
          );
      }
    } catch (error) {
      console.error('Error rendering tab content:', error);
      return (
        <div className="text-center py-8">
          <p className="text-red-600">Error loading content. Please try again.</p>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#78C841] to-[#B4E50D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                {profileImage ? (
                  <img 
                    src={`http://localhost:8080${profileImage}`} 
                    alt="Profile" 
                    className="w-16 h-16 rounded-lg object-cover shadow-lg"
                    onError={() => {
                      console.error('Failed to load header profile image:', profileImage);
                      setProfileImage(null);
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-lg">
                    <span className="text-4xl"><User /></span>
                  </div>
                )}
                
                {isEditing && (
                  <label className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 cursor-pointer shadow-lg hover:bg-gray-50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploadingImage}
                    />
                    {isUploadingImage ? (
                      <div className="w-4 h-4 animate-spin rounded-full border-b-2 border-[#78C841]"></div>
                    ) : (
                      <Edit className="w-4 h-4 text-[#78C841]" />
                    )}
                  </label>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-white/90">Member since {new Date().toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex space-x-3">
              {activeTab === 'profile' && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-white text-[#78C841] hover:bg-[#78C841]/10"
                  >
                    {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                
                  {isEditing && (
                    <Button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="bg-white text-[#78C841] hover:bg-[#78C841]/10"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#78C841] mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Navigation Tabs */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Dashboard</h3>
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabType)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-[#78C841]/10 text-[#78C841] border border-[#78C841]/20'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* User Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Recipes Shared</span>
                  <span className="font-semibold text-[#78C841]">{userStats.recipesShared}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Recipes Liked</span>
                  <span className="font-semibold text-[#B4E50D]">{userStats.recipesLiked}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Recipes Saved</span>
                  <span className="font-semibold text-[#FF9B2F]">{userStats.recipesSaved}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Resources Downloaded</span>
                  <span className="font-semibold text-[#78C841]">{userStats.resourcesDownloaded}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Community Points</span>
                  <span className="font-semibold text-[#B4E50D]">{userStats.communityPoints}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/recipes/create')}>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Share a Recipe
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/resources')}>
                  <Download className="w-4 h-4 mr-2" />
                  Browse Resources
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Account Settings
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-red-600 border-red-300 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
