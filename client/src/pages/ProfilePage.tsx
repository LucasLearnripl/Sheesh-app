import * as React from 'react';
import { Button } from '@/components/ui/button';
import { User, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ProfileForm from '../components/ProfileForm';
import ProfileDisplay from '../components/ProfileDisplay';
import LoginForm from '../components/LoginForm';

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const [showLogin, setShowLogin] = React.useState(false);

  if (isAuthenticated && user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-sheesh rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Your Profile</h1>
            <p className="text-muted-foreground">Manage your personal information and account settings</p>
          </div>
        </div>

        <ProfileDisplay />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gradient-sheesh rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Create an account or login to get started</p>
        </div>
      </div>

      <div className="flex justify-center space-x-2 mb-6">
        <Button
          variant={!showLogin ? 'default' : 'outline'}
          onClick={() => setShowLogin(false)}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Sign Up
        </Button>
        <Button
          variant={showLogin ? 'default' : 'outline'}
          onClick={() => setShowLogin(true)}
        >
          <LogIn className="w-4 h-4 mr-2" />
          Login
        </Button>
      </div>

      {showLogin ? <LoginForm /> : <ProfileForm />}
    </div>
  );
}
