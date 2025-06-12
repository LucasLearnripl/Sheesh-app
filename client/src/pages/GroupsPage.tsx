import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Users, Plus, Globe, UserCheck, Sparkles, Zap } from 'lucide-react';
import CreateGroupForm from '../components/CreateGroupForm';
import ExploreGroups from '../components/ExploreGroups';
import MyGroups from '../components/MyGroups';

export default function GroupsPage() {
  const [showCreateForm, setShowCreateForm] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('my-groups');

  return (
    <div className="space-y-8">
      {/* Enhanced Header with Animation - Mobile Responsive */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-sheesh blur-3xl opacity-10 animate-pulse"></div>
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-sheesh rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-900" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-sheesh bg-clip-text text-transparent">
                  Battle Groups
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground">Join the screentime competition</p>
              </div>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
              Create or join groups to compete with friends, track progress together, and see who can manage their screentime best!
            </p>
          </div>
          
          <Button 
            onClick={() => setShowCreateForm(true)}
            size="lg"
            className="bg-gradient-sheesh hover:bg-gradient-sheesh-hover transform hover:scale-105 transition-all duration-200 shadow-lg w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            <span className="text-sm sm:text-base">Create Battle Group</span>
          </Button>
        </div>
      </div>

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in-0 duration-300 px-4">
          <div className="animate-in zoom-in-95 duration-300 w-full max-w-md">
            <CreateGroupForm onClose={() => setShowCreateForm(false)} />
          </div>
        </div>
      )}

      {/* Enhanced Tabs - Mobile Responsive */}
      <div className="relative bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-1 sm:p-2 border-2 border-gray-200">
        <div className="flex space-x-1 sm:space-x-2 relative">
          <Button
            variant={activeTab === 'my-groups' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('my-groups')}
            className={`flex-1 h-12 sm:h-14 text-xs sm:text-base font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 ${
              activeTab === 'my-groups' 
                ? 'bg-gradient-sheesh text-white shadow-lg scale-105' 
                : 'bg-white/70 text-gray-700 hover:bg-white hover:shadow-md'
            }`}
          >
            <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-3" />
            <div className="flex flex-col items-start">
              <span>My Groups</span>
              <span className="text-xs opacity-80 hidden sm:block">Your joined groups</span>
            </div>
          </Button>
          
          <Button
            variant={activeTab === 'explore' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('explore')}
            className={`flex-1 h-12 sm:h-14 text-xs sm:text-base font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 ${
              activeTab === 'explore' 
                ? 'bg-gradient-sheesh text-white shadow-lg scale-105' 
                : 'bg-white/70 text-gray-700 hover:bg-white hover:shadow-md'
            }`}
          >
            <Globe className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-3" />
            <div className="flex flex-col items-start">
              <span>Explore Groups</span>
              <span className="text-xs opacity-80 hidden sm:block">Discover & join new groups</span>
            </div>
          </Button>
        </div>
        
        {/* Visual indicator */}
        <div 
          className={`absolute bottom-0 h-1 bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-300 rounded-full ${
            activeTab === 'my-groups' ? 'left-1 right-1/2 mr-0.5 sm:left-2 sm:mr-1' : 'left-1/2 right-1 ml-0.5 sm:right-2 sm:ml-1'
          }`}
        />
      </div>

      {/* Tab Content with Animations */}
      <div className="relative">
        {activeTab === 'my-groups' && (
          <div className="animate-in slide-in-from-left-5 duration-300">
            <MyGroups />
          </div>
        )}
        {activeTab === 'explore' && (
          <div className="animate-in slide-in-from-right-5 duration-300">
            <ExploreGroups />
          </div>
        )}
      </div>

      {/* Fun Stats Footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 border-t border-primary/10">
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:scale-105 transition-transform duration-200">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-blue-800">Join & Compete</h3>
          <p className="text-sm text-blue-600">Battle friends in screentime challenges</p>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:scale-105 transition-transform duration-200">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-green-800">Track Together</h3>
          <p className="text-sm text-green-600">See everyone's progress in real-time</p>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:scale-105 transition-transform duration-200">
          <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-purple-800">Build Habits</h3>
          <p className="text-sm text-purple-600">Motivate each other to improve</p>
        </div>
      </div>
    </div>
  );
}