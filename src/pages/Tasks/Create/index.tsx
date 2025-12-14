import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../../services/api';

export function CreateTaskPage() {
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState('1'); // Default to 'LOW'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post('/tasks', {
        title,
        difficulty,
        project_id: projectId
      });
      navigate(`/projects/${projectId}`, {
        state: { successMessage: `Tarefa "${title}" criada com sucesso!` }
      });
    } catch (err) {
      setError('Falha ao criar a tarefa. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Link to={`/projects/${projectId}`} className="link link-hover text-sm mb-2">
          &larr; Voltar para o projeto
        </Link>
        <h1 className="text-4xl font-bold">Criar Nova Tarefa</h1>
      </div>

      <div className="card bg-base-100 shadow-xl max-w-lg">
        <div className="card-body">
          {error && <div className="alert alert-error mb-4">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Título da Tarefa</span>
              </label>
              <input
                type="text"
                placeholder="Digite o título da tarefa"
                className="input input-bordered w-full"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Dificuldade</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="1">Baixa</option>
                <option value="2">Média</option>
                <option value="3">Alta</option>
              </select>
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? <span className="loading loading-spinner"></span> : 'Criar Tarefa'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
