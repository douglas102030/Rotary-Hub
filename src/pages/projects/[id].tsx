import React, { useState } from 'react';
import Image from 'next/image';
import Layout from '../../components/Layout';
import FundraisingWidget from '../../components/FundraisingWidget';

interface ProjectPhoto {
  id: number;
  src: string;
  alt: string;
}

const ProjectDetailPage: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<ProjectPhoto | null>(null);
  
  const photos: ProjectPhoto[] = [
    { id: 1, src: '/placeholder-project-1.jpg', alt: 'Project photo 1' },
    { id: 2, src: '/placeholder-project-2.jpg', alt: 'Project photo 2' },
    { id: 3, src: '/placeholder-project-3.jpg', alt: 'Project photo 3' },
    { id: 4, src: '/placeholder-project-4.jpg', alt: 'Project photo 4' },
    { id: 5, src: '/placeholder-project-5.jpg', alt: 'Project photo 5' },
    { id: 6, src: '/placeholder-project-6.jpg', alt: 'Project photo 6' },
  ];

  const currentPhotoIndex = selectedPhoto ? photos.findIndex(p => p.id === selectedPhoto.id) : -1;

  const goToPreviousPhoto = () => {
    if (currentPhotoIndex > 0) {
      setSelectedPhoto(photos[currentPhotoIndex - 1]);
    }
  };

  const goToNextPhoto = () => {
    if (currentPhotoIndex < photos.length - 1) {
      setSelectedPhoto(photos[currentPhotoIndex + 1]);
    }
  };

  return (
    <Layout title="Project Details">
      <div className="max-w-7xl mx-auto pb-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-6 flex-col md:flex-row gap-4">
          <div>
            <h1 className="text-3xl font-bold text-rotary-blue">Sample Project</h1>
            <p className="text-gray-600 mt-2">Sample Club - Sample Location</p>
          </div>
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-green-100 text-green-800">
            Active
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-rotary-blue mb-4">About this project</h2>
              
              <div className="prose max-w-none text-gray-700">
                <p className="mb-4">
                  Detailed description of the sample project. This project aims to make a significant impact on the community by providing essential resources and support to those in need.
                </p>
                
                <h3 className="text-xl font-bold text-rotary-blue mt-6 mb-3">Goals</h3>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  <li>Improve access to education for underprivileged children</li>
                  <li>Provide vocational training and job skills</li>
                  <li>Support sustainable community development</li>
                </ul>
                
                <h3 className="text-xl font-bold text-rotary-blue mt-6 mb-3">Expected Results</h3>
                <p>
                  The expected results for this project include reaching at least 500 families, creating 100 new jobs, and establishing sustainable income sources for participating communities.
                </p>
              </div>
            </div>

            {/* Fundraising Widget */}
            <FundraisingWidget goFundMeUrl="https://www.gofundme.com/f/sample-project-campaign" />

            {/* Photo Gallery */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-rotary-blue mb-6">Photo Gallery ({photos.length})</h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => setSelectedPhoto(photo)}
                    className="relative group cursor-pointer overflow-hidden rounded-lg bg-gray-200 aspect-square"
                  >
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-all duration-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <div className="absolute top-2 right-2 bg-white/80 px-2 py-1 rounded text-xs font-medium text-gray-800 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      {photo.id}/{photos.length}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-gray-700">
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  Click on any photo to view in full screen
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Project Details */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 sticky top-4">
              <h2 className="text-xl font-bold text-rotary-blue mb-4">Project Details</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Category</p>
                  <p className="mt-1 text-gray-900 font-medium">Education</p>
                </div>
                
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Location</p>
                  <p className="mt-1 text-gray-900 font-medium">Sample City, Sample Country</p>
                </div>
                
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Status</p>
                  <p className="mt-1">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      Active
                    </span>
                  </p>
                </div>
                
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Start Date</p>
                  <p className="mt-1 text-gray-900 font-medium">01/01/2026</p>
                </div>
                
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">End Date</p>
                  <p className="mt-1 text-gray-900 font-medium">31/12/2026</p>
                </div>
                
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Responsible Club</p>
                  <p className="mt-1 text-gray-900 font-medium">Sample Club</p>
                </div>
                
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Contact Person</p>
                  <p className="mt-1 text-gray-900 font-medium">John Doe</p>
                </div>
              </div>
            </div>

            {/* Useful Links */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-rotary-blue mb-4">Useful Links</h2>
              
              <div className="space-y-3">
                <a 
                  href="#" 
                  className="flex items-center text-rotary-blue hover:text-rotary-gold font-medium transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Fundraising Campaign
                </a>
                
                <a 
                  href="#" 
                  className="flex items-center text-rotary-blue hover:text-rotary-gold font-medium transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  External Website
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Photo Lightbox Modal */}
        {selectedPhoto && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setSelectedPhoto(null)}>
            <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
              {/* Close Button */}
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-all duration-300 z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Main Image */}
              <div className="relative w-full bg-gray-900 rounded-lg overflow-hidden aspect-video">
                <Image
                  src={selectedPhoto.src}
                  alt={selectedPhoto.alt}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={goToPreviousPhoto}
                  disabled={currentPhotoIndex === 0}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-all duration-300 font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>

                <div className="text-white font-medium bg-white/10 px-4 py-2 rounded-lg">
                  {currentPhotoIndex + 1} / {photos.length}
                </div>

                <button
                  onClick={goToNextPhoto}
                  disabled={currentPhotoIndex === photos.length - 1}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-all duration-300 font-medium"
                >
                  Next
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {photos.map((photo) => (
                  <button
                    key={photo.id}
                    onClick={() => setSelectedPhoto(photo)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      selectedPhoto.id === photo.id
                        ? 'border-white'
                        : 'border-white/30 hover:border-white/60'
                    }`}
                  >
                    <div className="relative w-full h-full bg-gray-700" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProjectDetailPage;
