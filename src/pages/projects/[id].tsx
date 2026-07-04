import React from 'react';
import Layout from '../../components/Layout';

const ProjectDetailPage: React.FC = () => {
  return (
    <Layout title="Project Details">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-rotary-blue">Sample Project</h1>
            <p className="text-gray-600 mt-2">Sample Club - Sample Location</p>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            Active
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 mb-4" />
              
              <div className="prose max-w-none">
                <p className="text-gray-700">
                  Detailed description of the sample project. This project aims to ...
                </p>
                
                <h2 className="text-xl font-bold text-rotary-blue mt-6 mb-3">Goals</h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Objetivo 1 do projeto</li>
                  <li>Objetivo 2 do projeto</li>
                  <li>Objetivo 3 do projeto</li>
                </ul>
                
                <h2 className="text-xl font-bold text-rotary-blue mt-6 mb-3">Expected Results</h2>
                <p className="text-gray-700">
                  Os resultados esperados para este projeto incluem...
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-rotary-blue mb-4">Project Photos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48" />
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-rotary-blue mb-4">Project Details</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Category</h3>
                  <p className="mt-1 text-gray-900">Education</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Location</h3>
                  <p className="mt-1 text-gray-900">Sample City, Sample Country</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="mt-1 text-gray-900">Active</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Period</h3>
                  <p className="mt-1 text-gray-900">01/01/2026 - 31/12/2026</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Responsible Club</h3>
                  <p className="mt-1 text-gray-900">Sample Club</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Contact</h3>
                  <p className="mt-1 text-gray-900">Name do Contact</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-rotary-blue mb-4">Useful Links</h2>
              
              <div className="space-y-3">
                <a href="#" className="flex items-center text-rotary-blue hover:text-rotary-gold">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Fundraising campaign link
                </a>
                
                <a href="#" className="flex items-center text-rotary-blue hover:text-rotary-gold">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Documento relacionado
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-rotary-blue mb-4">Comments</h2>
          
          <div className="space-y-4">
            {[1, 2].map((item) => (
              <div key={item} className="border-b pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">User Name {item}</h3>
                    <p className="text-sm text-gray-500">Sample Club • 2 days ago</p>
                  </div>
                </div>
                <p className="mt-2 text-gray-700">
                  This is a sample comment about the project. It can include relevant information, questions, or feedback.
                </p>
              </div>
            ))}
            
            <div className="mt-4">
              <textarea 
                rows={3} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rotary-blue"
                placeholder="Add a comment..."
              ></textarea>
              <div className="mt-2 text-right">
                <button className="btn-primary px-4 py-2">
                  Publicar Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetailPage;
