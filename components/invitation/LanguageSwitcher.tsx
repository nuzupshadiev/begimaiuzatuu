"use client";

import {
  LANGUAGES,
  languageNames,
  t,
  translations,
  type Language,
} from "@/data/translations";

/**
 * RU/KY switch. It changes one piece of state in `InvitationApp`, and every
 * section reads its copy from that value — the page is never duplicated per
 * language and the choice survives all in-page interaction.
 */
export function LanguageSwitcher({
  language,
  onChange,
}: {
  language: Language;
  onChange: (next: Language) => void;
}) {
  return (
    <div
      className="pill-group"
      role="group"
      aria-label={t(translations.languageLabel, language)}
    >
      {LANGUAGES.map((option) => (
        <button
          key={option}
          type="button"
          className="pill-group__button"
          aria-pressed={language === option}
          onClick={() => onChange(option)}
        >
          <span aria-hidden="true">{languageNames[option]}</span>
          <span className="sr-only">
            {t(translations.languageOption[option], language)}
          </span>
        </button>
      ))}
    </div>
  );
}
