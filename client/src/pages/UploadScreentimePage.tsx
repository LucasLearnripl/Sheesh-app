import * as React from 'react';
import { Upload, Zap, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import ScreentimeUpload from '../components/ScreentimeUpload';

export default function UploadScreentimePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-sheesh rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Upload Screen Time</h1>
            <p className="text-muted-foreground">Add your daily screentime data to compete with friends</p>
          </div>
        </div>
      </div>

      {/* Automatic Tracking Coming Soon */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Zap className="w-5 h-5 text-white animate-pulse" />
            </div>
            <h3 className="text-lg font-bold text-blue-800">Auto-Tracking Coming Soon! ⚡</h3>
          </div>
          <p className="text-sm text-blue-700 mb-4">
            We're working on automatic screentime tracking! Soon you won't need to manually upload - 
            <span className="font-semibold"> your data will sync automatically every day.</span>
          </p>
          <div className="flex items-center space-x-2 text-xs text-blue-600">
            <RefreshCw className="w-4 h-4" />
            <span>For now, keep uploading manually to stay competitive!</span>
          </div>
        </CardContent>
      </Card>

      <ScreentimeUpload />
    </div>
  );
}