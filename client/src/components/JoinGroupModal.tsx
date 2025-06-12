import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Users, Key } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface JoinGroupModalProps {
  onClose: () => void;
  onJoined: () => void;
}

export default function JoinGroupModal({ onClose, onJoined }: JoinGroupModalProps) {
  const { user } = useAuth();
  const [joinCode, setJoinCode] = React.useState('');
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
          joinCode: joinCode.toUpperCase(),
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Key className="w-5 h-5 mr-2" />
            Join Private Group
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
            
            <div className="space-y-2">
              <Label htmlFor="joinCode">Join Code</Label>
              <Input
                id="joinCode"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="Enter 6-character code"
                maxLength={6}
                required
              />
              <p className="text-sm text-muted-foreground">
                Enter the 6-character code shared by the group creator
              </p>
            </div>
            
            <div className="flex space-x-2">
              <Button type="submit" disabled={loading || joinCode.length !== 6} className="flex-1">
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
