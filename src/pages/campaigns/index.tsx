import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

interface Campaign {
  id: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  image: string;
  embedCode: string;
}

const CampaignsPage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal: '',
    image: ''
  });
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Redirect se não autenticado
  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData(prev => ({
            ...prev,
            image: event.target!.result as string
          }));
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/campaigns/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          goal: parseFloat(formData.goal),
          image: formData.image
        })
      });

      if (response.ok) {
        const campaign = await response.json();
        setCampaigns(prev => [campaign, ...prev]);
        setFormData({ title: '', description: '', goal: '', image: '' });
        alert('Campaign created successfully!');
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (embedCode: string, campaignId: string) => {
    navigator.clipboard.writeText(embedCode);
    setCopiedId(campaignId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-rotary-blue mb-2">
              Fundraising Campaigns
            </h1>
            <p className="text-gray-600">
              Create and manage your fundraising campaigns with embeddable widgets
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <h2 className="text-xl font-bold text-rotary-blue mb-6">
                  Create Campaign
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Campaign Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rotary-blue"
                      placeholder="e.g., Education Program 2026"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rotary-blue"
                      placeholder="Describe your campaign..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fundraising Goal (€) *
                    </label>
                    <input
                      type="number"
                      name="goal"
                      value={formData.goal}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rotary-blue"
                      placeholder="10000"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Campaign Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full"
                    />
                    {formData.image && (
                      <div className="mt-2 relative w-full h-32 rounded-md overflow-hidden">
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-2 bg-rotary-gold text-rotary-blue font-medium rounded-md hover:bg-yellow-500 disabled:opacity-50 transition"
                  >
                    {loading ? 'Creating...' : 'Create Campaign'}
                  </button>
                </form>
              </div>
            </div>

            {/* Campaigns List */}
            <div className="lg:col-span-2 space-y-6">
              {campaigns.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <p className="text-gray-500">No campaigns created yet.</p>
                  <p className="text-sm text-gray-400">Create your first campaign to get started!</p>
                </div>
              ) : (
                campaigns.map(campaign => (
                  <div key={campaign.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                    <div className="p-6">
                      <div className="flex gap-6">
                        {campaign.image && (
                          <div className="w-32 h-32 flex-shrink-0 rounded-md overflow-hidden">
                            <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover" />
                          </div>
                        )}

                        <div className="flex-grow">
                          <h3 className="text-lg font-bold text-rotary-blue mb-1">
                            {campaign.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {campaign.description}
                          </p>

                          <div className="flex gap-4 mb-4">
                            <div>
                              <div className="text-xs text-gray-500 uppercase">Goal</div>
                              <div className="font-bold text-rotary-blue">
                                €{campaign.goal.toLocaleString('pt-PT')}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 uppercase">Raised</div>
                              <div className="font-bold text-rotary-blue">
                                €{campaign.raised.toLocaleString('pt-PT')}
                              </div>
                            </div>
                          </div>

                          {/* Embed Code */}
                          <div className="bg-gray-50 rounded p-3 mb-3">
                            <div className="text-xs font-semibold text-gray-600 mb-2">
                              Embed Code:
                            </div>
                            <code className="text-xs text-gray-700 block break-all font-mono">
                              {campaign.embedCode}
                            </code>
                          </div>

                          <button
                            onClick={() => copyToClipboard(campaign.embedCode, campaign.id)}
                            className="px-4 py-2 bg-rotary-blue text-white text-sm font-medium rounded hover:bg-opacity-90 transition"
                          >
                            {copiedId === campaign.id ? '✓ Copied!' : 'Copy Embed Code'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CampaignsPage;
