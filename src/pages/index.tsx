import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../components/Layout';
import { useSession } from 'next-auth/react';

const CURRENT_YEAR = 2026;

interface Project {
  id: number;
  title: string;
  description: string;
  main_image?: string;
}

const HomePage: React.FC = () => {
  const { data: session } = useSession();
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const isAdmin = session?.user?.role === 'admin';

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        const response = await fetch('/api/projects/featured');
        if (response.ok) {
          const data = await response.json();
          setFeaturedProjects(data.projects || []);
        }
      } catch (error) {
        console.error('Error fetching featured projects:', error);
      }
    };
    
    fetchFeaturedProjects();
  }, []);

  return (
    <Layout title="Rotary Club HUB Projects">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-rotary-blue to-rotary-dark-blue text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-radial-dots-white-48" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Rotary Club HUB Projects
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              Connecting clubs, sharing projects, and creating transformational impact in communities around the world.
            </p>

            <div className="flex justify-center items-center mt-12">
              <Link 
                href="/pre-access"
                className="group inline-flex items-center px-8 py-4 bg-white text-rotary-blue font-bold rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-yellow-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0H3z" />
                </svg>
                Request Free Access
              </Link>
            </div>

            <p className="text-gray-400 text-sm mt-6">Join more than {CURRENT_YEAR} Rotary members around the world</p>
          </div>
        </div>
      </section>

      {/* Rotary Information Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-rotary-blue mb-4">
              About Rotary International
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Building communities where together we see a future where people unite and take action to create lasting change.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
            {/* Rotary International */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border-t-4 border-rotary-blue">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-2xl font-bold text-rotary-blue mb-4">Rotary International</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Founded in 1905, Rotary International is a global organization of 1.4+ million Rotarians in nearly every country. We work locally and globally to tackle the world's toughest challenges.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ <strong>192 countries</strong> and geographical areas</li>
                <li>✓ <strong>35,000+ clubs</strong> worldwide</li>
                <li>✓ <strong>Committed to 6 areas of focus:</strong></li>
                <li className="ml-4">• Disease Prevention & Treatment</li>
                <li className="ml-4">• Maternal & Child Health</li>
                <li className="ml-4">• Water, Sanitation & Hygiene</li>
                <li className="ml-4">• Basic Education & Literacy</li>
                <li className="ml-4">• Economic & Community Development</li>
                <li className="ml-4">• Peace & Conflict Resolution</li>
              </ul>
            </div>

            {/* Rotary Ireland */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border-t-4 border-green-600">
              <div className="text-4xl mb-4">🇮🇪</div>
              <h3 className="text-2xl font-bold text-green-700 mb-4">Rotary Ireland</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Rotary in Ireland comprises over 60 clubs working together to make a meaningful difference in Irish communities and globally.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ <strong>60+ active Rotary clubs</strong></li>
                <li>✓ <strong>Supporting local communities</strong> through various projects</li>
                <li>✓ <strong>Focus areas:</strong></li>
                <li className="ml-4">• Community development</li>
                <li className="ml-4">• Youth initiatives</li>
                <li className="ml-4">• International service</li>
                <li className="ml-4">• Health & welfare programs</li>
              </ul>
            </div>

            {/* Rotary UK & Ireland */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border-t-4 border-blue-700">
              <div className="text-4xl mb-4">🇬🇧</div>
              <h3 className="text-2xl font-bold text-blue-800 mb-4">Rotary UK & Ireland</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                With over 650 clubs across the UK and Ireland, Rotary is delivering real, lasting change to communities.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ <strong>650+ clubs</strong> united in service</li>
                <li>✓ <strong>Active regions:</strong> England, Scotland, Wales, Northern Ireland</li>
                <li>✓ <strong>Latest Initiatives:</strong></li>
                <li className="ml-4">• Tackling homelessness</li>
                <li className="ml-4">• Supporting mental health</li>
                <li className="ml-4">• Youth and education programs</li>
                <li className="ml-4">• Environmental sustainability</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-rotary-blue mb-2">
                Featured Projects
              </h2>
              <p className="text-xl text-gray-600">
                Showcase the most impactful Rotary projects
              </p>
            </div>
            {isAdmin && (
              <Link 
                href="/admin/featured-projects"
                className="inline-flex items-center px-6 py-3 bg-rotary-gold text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Manage Featured
              </Link>
            )}
          </div>

          {featuredProjects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <Link 
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-2"
                >
                  <div className="relative h-48 bg-gradient-to-br from-rotary-blue to-blue-700 overflow-hidden">
                    {project.main_image ? (
                      <Image
                        src={project.main_image}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-rotary-blue transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 text-lg">No featured projects yet</p>
              {isAdmin && (
                <p className="text-gray-400 text-sm mt-2">
                  <Link href="/admin/featured-projects" className="text-rotary-gold hover:underline">
                    Add your first featured project
                  </Link>
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold text-rotary-blue mb-4">
              Why use HUB Projects?
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              A complete platform built especially for Rotary clubs to manage and share their impact projects.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <Link 
              href="/projects"
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 border-b-4 border-transparent group-hover:border-yellow-500 transform hover:-translate-y-2 h-full"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white transform group-hover:scale-110 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-rotary-blue transition-colors">
                Connecting Clubs
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Build powerful connections between Rotary clubs in different regions, enabling collaboration and sharing best practices for social impact projects.
              </p>
            </Link>

            {/* Feature 2 */}
            <Link 
              href="/projects"
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 border-b-4 border-transparent group-hover:border-yellow-500 transform hover:-translate-y-2 h-full"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white transform group-hover:scale-110 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-rotary-blue transition-colors">
                Managed Projects
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Create, track, and manage impact projects with integrated tools for photos, documents, and detailed reports.
              </p>
            </Link>

            {/* Feature 3 */}
            <Link 
              href="/dashboard"
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 border-b-4 border-transparent group-hover:border-yellow-500 transform hover:-translate-y-2 h-full"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white transform group-hover:scale-110 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l9 2m8.7-3a6 6 0 00-11.27-.4c-.03.1-.05.2-.07.3A6.5 6.5 0 0111.9 2.5a6.48 6.48 0 00-5.7 9.5zM3 20h18M12 8V2m0 1v1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-rotary-blue transition-colors">
                Creating Real Impact
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Track project impact with metrics, reports, and community feedback to maximize social outcomes.
              </p>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 bg-white rounded-3xl shadow-xl p-12">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Numbers That Speak for Us</h2>
            
            <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {[
                { label: 'Active Clubs', value: '1,200+', icon: '🏛️' },
                { label: 'Projects Created', value: '3,500+', icon: '💼' },
                { label: 'Registered Members', value: '45,000+', icon: '👥' },
                { label: 'Communities Impacted', value: '890+', icon: '🌍' }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <span className="text-5xl mb-4 block">{stat.icon}</span>
                  <p className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <p className="text-sm md:text-base leading-relaxed transition-colors duration-300 group-hover:font-semibold">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
