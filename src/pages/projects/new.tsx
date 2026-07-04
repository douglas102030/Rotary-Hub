import React, { useState } from 'react';
import Image from 'next/image';
import Layout from '../../components/Layout';

interface ProjectImage {
  id: string;
  src: string;
  name: string;
  isExternal?: boolean;
}

const NewProjectPage: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    clubName: '',
    category: '',
    location: '',
    description: '',
    status: 'draft',
    startDate: '',
    endDate: '',
    fundraisingLink: '',
    goFundMeUrl: '',
    externalLinks: '',
    contactPerson: '',
  });

  const [images, setImages] = useState<ProjectImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoadingGoFundMe, setIsLoadingGoFundMe] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const extractGoFundMeData = async () => {
    if (!formData.goFundMeUrl) {
      setFeedbackMessage({ type: 'error', text: 'Please enter a GoFundMe URL first' });
      return;
    }

    setIsLoadingGoFundMe(true);
    setFeedbackMessage(null);

    try {
      const response = await fetch('/api/gofundme/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: formData.goFundMeUrl })
      });

      const data = await response.json();

      if (!data.success) {
        setFeedbackMessage({ type: 'error', text: data.message || 'Failed to extract data' });
        return;
      }

      // Popular os campos automaticamente
      setFormData(prev => ({
        ...prev,
        title: data.title || prev.title,
        description: data.description || prev.description,
        fundraisingLink: formData.goFundMeUrl
      }));

      // Carregar imagens extraídas - usar URLs diretas
      if (data.images && data.images.length > 0) {
        const extractedImages: ProjectImage[] = data.images.map((imageUrl: string, index: number) => ({
          id: `gofundme-${Date.now()}-${index}`,
          src: imageUrl,
          name: `GoFundMe-Photo-${index + 1}.jpg`,
          isExternal: true
        }));
        
        setImages(prev => [...prev, ...extractedImages]);

        setFeedbackMessage({ 
          type: 'success', 
          text: `✅ Successfully extracted! Title, description, and ${data.images.length} photos loaded.` 
        });
      } else {
        setFeedbackMessage({ 
          type: 'success', 
          text: 'Successfully extracted project data (no photos found).' 
        });
      }
    } catch (error) {
      console.error('Error extracting data:', error);
      setFeedbackMessage({ type: 'error', text: 'An error occurred while extracting data' });
    } finally {
      setIsLoadingGoFundMe(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setImages(prev => [...prev, {
              id: Math.random().toString(36),
              src: event.target!.result as string,
              name: file.name
            }]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files) {
      Array.from(files).forEach((file) => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              setImages(prev => [...prev, {
                id: Math.random().toString(36),
                src: event.target!.result as string,
                name: file.name
              }]);
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const removeImage = (id: string) => {
    setImages(images.filter(img => img.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted form:', formData);
    console.log('Images:', images);
    alert('Project created successfully!');
  };

  return (
    <Layout title="Create New Project">
      <div className="max-w-4xl mx-auto pb-8">
        <h1 className="text-3xl font-bold text-rotary-blue mb-6">Create New Project</h1>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          {/* Basic Info */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-rotary-blue mb-4">Project Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rotary-blue"
                  placeholder="Project title"
                  required
                />
              </div>

              <div>
                <label htmlFor="clubName" className="block text-sm font-medium text-gray-700 mb-1">
                  Responsible Club *
                </label>
                <input
                  type="text"
                  id="clubName"
                  name="clubName"
                  value={formData.clubName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rotary-blue"
                  placeholder="Club name"
                  required
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rotary-blue"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="education">Education</option>
                  <option value="health">Health</option>
                  <option value="environment">Environment</option>
                  <option value="community">Community</option>
                  <option value="humanitarian">Humanitarian</option>
                </select>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rotary-blue"
                  placeholder="City, Country"
                  required
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rotary-blue"
                  required
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="on_hold">On Hold</option>
                </select>
              </div>

              <div>
                <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Person
                </label>
                <input
                  type="text"
                  id="contactPerson"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rotary-blue"
                  placeholder="Contact person name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rotary-blue"
                placeholder="Detailed project description..."
                required
              ></textarea>
            </div>
          </div>

          {/* Dates and Links */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-rotary-blue mb-4">Dates & Links</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rotary-blue"
                />
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rotary-blue"
                />
              </div>

              <div>
                <label htmlFor="fundraisingLink" className="block text-sm font-medium text-gray-700 mb-1">
                  Fundraising Campaign Link
                </label>
                <input
                  type="url"
                  id="fundraisingLink"
                  name="fundraisingLink"
                  value={formData.fundraisingLink}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rotary-blue"
                  placeholder="https://example.com/campaign"
                />
              </div>

              <div>
                <label htmlFor="goFundMeUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  GoFundMe Campaign URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    id="goFundMeUrl"
                    name="goFundMeUrl"
                    value={formData.goFundMeUrl}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rotary-blue"
                    placeholder="https://www.gofundme.com/f/your-campaign"
                  />
                  <button
                    type="button"
                    onClick={extractGoFundMeData}
                    disabled={isLoadingGoFundMe || !formData.goFundMeUrl}
                    className="px-4 py-2 bg-rotary-gold text-rotary-blue font-medium rounded-md hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition whitespace-nowrap"
                  >
                    {isLoadingGoFundMe ? 'Loading...' : '✨ Auto-fill'}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">Paste a GoFundMe URL and click &quot;Auto-fill&quot; to extract project name, description, and images automatically!</p>
                
                {feedbackMessage && (
                  <div className={`mt-3 p-3 rounded-lg text-sm font-medium animate-pulse ${
                    feedbackMessage.type === 'success' 
                      ? 'bg-green-100 text-green-800 border border-green-300' 
                      : 'bg-red-100 text-red-800 border border-red-300'
                  }`}>
                    {feedbackMessage.text}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="externalLinks" className="block text-sm font-medium text-gray-700 mb-1">
                  External Links
                </label>
                <input
                  type="text"
                  id="externalLinks"
                  name="externalLinks"
                  value={formData.externalLinks}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rotary-blue"
                  placeholder="Related links (comma-separated)"
                />
              </div>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-rotary-blue mb-4">Project Photos</h2>
            
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging
                  ? 'border-rotary-blue bg-rotary-blue/5'
                  : 'border-gray-300 bg-gray-50'
              }`}
            >
              <div className="mb-4">
                <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              
              <p className="text-gray-700 font-medium mb-2">
                Drag and drop your photos here or click to browse
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Supported formats: JPG, PNG, GIF (Max 10 files, 5MB each)
              </p>
              
              <label className="inline-block">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <span className="btn-secondary px-4 py-2 cursor-pointer inline-block">
                  Select Photos
                </span>
              </label>
            </div>

            {/* Image Preview */}
            {images.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Photos ({images.length})</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((image) => (
                    <div key={image.id} className="relative group">
                      <div className="relative w-full h-40 bg-gray-200 rounded-lg overflow-hidden border border-gray-300">
                        {image.isExternal ? (
                          // Para URLs externas, usar img tag simples
                          <img
                            src={image.src}
                            alt={image.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.error('Failed to load image:', image.src);
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          // Para imagens locais, usar Next Image
                          <Image
                            src={image.src}
                            alt={image.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-2 truncate">{image.name}</p>
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary px-4 py-2"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default NewProjectPage;
