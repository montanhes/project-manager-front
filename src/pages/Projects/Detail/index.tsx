import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../../services/api';

// Type Definitions
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
  1: { text: 'Fácil', className: 'badge-success' },
  2: { text: 'Médio', className: 'badge-warning' },
  3: { text: 'Difícil', className: 'badge-error' },
};

export function ProjectDetailPage() {
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const { id } = useParams<{ id: string }>();

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
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleToggleTask = async (taskId: number) => {
    if (!project) return;

    // Optimistic UI update
    const originalTasks = project.tasks;
    const newTasks = originalTasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setProject({ ...project, tasks: newTasks });

    try {
      await api.patch(`/tasks/${taskId}/toggle`);
      setToast({ message: 'Status da tarefa atualizado!', type: 'success' });
      // Re-fetch project data to get updated progress
      await fetchProject(false); 
    } catch (err) {
      // Revert optimistic update on error
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
          <div className="stat-desc">{totalTasks > 0 ? `${((completedTasks / totalTasks) * 100).toFixed(0)}% das tarefas` : 'Nenhuma tarefa'}</div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Tarefas</h2>
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
            {project.tasks.map(task => (
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
    </div>
  );
}
