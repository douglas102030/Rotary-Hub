import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import FundraisingProgressTracker from '../../components/FundraisingProgressTracker';

interface Project {
  id: number;
  title: string;
  club_name: string;
  category: string;
  location: string;
  description: string;
  status: string;
  start_date?: string;
  end_date?: string;
  fundraising_link?: string;
  gofundme_url?: string;
  crowdfunder_url?: string;
  raised?: number;
  goal?: number;
  main_image?: string;
  photos?: Array<{ id: number; image_url: string }>;
}

const ProjectDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${id}`);
        const data = await response.json();

        if (data.success) {
          setProject(data.project);
        } else {
          setError(data.message || 'Failed to load project');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <Layout title="Project Details">
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rotary-blue mx-auto mb-4"></div>
            <p className="text-gray-600">Loading project...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !project) {
    return (
      <Layout title="Project Details">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-bold text-red-800 mb-2">Error Loading Project</h2>
            <p className="text-red-700">{error || 'Project not found'}</p>
          </div>
        </div>
      </Layout>
    );
  }

  const photos = project.photos || [];
  const hasFundraisingTracking = project.gofundme_url || project.crowdfunder_url;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'on hold':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Layout title={`${project.title} - Project Details`}>
      <div className="max-w-7xl mx-auto pb-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-6 flex-col md:flex-row gap-4">
          <div>
            <h1 className="text-3xl font-bold text-rotary-blue">{project.title}</h1>
            <p className="text-gray-600 mt-2">
              {project.club_name} • {project.location}
            </p>
          </div>
          <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-rotary-blue mb-4">About this project</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
            </div>

            {/* Fundraising Progress Tracker */}
            {hasFundraisingTracking && (
              <div className="mb-6">
                {project.gofundme_url && (
                  <FundraisingProgressTracker
                    projectId={project.id}
                    url={project.gofundme_url}
                    platform="gofundme"
                    initialRaised={project.raised || 0}
                    initialGoal={project.goal || 0}
                  />
                )}
                {project.crowdfunder_url && (
                  <FundraisingProgressTracker
                    projectId={project.id}
                    url={project.crowdfunder_url}
                    platform="crowdfunder"
                    initialRaised={project.raised || 0}
                    initialGoal={project.goal || 0}
                  />
                )}
              </div>
            )}

            {/* Photo Gallery */}
            {photos.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-rotary-blue mb-6">Photo Gallery ({photos.length})</h2>

                {/* Main image display */}
                <div className="mb-6">
                  <div className="relative bg-gray-200 rounded-lg overflow-hidden" style={{ aspectRatio: '16 / 9' }}>
                    <img
                      src={photos[selectedPhotoIndex]?.image_url}
                      alt={`Project photo ${selectedPhotoIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {photos.length > 1 && (
                      <>
                        <button
                          onClick={() => setSelectedPhotoIndex((i) => (i - 1 + photos.length) % photos.length)}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition"
                        >
                          ←
                        </button>
                        <button
                          onClick={() => setSelectedPhotoIndex((i) => (i + 1) % photos.length)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition"
                        >
                          →
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Thumbnail gallery */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {photos.map((photo, index) => (
                    <button
                      key={photo.id}
                      onClick={() => setSelectedPhotoIndex(index)}
                      className={`relative rounded-lg overflow-hidden aspect-square transition ${
                        selectedPhotoIndex === index ? 'ring-2 ring-rotary-gold' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={photo.image_url}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            {/* Project Details */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 sticky top-4">
              <h2 className="text-xl font-bold text-rotary-blue mb-4">Project Details</h2>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Category</p>
                  <p className="mt-1 text-gray-900 font-medium">{project.category}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Location</p>
                  <p className="mt-1 text-gray-900 font-medium">{project.location}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Status</p>
                  <p className="mt-1">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </p>
                </div>

                {project.start_date && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Start Date</p>
                    <p className="mt-1 text-gray-900 font-medium">{formatDate(project.start_date)}</p>
                  </div>
                )}

                {project.end_date && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">End Date</p>
                    <p className="mt-1 text-gray-900 font-medium">{formatDate(project.end_date)}</p>
                  </div>
                )}

                {project.fundraising_link && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Fundraising Link</p>
                    <a
                      href={project.fundraising_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 text-rotary-blue hover:text-rotary-gold font-medium break-all"
                    >
                      View Campaign →
                    </a>
                  </div>
                )}

                {project.goal && project.goal > 0 && (
                  <div className="pt-4 border-t">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Fundraising Goal</p>
                    <p className="mt-1 text-2xl font-bold text-rotary-gold">£{project.goal.toLocaleString()}</p>
                    {project.raised && (
                      <p className="text-sm text-gray-600 mt-1">
                        Raised: £{project.raised.toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetailPage;
