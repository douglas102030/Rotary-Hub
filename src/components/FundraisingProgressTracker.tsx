import React, { useState, useEffect } from 'react';

interface FundraisingProgressTrackerProps {
  projectId: number;
  url: string;
  platform: 'gofundme' | 'crowdfunder';
  initialRaised?: number;
  initialGoal?: number;
}

const FundraisingProgressTracker: React.FC<FundraisingProgressTrackerProps> = ({
  projectId,
  url,
  platform,
  initialRaised = 0,
  initialGoal = 1
}) => {
  const [raised, setRaised] = useState(initialRaised);
  const [goal, setGoal] = useState(initialGoal);
  const [percentage, setPercentage] = useState((initialRaised / initialGoal) * 100);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Update progress every 5 seconds
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const updateProgress = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/projects/update-progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            projectId,
            url,
            platform
          })
        });

        const data = await response.json();

        if (data.success) {
          setRaised(data.raised || 0);
          setGoal(data.goal || 1);
          setPercentage(data.percentage || 0);
          setLastUpdate(new Date());
        } else {
          setError(data.message || 'Failed to update progress');
        }
      } catch (err) {
        console.error('Progress update error:', err);
        setError(err instanceof Error ? err.message : 'Failed to update progress');
      } finally {
        setIsLoading(false);
      }
    };

    // Initial update immediately
    updateProgress();

    // Then update every 5 seconds
    intervalId = setInterval(updateProgress, 5000);

    return () => clearInterval(intervalId);
  }, [projectId, url, platform]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-rotary-blue">
          💰 Fundraising Progress - {platform === 'gofundme' ? 'GoFundMe' : 'Crowdfunder'}
        </h3>
        <div className="flex items-center gap-2">
          {isLoading && (
            <span className="inline-block animate-spin">🔄</span>
          )}
          {lastUpdate && (
            <span className="text-xs text-gray-500">
              Updated: {formatTime(lastUpdate)}
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          ⚠️ {error}
        </div>
      )}

      <div className="mb-4">
        <div className="flex justify-between items-end mb-2">
          <div>
            <div className="text-sm font-medium text-gray-600">Amount Raised</div>
            <div className="text-2xl font-bold text-rotary-gold">
              {formatCurrency(raised)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-600">Goal</div>
            <div className="text-2xl font-bold text-rotary-blue">
              {formatCurrency(goal)}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-rotary-gold to-yellow-400 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          >
            {percentage > 10 && (
              <span className="text-xs font-bold text-rotary-blue">{Math.round(percentage)}%</span>
            )}
          </div>
        </div>
        {percentage > 100 && (
          <p className="mt-2 text-sm font-medium text-green-600">
            ✅ Goal exceeded by {formatCurrency(raised - goal)}!
          </p>
        )}
      </div>

      {/* Detailed stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        <div>
          <p className="text-xs text-gray-500 uppercase">Remaining</p>
          <p className="text-lg font-bold text-gray-800">
            {formatCurrency(Math.max(0, goal - raised))}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase">Progress</p>
          <p className="text-lg font-bold text-rotary-blue">{Math.round(percentage)}%</p>
        </div>
      </div>

      {/* Auto-update info */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-gray-600">
        📊 Automatically updates every <strong>5 seconds</strong> from {platform === 'gofundme' ? 'GoFundMe' : 'Crowdfunder'}
      </div>
    </div>
  );
};

export default FundraisingProgressTracker;
