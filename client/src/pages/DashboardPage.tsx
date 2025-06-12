import * as React from 'react';
import { TrendingUp, Calendar, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import ScreentimeChart from '../components/ScreentimeChart';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-sheesh rounded-full flex items-center justify-center">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">View your statistics and track your progress</p>
          </div>
        </div>
      </div>

      {/* Daily Update Encouragement */}
      <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-orange-800">Stay in the Game! 🔥</h3>
          </div>
          <p className="text-sm text-orange-700 mb-4">
            Upload your screentime daily to track live progress and compete with friends in real-time! 
            <span className="font-semibold"> Every day counts in the battle for digital wellness!</span>
          </p>
          <div className="flex items-center space-x-2 text-xs text-orange-600">
            <Calendar className="w-4 h-4" />
            <span>Best time: Upload at the end of each day</span>
          </div>
        </CardContent>
      </Card>

      <ScreentimeChart />
    </div>
  );
}