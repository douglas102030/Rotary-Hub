import React from 'react';
import { useRouter } from 'next/router';
import CampaignEmbed from '../../components/CampaignEmbed';

const EmbedCampaignPage: React.FC = () => {
  const router = useRouter();
  const { campaignId } = router.query;

  if (!campaignId || typeof campaignId !== 'string') {
    return null;
  }

  return (
    <div style={{
      width: '100%',
      margin: 0,
      padding: '16px',
      backgroundColor: '#f9f9f9',
      minHeight: '100vh'
    }}>
      <CampaignEmbed campaignId={campaignId} />
    </div>
  );
};

export default EmbedCampaignPage;
