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
        <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
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
