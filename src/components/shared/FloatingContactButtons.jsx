import "./FloatingContactButtons.css";

const WHATSAPP_NUMBER = "593999601748"; // +593 99 960 1748, formato internacional sin '+' para wa.me
const FACEBOOK_URL = "https://www.facebook.com/share/1Eb6kGbPA3/?mibextid=wwXIfr";
// TikTok: aún no habilitado, se agrega la URL cuando el cliente confirme el usuario oficial.
const TIKTOK_URL = null;

const FloatingContactButtons = () => {
  return (
    <div className="floating-contact-buttons">
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-contact-btn floating-contact-btn--whatsapp"
        aria-label="Escríbenos por WhatsApp"
        title="WhatsApp"
      >
        <svg viewBox="0 0 32 32" width="24" height="24" fill="currentColor" aria-hidden="true">
          <path d="M16.01 2.667c-7.364 0-13.343 5.98-13.343 13.343 0 2.357.617 4.57 1.7 6.494L2.667 29.333l6.99-1.833a13.28 13.28 0 0 0 6.353 1.617h.006c7.364 0 13.343-5.98 13.343-13.343S23.374 2.667 16.01 2.667zm0 24.42a11.02 11.02 0 0 1-5.617-1.54l-.403-.24-4.15 1.088 1.108-4.045-.263-.417a11.02 11.02 0 0 1-1.687-5.883c0-6.106 4.97-11.076 11.086-11.076 2.96 0 5.744 1.154 7.836 3.246a11 11 0 0 1 3.246 7.836c0 6.117-4.97 11.086-11.09 11.086zm6.07-8.31c-.333-.167-1.97-.973-2.276-1.083-.306-.11-.53-.166-.753.166s-.86 1.084-1.054 1.307c-.193.223-.386.25-.72.084-.334-.167-1.404-.517-2.677-1.65-.99-.88-1.657-1.966-1.85-2.3-.194-.334-.02-.514.166-.68.167-.15.333-.39.5-.583.167-.194.222-.334.334-.557.11-.223.055-.417-.04-.583-.096-.167-.86-2.077-1.18-2.844-.312-.75-.63-.65-.865-.663l-.737-.014c-.25 0-.657.093-.897.36-.24.267-.917.897-.917 2.187 0 1.29.94 2.537 1.07 2.717.13.18 1.78 2.717 4.32 3.7 2.54.983 2.54.656 3.166.617.627-.04 2.03-.83 2.317-1.633.286-.803.286-1.49.2-1.633-.086-.144-.316-.23-.65-.397z"/>
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
