import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const { user, loading, error, loadProfile, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ nombres: '', apellidos: '', telefono: '' });
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (user) {
      setFormData({
        nombres: user.nombres || '',
        apellidos: user.apellidos || '',
        telefono: user.telefono || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSuccessMsg('');
    const result = await updateProfile(formData);
    if (result.success) {
      setEditing(false);
      setSuccessMsg('Perfil actualizado correctamente');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  if (loading && !user) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <div className="profile-spinner"></div>
          <p>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.nombres?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <h1>Mi Perfil</h1>
        </div>

        {error && (
          <div className="profile-error">{error}</div>
        )}

        {successMsg && (
          <div className="profile-success">{successMsg}</div>
        )}

        <div className="profile-info">
          <div className="profile-field">
            <label>Nombres</label>
            {editing ? (
              <input
                type="text"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
              />
            ) : (
              <span>{user?.nombres || '—'}</span>
            )}
          </div>

          <div className="profile-field">
            <label>Apellidos</label>
            {editing ? (
              <input
                type="text"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
              />
            ) : (
              <span>{user?.apellidos || '—'}</span>
            )}
          </div>

          <div className="profile-field">
            <label>Email</label>
            <span>{user?.email || '—'}</span>
          </div>

          <div className="profile-field">
            <label>Teléfono</label>
            {editing ? (
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
              />
            ) : (
              <span>{user?.telefono || '—'}</span>
            )}
          </div>

          <div className="profile-field">
            <label>Identificación</label>
            <span>{user?.tipoIdentificacion} — {user?.numeroIdentificacion || '—'}</span>
          </div>
        </div>

        <div className="profile-actions">
          {editing ? (
            <>
              <button className="profile-btn profile-btn--save" onClick={handleSave} disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar cambios'}
              </button>
              <button className="profile-btn profile-btn--cancel" onClick={() => setEditing(false)}>
                Cancelar
              </button>
            </>
          ) : (
            <button className="profile-btn profile-btn--edit" onClick={() => setEditing(true)}>
              Editar Perfil
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
