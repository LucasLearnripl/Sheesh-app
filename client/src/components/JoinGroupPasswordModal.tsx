import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Lock, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface JoinGroupPasswordModalProps {
  group: any;
  onClose: () => void;
  onJoined: () => void;
}

export default function JoinGroupPasswordModal({ group, onClose, onJoined }: JoinGroupPasswordModalProps) {
  const { user } = useAuth();
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/groups/join-by-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          joinCode: password.toUpperCase(),
          userId: user.id
        }),
      });
      
      if (response.ok) {
        onJoined();
        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Invalid join code');
      }
    } catch (error) {
      console.error('Error joining group:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Lock className="w-5 h-5 mr-2" />
            Join "{group.name}"
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
            
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-gradient-sheesh rounded-full flex items-center justify-center mx-auto mb-3">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg">Private Group</h3>
              <p className="text-sm text-muted-foreground">
                This group requires a join code to enter
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Join Code</Label>
              <Input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value.toUpperCase())}
                placeholder="Enter 6-character code"
                maxLength={6}
                required
                className="text-center text-lg font-mono tracking-wider"
              />
              <p className="text-sm text-muted-foreground">
                Ask the group creator for the join code
              </p>
            </div>
            
            <div className="flex space-x-2">
              <Button type="submit" disabled={loading || password.length !== 6} className="flex-1">
                <Users className="w-4 h-4 mr-2" />
                {loading ? 'Joining...' : 'Join Group'}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
