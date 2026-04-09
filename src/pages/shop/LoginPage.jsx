import { useNavigate, useLocation } from 'react-router-dom';
import LoginForm from '../../components/Auth/LoginForm';
import '../styles/AuthPages.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSuccess = (result) => {
    // Si el login devuelve isAdmin, redirigir al panel admin
    if (result?.isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    } else {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="auth-page">
      <LoginForm onSuccess={handleSuccess} />
    </div>
  );
};

export default LoginPage;
