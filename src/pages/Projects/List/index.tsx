import { useState, useEffect } from 'react';
import { useSearchParams, useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../../../services/api';

interface Project {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  progress: string;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PaginatedProjectsResponse {
  current_page: number;
  data: Project[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export function ProjectsListPage() {
  const [projectsResponse, setProjectsResponse] = useState<PaginatedProjectsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.successMessage) {
      setToastMessage(location.state.successMessage);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, navigate]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      const page = searchParams.get('page') || '1';

      try {
        const { data } = await api.get(`/projects?page=${page}`);
        setProjectsResponse(data);
      } catch (err) {
        setError('Falha ao buscar projetos.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [searchParams]);

  const handlePageChange = (url: string | null) => {
    if (!url) return;
    const page = new URL(url).searchParams.get('page');
    setSearchParams({ page: page || '1' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  return (
    <div>
      <div className="toast toast-top toast-end z-50">
        {toastMessage && (
          <div className="alert alert-success">
            <span>{toastMessage}</span>
            <button className="btn btn-ghost btn-sm" onClick={() => setToastMessage(null)}>
              ✕
            </button>
          </div>
        )}
      </div>

      <h1 className="text-2xl font-bold mb-4">Projetos</h1>
      <div className="flex justify-end mb-4">
        <button className="btn btn-primary" onClick={() => navigate('/projects/create')}>
          Criar Novo Projeto
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Progresso</th>
              <th>Criado</th>
              <th>Atualizado</th>
            </tr>
          </thead>
          <tbody>
            {projectsResponse?.data.map((project) => (
              <tr
                key={project.id}
                className="cursor-pointer hover:bg-base-300"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <td>
                  {project.name}
                </td>
                <td>
                  <progress
                    className="progress progress-primary w-56"
                    value={parseFloat(project.progress)}
                    max="100"
                  ></progress>
                  <span className="ml-2 text-sm">{project.progress}%</span>
                </td>
                <td>{formatDate(project.created_at)}</td>
                <td>{formatDate(project.updated_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-8">
        <div className="join">
          {projectsResponse?.links.map((link, index) => {
            let label = link.label;
            if (label.includes('Previous')) {
              label = label.replace('Previous', 'Anterior');
            } else if (label.includes('Next')) {
              label = label.replace('Next', 'Próximo');
            }

            return (
              <button
                key={index}
                className={`join-item btn ${link.active ? 'btn-active' : ''}`}
                onClick={() => handlePageChange(link.url)}
                disabled={!link.url}
                dangerouslySetInnerHTML={{ __html: label }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
