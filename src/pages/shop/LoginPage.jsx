import { useNavigate, useLocation } from 'react-router-dom';
import LoginForm from '../../components/Auth/LoginForm';
import '../styles/AuthPages.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSuccess = () => {
    navigate(from, { replace: true });
  };

  return (
    <div className="auth-page">
      <LoginForm onSuccess={handleSuccess} />
    </div>
  );
};

export default LoginPage;
