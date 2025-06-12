import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, Medal, Award, User, TrendingUp, TrendingDown, Crown, Star, AlertCircle, Shield } from 'lucide-react';

interface LeaderboardTableProps {
  groupId: number;
  type: 'today' | 'yesterday' | 'weekly' | 'change';
}

export default function LeaderboardTable({ groupId, type }: LeaderboardTableProps) {
  const [leaderboard, setLeaderboard] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (groupId) {
      fetchLeaderboard();
    }
  }, [groupId, type]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/groups/${groupId}/leaderboard?type=${type}`);
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (minutes: number) => {
    if (!minutes || minutes === 0) return 'Incomplete';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatPercentage = (percentage: number) => {
    if (percentage === null || percentage === undefined) return 'N/A';
    const isPositive = percentage >= 0;
    const absPercentage = Math.abs(percentage).toFixed(1);
    return (
      <div className={`flex items-center justify-center ${isPositive ? 'text-red-600' : 'text-green-600'}`}>
        {isPositive ? (
          <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
        ) : (
          <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
        )}
        <span className="text-xs sm:text-sm">{absPercentage}%</span>
      </div>
    );
  };

  const isIncomplete = (user: any) => {
    // Check if user is private and hidden
    if (user.is_private_hidden) return false; // Private users are handled separately
    
    switch (type) {
      case 'today':
        return !user.today_screentime || user.today_screentime === 0;
      case 'yesterday':
        return !user.yesterday_screentime || user.yesterday_screentime === 0;
      case 'weekly':
        return !user.weekly_average || user.weekly_average === 0;
      case 'change':
        return user.percentage_change === null;
      default:
        return false;
    }
  };

  const isPrivateHidden = (user: any) => {
    return user.is_private_hidden === true;
  };

  const getRankIcon = (rank: number, user: any) => {
    const incomplete = isIncomplete(user);
    const privateHidden = isPrivateHidden(user);
    
    if (incomplete || privateHidden) {
      return (
        <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full border-2 border-gray-300">
          {privateHidden ? (
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          ) : (
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          )}
        </div>
      );
    }

    switch (rank) {
      case 1:
        return (
          <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-lg">
            <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-900" />
          </div>
        );
      case 2:
        return (
          <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full shadow-lg">
            <Medal className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
          </div>
        );
      case 3:
        return (
          <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-700 to-amber-900 rounded-full shadow-lg">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-amber-100" />
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full border border-gray-200">
            <span className="text-sm sm:text-base font-medium text-gray-500">{rank}</span>
          </div>
        );
    }
  };

  const getUserDisplayName = (user: any) => {
    if (user.display_name) return user.display_name;
    if (user.first_name || user.last_name) {
      return `${user.first_name || ''} ${user.last_name || ''}`.trim();
    }
    return user.username;
  };

  const getTableHeaders = () => {
    switch (type) {
      case 'today':
        return ['Rank', 'User', "Today's Screentime"];
      case 'yesterday':
        return ['Rank', 'User', "Yesterday's Screentime"];
      case 'weekly':
        return ['Rank', 'User', 'Daily Average', 'Days This Week'];
      case 'change':
        return ['Rank', 'User', 'Change vs Previous', 'Current Average'];
      default:
        return ['Rank', 'User', 'Value'];
    }
  };

  const renderTableCell = (user: any, displayRank: number) => {
    const incomplete = isIncomplete(user);
    const privateHidden = isPrivateHidden(user);
    
    switch (type) {
      case 'today':
        return (
          <TableCell className={`font-bold text-center ${privateHidden ? 'text-gray-500' : incomplete ? 'text-gray-500' : 'text-orange-600'}`}>
            <span className="text-sm sm:text-base">
              {privateHidden ? 'Private' : formatTime(user.today_screentime || 0)}
            </span>
          </TableCell>
        );
      case 'yesterday':
        return (
          <TableCell className={`font-bold text-center ${privateHidden ? 'text-gray-500' : incomplete ? 'text-gray-500' : 'text-purple-600'}`}>
            <span className="text-sm sm:text-base">
              {privateHidden ? 'Private' : formatTime(user.yesterday_screentime || 0)}
            </span>
          </TableCell>
        );
      case 'weekly':
        return (
          <>
            <TableCell className={`font-bold text-center ${privateHidden ? 'text-gray-500' : incomplete ? 'text-gray-500' : 'text-blue-600'}`}>
              <span className="text-sm sm:text-base">
                {privateHidden ? 'Private' : formatTime(user.weekly_average || 0)}
              </span>
            </TableCell>
            <TableCell className="text-blue-700 text-center">
              <span className="text-sm sm:text-base">
                {privateHidden ? '-' : `${user.days_this_week || 0}/7`}
              </span>
            </TableCell>
          </>
        );
      case 'change':
        return (
          <>
            <TableCell className="text-center">
              {privateHidden ? (
                <span className="text-gray-500 text-sm">Private</span>
              ) : (
                formatPercentage(user.percentage_change)
              )}
            </TableCell>
            <TableCell className={`font-bold text-center ${privateHidden ? 'text-gray-500' : incomplete ? 'text-gray-500' : 'text-green-600'}`}>
              <span className="text-sm sm:text-base">
                {privateHidden ? 'Private' : formatTime(user.current_average || 0)}
              </span>
            </TableCell>
          </>
        );
      default:
        return <TableCell className="text-center">-</TableCell>;
    }
  };

  const getPodiumColors = (displayRank: number, user: any) => {
    const incomplete = isIncomplete(user);
    const privateHidden = isPrivateHidden(user);
    
    if (incomplete || privateHidden) {
      return 'bg-gradient-to-r from-gray-50 to-gray-100 border-l-4 border-l-gray-300';
    }

    switch (displayRank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-100 border-l-4 border-l-yellow-500';
      case 2:
        return 'bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 border-l-4 border-l-gray-400';
      case 3:
        return 'bg-gradient-to-r from-amber-100 via-amber-200 to-amber-100 border-l-4 border-l-amber-700';
      default:
        return 'bg-white hover:bg-gray-50 border-l-4 border-l-gray-100';
    }
  };

  const getRankDisplay = (index: number, user: any) => {
    const incomplete = isIncomplete(user);
    const privateHidden = isPrivateHidden(user);
    
    if (incomplete || privateHidden) {
      return '-';
    }
    
    // Find how many complete users come before this one
    let completeUsersAbove = 0;
    for (let i = 0; i < index; i++) {
      const prevUser = leaderboard[i];
      if (!isIncomplete(prevUser) && !isPrivateHidden(prevUser)) {
        completeUsersAbove++;
      }
    }
    
    return completeUsersAbove + 1;
  };

  if (loading) {
    return (
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">Loading leaderboard...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-xl transition-all duration-500 bg-white">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
        <CardTitle className="text-gray-800 flex items-center text-lg sm:text-xl">
          <Trophy className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-orange-500" />
          {type === 'today' && "Today's Battle Rankings"}
          {type === 'yesterday' && "Yesterday's Final Rankings"}
          {type === 'weekly' && "Weekly Consistency Champions"}
          {type === 'change' && "Most Improved Warriors"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {leaderboard.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <User className="w-16 h-16 mx-auto mb-4 animate-pulse text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No Battle Data Yet</h3>
            <p className="text-sm px-4">Group members need to upload their screentime to join the leaderboard!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  {getTableHeaders().map((header, index) => (
                    <TableHead 
                      key={index} 
                      className={`${index === 0 ? "w-20 sm:w-24" : ""} text-gray-700 font-semibold text-center text-xs sm:text-sm`}
                    >
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((user: any, index: number) => {
                  const displayRank = getRankDisplay(index, user);
                  const incomplete = isIncomplete(user);
                  const privateHidden = isPrivateHidden(user);
                  
                  return (
                    <TableRow 
                      key={user.id} 
                      className={`${getPodiumColors(typeof displayRank === 'number' ? displayRank : 999, user)} transition-all duration-200 border-b border-gray-100`}
                    >
                      <TableCell className="text-center py-4">
                        {getRankIcon(typeof displayRank === 'number' ? displayRank : 999, user)}
                      </TableCell>
                      <TableCell className="font-medium text-gray-800 py-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 ${privateHidden ? 'bg-gray-400' : incomplete ? 'bg-gray-400' : 'bg-gradient-sheesh'} rounded-full flex items-center justify-center flex-shrink-0`}>
                            <span className="text-white font-bold text-xs sm:text-sm">
                              {getUserDisplayName(user).charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className={`text-sm sm:text-base font-semibold truncate ${privateHidden || incomplete ? 'text-gray-500' : ''}`}>
                              {getUserDisplayName(user)}
                            </p>
                            {!incomplete && !privateHidden && typeof displayRank === 'number' && displayRank <= 3 && (
                              <div className="flex items-center mt-1">
                                <Star className="w-3 h-3 text-orange-400 fill-current mr-1" />
                                <span className="text-xs text-gray-600">
                                  {displayRank === 1 && "Champion"}
                                  {displayRank === 2 && "Runner-up"}
                                  {displayRank === 3 && "Third Place"}
                                </span>
                              </div>
                            )}
                            {incomplete && !privateHidden && (
                              <div className="flex items-center mt-1">
                                <AlertCircle className="w-3 h-3 text-gray-400 mr-1" />
                                <span className="text-xs text-gray-500">No data uploaded</span>
                              </div>
                            )}
                            {privateHidden && (
                              <div className="flex items-center mt-1">
                                <Shield className="w-3 h-3 text-gray-400 mr-1" />
                                <span className="text-xs text-gray-500">Private account</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      {renderTableCell(user, typeof displayRank === 'number' ? displayRank : 999)}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
