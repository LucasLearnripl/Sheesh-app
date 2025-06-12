import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Crown, UserPlus, Lock, Globe, Search, Key } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import GroupDetailsModal from './GroupDetailsModal';
import JoinGroupModal from './JoinGroupModal';
import JoinGroupPasswordModal from './JoinGroupPasswordModal';
import EditGroupModal from './EditGroupModal';

export default function ExploreGroups() {
  const { user } = useAuth();
  const [groups, setGroups] = React.useState([]);
  const [userGroups, setUserGroups] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedGroup, setSelectedGroup] = React.useState(null);
  const [showJoinModal, setShowJoinModal] = React.useState(false);
  const [showPasswordModal, setShowPasswordModal] = React.useState(false);
  const [groupToJoin, setGroupToJoin] = React.useState(null);
  const [editingGroup, setEditingGroup] = React.useState(null);

  React.useEffect(() => {
    fetchGroups();
    if (user) {
      fetchUserGroups();
    }
  }, [user]);

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
    }
  };

  const joinPublicGroup = async (groupId: number) => {
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
        fetchGroups();
        fetchUserGroups();
      }
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  const handleJoinGroup = (group: any) => {
    if (!user) return;
    
    if (group.is_private) {
      setGroupToJoin(group);
      setShowPasswordModal(true);
    } else {
      joinPublicGroup(group.id);
    }
  };

  const handleGroupClick = (group: any) => {
    setSelectedGroup(group);
  };

  const handleEditGroup = (group: any) => {
    setEditingGroup(group);
    setSelectedGroup(null);
  };

  const handlePasswordModalSuccess = () => {
    fetchGroups();
    fetchUserGroups();
  };

  const isUserInGroup = (groupId: number) => {
    return userGroups.some((userGroup: any) => userGroup.id === groupId);
  };

  // Real-time filtering as user types - ONLY SEARCH GROUP NAMES
  const filteredGroups = React.useMemo(() => {
    if (!searchTerm.trim()) return groups;
    
    const searchLower = searchTerm.toLowerCase();
    return groups.filter((group: any) =>
      group.name.toLowerCase().includes(searchLower)
    );
  }, [groups, searchTerm]);

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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold">Explore All Groups</h3>
          <p className="text-sm text-muted-foreground">Discover and join groups created by the community</p>
        </div>
        <Button onClick={() => setShowJoinModal(true)} size="sm" className="w-full sm:w-auto">
          <Key className="w-4 h-4 mr-2" />
          Join with Code
        </Button>
      </div>

      {/* Real-time Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search group names..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        {searchTerm && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
            {filteredGroups.length} result{filteredGroups.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {filteredGroups.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm ? 'No groups found' : 'No groups yet'}
            </h3>
            <p className="text-muted-foreground">
              {searchTerm 
                ? `No groups match "${searchTerm}". Try different search terms or create a new group!`
                : 'Be the first to create a group and invite your friends!'}
            </p>
            {searchTerm && (
              <Button 
                variant="outline" 
                onClick={() => setSearchTerm('')}
                className="mt-4"
              >
                Clear Search
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGroups.map((group: any) => {
            const userAlreadyJoined = isUserInGroup(group.id);
            
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
                    {user && group.created_by === user.id && (
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
                        {group.member_count || 0} member{(group.member_count || 0) !== 1 ? 's' : ''}
                      </span>
                      <Badge variant={group.is_private ? "secondary" : "outline"} className="text-xs">
                        {group.is_private ? "Private" : "Public"}
                      </Badge>
                      {userAlreadyJoined && (
                        <Badge variant="default" className="text-xs">Joined</Badge>
                      )}
                    </div>
                    {!userAlreadyJoined && user && (
                      <Button 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleJoinGroup(group);
                        }}
                        className="h-8 px-2 text-xs"
                      >
                        <UserPlus className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                        <span className="hidden sm:inline">Join</span>
                      </Button>
                    )}
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

      {showJoinModal && (
        <JoinGroupModal
          onClose={() => setShowJoinModal(false)}
          onJoined={() => {
            fetchGroups();
            fetchUserGroups();
          }}
        />
      )}

      {showPasswordModal && groupToJoin && (
        <JoinGroupPasswordModal
          group={groupToJoin}
          onClose={() => {
            setShowPasswordModal(false);
            setGroupToJoin(null);
          }}
          onJoined={handlePasswordModalSuccess}
        />
      )}

      {editingGroup && (
        <EditGroupModal
          group={editingGroup}
          onClose={() => setEditingGroup(null)}
          onSaved={() => {
            fetchGroups();
            fetchUserGroups();
          }}
          onDeleted={() => {
            fetchGroups();
            fetchUserGroups();
          }}
        />
      )}
    </div>
  );
}