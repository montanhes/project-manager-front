import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api, { getCsrfCookie } from '../../services/api';

export function LoginPage() {
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    try {
      await getCsrfCookie();
      await api.post('/login', { email, password });

      const { data: user } = await api.get('/user');
      authLogin(user);
      navigate('/');
    } catch (err) {
      setError('Falha no login. Verifique suas credenciais.');
      console.error(err);
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row lg:gap-24">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Plan Marketing Project Manager</h1>
          <p className="py-6">
            Faça o login para gerenciar seus projetos de marketing de forma eficiente e organizada.
          </p>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl p-4">
          <form className="card-body" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email"
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Senha</span>
              </label>
              <input
                type="password"
                placeholder="senha"
                className="input input-bordered w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">Entrar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
