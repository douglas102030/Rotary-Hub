import React from 'react';
import Layout from '../../components/Layout';

const ProjectsPage: React.FC = () => {
  return (
    <Layout title="Rotary Projects">
      <div className="max-w-7xl mx-auto">
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
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="card">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mb-4" />
              <h3 className="text-lg font-bold text-rotary-blue mb-2">Sample Project {item}</h3>
              <p className="text-gray-600 text-sm mb-3">
                Brief description of sample project {item} showing how clubs can share their projects.
              </p>
              <div className="flex justify-between items-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  Active
                </span>
                <span className="text-gray-500 text-sm">Sample Club {item}</span>
              </div>
              <div className="mt-4">
                <a href={`/projects/${item}`} className="text-rotary-blue hover:text-rotary-gold font-medium">
                  View details
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <nav className="inline-flex rounded-md shadow">
            <a href="#" className="btn-primary px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              Previous
            </a>
            <a href="#" className="btn-primary px-4 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              1
            </a>
            <a href="#" className="btn-primary px-4 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              2
            </a>
            <a href="#" className="btn-primary px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              Next
            </a>
          </nav>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectsPage;
