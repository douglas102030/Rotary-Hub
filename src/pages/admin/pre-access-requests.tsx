import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

interface PreAccessRequest {
  id: number;
  fullName: string;
  email: string;
  clubName: string;
  position: string;
  phoneNumber: string;
  country: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const PreAccessRequestsPage: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [requests, setRequests] = useState<PreAccessRequest[]>([
    {
      id: 1,
      fullName: 'João Silva',
      email: 'joao@club.com',
      clubName: 'Rotary Dublin',
      position: 'President',
      phoneNumber: '+353 1 234 5678',
      country: 'Ireland',
      message: 'Solicito acesso ao sistema para gerenciar projetos do club.',
      status: 'pending',
      createdAt: '2026-07-03T10:30:00',
    },
    {
      id: 2,
      fullName: 'Maria Santos',
      email: 'maria@club.com',
      clubName: 'Rotary Cork',
      position: 'Treasurer',
      phoneNumber: '+353 21 987 6543',
      country: 'Ireland',
      message: 'Gostaria de acessar a plataforma para submeter nossos projetos.',
      status: 'pending',
      createdAt: '2026-07-02T15:45:00',
    },
  ]);

  const [selectedRequest, setSelectedRequest] = useState<PreAccessRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  if (!session || session.user.role !== 'admin') {
    return (
      <Layout title="Access Denied">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h1 className="text-2xl font-bold text-red-800 mb-2">Access Denied</h1>
            <p className="text-red-700 mb-4">You don&apos;t have permission to access this page.</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="btn-primary"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const filteredRequests = filterStatus === 'all'
    ? requests
    : requests.filter(req => req.status === filterStatus);

  const handleApprove = (id: number) => {
    setRequests(requests.map(req =>
      req.id === id ? { ...req, status: 'approved' as const } : req
    ));
    setSelectedRequest(null);
    alert('Pedido aprovado! Um email será enviado para o solicitante.');
  };

  const handleReject = (id: number) => {
    setRequests(requests.map(req =>
      req.id === id ? { ...req, status: 'rejected' as const } : req
    ));
    setSelectedRequest(null);
    alert('Pedido rejeitado! Um email será enviado para o solicitante.');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Aprovado';
      case 'rejected':
        return 'Rejeitado';
      default:
        return 'Pendente';
    }
  };

  return (
    <Layout title="Pre-Access Requests">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-rotary-blue mb-6">Pedidos de Pré-Cadastro</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterStatus === 'all'
                  ? 'bg-rotary-blue text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Todos ({requests.length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterStatus === 'pending'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Pendentes ({requests.filter(r => r.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilterStatus('approved')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterStatus === 'approved'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Aprovados ({requests.filter(r => r.status === 'approved').length})
            </button>
            <button
              onClick={() => setFilterStatus('rejected')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterStatus === 'rejected'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Rejeitados ({requests.filter(r => r.status === 'rejected').length})
            </button>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Club</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">País</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{request.fullName}</div>
                      <div className="text-sm text-gray-500">{request.position}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{request.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{request.clubName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{request.country}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(request.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {getStatusLabel(request.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="text-rotary-blue hover:text-rotary-gold font-medium"
                      >
                        Ver Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Request Details Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-rotary-blue">Detalhes do Pedido</h2>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Nome Completo</p>
                    <p className="text-gray-900">{selectedRequest.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Email</p>
                    <p className="text-gray-900">{selectedRequest.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Club</p>
                    <p className="text-gray-900">{selectedRequest.clubName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Posição</p>
                    <p className="text-gray-900">{selectedRequest.position}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Telefone</p>
                    <p className="text-gray-900">{selectedRequest.phoneNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">País</p>
                    <p className="text-gray-900">{selectedRequest.country}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 font-medium mb-2">Mensagem</p>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-gray-900">{selectedRequest.message}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {selectedRequest.status === 'pending' && (
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => handleReject(selectedRequest.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium transition"
                  >
                    Rejeitar
                  </button>
                  <button
                    onClick={() => handleApprove(selectedRequest.id)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium transition"
                  >
                    Aprovar
                  </button>
                </div>
              )}

              {selectedRequest.status !== 'pending' && (
                <div className="flex justify-end">
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-medium transition"
                  >
                    Fechar
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PreAccessRequestsPage;
