import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Users, Trophy, Clock, Smartphone, Zap, Target, TrendingDown, ArrowRight, Sparkles, CheckCircle, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();

  const getWelcomeMessage = () => {
    if (isAuthenticated && user?.first_name) {
      return `Welcome to Sheesh, ${user.first_name}! 👋`;
    }
    return 'Welcome to Sheesh! 👋';
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-8 py-16 relative">
        <div className="absolute inset-0 bg-gradient-sheesh-light blur-3xl opacity-20 animate-pulse"></div>
        <div className="relative space-y-6">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-sheesh rounded-2xl flex items-center justify-center shadow-2xl animate-bounce">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
            <h1 className="text-4xl sm:text-7xl font-bold bg-gradient-sheesh bg-clip-text text-transparent leading-tight">
              Sheesh
            </h1>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl sm:text-3xl font-semibold text-muted-foreground">
              <span className="bg-gradient-sheesh bg-clip-text text-transparent">{getWelcomeMessage()}</span>
            </h2>
            <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
              See how addicted your friends really are to their phones! 📱 Compare everyone's screen time, 
              roast each other's usage, and maybe motivate yourselves to scroll less. 
              <span className="font-semibold text-primary"> Turn your group chats into leaderboards!</span> 🏆
            </p>
          </div>

          {/* Primary Get Started CTA */}
          <div className="mt-8 space-y-4">
            <Button 
              size="lg" 
              className="bg-gradient-sheesh hover:bg-gradient-sheesh-hover text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border-0"
              asChild
            >
              <Link to="/profile">
                <Sparkles className="w-6 h-6 mr-3" />
                Get Started Free
                <ArrowRight className="w-6 h-6 ml-3" />
              </Link>
            </Button>
            
            <p className="text-sm text-muted-foreground">
              Join thousands competing in the ultimate screentime challenge!
            </p>
          </div>
        </div>
      </div>

      {/* Clear 3-Step Process */}
      <div className="py-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-5xl font-bold mb-4 bg-gradient-sheesh bg-clip-text text-transparent">
            How Sheesh Works
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            It's simple! Follow these 3 steps to start competing with friends and building better digital habits.
          </p>
          <div className="mt-6 flex justify-center">
            <ArrowDown className="w-8 h-8 text-primary animate-bounce" />
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="relative">
              <Card className="h-full bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-sheesh rounded-full flex items-center justify-center mx-auto shadow-lg">
                      <span className="text-3xl font-bold text-white">1</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
                      <Upload className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-orange-800 mb-4">Upload Your Screen Time</h3>
                  <p className="text-orange-700 mb-6 text-lg leading-relaxed">
                    Go to iPhone Settings → Screen Time and upload your daily usage data. Takes 30 seconds!
                  </p>
                  <div className="bg-white/70 backdrop-blur rounded-lg p-4 border border-orange-300">
                    <p className="text-sm text-orange-600 font-medium">💡 Pro Tip: Upload every day to stay competitive!</p>
                  </div>
                  <Button asChild className="mt-6 bg-gradient-sheesh hover:bg-gradient-sheesh-hover w-full" size="lg">
                    <Link to="/upload">
                      <Upload className="w-5 h-5 mr-2" />
                      Start Uploading
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              
              {/* Arrow for desktop */}
              <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                <ArrowRight className="w-8 h-8 text-gray-400" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <Card className="h-full bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-sheesh rounded-full flex items-center justify-center mx-auto shadow-lg">
                      <span className="text-3xl font-bold text-white">2</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-orange-800 mb-4">Join Groups with Friends</h3>
                  <p className="text-orange-700 mb-6 text-lg leading-relaxed">
                    Create or join groups with your friends, family, or colleagues. Share join codes to invite others!
                  </p>
                  <div className="bg-white/70 backdrop-blur rounded-lg p-4 border border-orange-300">
                    <p className="text-sm text-orange-600 font-medium">🎯 Groups make everything more fun and motivating!</p>
                  </div>
                  <Button asChild className="mt-6 bg-gradient-sheesh hover:bg-gradient-sheesh-hover w-full" size="lg">
                    <Link to="/groups">
                      <Users className="w-5 h-5 mr-2" />
                      Browse Groups
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              
              {/* Arrow for desktop */}
              <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                <ArrowRight className="w-8 h-8 text-gray-400" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <Card className="h-full bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-sheesh rounded-full flex items-center justify-center mx-auto shadow-lg">
                      <span className="text-3xl font-bold text-white">3</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-orange-800 mb-4">Compete & Track Progress</h3>
                  <p className="text-orange-700 mb-6 text-lg leading-relaxed">
                    See live leaderboards, track your daily progress, and compete to see who uses their phone the most (or least)!
                  </p>
                  <div className="bg-white/70 backdrop-blur rounded-lg p-4 border border-orange-300">
                    <p className="text-sm text-orange-600 font-medium">🏆 Rankings update in real-time!</p>
                  </div>
                  <Button asChild className="mt-6 bg-gradient-sheesh hover:bg-gradient-sheesh-hover w-full" size="lg">
                    <Link to="/leaderboard">
                      <Trophy className="w-5 h-5 mr-2" />
                      View Leaderboards
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="flex items-center justify-center mb-6">
                <CheckCircle className="w-12 h-12 text-green-500 mr-4" />
                <h3 className="text-2xl font-bold text-gray-800">That's It!</h3>
              </div>
              <p className="text-lg text-gray-700 mb-6">
                You're now part of the screentime revolution! Upload daily, stay competitive, and watch your digital habits evolve.
              </p>
              <Button asChild size="lg" className="bg-gradient-sheesh hover:bg-gradient-sheesh-hover">
                <Link to="/profile">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Join the Revolution
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-md bg-gradient-to-br from-orange-50 to-red-50">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-sheesh rounded-xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-orange-800 mb-2">Real-Time Tracking</h4>
            <p className="text-sm text-orange-600">See your progress update instantly as you upload daily data</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-md bg-gradient-to-br from-orange-50 to-red-50">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-sheesh rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-orange-800 mb-2">Group Challenges</h4>
            <p className="text-sm text-orange-600">Create private groups and compete with friends, family, or coworkers</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-md bg-gradient-to-br from-orange-50 to-red-50">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-sheesh rounded-xl flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-orange-800 mb-2">Live Leaderboards</h4>
            <p className="text-sm text-orange-600">Daily, weekly, and improvement rankings that update automatically</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-md bg-gradient-to-br from-orange-50 to-red-50">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-sheesh rounded-xl flex items-center justify-center mx-auto mb-4">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-orange-800 mb-2">Build Better Habits</h4>
            <p className="text-sm text-orange-600">Use friendly competition to actually reduce your phone usage</p>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <div className="py-16 px-4">
        <Card className="bg-gradient-sheesh border-0 shadow-2xl hover:scale-105 transition-transform duration-300">
          <CardContent className="p-6 sm:p-12 text-center text-white">
            <div className="space-y-6">
              <div className="flex items-center justify-center space-x-4">
                <Target className="w-12 h-12 sm:w-16 sm:h-16 text-white animate-spin" style={{ animationDuration: '3s' }} />
                <div className="text-4xl sm:text-6xl animate-bounce">😱</div>
              </div>
              
              <h2 className="text-3xl sm:text-5xl font-bold leading-tight">
                Ready to Face the Truth?
              </h2>
              
              <p className="text-lg sm:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed">
                Join thousands of people discovering just how much time they <em>really</em> spend on their phones. 
                <strong> It's gonna be a wake-up call!</strong> 
                But hey, at least you'll have fun competing with friends while building better habits! 🎮
              </p>
              
              <div className="flex justify-center">
                <Button size="lg" variant="secondary" className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 hover:scale-105 transition-transform duration-200" asChild>
                  <Link to="/profile">
                    <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Start Your Journey
                  </Link>
                </Button>
              </div>
              
              <p className="text-xs sm:text-sm opacity-75 italic">
                Warning: May cause existential crisis about time management 😅
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}