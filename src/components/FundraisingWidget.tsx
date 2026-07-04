import React, { useEffect, useState } from 'react';

interface FundraisingData {
  title: string;
  goal: number;
  raised: number;
  donors: number;
  percent: number;
  url: string;
  daysLeft?: number;
}

interface FundraisingWidgetProps {
  goFundMeUrl: string;
}

const FundraisingWidget: React.FC<FundraisingWidgetProps> = ({ goFundMeUrl }) => {
  const [data, setData] = useState<FundraisingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!goFundMeUrl) {
      setLoading(false);
      return;
    }

    const fetchFundraisingData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/fundraising/gofundme', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: goFundMeUrl })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch fundraising data');
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error('Error fetching fundraising data:', err);
        setError('Unable to load fundraising data');
      } finally {
        setLoading(false);
      }
    };

    fetchFundraisingData();

    // Atualizar a cada 5 minutos
    const interval = setInterval(fetchFundraisingData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [goFundMeUrl]);

  if (!goFundMeUrl) return null;

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-full mb-4" />
          <div className="h-4 bg-gray-200 rounded w-full" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
        <p className="text-amber-800">
          <strong>Fundraising Campaign</strong><br />
          <a 
            href={goFundMeUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-amber-600 hover:text-amber-700 underline"
          >
            View on GoFundMe →
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-rotary-blue/5 to-rotary-gold/5 rounded-lg shadow-md p-6 mb-8 border border-rotary-gold/20">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-rotary-blue mb-2">Fundraising Campaign</h3>
          <p className="text-gray-600">{data.title}</p>
        </div>
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary px-4 py-2 text-sm whitespace-nowrap"
        >
          Donate Now
        </a>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-bold text-rotary-blue">{Math.round(data.percent)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-rotary-blue to-rotary-gold h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(data.percent, 100)}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Raised</p>
          <p className="text-2xl font-bold text-rotary-blue">
            €{data.raised.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Goal</p>
          <p className="text-2xl font-bold text-rotary-gold">
            €{data.goal.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Donors</p>
          <p className="text-2xl font-bold text-gray-700">
            {data.donors.toLocaleString()}
          </p>
        </div>
      </div>

      {data.daysLeft && (
        <div className="mt-4 p-3 bg-rotary-gold/10 rounded border border-rotary-gold/30">
          <p className="text-sm text-rotary-blue font-medium">
            ⏱️ Campaign ends in {data.daysLeft} days
          </p>
        </div>
      )}

      <div className="mt-4 text-center">
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-rotary-blue hover:text-rotary-gold font-medium text-sm inline-flex items-center"
        >
          View full campaign on GoFundMe →
        </a>
      </div>
    </div>
  );
};

export default FundraisingWidget;
