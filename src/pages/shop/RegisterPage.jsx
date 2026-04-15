import { useNavigate } from 'react-router-dom';
import RegisterForm from '../../components/Auth/RegisterForm';
import '../styles/AuthPages.css';

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleSuccess = (result) => {
    // El usuario quedó logueado automáticamente gracias al token del backend.
    // Redirigimos al home con un mensaje de bienvenida en el state.
    const nombre = result?.cliente?.nombres || 'nuevo usuario';
    navigate('/', {
      replace: true,
      state: { welcomeMessage: `¡Cuenta creada! Bienvenido/a, ${nombre} 🎉` },
    });
  };

  return (
    <div className="auth-page">
      <RegisterForm onSuccess={handleSuccess} />
    </div>
  );
};

export default RegisterPage;
