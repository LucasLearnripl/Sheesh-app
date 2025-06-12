import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Save, X, Shield, Globe, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface EditProfileFormProps {
  onClose: () => void;
  onSave: () => void;
}

export default function EditProfileForm({ onClose, onSave }: EditProfileFormProps) {
  const { user, login } = useAuth();
  const [firstName, setFirstName] = React.useState(user?.first_name || '');
  const [lastName, setLastName] = React.useState(user?.last_name || '');
  const [displayName, setDisplayName] = React.useState(user?.display_name || '');
  const [email, setEmail] = React.useState(user?.email || '');
  const [isPrivate, setIsPrivate] = React.useState(user?.is_private === 1);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [showPrivacyMessage, setShowPrivacyMessage] = React.useState(false);

  const handlePrivacyChange = (newPrivateState: boolean) => {
    setIsPrivate(newPrivateState);
    setShowPrivacyMessage(true);
    // Hide message after 4 seconds
    setTimeout(() => setShowPrivacyMessage(false), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          firstName, 
          lastName, 
          displayName,
          email,
          isPrivate
        }),
      });
      
      if (response.ok) {
        const updatedUser = await response.json();
        login(updatedUser);
        onSave();
        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Edit Profile</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your display name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Privacy Setting */}
          <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  {isPrivate ? (
                    <Shield className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Globe className="w-4 h-4 text-green-600" />
                  )}
                  <Label htmlFor="isPrivate" className="font-medium">
                    {isPrivate ? 'Private Account' : 'Public Account'}
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  {isPrivate 
                    ? 'Only groups you join can see your screentime data'
                    : 'The Sheesh community can see your screentime data'
                  }
                </p>
              </div>
              <Switch
                id="isPrivate"
                checked={isPrivate}
                onCheckedChange={handlePrivacyChange}
              />
            </div>

            {/* Privacy Message */}
            {showPrivacyMessage && (
              <div className={`p-3 rounded-md border animate-in slide-in-from-top-2 duration-300 ${
                isPrivate 
                  ? 'bg-blue-50 border-blue-200' 
                  : 'bg-green-50 border-green-200'
              }`}>
                <div className="flex items-start space-x-2">
                  <Info className={`w-4 h-4 mt-0.5 ${isPrivate ? 'text-blue-600' : 'text-green-600'}`} />
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${isPrivate ? 'text-blue-800' : 'text-green-800'}`}>
                      {isPrivate ? 'Account set to Private' : 'Account set to Public'}
                    </p>
                    <p className={`text-xs mt-1 ${isPrivate ? 'text-blue-700' : 'text-green-700'}`}>
                      {isPrivate 
                        ? 'Only people in groups you join will see your screentime info. You\'ll appear as "Private" in the main Sheesh group leaderboard.'
                        : 'The Sheesh community can see your screentime data in all leaderboards, including the main Sheesh group.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>Public:</strong> Visible in all group leaderboards and the main Sheesh community</p>
              <p><strong>Private:</strong> Only visible in groups you specifically join; shows as "Private" in Sheesh group</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button type="submit" disabled={loading} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
