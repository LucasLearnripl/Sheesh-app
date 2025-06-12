import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Crown, UserPlus, Lock, Globe, Key } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import GroupDetailsModal from './GroupDetailsModal';
import JoinGroupModal from './JoinGroupModal';
import EditGroupModal from './EditGroupModal';

export default function GroupsList() {
  const { user } = useAuth();
  const [groups, setGroups] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedGroup, setSelectedGroup] = React.useState(null);
  const [showJoinModal, setShowJoinModal] = React.useState(false);
  const [editingGroup, setEditingGroup] = React.useState(null);

  React.useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await fetch('/api/groups');
      if (response.ok) {
        const data = await response.json();
        setGroups(data);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const joinGroup = async (groupId: number) => {
    if (!user) {
      console.error('User not logged in');
      return;
    }

    try {
      const response = await fetch(`/api/groups/${groupId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });
      
      if (response.ok) {
        console.log('Joined group successfully');
        fetchGroups(); // Refresh the list
      }
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  const handleGroupClick = (group: any) => {
    setSelectedGroup(group);
  };

  const handleEditGroup = (group: any) => {
    setEditingGroup(group);
    setSelectedGroup(null);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">Loading groups...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Available Groups</h2>
          <p className="text-sm text-muted-foreground">Click on a group to see members</p>
        </div>
        <Button onClick={() => setShowJoinModal(true)}>
          <Key className="w-4 h-4 mr-2" />
          Join with Code
        </Button>
      </div>

      {groups.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No groups yet</h3>
            <p className="text-muted-foreground">Be the first to create a group and invite your friends!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group: any) => (
            <Card 
              key={group.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleGroupClick(group)}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    {group.name}
                    {group.is_private ? (
                      <Lock className="w-4 h-4 ml-2 text-muted-foreground" />
                    ) : (
                      <Globe className="w-4 h-4 ml-2 text-muted-foreground" />
                    )}
                  </span>
                  {user && group.created_by === user.id && (
                    <Crown className="w-4 h-4 text-yellow-500" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {group.description && (
                  <p className="text-sm text-muted-foreground mb-4">{group.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {group.member_count || 0} members
                    </span>
                    <Badge variant={group.is_private ? "secondary" : "outline"}>
                      {group.is_private ? "Private" : "Public"}
                    </Badge>
                  </div>
                  {!group.is_private && (
                    <Button 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        joinGroup(group.id);
                      }} 
                      disabled={!user}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Join
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedGroup && (
        <GroupDetailsModal
          group={selectedGroup}
          onClose={() => setSelectedGroup(null)}
          onEdit={() => handleEditGroup(selectedGroup)}
        />
      )}

      {showJoinModal && (
        <JoinGroupModal
          onClose={() => setShowJoinModal(false)}
          onJoined={fetchGroups}
        />
      )}

      {editingGroup && (
        <EditGroupModal
          group={editingGroup}
          onClose={() => setEditingGroup(null)}
          onSaved={fetchGroups}
          onDeleted={fetchGroups}
        />
      )}
    </div>
  );
}
