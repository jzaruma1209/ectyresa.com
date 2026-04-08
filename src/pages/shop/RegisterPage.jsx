import { useNavigate, useLocation } from 'react-router-dom';
import RegisterForm from '../../components/Auth/RegisterForm';
import '../styles/AuthPages.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSuccess = () => {
    navigate(from, { replace: true });
  };

  return (
    <div className="auth-page">
      <RegisterForm onSuccess={handleSuccess} />
    </div>
  );
};

export default RegisterPage;
