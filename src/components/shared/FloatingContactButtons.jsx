import { buildWhatsAppUrl, trackWhatsAppClick } from "../../utils/whatsapp";
import "./FloatingContactButtons.css";

const WHATSAPP_MESSAGE = "Hola ECTYRE, vengo de la página web y quiero información sobre llantas.";
const FACEBOOK_URL = "https://www.facebook.com/share/1Eb6kGbPA3/?mibextid=wwXIfr";
// TikTok: aún no habilitado, se agrega la URL cuando el cliente confirme el usuario oficial.
const TIKTOK_URL = null;

const FloatingContactButtons = () => {
  return (
    <div className="floating-contact-buttons">
      <a
        href={buildWhatsAppUrl(WHATSAPP_MESSAGE)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackWhatsAppClick("boton_flotante")}
        className="floating-contact-btn floating-contact-btn--whatsapp"
        aria-label="Escríbenos por WhatsApp"
        title="WhatsApp"
      >
        <img src="/iconowhassap-128.webp" alt="" width="50" height="50" className="floating-contact-btn__img" aria-hidden="true" />
      </a>
      <a
        href={FACEBOOK_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-contact-btn floating-contact-btn--facebook"
        aria-label="Síguenos en Facebook"
        title="Facebook"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
          <path d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06c0 5.02 3.657 9.184 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.459h-1.26c-1.243 0-1.63.773-1.63 1.564v1.878h2.773l-.443 2.91h-2.33V22c4.78-.756 8.437-4.92 8.437-9.94z"/>
        </svg>
      </a>
      {TIKTOK_URL && (
        <a
          href={TIKTOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="floating-contact-btn floating-contact-btn--tiktok"
          aria-label="Síguenos en TikTok"
          title="TikTok"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
            <path d="M16.6 5.82c-1-.7-1.6-1.83-1.6-3.07h-3.02v13.6a2.6 2.6 0 1 1-1.8-2.47V10.8a5.6 5.6 0 1 0 4.82 5.55V9.4c1.13.79 2.5 1.25 3.98 1.25V7.64c-.84 0-1.66-.24-2.38-.7z"/>
          </svg>
        </a>
      )}
    </div>
  );
};

export default FloatingContactButtons;
