import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link, Outlet } from 'react-router-dom';

export function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <div className="navbar bg-base-100 lg:hidden">
          <div className="flex-none">
            <label htmlFor="my-drawer-2" aria-label="open sidebar" className="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-6 w-6 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </label>
          </div>
          <div className='flex-1'>
            <a className="btn btn-ghost text-xl">Plan Marketing</a>
          </div>
        </div>

        <div className="flex-1 p-8 bg-base-200">
          <Outlet />
        </div>

      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu bg-base-100 text-base-content min-h-full w-80 p-4">
          <li className="text-2xl font-bold p-4">Plan Marketing</li>
          <li><Link to="/projects">Projetos</Link></li>

          <div className="mt-auto">
            <div className="p-4">
                <p className="font-bold">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            <button className="btn btn-outline w-full" onClick={handleLogout}>Sair</button>
          </div>
        </ul>
      </div>
    </div>
  );
}
