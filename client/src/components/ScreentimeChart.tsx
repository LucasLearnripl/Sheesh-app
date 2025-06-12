import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, TrendingUp, Calendar, Smartphone, Flame, Target, TrendingDown, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function ScreentimeChart() {
  const { user, isAuthenticated } = useAuth();
  const [entries, setEntries] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (isAuthenticated && user) {
      fetchScreentimeData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const fetchScreentimeData = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/screentime/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setEntries(data);
      }
    } catch (error) {
      console.error('Error fetching screentime data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Get today's screentime
  const today = new Date().toISOString().split('T')[0];
  const todayEntry = entries.find((entry: any) => entry.date === today);
  const todayMinutes = todayEntry?.totalMinutes || 0;

  // Calculate daily average with proper rounding (excluding today)
  const entriesExcludingToday = entries.filter((entry: any) => entry.date !== today);
  const averageScreentime = entriesExcludingToday.length > 0 
    ? Math.round(entriesExcludingToday.reduce((sum: number, entry: any) => sum + entry.totalMinutes, 0) / entriesExcludingToday.length)
    : 0;

  // Calculate days per year spent on phone
  const minutesPerDay = averageScreentime || todayMinutes;
  const hoursPerDay = minutesPerDay / 60;
  const daysPerYear = (hoursPerDay * 365) / 24;

  // Calculate 3-day improvement metrics
  const calculate3DayImprovement = () => {
    if (entries.length < 6) return null;
    
    const today = new Date().toISOString().split('T')[0];
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const sixDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Current 3-day period (excluding today)
    const currentPeriodEntries = entries.filter((entry: any) => 
      entry.date >= threeDaysAgo && entry.date < today
    );
    
    // Previous 3-day period (days 4-6 ago)
    const previousPeriodEntries = entries.filter((entry: any) => 
      entry.date >= sixDaysAgo && entry.date < threeDaysAgo
    );
    
    if (currentPeriodEntries.length === 0 || previousPeriodEntries.length === 0) return null;
    
    const currentAvg = Math.round(
      currentPeriodEntries.reduce((sum: number, entry: any) => sum + entry.totalMinutes, 0) / currentPeriodEntries.length
    );
    
    const previousAvg = Math.round(
      previousPeriodEntries.reduce((sum: number, entry: any) => sum + entry.totalMinutes, 0) / previousPeriodEntries.length
    );
    
    const change = currentAvg - previousAvg;
    const percentageChange = previousAvg > 0 ? ((change / previousAvg) * 100) : 0;
    
    return {
      currentAvg,
      previousAvg,
      change,
      percentageChange,
      currentDays: currentPeriodEntries.length,
      previousDays: previousPeriodEntries.length
    };
  };

  const improvementData = calculate3DayImprovement();

  // Get last 7 days of data (excluding today)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (i + 1)); // Start from yesterday and go back
    return date.toISOString().split('T')[0];
  }); // Descending order from yesterday

  const chartData = last7Days.map(date => {
    const entry = entries.find((e: any) => e.date === date);
    const dateObj = new Date(date);
    return {
      date,
      minutes: entry?.totalMinutes || 0,
      dayName: dateObj.toLocaleDateString('en-US', { weekday: 'short' }),
      monthDay: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      isYesterday: date === new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
  });

  // Calculate weekly average from past 7 days (excluding today)
  const weeklyAverage = entriesExcludingToday.length > 0 
    ? Math.round(entriesExcludingToday.slice(0, 7).reduce((sum: number, entry: any) => sum + entry.totalMinutes, 0) / Math.min(entriesExcludingToday.length, 7))
    : 0;

  const maxMinutes = Math.max(...chartData.map(d => d.minutes), weeklyAverage, 1);

  const totalScreentime = entries.reduce((sum: number, entry: any) => sum + entry.totalMinutes, 0);

  if (!isAuthenticated) {
    return (
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6 text-center">
          <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Login Required</h3>
          <p className="text-muted-foreground">Please login to view your screentime statistics.</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">Loading statistics...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Today's Screentime - Prominent Display */}
      <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 hover:shadow-xl transition-all duration-500 hover:scale-105">
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Smartphone className="w-8 h-8 text-orange-600 mr-3 animate-pulse" />
            <h2 className="text-2xl font-bold text-gray-800">Today's Screen Time</h2>
          </div>
          <div className="text-6xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
            {formatTime(todayMinutes)}
          </div>
          <p className="text-gray-600">
            {daysPerYear > 0 ? (
              <>On track to spend <strong>{daysPerYear.toFixed(1)} days</strong> on your phone this year</>
            ) : (
              'No data recorded today'
            )}
          </p>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-blue-800">
              <Clock className="w-4 h-4 mr-2" />
              Total Screen Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{formatTime(totalScreentime)}</div>
            <p className="text-xs text-blue-700">All time</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-green-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-green-800">
              <TrendingUp className="w-4 h-4 mr-2" />
              Daily Average
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{formatTime(averageScreentime)}</div>
            <p className="text-xs text-green-700">Past days average</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-purple-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-purple-800">
              <Calendar className="w-4 h-4 mr-2" />
              Days Tracked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{entries.length}</div>
            <p className="text-xs text-purple-700">Total entries</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Progress Bar */}
      <Card className="border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-50 to-orange-100 hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-orange-800">
            <Zap className="w-5 h-5 mr-2" />
            Today's Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-orange-700">Current: {formatTime(todayMinutes)}</span>
            <span className="text-orange-700">Daily Avg: {formatTime(averageScreentime)}</span>
          </div>
          
          <div className="space-y-2">
            <Progress 
              value={averageScreentime > 0 ? Math.min((todayMinutes / averageScreentime) * 100, 100) : 0}
              className="h-3"
            />
            
            <div className="flex items-center justify-between text-xs text-orange-600">
              <span>0m</span>
              {averageScreentime > 0 && (
                <div className="flex flex-col items-center">
                  <span className="font-medium">Average</span>
                  <span>{formatTime(averageScreentime)}</span>
                </div>
              )}
              <span>{averageScreentime > 0 ? formatTime(Math.max(averageScreentime * 1.5, todayMinutes)) : formatTime(todayMinutes * 2)}</span>
            </div>
          </div>
          
          {averageScreentime > 0 && (
            <div className="text-center">
              {todayMinutes < averageScreentime ? (
                <p className="text-sm text-green-600 font-medium">
                  🎉 {formatTime(averageScreentime - todayMinutes)} below your daily average!
                </p>
              ) : todayMinutes === averageScreentime ? (
                <p className="text-sm text-yellow-600 font-medium">
                  📊 Right at your daily average
                </p>
              ) : (
                <p className="text-sm text-red-600 font-medium">
                  📈 {formatTime(todayMinutes - averageScreentime)} above your daily average
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 7-Day Bar Chart (Previous 7 Days) */}
        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Previous 7 Days</span>
              <div className="text-sm text-muted-foreground">
                Avg: {formatTime(weeklyAverage)}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.every(d => d.minutes === 0) ? (
              <div className="text-center text-muted-foreground py-8">
                No screentime data for the previous 7 days
              </div>
            ) : (
              <div className="space-y-3">
                {chartData.map((day, index) => {
                  const aboveAverage = day.minutes > weeklyAverage;
                  const percentageDiff = weeklyAverage > 0 ? ((day.minutes - weeklyAverage) / weeklyAverage) * 100 : 0;
                  
                  // Consistent color scheme
                  let barColor;
                  let celebrationText = '';
                  
                  if (day.isYesterday) {
                    barColor = 'bg-gradient-to-r from-purple-500 to-purple-700';
                  } else if (day.minutes === 0) {
                    barColor = 'bg-gradient-to-r from-gray-300 to-gray-400';
                  } else if (percentageDiff > 15) {
                    barColor = 'bg-gradient-to-r from-red-500 to-red-700';
                    celebrationText = 'Way above avg';
                  } else if (percentageDiff > 5) {
                    barColor = 'bg-gradient-to-r from-orange-400 to-red-500';
                    celebrationText = 'Above avg';
                  } else if (percentageDiff > -5) {
                    barColor = 'bg-gradient-to-r from-yellow-400 to-orange-500';
                    celebrationText = 'Near avg';
                  } else if (percentageDiff > -15) {
                    barColor = 'bg-gradient-to-r from-green-400 to-green-600';
                    celebrationText = 'Great job! 🎉';
                  } else {
                    barColor = 'bg-gradient-to-r from-emerald-400 to-green-600';
                    celebrationText = 'Amazing! 🌟';
                  }
                  
                  return (
                    <div key={day.date} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <span className={`font-medium ${day.isYesterday ? 'text-purple-600' : 'text-muted-foreground'}`}>
                            {day.dayName}
                          </span>
                          <span className="text-muted-foreground">
                            {day.monthDay}
                          </span>
                          {day.isYesterday && (
                            <span className="text-purple-600 font-bold">Yesterday</span>
                          )}
                        </div>
                        <span className={`font-medium ${day.isYesterday ? 'text-purple-600' : 'text-foreground'}`}>
                          {day.minutes > 0 ? formatTime(day.minutes) : '0m'}
                        </span>
                      </div>
                      
                      <div className="relative">
                        <div className="w-full bg-muted rounded-full h-4 relative overflow-hidden">
                          {/* Average line indicator */}
                          <div 
                            className="absolute top-0 bottom-0 w-0.5 bg-gray-600 z-10"
                            style={{ left: `${(weeklyAverage / maxMinutes) * 100}%` }}
                          />
                          
                          {/* Day's usage bar */}
                          <div 
                            className={`h-full transition-all duration-500 ${barColor}`}
                            style={{ width: `${(day.minutes / maxMinutes) * 100}%` }}
                          />
                          
                          {/* Celebration text for improvements */}
                          {day.minutes > 0 && celebrationText && (
                            <div className="absolute inset-0 flex items-center px-2">
                              <span className="text-xs font-medium text-white">
                                {celebrationText}
                              </span>
                            </div>
                          )}
                          
                          {/* Percentage for others */}
                          {day.minutes > 0 && !celebrationText && (
                            <div className="absolute inset-0 flex items-center px-2">
                              <span className="text-xs font-medium text-white">
                                {percentageDiff > 0 ? '+' : ''}
                                {percentageDiff !== 0 && weeklyAverage > 0 
                                  ? `${Math.round(percentageDiff)}%`
                                  : ''}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                <div className="pt-2 border-t border-muted">
                  <div className="flex items-center justify-center space-x-3 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-600 rounded"></div>
                      <span>Amazing!</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-600 rounded"></div>
                      <span>Great!</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded"></div>
                      <span>Good</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-red-600 rounded"></div>
                      <span>High</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-0.5 h-3 bg-gray-600"></div>
                      <span>Avg</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 3-Day Improvement Tracking */}
        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardHeader>
            <CardTitle className="flex items-center text-purple-800">
              <Target className="w-5 h-5 mr-2" />
              3-Day Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {improvementData ? (
                <>
                  <div className="text-center">
                    <div className={`text-4xl font-bold mb-2 ${
                      improvementData.change < 0 ? 'text-green-600' : 
                      improvementData.change > 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {improvementData.change < 0 ? (
                        <TrendingDown className="w-10 h-10 mx-auto" />
                      ) : improvementData.change > 0 ? (
                        <TrendingUp className="w-10 h-10 mx-auto" />
                      ) : (
                        <div className="w-10 h-10 mx-auto flex items-center justify-center text-gray-400">—</div>
                      )}
                    </div>
                    <p className={`text-lg font-semibold ${
                      improvementData.change < 0 ? 'text-green-600' : 
                      improvementData.change > 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {improvementData.change < 0 ? 'Improving!' : 
                       improvementData.change > 0 ? 'Increased' : 'No Change'}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-blue-800">Current Period</span>
                      </div>
                      <span className="text-blue-800 font-bold">{formatTime(improvementData.currentAvg)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-800">Previous Period</span>
                      </div>
                      <span className="text-gray-800 font-bold">{formatTime(improvementData.previousAvg)}</span>
                    </div>
                    
                    <div className={`flex items-center justify-between p-3 rounded-lg border ${
                      improvementData.change < 0 ? 'bg-green-50 border-green-200' : 
                      improvementData.change > 0 ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-center space-x-2">
                        <Target className="w-5 h-5 text-purple-600" />
                        <span className="font-medium text-purple-800">Change</span>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${
                          improvementData.change < 0 ? 'text-green-600' : 
                          improvementData.change > 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {improvementData.change > 0 ? '+' : ''}{formatTime(Math.abs(improvementData.change))}
                        </div>
                        <div className={`text-sm ${
                          improvementData.change < 0 ? 'text-green-600' : 
                          improvementData.change > 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {improvementData.percentageChange > 0 ? '+' : ''}{improvementData.percentageChange.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-gray-600">Not Enough Data</h3>
                  <p className="text-gray-500 text-sm">
                    Track your screentime for at least 6 days to see 3-day improvement trends
                  </p>
                </div>
              )}
              
              <div className="pt-4 border-t border-muted">
                <p className="text-sm text-muted-foreground text-center">
                  Compares your last 3 days (excluding today) with the previous 3 days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Entries - Compact Version */}
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-gray-800">Recent Entries</CardTitle>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              No screentime data yet. Upload your first entry to get started!
            </div>
          ) : (
            <div className="space-y-1">
              {entries.slice(0, 5).map((entry: any) => (
                <div key={entry.id} className="flex justify-between items-center p-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-md hover:from-orange-50 hover:to-red-50 transition-colors duration-200 border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-medium text-gray-800 min-w-[80px]">
                      {entry.date === today ? 'Today' : new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    {entry.categoryBreakdown && entry.categoryBreakdown.length > 0 && (
                      <div className="text-xs text-gray-600 hidden sm:block">
                        {entry.categoryBreakdown.slice(0, 2).map((cat: any) => cat.category).join(', ')}
                        {entry.categoryBreakdown.length > 2 && ` +${entry.categoryBreakdown.length - 2}`}
                      </div>
                    )}
                  </div>
                  <span className="text-orange-600 font-bold text-sm">{formatTime(entry.totalMinutes)}</span>
                </div>
              ))}
              {entries.length > 5 && (
                <div className="text-center pt-2">
                  <p className="text-xs text-muted-foreground">
                    Showing latest 5 of {entries.length} entries
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}