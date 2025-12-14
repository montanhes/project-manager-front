import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../../services/api';

export function CreateProjectPage() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post('/projects', { name });
      navigate('/projects', {
        state: { successMessage: `Projeto "${name}" criado com sucesso!` }
      });
    } catch (err) {
      setError('Falha ao criar o projeto. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Link to="/projects" className="link link-hover text-sm mb-2">
          &larr; Voltar para todos os projetos
        </Link>
        <h1 className="text-4xl font-bold">Criar Novo Projeto</h1>
      </div>

      <div className="card bg-base-100 shadow-xl max-w-lg">
        <div className="card-body">
          {error && <div className="alert alert-error mb-4">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nome do Projeto</span>
              </label>
              <input
                type="text"
                placeholder="Digite o nome do projeto"
                className="input input-bordered w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? <span className="loading loading-spinner"></span> : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
