"use client";

import { useI18n } from "@/locales/client";

import Event from "./event/Event";

import styles from "./events.module.css";

const Events = ({ loading, error,events }) => {
  const t = useI18n();

  if (events?.length === 0) return null;
  return (
    <section className={styles.events}>
      <div className={styles.eventsTitle}>{t("events")}</div>
      <div className={styles.eventsList}>
        {events.map((event, index) => (
          <Event key={index} t={t} event={event} />
        ))}
      </div>
    </section>
  );
};

export default Events;
