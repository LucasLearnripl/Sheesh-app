import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Calendar, LogOut, Edit, Shield, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import EditProfileForm from './EditProfileForm';

export default function ProfileDisplay() {
  const { user, logout } = useAuth();
  const [showEditForm, setShowEditForm] = React.useState(false);

  if (!user) return null;

  const getDisplayName = () => {
    if (user.display_name) return user.display_name;
    if (user.first_name || user.last_name) {
      return `${user.first_name || ''} ${user.last_name || ''}`.trim();
    }
    return user.username;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (showEditForm) {
    return (
      <EditProfileForm 
        onClose={() => setShowEditForm(false)}
        onSave={() => setShowEditForm(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Profile Information
            </CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => setShowEditForm(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-sheesh rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {getDisplayName().charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{getDisplayName()}</h2>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">@{user.username}</Badge>
                <Badge variant={user.is_private ? "default" : "outline"} className="flex items-center space-x-1">
                  {user.is_private ? (
                    <>
                      <Shield className="w-3 h-3" />
                      <span>Private</span>
                    </>
                  ) : (
                    <>
                      <Globe className="w-3 h-3" />
                      <span>Public</span>
                    </>
                  )}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Personal Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">First Name</label>
                    <p className="text-sm text-muted-foreground">{user.first_name || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Last Name</label>
                    <p className="text-sm text-muted-foreground">{user.last_name || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Display Name</label>
                    <p className="text-sm text-muted-foreground">{user.display_name || 'Not set'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Account Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <label className="text-sm font-medium">Member Since</label>
                      <p className="text-sm text-muted-foreground">{formatDate(user.created_at)}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">User ID</label>
                    <p className="text-sm text-muted-foreground">#{user.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Information */}
          <div className={`p-4 rounded-lg border ${
            user.is_private 
              ? 'bg-blue-50 border-blue-200' 
              : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-start space-x-3">
              {user.is_private ? (
                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              ) : (
                <Globe className="w-5 h-5 text-green-600 mt-0.5" />
              )}
              <div>
                <h4 className={`font-medium ${user.is_private ? 'text-blue-800' : 'text-green-800'}`}>
                  {user.is_private ? 'Private Account' : 'Public Account'}
                </h4>
                <p className={`text-sm mt-1 ${user.is_private ? 'text-blue-700' : 'text-green-700'}`}>
                  {user.is_private 
                    ? 'Your screentime data is only visible to groups you specifically join. You appear as "Private" in the main Sheesh group leaderboard.'
                    : 'Your screentime data is visible to the Sheesh community in all leaderboards, including the main Sheesh group.'
                  }
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
