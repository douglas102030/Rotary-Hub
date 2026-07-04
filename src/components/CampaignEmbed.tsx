import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface CampaignData {
  id: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  image: string;
  percent: number;
}

const CampaignEmbed: React.FC<{ campaignId: string }> = ({ campaignId }) => {
  const [campaign, setCampaign] = useState<CampaignData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await fetch(`/api/campaigns/${campaignId}`);
        if (!response.ok) throw new Error('Failed to load campaign');
        const data = await response.json();
        setCampaign(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading campaign');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [campaignId]);

  if (loading) {
    return (
      <div className="w-full bg-gray-100 rounded-lg p-6 flex items-center justify-center" style={{ minHeight: '300px' }}>
        <p className="text-gray-500">Loading campaign...</p>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="w-full bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-600">{error || 'Campaign not found'}</p>
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      maxWidth: '450px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header com imagem */}
      {campaign.image && (
        <div style={{ position: 'relative', width: '100%', paddingBottom: '66.67%', backgroundColor: '#f0f0f0' }}>
          <img
            src={campaign.image}
            alt={campaign.title}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      )}

      {/* Content */}
      <div style={{ padding: '24px' }}>
        {/* Título */}
        <h2 style={{
          margin: '0 0 12px 0',
          fontSize: '20px',
          fontWeight: '700',
          color: '#003366',
          lineHeight: '1.3'
        }}>
          {campaign.title}
        </h2>

        {/* Descrição curta */}
        <p style={{
          margin: '0 0 16px 0',
          fontSize: '13px',
          color: '#666',
          lineHeight: '1.4',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {campaign.description}
        </p>

        {/* Progress Bar */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#e5e5e5',
            borderRadius: '10px',
            overflow: 'hidden',
            marginBottom: '8px'
          }}>
            <div style={{
              width: `${campaign.percent}%`,
              height: '100%',
              backgroundColor: '#FFD700',
              transition: 'width 0.3s ease'
            }} />
          </div>

          {/* Porcentagem */}
          <div style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#003366',
            textAlign: 'right'
          }}>
            {campaign.percent}%
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '16px',
          paddingBottom: '16px',
          borderBottom: '1px solid #e5e5e5'
        }}>
          <div>
            <div style={{
              fontSize: '11px',
              color: '#999',
              textTransform: 'uppercase',
              marginBottom: '4px',
              fontWeight: '600'
            }}>
              Raised
            </div>
            <div style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#003366'
            }}>
              €{campaign.raised.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div>
            <div style={{
              fontSize: '11px',
              color: '#999',
              textTransform: 'uppercase',
              marginBottom: '4px',
              fontWeight: '600'
            }}>
              Goal
            </div>
            <div style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#666'
            }}>
              €{campaign.goal.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* Donate Button */}
        <a
          href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/campaigns/${campaign.id}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block',
            width: '100%',
            padding: '12px',
            backgroundColor: '#FFD700',
            color: '#003366',
            textAlign: 'center',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '700',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FFC700')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFD700')}
        >
          View Campaign
        </a>

        {/* Branding */}
        <div style={{
          marginTop: '12px',
          fontSize: '11px',
          color: '#999',
          textAlign: 'center'
        }}>
          Powered by Rotary Hub
        </div>
      </div>
    </div>
  );
};

export default CampaignEmbed;
