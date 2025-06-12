import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Crown, Settings, Lock, Globe, UserMinus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import GroupDetailsModal from './GroupDetailsModal';
import EditGroupModal from './EditGroupModal';

export default function MyGroups() {
  const { user } = useAuth();
  const [userGroups, setUserGroups] = React.useState([]);
  const [allGroups, setAllGroups] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedGroup, setSelectedGroup] = React.useState(null);
  const [editingGroup, setEditingGroup] = React.useState(null);

  React.useEffect(() => {
    if (user) {
      fetchUserGroups();
      fetchAllGroups();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchUserGroups = async () => {
    if (!user) return;
    try {
      const response = await fetch(`/api/users/${user.id}/groups`);
      if (response.ok) {
        const data = await response.json();
        setUserGroups(data);
      }
    } catch (error) {
      console.error('Error fetching user groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllGroups = async () => {
    try {
      const response = await fetch('/api/groups');
      if (response.ok) {
        const data = await response.json();
        setAllGroups(data);
      }
    } catch (error) {
      console.error('Error fetching all groups:', error);
    }
  };

  const leaveGroup = async (groupId: number) => {
    if (!user) return;
    
    if (!confirm('Are you sure you want to leave this group?')) {
      return;
    }

    try {
      const response = await fetch(`/api/groups/${groupId}/members/${user.id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        console.log('Left group successfully');
        fetchUserGroups();
        fetchAllGroups();
      }
    } catch (error) {
      console.error('Error leaving group:', error);
    }
  };

  const handleGroupClick = (group: any) => {
    setSelectedGroup(group);
  };

  const handleEditGroup = (group: any) => {
    setEditingGroup(group);
    setSelectedGroup(null);
  };

  const getGroupMemberCount = (groupId: number) => {
    const fullGroup = allGroups.find((g: any) => g.id === groupId);
    return fullGroup?.member_count || 0;
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Login Required</h3>
          <p className="text-muted-foreground">Please login to view your groups.</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">Loading your groups...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">My Groups</h3>
        <p className="text-sm text-muted-foreground">Groups you've joined or created</p>
      </div>

      {userGroups.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No groups joined yet</h3>
            <p className="text-muted-foreground">
              Explore groups to find communities to join, or create your own group!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userGroups.map((group: any) => {
            const memberCount = getGroupMemberCount(group.id);
            
            return (
              <Card 
                key={group.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleGroupClick(group)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                    <span className="flex items-center min-w-0">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                      <span className="truncate">{group.name}</span>
                      {group.is_private ? (
                        <Lock className="w-3 h-3 sm:w-4 sm:h-4 ml-2 text-muted-foreground flex-shrink-0" />
                      ) : (
                        <Globe className="w-3 h-3 sm:w-4 sm:h-4 ml-2 text-muted-foreground flex-shrink-0" />
                      )}
                    </span>
                    {group.created_by === user.id && (
                      <Crown className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {group.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{group.description}</p>
                  )}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {memberCount} member{memberCount !== 1 ? 's' : ''}
                      </span>
                      <Badge variant={group.is_private ? "secondary" : "outline"} className="text-xs">
                        {group.is_private ? "Private" : "Public"}
                      </Badge>
                      {group.created_by === user.id && (
                        <Badge variant="default" className="text-xs">Owner</Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {group.created_by === user.id ? (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditGroup(group);
                          }}
                          className="h-8 px-2"
                        >
                          <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="sr-only sm:not-sr-only sm:ml-1">Edit</span>
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            leaveGroup(group.id);
                          }}
                          className="h-8 px-2"
                        >
                          <UserMinus className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="sr-only sm:not-sr-only sm:ml-1">Leave</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {selectedGroup && (
        <GroupDetailsModal
          group={selectedGroup}
          onClose={() => setSelectedGroup(null)}
          onEdit={() => handleEditGroup(selectedGroup)}
        />
      )}

      {editingGroup && (
        <EditGroupModal
          group={editingGroup}
          onClose={() => setEditingGroup(null)}
          onSaved={() => {
            fetchUserGroups();
            fetchAllGroups();
          }}
          onDeleted={() => {
            fetchUserGroups();
            fetchAllGroups();
          }}
        />
      )}
    </div>
  );
}
