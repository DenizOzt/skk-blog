import React from "react";
import { useTranslation } from "react-i18next";
function LanguageSwitcher() {
  const { i18n } = useTranslation();
  return (
    <div className="langSelect">
      <select
        value={i18n.language}
        onChange={(e) =>
          i18n.changeLanguage(e.target.value)
        }
      >
        <option value="tr">Türkçe</option>
        <option value="en">English</option>
        <option value="ru">Русский</option>
      </select>
    </div>
  );
}
export default LanguageSwitcher;