import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Users, Crown, Lock, Globe, Copy, Settings, UserX } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface GroupDetailsModalProps {
  group: any;
  onClose: () => void;
  onEdit?: () => void;
}

export default function GroupDetailsModal({ group, onClose, onEdit }: GroupDetailsModalProps) {
  const { user } = useAuth();
  const [members, setMembers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchGroupMembers();
  }, [group.id]);

  const fetchGroupMembers = async () => {
    try {
      const response = await fetch(`/api/groups/${group.id}/members`);
      if (response.ok) {
        const data = await response.json();
        setMembers(data);
      }
    } catch (error) {
      console.error('Error fetching group members:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeUser = async (userId: number) => {
    try {
      const response = await fetch(`/api/groups/${group.id}/members/${userId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchGroupMembers(); // Refresh the member list
      }
    } catch (error) {
      console.error('Error removing user:', error);
    }
  };

  const copyJoinCode = () => {
    if (group.join_code) {
      navigator.clipboard.writeText(group.join_code);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const isCreator = user && group.created_by === user.id;

  const getUserDisplayName = (member: any) => {
    if (member.display_name) return member.display_name;
    if (member.first_name || member.last_name) {
      return `${member.first_name || ''} ${member.last_name || ''}`.trim();
    }
    return member.username;
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              {group.name}
              {group.is_private ? (
                <Lock className="w-4 h-4 ml-2 text-muted-foreground" />
              ) : (
                <Globe className="w-4 h-4 ml-2 text-muted-foreground" />
              )}
            </CardTitle>
            {group.description && (
              <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {isCreator && onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Settings className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {group.is_private && group.join_code && isCreator && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Join Code</h3>
                  <p className="text-sm text-muted-foreground">Share this code with friends to invite them</p>
                </div>
                <div className="flex items-center space-x-2">
                  <code className="px-3 py-1 bg-background rounded font-mono">{group.join_code}</code>
                  <Button size="sm" variant="outline" onClick={copyJoinCode}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div>
            <h3 className="font-medium mb-4">Members ({members.length})</h3>
            {loading ? (
              <div className="text-center text-muted-foreground py-4">Loading members...</div>
            ) : members.length === 0 ? (
              <div className="text-center text-muted-foreground py-4">No members yet</div>
            ) : (
              <div className="space-y-2">
                {members.map((member: any) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-sheesh rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {getUserDisplayName(member).charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{getUserDisplayName(member)}</p>
                        <p className="text-sm text-muted-foreground">@{member.username}</p>
                      </div>
                      {member.id === group.created_by && (
                        <Crown className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                    {isCreator && member.id !== group.created_by && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => removeUser(member.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <UserX className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
