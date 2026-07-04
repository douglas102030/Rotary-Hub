import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Layout from '../../components/Layout';

interface Project {
  id: number;
  title: string;
  club_name: string;
  category: string;
  description: string;
  status: string;
  location: string;
  main_image?: string;
}

const ProjectsPage: React.FC = () => {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch('/api/projects/list');
        const data = await response.json();
        
        if (data.success) {
          setProjects(data.projects || []);
        } else {
          setError(data.message || 'Failed to fetch projects');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const truncateText = (text: string, maxLength: number = 120) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'on hold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const navigateToProject = (projectId: number) => {
    router.push(`/projects/${projectId}`);
  };

  return (
    <Layout title="Rotary Projects">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-rotary-blue mb-6">Rotary Projects</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <h2 className="text-xl font-bold text-gray-900">All Projects</h2>
              <p className="text-gray-600">Explore Rotary club projects around the world</p>
            </div>
            
            <div className="flex space-x-3">
              <select aria-label="Filter projects by club" className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rotary-blue">
                <option>All clubs</option>
                <option>Sample Club 1</option>
                <option>Sample Club 2</option>
              </select>
              
              <select aria-label="Filter projects by category" className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rotary-blue">
                <option>All categories</option>
                <option>Education</option>
                <option>Health</option>
                <option>Environment</option>
              </select>
              
              <select aria-label="Filter projects by status" className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rotary-blue">
                <option>All statuses</option>
                <option>Draft</option>
                <option>Active</option>
                <option>Completed</option>
                <option>On Hold</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && (
            <div className="col-span-3 text-center py-8">
              <p className="text-gray-600">Loading projects...</p>
            </div>
          )}
          
          {error && (
            <div className="col-span-3 text-center py-8">
              <p className="text-red-600">Error: {error}</p>
            </div>
          )}
          
          {!loading && !error && projects.length === 0 && (
            <div className="col-span-3 text-center py-8">
              <p className="text-gray-600">No projects found</p>
            </div>
          )}
          
          {!loading && !error && projects.map((project) => (
            <div
              key={project.id}
              onClick={() => navigateToProject(project.id)}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
            >
              {/* Image Container */}
              <div className="relative w-full h-48 bg-gradient-to-br from-rotary-blue/10 to-rotary-gold/10 overflow-hidden">
                {project.main_image ? (
                  <img
                    src={project.main_image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-16 h-16 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-400 text-sm">No image</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Title */}
                <h3 className="text-lg font-bold text-rotary-blue mb-2 line-clamp-2 group-hover:text-rotary-gold transition-colors">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-3 line-clamp-2 h-10">
                  {truncateText(project.description, 100)}
                </p>

                {/* Status and Location */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {project.location}
                  </span>
                </div>

                {/* Club Name */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="text-gray-600 text-sm font-medium">
                    {project.club_name}
                  </span>
                  <span className="text-rotary-blue hover:text-rotary-gold font-medium text-sm transition-colors group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <nav className="inline-flex rounded-md shadow">
            <a href="#" className="px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              Previous
            </a>
            <a href="#" className="px-4 py-2 border-t border-b border-gray-300 bg-rotary-blue text-sm font-medium text-white">
              1
            </a>
            <a href="#" className="px-4 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              2
            </a>
            <a href="#" className="px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              Next
            </a>
          </nav>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectsPage;
