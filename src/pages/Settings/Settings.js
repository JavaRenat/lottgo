import {useState} from "react";
import {useTranslation} from "react-i18next";

export default function Settings() {
    const {t} = useTranslation();
  const [content, setContent] = useState([]);

  return (
    <div>
      <span className="pageTitle">{t('Settings')}</span>
    </div>
  );
}
