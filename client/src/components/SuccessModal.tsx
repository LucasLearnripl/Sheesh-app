import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, CheckCircle } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export default function SuccessModal({ isOpen, onClose, message }: SuccessModalProps) {
  const [showConfetti, setShowConfetti] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      // Remove confetti after animation
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const createConfettiPiece = (index: number) => {
    const colors = ['#FF4500', '#FF6B35', '#FF8A65', '#FFAB91', '#FFCCBC', '#FFD700', '#FF69B4', '#00CED1'];
    const color = colors[index % colors.length];
    
    return (
      <div
        key={index}
        className="absolute w-3 h-3 opacity-90"
        style={{
          backgroundColor: color,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 2}s`,
          animationDuration: `${2 + Math.random() * 2}s`,
          transform: `rotate(${Math.random() * 360}deg)`,
        }}
      />
    );
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <style>{`
            @keyframes confetti-fall {
              0% {
                transform: translateY(-100vh) rotate(0deg);
                opacity: 1;
              }
              100% {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
              }
            }
            .confetti-piece {
              animation: confetti-fall linear forwards;
            }
          `}</style>
          {Array.from({ length: 50 }, (_, i) => (
            <div key={i} className="confetti-piece">
              {createConfettiPiece(i)}
            </div>
          ))}
        </div>
      )}

      {/* Success Modal */}
      <Card className="w-full max-w-md mx-4 bg-white shadow-2xl border-0" onClick={(e) => e.stopPropagation()}>
        <CardContent className="p-8 text-center relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
          
          <div className="space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-green-600">Success! 🎉</h2>
              <p className="text-gray-600">{message}</p>
            </div>
            
            <div className="space-y-3">
              <div className="p-4 bg-gradient-sheesh-light rounded-lg">
                <p className="text-sm text-gray-700 font-medium">
                  Great job tracking your screentime! 
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Keep building healthy digital habits with Sheesh
                </p>
              </div>
              
              <Button 
                onClick={onClose}
                className="w-full bg-gradient-sheesh hover:bg-gradient-sheesh-hover"
              >
                Continue
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
