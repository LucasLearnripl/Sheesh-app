import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { X, Save, Copy, Trash } from 'lucide-react';

interface EditGroupModalProps {
  group: any;
  onClose: () => void;
  onSaved: () => void;
  onDeleted: () => void;
}

export default function EditGroupModal({ group, onClose, onSaved, onDeleted }: EditGroupModalProps) {
  const [name, setName] = React.useState(group.name);
  const [description, setDescription] = React.useState(group.description || '');
  const [isPrivate, setIsPrivate] = React.useState(group.is_private);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const generateJoinCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      let joinCode = group.join_code;
      
      // Generate new join code if switching to private
      if (isPrivate && !joinCode) {
        joinCode = generateJoinCode();
      }
      // Clear join code if switching to public
      if (!isPrivate) {
        joinCode = null;
      }
      
      const response = await fetch(`/api/groups/${group.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name, 
          description,
          isPrivate,
          joinCode
        }),
      });
      
      if (response.ok) {
        onSaved();
        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update group');
      }
    } catch (error) {
      console.error('Error updating group:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch(`/api/groups/${group.id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        onDeleted();
        onClose();
      } else {
        setError('Failed to delete group');
      }
    } catch (error) {
      console.error('Error deleting group:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyJoinCode = () => {
    if (group.join_code) {
      navigator.clipboard.writeText(group.join_code);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Edit Group</CardTitle>
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
              <Label htmlFor="groupName">Group Name</Label>
              <Input
                id="groupName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter group name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your group"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="isPrivate">Private Group</Label>
                <p className="text-sm text-muted-foreground">
                  {isPrivate ? 'Requires join code to join' : 'Anyone can join'}
                </p>
              </div>
              <Switch
                id="isPrivate"
                checked={isPrivate}
                onCheckedChange={setIsPrivate}
              />
            </div>
            
            {isPrivate && group.join_code && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Current Join Code</p>
                    <code className="text-sm">{group.join_code}</code>
                  </div>
                  <Button size="sm" variant="outline" onClick={copyJoinCode}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
            
            <div className="flex space-x-2 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button 
                type="button" 
                variant="destructive" 
                onClick={handleDelete}
                disabled={loading}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
