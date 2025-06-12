import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Clock, Smartphone, Info, ArrowDown, ChevronDown, Calendar, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import SuccessModal from './SuccessModal';

export default function ScreentimeUpload() {
  const { user, isAuthenticated } = useAuth();
  const [selectedDate, setSelectedDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [hours, setHours] = React.useState('');
  const [minutes, setMinutes] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState('');

  // Generate date options with today first - fixed date calculations
  const generateDateOptions = () => {
    const options = [];
    const today = new Date();
    
    // Add today first
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    options.push({
      date: todayDate.toISOString().split('T')[0],
      dayOfWeek: todayDate.toLocaleDateString('en-US', { weekday: 'short' }),
      dayOfMonth: todayDate.getDate(),
      label: 'Today',
      isToday: true,
      isYesterday: false
    });

    // Add yesterday second
    const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
    options.push({
      date: yesterday.toISOString().split('T')[0],
      dayOfWeek: yesterday.toLocaleDateString('en-US', { weekday: 'short' }),
      dayOfMonth: yesterday.getDate(),
      label: 'Yesterday',
      isToday: false,
      isYesterday: true
    });

    // Add previous days
    for (let i = 2; i <= 6; i++) {
      const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
      options.push({
        date: date.toISOString().split('T')[0],
        dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayOfMonth: date.getDate(),
        label: null,
        isToday: false,
        isYesterday: false
      });
    }

    return options;
  };

  const dateOptions = generateDateOptions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      setError('Please login to upload screentime');
      return;
    }

    setLoading(true);
    setError('');
    
    // Calculate total minutes
    const totalMinutes = (parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0);
    
    if (totalMinutes === 0) {
      setError('Please enter screentime value');
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch('/api/screentime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          date: selectedDate, 
          totalMinutes,
          userId: user.id
        }),
      });
      
      if (response.ok) {
        console.log('Screentime uploaded successfully');
        
        // Format the success message
        const hoursDisplay = Math.floor(totalMinutes / 60);
        const minsDisplay = totalMinutes % 60;
        const timeStr = hoursDisplay > 0 ? `${hoursDisplay}h ${minsDisplay}m` : `${minsDisplay}m`;
        const selectedOption = dateOptions.find(opt => opt.date === selectedDate);
        const dayLabel = selectedOption?.label || `${selectedOption?.dayOfWeek} ${selectedOption?.dayOfMonth}`;
        setSuccessMessage(`${timeStr} of screentime recorded for ${dayLabel}!`);
        setShowSuccessModal(true);
        
        // Clear form
        setHours('');
        setMinutes('');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to upload screentime');
      }
    } catch (error) {
      console.error('Error uploading screentime:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 hover:shadow-xl transition-all duration-500 hover:scale-105">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Clock className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Login Required
            </h3>
            <p className="text-gray-600 text-lg">Please login to upload your screentime data and join the competition!</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Instructions Header */}
      <Card className="bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 border-2 border-orange-300 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-400/20 to-orange-400/20 rounded-full -ml-12 -mb-12"></div>
        
        <CardHeader className="relative">
          <CardTitle className="flex items-center text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-3 sm:mr-4 shadow-lg">
              <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            How to Find Your Screen Time Data
          </CardTitle>
        </CardHeader>
        <CardContent className="relative space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white/70 backdrop-blur rounded-xl p-4 sm:p-6 hover:bg-white/90 transition-all duration-300 hover:scale-105">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-lg sm:text-xl font-bold mb-4">1</div>
              <h3 className="font-bold text-base sm:text-lg mb-2 text-orange-800">Open Settings</h3>
              <p className="text-sm sm:text-base text-orange-700 leading-relaxed">
                Launch the <strong>Settings</strong> app on your iPhone or iPad
              </p>
            </div>
            
            <div className="bg-white/70 backdrop-blur rounded-xl p-4 sm:p-6 hover:bg-white/90 transition-all duration-300 hover:scale-105">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full flex items-center justify-center text-lg sm:text-xl font-bold mb-4">2</div>
              <h3 className="font-bold text-base sm:text-lg mb-2 text-orange-800">Find Screen Time</h3>
              <p className="text-sm sm:text-base text-orange-700 leading-relaxed">
                Tap on <strong>Screen Time</strong> in the settings menu
              </p>
            </div>
            
            <div className="bg-white/70 backdrop-blur rounded-xl p-4 sm:p-6 hover:bg-white/90 transition-all duration-300 hover:scale-105">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-full flex items-center justify-center text-lg sm:text-xl font-bold mb-4">3</div>
              <h3 className="font-bold text-base sm:text-lg mb-2 text-orange-800">Get Your Data</h3>
              <p className="text-sm sm:text-base text-orange-700 leading-relaxed">
                Look at the large number at the top for today, or use arrows to navigate to previous days
              </p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-4 sm:p-6 border border-orange-200">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2 animate-bounce">
                <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                <span className="font-medium text-sm sm:text-base text-orange-700">Scroll down in Settings</span>
              </div>
              <div className="flex items-center space-x-2 animate-pulse">
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                <span className="font-medium text-sm sm:text-base text-red-700">Use arrows for previous days</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Upload Form */}
      <Card className="bg-gradient-to-br from-white to-orange-50 border-2 border-orange-200 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-orange-200/30 to-transparent rounded-full -mr-20 -mt-20"></div>
        
        <CardHeader className="relative">
          <CardTitle className="flex items-center text-xl sm:text-2xl font-bold text-gray-800">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-3 sm:mr-4 shadow-lg">
              <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            Upload Your Screen Time
          </CardTitle>
        </CardHeader>
        
        <CardContent className="relative">
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 p-4 rounded-r-lg animate-in slide-in-from-left-5 duration-300">
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Enhanced Date Selection - Mobile Optimized */}
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 px-3 sm:px-4 py-2 rounded-full mb-3 sm:mb-4">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <span className="font-semibold text-sm sm:text-base text-blue-700">Select Date</span>
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                </div>
                <p className="text-sm sm:text-lg text-gray-600">Choose which day you're adding screentime data for</p>
              </div>
              
              <div className="flex justify-center px-2">
                <div className="grid grid-cols-7 gap-1 sm:gap-3 p-2 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 w-full max-w-full overflow-x-visible">
                  {dateOptions.map((option) => (
                    <div key={option.date} className="flex flex-col items-center space-y-1 sm:space-y-2">
                      <Button
                        type="button"
                        variant={selectedDate === option.date ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedDate(option.date)}
                        className={`w-10 h-12 sm:w-16 sm:h-20 flex flex-col items-center justify-center p-1 sm:p-2 transition-all duration-300 hover:scale-110 transform text-xs sm:text-sm ${
                          selectedDate === option.date 
                            ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg scale-110' 
                            : 'hover:bg-gradient-to-br hover:from-orange-100 hover:to-red-100'
                        } ${
                          option.isToday ? 'ring-1 sm:ring-2 ring-blue-400 ring-offset-1 sm:ring-offset-2' : ''
                        } ${
                          option.isYesterday ? 'ring-1 sm:ring-2 ring-purple-400 ring-offset-1 sm:ring-offset-2' : ''
                        }`}
                      >
                        <div className="text-xs font-semibold opacity-75">
                          {option.dayOfWeek.toUpperCase()}
                        </div>
                        <div className="text-sm sm:text-xl font-bold">
                          {option.dayOfMonth}
                        </div>
                      </Button>
                      {(option.isToday || option.isYesterday) && (
                        <span className={`text-xs font-bold px-1 sm:px-2 py-0.5 sm:py-1 rounded-full ${
                          option.isToday 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {option.label}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-xs sm:text-sm bg-gradient-to-r from-gray-100 to-gray-200 px-3 sm:px-4 py-2 rounded-full inline-block text-gray-600">
                  Selected: <span className="font-semibold">{new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric'
                  })}</span>
                </p>
              </div>
            </div>

            {/* Enhanced Time Input */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 sm:p-8 border border-green-200">
              <div className="text-center mb-4 sm:mb-6">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-emerald-100 px-3 sm:px-4 py-2 rounded-full mb-3 sm:mb-4">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  <span className="font-semibold text-sm sm:text-base text-green-700">
                    {selectedDate === new Date().toISOString().split('T')[0] ? "Today's" : "Daily"} Screen Time
                  </span>
                </div>
                <p className="text-sm sm:text-base text-gray-600">
                  Enter the total screentime shown at the top of your Screen Time settings
                  {selectedDate !== new Date().toISOString().split('T')[0] && (
                    <span className="block mt-2 font-medium text-green-700 text-xs sm:text-sm">
                      💡 Remember to scroll down and use the arrows to navigate to {dateOptions.find(opt => opt.date === selectedDate)?.label || 'this day'}
                    </span>
                  )}
                </p>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                <Label className="block text-center text-base sm:text-lg font-semibold text-green-800">
                  Screen Time for {dateOptions.find(opt => opt.date === selectedDate)?.label || `${dateOptions.find(opt => opt.date === selectedDate)?.dayOfWeek} ${dateOptions.find(opt => opt.date === selectedDate)?.dayOfMonth}`}
                </Label>
                
                <div className="flex items-center justify-center space-x-4 sm:space-x-6">
                  <div className="text-center">
                    <div className="bg-white rounded-xl p-3 sm:p-4 shadow-md border border-green-200">
                      <Input
                        type="number"
                        min="0"
                        max="23"
                        value={hours}
                        onChange={(e) => setHours(e.target.value)}
                        placeholder="0"
                        className="w-16 sm:w-20 text-center text-lg sm:text-xl font-bold border-0 bg-transparent"
                      />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-green-700 mt-2 block">hours</span>
                  </div>
                  
                  <div className="text-3xl sm:text-4xl font-bold text-green-600">:</div>
                  
                  <div className="text-center">
                    <div className="bg-white rounded-xl p-3 sm:p-4 shadow-md border border-green-200">
                      <Input
                        type="number"
                        min="0"
                        max="59"
                        value={minutes}
                        onChange={(e) => setMinutes(e.target.value)}
                        placeholder="0"
                        className="w-16 sm:w-20 text-center text-lg sm:text-xl font-bold border-0 bg-transparent"
                      />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-green-700 mt-2 block">minutes</span>
                  </div>
                </div>
                
                {(hours || minutes) && (
                  <div className="text-center animate-in fade-in-50 duration-500">
                    <div className="inline-block bg-white/80 backdrop-blur rounded-xl px-4 sm:px-6 py-3 border border-green-300">
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Screen Time</p>
                      <p className="text-xl sm:text-2xl font-bold text-green-700">
                        {((parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0)) > 0 
                          ? `${Math.floor(((parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0)) / 60)}h ${((parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0)) % 60}m`
                          : '0m'
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Uploading...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Upload Screen Time</span>
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
      />
    </div>
  );
}