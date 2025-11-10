import { useLanguage } from '../i18n/LanguageContext';
import donateQr from '../assets/donate-qr.png';
import './About.css';

export const About = () => {
  const { t } = useLanguage();

  return (
    <div className="about">
      <div className="about-header">
        <h2>{t.about.title}</h2>
      </div>

      {/* App Info Section */}
      <div className="about-section">
        <h3>ℹ️ {t.settings.aboutApp}</h3>
        <div className="about-content">
          <p className="about-app-name">
            <strong>{t.settings.appName}</strong>
          </p>
          <p className="about-description">
            {t.settings.appDescription}
          </p>
          <p className="about-storage">
            {t.settings.dataStoredLocally}
          </p>
        </div>
      </div>

      {/* Donate Section */}
      <div className="about-section donate-section">
        <h3>💝 {t.donate.title}</h3>
        <p className="section-description">
          {t.donate.description}
        </p>

        <div className="donate-content">
          <div className="donate-info">
            <div className="donate-badge">
              ✨ {t.donate.alwaysFree}
            </div>
            <p className="donate-qr-label">{t.donate.scanQr}</p>
          </div>

          <div className="donate-qr-container">
            <img
              src={donateQr}
              alt="Donate QR Code"
              className="donate-qr"
            />
          </div>

          <div className="donate-thank-you">
            {t.donate.thankYou}
          </div>
        </div>
      </div>
    </div>
  );
};
