"use client";

import { useId, useState, type FormEvent } from "react";
import { templateContent } from "@/data/template-content";
import { t, translations, type Language } from "@/data/translations";
import {
  RsvpConfigurationError,
  RsvpRequestError,
  submitRsvp,
  type Attendance,
} from "@/lib/rsvp";
import { Reveal } from "./Reveal";

type Status = "idle" | "submitting" | "success" | "error";

const MIN_GUESTS: number = templateContent.rsvpGuests.min;
const MAX_GUESTS: number = templateContent.rsvpGuests.max;

/**
 * Posts straight to the central RSVP API — this template ships no route of its
 * own and stores nothing locally. Every state the guest can land in (idle,
 * invalid, submitting, success, server error, network error, retry) is
 * represented, and a failed attempt keeps the typed values.
 */
export function RsvpSection({ language }: { language: Language }) {
  const ids = useId();
  const nameId = `${ids}-name`;
  const nameErrorId = `${ids}-name-error`;
  const attendanceErrorId = `${ids}-attendance-error`;
  const guestsId = `${ids}-guests`;
  const guestsHintId = `${ids}-guests-hint`;

  const [guestName, setGuestName] = useState("");
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [guestCount, setGuestCount] = useState(MIN_GUESTS);
  const [status, setStatus] = useState<Status>("idle");
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    attendance?: string;
  }>({});
  const [formError, setFormError] = useState<string | null>(null);

  const labels = translations.rsvp;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const trimmed = guestName.trim();
    const nextErrors: { name?: string; attendance?: string } = {};
    if (!trimmed) nextErrors.name = t(labels.errorName, language);
    if (!attendance) nextErrors.attendance = t(labels.errorAttendance, language);

    setFieldErrors(nextErrors);
    if (nextErrors.name || nextErrors.attendance || !attendance) {
      setFormError(null);
      setStatus("idle");
      return;
    }

    if (
      attendance === "yes" &&
      (guestCount < MIN_GUESTS || guestCount > MAX_GUESTS)
    ) {
      setFormError(t(labels.errorGuests, language));
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setFormError(null);

    try {
      await submitRsvp({ guestName: trimmed, attendance, guestCount, language });
      setStatus("success");
    } catch (error) {
      // Values are deliberately kept so a retry needs no re-typing.
      setStatus("error");
      if (error instanceof RsvpConfigurationError) {
        setFormError(t(labels.errorConfig, language));
      } else if (error instanceof RsvpRequestError) {
        setFormError(t(labels.errorServer, language));
      } else {
        setFormError(t(labels.errorNetwork, language));
      }
    }
  }

  const submitting = status === "submitting";
  const succeeded = status === "success";

  return (
    <section className="section" aria-labelledby="rsvp-heading">
      <div className="shell">
        <Reveal className="rsvp__card stack-center">
          <h2 id="rsvp-heading" className="heading">
            {t(templateContent.rsvp.heading, language)}
          </h2>

          <p className="rsvp__note">{t(templateContent.rsvp.note, language)}</p>

          {succeeded ? (
            <button
              type="button"
              className="link-button"
              style={{ marginTop: "1rem" }}
              onClick={() => {
                setStatus("idle");
                setFormError(null);
              }}
            >
              {t(labels.changeAnswer, language)}
            </button>
          ) : (
            <form className="rsvp__form" onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label className="field__label" htmlFor={nameId}>
                  {t(labels.nameLabel, language)}
                </label>
                <input
                  id={nameId}
                  name="guestName"
                  type="text"
                  className="field__input"
                  autoComplete="name"
                  value={guestName}
                  placeholder={t(labels.namePlaceholder, language)}
                  aria-invalid={fieldErrors.name ? "true" : undefined}
                  aria-describedby={fieldErrors.name ? nameErrorId : undefined}
                  onChange={(event) => {
                    setGuestName(event.target.value);
                    if (fieldErrors.name) {
                      setFieldErrors((current) => ({
                        ...current,
                        name: undefined,
                      }));
                    }
                  }}
                />
                {fieldErrors.name ? (
                  <span className="field__error" id={nameErrorId}>
                    {fieldErrors.name}
                  </span>
                ) : null}
              </div>

              <fieldset className="field">
                <legend className="field__label">
                  {t(labels.attendanceLabel, language)}
                </legend>

                <div className="choices">
                  {(["yes", "no"] as const).map((value) => (
                    <label className="choice" key={value}>
                      <input
                        type="radio"
                        name="attendance"
                        value={value}
                        checked={attendance === value}
                        aria-describedby={
                          fieldErrors.attendance ? attendanceErrorId : undefined
                        }
                        onChange={() => {
                          setAttendance(value);
                          setFieldErrors((current) => ({
                            ...current,
                            attendance: undefined,
                          }));
                        }}
                      />
                      {t(
                        value === "yes"
                          ? labels.attendanceYes
                          : labels.attendanceNo,
                        language,
                      )}
                    </label>
                  ))}
                </div>

                {fieldErrors.attendance ? (
                  <span className="field__error" id={attendanceErrorId}>
                    {fieldErrors.attendance}
                  </span>
                ) : null}
              </fieldset>

              {attendance === "yes" ? (
                <div className="field">
                  <label className="field__label" htmlFor={guestsId}>
                    {t(labels.guestCountLabel, language)}
                  </label>
                  <div className="stepper">
                    <button
                      type="button"
                      className="stepper__button"
                      aria-label={t(labels.decrease, language)}
                      disabled={guestCount <= MIN_GUESTS}
                      onClick={() =>
                        setGuestCount((count) => Math.max(MIN_GUESTS, count - 1))
                      }
                    >
                      −
                    </button>
                    <input
                      id={guestsId}
                      name="guestCount"
                      type="number"
                      inputMode="numeric"
                      className="stepper__value"
                      min={MIN_GUESTS}
                      max={MAX_GUESTS}
                      step={1}
                      value={guestCount}
                      aria-describedby={guestsHintId}
                      onChange={(event) => {
                        const next = Number.parseInt(event.target.value, 10);
                        if (Number.isNaN(next)) return;
                        setGuestCount(
                          Math.min(MAX_GUESTS, Math.max(MIN_GUESTS, next)),
                        );
                      }}
                    />
                    <button
                      type="button"
                      className="stepper__button"
                      aria-label={t(labels.increase, language)}
                      disabled={guestCount >= MAX_GUESTS}
                      onClick={() =>
                        setGuestCount((count) => Math.min(MAX_GUESTS, count + 1))
                      }
                    >
                      +
                    </button>
                  </div>
                  <span className="field__hint" id={guestsHintId}>
                    {t(labels.guestCountHint, language)}
                  </span>
                </div>
              ) : null}

              <button type="submit" className="button" disabled={submitting}>
                {submitting
                  ? t(labels.submitting, language)
                  : status === "error"
                    ? t(labels.retry, language)
                    : t(labels.submit, language)}
              </button>
            </form>
          )}

          <p
            className={
              formError ? "rsvp__status rsvp__status--error" : "rsvp__status"
            }
            role="status"
            aria-live="polite"
          >
            {formError ??
              (succeeded
                ? t(
                    attendance === "no" ? labels.successNo : labels.successYes,
                    language,
                  )
                : "")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
