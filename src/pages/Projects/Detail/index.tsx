import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../../../services/api';

interface Task {
  id: number;
  title: string;
  completed: boolean;
  difficulty: number;
  project_id: number;
  created_at: string;
  updated_at: string;
}

interface ProjectDetails {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  tasks: Task[];
  progress: number;
}

const difficultyMap: { [key: number]: { text: string; className: string } } = {
  1: { text: 'Baixa', className: 'badge-info' },
  2: { text: 'Média', className: 'badge-warning' },
  3: { text: 'Alta', className: 'badge-error' },
};

export function ProjectDetailPage() {
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const TASKS_PER_PAGE = 15;

  const fetchProject = useCallback(async (showLoading = true) => {
    if (!id) return;
    if (showLoading) setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/projects/${id}`);
      setProject(data);
    } catch (err) {
      setError('Falha ao buscar detalhes do projeto.');
      console.error(err);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);
  
  useEffect(() => {
    if (location.state?.successMessage) {
      setToast({ message: location.state.successMessage, type: 'success' });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleToggleTask = async (taskId: number) => {
    if (!project) return;

    const originalTasks = project.tasks;
    const newTasks = originalTasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setProject({ ...project, tasks: newTasks });

    try {
      await api.patch(`/tasks/${taskId}/toggle`);
      setToast({ message: 'Status da tarefa atualizado!', type: 'success' });
      await fetchProject(false); 
    } catch (err) {
      setProject({ ...project, tasks: originalTasks });
      setToast({ message: 'Falha ao atualizar a tarefa.', type: 'error' });
      console.error(err);
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error || !project) {
    return <div className="alert alert-error">{error || 'Projeto não encontrado.'}</div>;
  }

  const completedTasks = project.tasks.filter(task => task.completed).length;
  const totalTasks = project.tasks.length;

  const indexOfLastTask = currentPage * TASKS_PER_PAGE;
  const indexOfFirstTask = indexOfLastTask - TASKS_PER_PAGE;
  const currentTasks = project.tasks.slice(indexOfFirstTask, indexOfLastTask);
  const pageCount = Math.ceil(totalTasks / TASKS_PER_PAGE);

  return (
    <div>
      <div className="toast toast-top toast-end z-50">
        {toast && (
          <div className={`alert alert-${toast.type}`}>
            <span>{toast.message}</span>
          </div>
        )}
      </div>

      <div className="mb-6">
        <Link to="/projects" className="link link-hover text-sm mb-2">
          &larr; Voltar para todos os projetos
        </Link>
        <h1 className="text-4xl font-bold">{project.name}</h1>
      </div>

      <div className="stats shadow w-full mb-8">
        <div className="stat">
          <div className="stat-title">Progresso do Projeto</div>
          <div className="stat-value">{project.progress}%</div>
          <div className="stat-desc">
            <progress className="progress progress-primary w-full" value={project.progress} max="100"></progress>
          </div>
        </div>

        <div className="stat flex flex-col items-end">
          <div className="stat-title">Tarefas Concluídas</div>
          <div className="stat-value">{completedTasks} / {totalTasks}</div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Tarefas</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate(`/projects/${project.id}/tasks/create`)}
        >
          Nova Tarefa
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th className="w-12">Status</th>
              <th>Título</th>
              <th className="w-32">Dificuldade</th>
            </tr>
          </thead>
          <tbody>
            {currentTasks.map(task => (
              <tr key={task.id}>
                <td>
                  <input 
                    type="checkbox" 
                    checked={task.completed}
                    className={`toggle ${task.completed ? 'toggle-success' : 'toggle-error'}`} 
                    onChange={() => handleToggleTask(task.id)}
                  />
                </td>
                <td>{task.title}</td>
                <td>
                  <span className={`badge badge-dash w-20 ${difficultyMap[task.difficulty]?.className || 'badge-ghost'}`}>
                    {difficultyMap[task.difficulty]?.text || 'N/A'}
                  </span>
                </td>
              </tr>
            ))}
             {project.tasks.length === 0 && (
                <tr>
                    <td colSpan={3} className="text-center">Nenhuma tarefa encontrada para este projeto.</td>
                </tr>
             )}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <div className="flex justify-end mt-4">
          <div className="join">
            <button
              className="join-item btn"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              « Anterior
            </button>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map(pageNumber => (
              <button
                key={pageNumber}
                className={`join-item btn ${currentPage === pageNumber ? 'btn-active' : ''}`}
                onClick={() => setCurrentPage(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
            <button
              className="join-item btn"
              onClick={() => setCurrentPage(prev => Math.min(pageCount, prev + 1))}
              disabled={currentPage === pageCount}
            >
              Próximo »
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
