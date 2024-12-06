import React from 'react';
import { useTranslation } from 'react-i18next';

function Header({ changeLanguage, language }) {
  const { t } = useTranslation();

  const changeLanguageHandler = (event) => {
    const selectedLanguage = event.target.value;
    changeLanguage(selectedLanguage);
  };

  return (
    <header className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">Fighters</a>
        <div className="d-flex">
          <select className="form-select me-2" aria-label="Language" onChange={changeLanguageHandler} defaultValue={language}>
            <option value="en">English</option>
            <option value="ru">Русский</option>
          </select>
        </div>
      </div>
    </header>
  );
}

export default Header;
