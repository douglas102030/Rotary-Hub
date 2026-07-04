import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';

interface Project {
  id: number;
  title: string;
  description: string;
  main_image?: string;
  is_featured?: boolean;
}

const FeaturedProjectsAdmin: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [featuredIds, setFeaturedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (session?.user?.role !== 'admin') {
      router.push('/');
      return;
    }

    fetchProjects();
  }, [session, router]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects/list');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
        
        // Fetch featured projects
        const featuredResponse = await fetch('/api/projects/featured');
        if (featuredResponse.ok) {
          const featuredData = await featuredResponse.json();
          setFeaturedIds(featuredData.projects?.map((p: any) => p.id) || []);
        }
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setMessage('Erro ao carregar projetos');
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = (projectId: number) => {
    setFeaturedIds(prev => 
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId].slice(0, 6)
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/featured-projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectIds: featuredIds })
      });

      if (response.ok) {
        setMessage('✓ Projetos em destaque atualizados com sucesso!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('✗ Erro ao salvar projetos em destaque');
      }
    } catch (error) {
      console.error('Error saving featured projects:', error);
      setMessage('✗ Erro ao conectar ao servidor');
    } finally {
      setSaving(false);
    }
  };

  if (session?.user?.role !== 'admin') {
    return null;
  }

  return (
    <Layout title="Gerenciar Projetos em Destaque">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/" className="text-rotary-blue hover:underline mb-4 inline-block">
            ← Voltar para Home
          </Link>
          <h1 className="text-4xl font-bold text-rotary-blue mb-2">Projetos em Destaque</h1>
          <p className="text-gray-600">Selecione até 6 projetos para aparecer na tela principal</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.startsWith('✓') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <div className="h-8 w-8 border-4 border-rotary-blue border-t-transparent rounded-full"></div>
            </div>
            <p className="mt-4 text-gray-600">Carregando projetos...</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Selecionados: {featuredIds.length}/6
                </h2>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-rotary-gold h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(featuredIds.length / 6) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-h-96 overflow-y-auto">
                {projects.map((project) => (
                  <div 
                    key={project.id}
                    onClick={() => toggleFeatured(project.id)}
                    className={`p-4 rounded-lg cursor-pointer border-2 transition-all duration-300 ${
                      featuredIds.includes(project.id)
                        ? 'border-rotary-gold bg-yellow-50'
                        : 'border-gray-200 bg-gray-50 hover:border-rotary-gold'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={featuredIds.includes(project.id)}
                          onChange={() => toggleFeatured(project.id)}
                          className="h-5 w-5 text-rotary-gold rounded cursor-pointer"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate">
                          {project.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {project.description}
                        </p>
                        {project.main_image && (
                          <div className="mt-2 text-xs text-green-600">✓ Tem imagem</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {projects.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nenhum projeto disponível
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 px-6 py-3 bg-rotary-gold text-white font-bold rounded-lg hover:bg-yellow-600 disabled:opacity-50 transition-all duration-300"
              >
                {saving ? 'Salvando...' : 'Salvar Seleção'}
              </button>
              <Link 
                href="/"
                className="flex-1 px-6 py-3 bg-gray-300 text-gray-900 font-bold rounded-lg hover:bg-gray-400 text-center transition-all duration-300"
              >
                Cancelar
              </Link>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default FeaturedProjectsAdmin;
