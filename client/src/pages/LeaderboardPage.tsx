import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Award, Users, Crown, Star, Zap, Target, TrendingUp, Calendar, Flame, Clock, Sword, Shield, Upload, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LeaderboardTable from '../components/LeaderboardTable';

export default function LeaderboardPage() {
  const { user, isAuthenticated } = useAuth();
  const [groups, setGroups] = React.useState([]);
  const [selectedGroupId, setSelectedGroupId] = React.useState<string>('');
  const [activeTab, setActiveTab] = React.useState<'today' | 'yesterday' | 'weekly' | 'change'>('today');
  const [loading, setLoading] = React.useState(true);
  const [topUser, setTopUser] = React.useState(null);
  const [leaderboardData, setLeaderboardData] = React.useState([]);

  React.useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserGroups();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  React.useEffect(() => {
    if (selectedGroupId) {
      fetchLeaderboardPreview();
    }
  }, [selectedGroupId, activeTab]);

  const fetchUserGroups = async () => {
    try {
      const response = await fetch(`/api/users/${user?.id}/groups`);
      if (response.ok) {
        const data = await response.json();
        setGroups(data);
        if (data.length > 0) {
          setSelectedGroupId(data[0].id.toString());
        }
      }
    } catch (error) {
      console.error('Error fetching user groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboardPreview = async () => {
    if (!selectedGroupId) return;
    
    try {
      const response = await fetch(`/api/groups/${selectedGroupId}/leaderboard?type=${activeTab}`);
      if (response.ok) {
        const data = await response.json();
        setLeaderboardData(data);
        setTopUser(data[0] || null);
      }
    } catch (error) {
      console.error('Error fetching leaderboard preview:', error);
    }
  };

  const formatTime = (minutes: number) => {
    if (!minutes || minutes === 0) return '0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatPercentage = (percentage: number) => {
    if (percentage === null || percentage === undefined) return 'N/A';
    const isPositive = percentage >= 0;
    return `${isPositive ? '+' : ''}${percentage.toFixed(1)}%`;
  };

  const getUserDisplayName = (user: any) => {
    if (user?.display_name) return user.display_name;
    if (user?.first_name || user?.last_name) {
      return `${user.first_name || ''} ${user.last_name || ''}`.trim();
    }
    return user?.username || 'Unknown';
  };

  const getTabInfo = (tab: string) => {
    switch (tab) {
      case 'today':
        return {
          title: "Daily Duel",
          subtitle: "Today's battle champions",
          icon: <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />,
          gradient: "from-orange-400 to-red-500",
          bgGradient: "from-yellow-100 via-orange-100 to-red-100",
          description: "Who's dominating the screentime battlefield today",
          championTitle: "👑 Daily Champion"
        };
      case 'yesterday':
        return {
          title: "Yesterday's Legends",
          subtitle: "Final scores from yesterday",
          icon: <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />,
          gradient: "from-purple-400 to-pink-500",
          bgGradient: "from-purple-100 via-pink-100 to-purple-100",
          description: "Complete battle results from yesterday's epic showdown",
          championTitle: "🏆 Yesterday's Victor"
        };
      case 'weekly':
        return {
          title: "Weekly Warriors",
          subtitle: "Consistency masters",
          icon: <Target className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />,
          gradient: "from-blue-400 to-cyan-500",
          bgGradient: "from-blue-100 via-cyan-100 to-blue-100",
          description: "Most consistent daily usage this week",
          championTitle: "⭐ Weekly Champion"
        };
      case 'change':
        return {
          title: "Improvement Heroes",
          subtitle: "Making positive changes",
          icon: <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />,
          gradient: "from-green-400 to-emerald-500",
          bgGradient: "from-green-100 via-emerald-100 to-green-100",
          description: "Who's making the biggest positive changes",
          championTitle: "🌟 Improvement MVP"
        };
      default:
        return {
          title: "Champions",
          subtitle: "Group rankings",
          icon: <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />,
          gradient: "from-orange-400 to-red-500",
          bgGradient: "from-orange-100 to-red-100",
          description: "Group rankings",
          championTitle: "👑 Champion"
        };
    }
  };

  const currentTabInfo = getTabInfo(activeTab);
  const selectedGroup = groups.find((g: any) => g.id.toString() === selectedGroupId);

  if (!isAuthenticated) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 blur-xl opacity-20 animate-pulse"></div>
            <h1 className="relative text-2xl sm:text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-4 animate-bounce">
              🏆 Battle Arena
            </h1>
          </div>
          <p className="text-base sm:text-xl text-muted-foreground">Login to join the competition!</p>
        </div>
        
        <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50 hover:shadow-2xl transition-all duration-500">
          <CardContent className="p-6 sm:p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Users className="w-12 h-12 sm:w-20 sm:h-20 text-orange-500 animate-pulse" />
                <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center animate-bounce">
                  <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
              </div>
            </div>
            <h3 className="text-lg sm:text-2xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Join the Competition!
            </h3>
            <p className="text-sm sm:text-lg text-gray-600 mb-6">
              Login to view group leaderboards and compete with your friends in epic screentime battles!
            </p>
            <div className="flex justify-center space-x-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 sm:w-6 sm:h-6 text-orange-400 fill-current animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 blur-xl opacity-20 animate-pulse"></div>
            <h1 className="relative text-2xl sm:text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-4">
              🏆 Battle Arena
            </h1>
          </div>
          <p className="text-base sm:text-xl text-muted-foreground">Loading your battlegrounds...</p>
        </div>
        
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 sm:p-12 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Preparing epic battles...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 blur-xl opacity-20"></div>
            <h1 className="relative text-2xl sm:text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-4">
              🏆 Battle Arena
            </h1>
          </div>
          <p className="text-base sm:text-xl text-muted-foreground">No battles to fight yet!</p>
        </div>
        
        <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50 hover:scale-105 transition-transform duration-300">
          <CardContent className="p-6 sm:p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Users className="w-12 h-12 sm:w-20 sm:h-20 text-orange-500 animate-pulse" />
                <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center animate-bounce">
                  <Flame className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
              </div>
            </div>
            <h3 className="text-lg sm:text-2xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Ready for Battle?
            </h3>
            <p className="text-sm sm:text-lg text-gray-600 mb-6">
              You need to join a group to enter the screentime arena and compete with friends!
            </p>
            <Button asChild size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200">
              <a href="/groups">
                <Trophy className="w-5 h-5 mr-2" />
                Join Your First Battle Group
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Compact Hero Section */}
      <div className="text-center space-y-2">
        <div className="relative">
          <div className={`absolute inset-0 bg-gradient-to-r ${currentTabInfo.gradient} blur-2xl opacity-15 animate-pulse`}></div>
          <h1 className={`relative text-2xl sm:text-4xl font-bold bg-gradient-to-r ${currentTabInfo.gradient} bg-clip-text text-transparent`}>
            🏆 {currentTabInfo.title}
          </h1>
        </div>
        <p className="text-sm sm:text-lg text-muted-foreground">{currentTabInfo.subtitle}</p>
      </div>

      {/* Live Competition Encouragement */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-bold text-green-800">Keep the Battle Alive! ⚔️</h3>
                <p className="text-sm text-green-700">
                  Upload today's screentime to see live rankings and stay competitive!
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-xs text-blue-600 bg-blue-100 px-3 py-2 rounded-full">
              <RefreshCw className="w-4 h-4" />
              <span className="font-medium">Rankings update in real-time</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compact Battle Group Selection */}
      <div className="space-y-3">
        <div className="text-center">
          <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-1">⚔️ Battle Arena</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">Select which group leaderboard to view</p>
        </div>
        
        <div className="flex flex-wrap gap-2 justify-center">
          {groups.map((group: any) => (
            <Button
              key={group.id}
              variant={selectedGroupId === group.id.toString() ? "default" : "outline"}
              onClick={() => setSelectedGroupId(group.id.toString())}
              className={`transition-all duration-300 text-xs sm:text-sm ${
                selectedGroupId === group.id.toString()
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 scale-105'
                  : 'hover:border-orange-300 hover:scale-105'
              }`}
              size="sm"
            >
              {selectedGroupId === group.id.toString() ? (
                <Sword className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              ) : (
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              )}
              <span className="truncate max-w-24 sm:max-w-none">{group.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Enhanced Champion Banner with Medal Colors */}
      {topUser && (
        <Card className={`border bg-gradient-to-r ${currentTabInfo.bgGradient} border-l-8 border-l-yellow-500 shadow-xl hover:shadow-2xl transition-all duration-300`}>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              {/* Profile Image with Medal */}
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center border-4 border-yellow-300 shadow-lg">
                  <span className="text-lg sm:text-2xl font-bold text-yellow-900">
                    {getUserDisplayName(topUser).charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                  <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-900" />
                </div>
              </div>
              
              {/* Champion Info - Mobile Optimized */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center text-center sm:text-left">
                {/* Title and Name */}
                <div>
                  <h2 className="text-sm sm:text-lg font-bold text-yellow-800">{currentTabInfo.championTitle}</h2>
                  <p className="text-lg sm:text-xl font-bold text-gray-800">{getUserDisplayName(topUser)}</p>
                </div>
                
                {/* Score */}
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-gray-700 mb-1">Current Score</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-800">
                    {activeTab === 'today' && formatTime(topUser.today_screentime || 0)}
                    {activeTab === 'yesterday' && formatTime(topUser.yesterday_screentime || 0)}
                    {activeTab === 'weekly' && formatTime(topUser.weekly_average || 0)}
                    {activeTab === 'change' && formatPercentage(topUser.percentage_change)}
                  </p>
                </div>
                
                {/* Achievement Badge */}
                <div className="text-center sm:text-right">
                  <div className="inline-flex items-center px-3 py-2 bg-white/80 backdrop-blur rounded-full border border-yellow-300 shadow-sm">
                    <Trophy className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-yellow-600" />
                    <span className="font-semibold text-gray-800 text-xs sm:text-sm">
                      {activeTab === 'today' && "#1 Today"}
                      {activeTab === 'yesterday' && "#1 Yesterday"}
                      {activeTab === 'weekly' && "#1 This Week"}
                      {activeTab === 'change' && "Top Improver"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Battle Mode Tabs - Mobile Responsive */}
      <div className="overflow-x-auto">
        <div className="flex space-x-1 sm:space-x-2 border-b-2 border-orange-200 min-w-max px-2 sm:px-0">
          <Button
            variant={activeTab === 'today' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('today')}
            className={`rounded-b-none border-b-2 text-xs sm:text-sm px-2 sm:px-4 ${
              activeTab === 'today' 
                ? 'border-orange-400 bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600' 
                : 'border-transparent hover:border-orange-300'
            } transition-all duration-300 transform hover:scale-105`}
            size="sm"
          >
            <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Daily Duel</span>
            <span className="sm:hidden">Today</span>
          </Button>
          <Button
            variant={activeTab === 'yesterday' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('yesterday')}
            className={`rounded-b-none border-b-2 text-xs sm:text-sm px-2 sm:px-4 ${
              activeTab === 'yesterday' 
                ? 'border-purple-400 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600' 
                : 'border-transparent hover:border-purple-300'
            } transition-all duration-300 transform hover:scale-105`}
            size="sm"
          >
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Yesterday's Legends</span>
            <span className="sm:hidden">Yesterday</span>
          </Button>
          <Button
            variant={activeTab === 'weekly' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('weekly')}
            className={`rounded-b-none border-b-2 text-xs sm:text-sm px-2 sm:px-4 ${
              activeTab === 'weekly' 
                ? 'border-blue-400 bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600' 
                : 'border-transparent hover:border-blue-300'
            } transition-all duration-300 transform hover:scale-105`}
            size="sm"
          >
            <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Weekly War</span>
            <span className="sm:hidden">Weekly</span>
          </Button>
          <Button
            variant={activeTab === 'change' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('change')}
            className={`rounded-b-none border-b-2 text-xs sm:text-sm px-2 sm:px-4 ${
              activeTab === 'change' 
                ? 'border-green-400 bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600' 
                : 'border-transparent hover:border-green-300'
            } transition-all duration-300 transform hover:scale-105`}
            size="sm"
          >
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Improvement Arena</span>
            <span className="sm:hidden">Progress</span>
          </Button>
        </div>
      </div>

      {/* Compact Battle Stats - Mobile Responsive */}
      {leaderboardData.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <Card className="border-l-4 border-l-orange-400 bg-gradient-to-r from-orange-50 to-red-50 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-2 sm:p-3 text-center">
              <div className="flex items-center justify-center mb-1">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 mr-1" />
                <span className="text-lg sm:text-xl font-bold text-orange-600">{leaderboardData.length}</span>
              </div>
              <p className="text-xs text-orange-700 font-medium">Warriors</p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-blue-400 bg-gradient-to-r from-blue-50 to-blue-100 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-2 sm:p-3 text-center">
              <div className="flex items-center justify-center mb-1">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mr-1" />
                <span className="text-lg sm:text-xl font-bold text-blue-600">
                  {leaderboardData.filter((u: any) => 
                    activeTab === 'today' ? u.today_screentime > 0 :
                    activeTab === 'yesterday' ? u.yesterday_screentime > 0 :
                    activeTab === 'weekly' ? u.weekly_average > 0 :
                    u.percentage_change !== null
                  ).length}
                </span>
              </div>
              <p className="text-xs text-blue-700 font-medium">Active</p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-400 bg-gradient-to-r from-green-50 to-green-100 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-2 sm:p-3 text-center">
              <div className="flex items-center justify-center mb-1">
                <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-1" />
                <span className="text-xs sm:text-sm font-bold text-green-600 truncate">
                  {selectedGroup?.name || 'Unknown'}
                </span>
              </div>
              <p className="text-xs text-green-700 font-medium">Arena</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Leaderboard - Enhanced UI */}
      {selectedGroupId && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg"></div>
          <LeaderboardTable 
            groupId={parseInt(selectedGroupId)} 
            type={activeTab}
          />
        </div>
      )}

      {/* Compact Motivational Footer */}
      <Card className="bg-gradient-to-r from-orange-50 via-orange-25 to-red-50 border-orange-200 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-4 text-center">
          <div className="flex justify-center space-x-2 mb-2">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
            <Medal className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-orange-600 mb-1">Keep Fighting! 💪</h3>
          <p className="text-xs sm:text-sm text-gray-600">
            Upload your screentime daily to stay in the battle!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}