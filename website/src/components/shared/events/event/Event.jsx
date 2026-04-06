"use client";
import React, { useState, useEffect } from "react";
import LocaleLink from "@/components/shared/locale-link/LocaleLink";
import { Calendar, MapPin, Clock, Users } from "lucide-react";

import { routes } from "@/lib/constants/routes";

import ImgSkeleton from "../../img-skeleton/ImgSkeleton";
import PersonProfile from "@/components/shared/person-profile/PersonProfile";

import styles from "./event.module.css";

const Event = ({ event, t }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const calculateDuration = () => {
    if (event.endDateTime) {
      const start = new Date(event.startDateTime);
      const end = new Date(event.endDateTime);
      const diffHours = Math.abs(end - start) / (1000 * 60 * 60);
      return `${diffHours} hours`;
    }
    return null;
  };

  const timeOptions = [
    { value: timeLeft.days, label: "d" },
    { value: timeLeft.hours, label: "h" },
    { value: timeLeft.minutes, label: "m" },
    { value: timeLeft.seconds, label: "s" },
  ];

  useEffect(() => {
    const calculateTimeLeft = () => {
      const eventDate = new Date(event.startDateTime);
      const now = new Date();
      const difference = eventDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [event.startDateTime]);

  return (
    <LocaleLink href={`${routes.events}/${event?.id}`} className={styles.eventCard}>
      <div className={styles.eventImage}>
        <ImgSkeleton obj={event} keyName="icon" defaultClass="eventImg" />

        <div className={styles.statusBadges}>
          <span className={`${styles.badge} ${styles.typeBadge}`}>
            {event.eventType}
          </span>
          <span
            className={`${styles.badge} ${styles.statusBadge} ${
              event.status === "UPCOMING" ? styles.upcoming : styles.other
            }`}
          >
            {event.status.toLowerCase()}
          </span>
        </div>

        {event.freeEvent && <div className={styles.freeBadge}>Free</div>}

        <div className={styles.remainingTime}>
          {timeOptions.map((option, index) => (
            <div className={styles.timeUnit} key={index}>
              <span className={styles.timeValue}>
                {String(option.value).padStart(2, "0")}
                {option.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.eventContent}>
        <h3 className={styles.eventTitle}>{event.title}</h3>

        {event.categories && event.categories.length > 0 && (
          <div className={styles.categoriesSection}>
            <div className={styles.categories}>
              {event.categories.map((category, index) => (
                <span key={index} className={styles.categoryTag}>
                  {category.categoryName}
                </span>
              ))}
            </div>
          </div>
        )}

        {event.tags && Array.isArray(event.tags) && event.tags.length > 0 && (
          <div className={styles.tagsSection}>
            <div className={styles.tags}>
              {event.tags.slice(0, 6).map((tag, index) => (
                <span key={index} className={styles.tag}>
                  #{tag}
                </span>
              ))}
              {event.tags.length > 6 && (
                <span className={styles.moreTag}>
                  +{event.tags.length - 6} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className={styles.speakersSection}>
          <h4 className={styles.speakersTitle}>
            <Users size={16} />
            Speakers
          </h4>
          <div className={styles.speakers}>
            {event.speakers &&
              event.speakers.map((speakerId, index) => (
                <PersonProfile personId={speakerId} key={index} />
              ))}
          </div>
        </div>

        <div className={styles.eventDetails}>
          <div className={styles.detailItem}>
            <Calendar size={16} />
            <span>{formatDate(event.startDateTime)}</span>
          </div>

          <div className={styles.detailItem}>
            <Clock size={16} />
            <span>{formatTime(event.startDateTime)}</span>
            {event.endDateTime && (
              <span className={styles.endTime}>
                - {formatTime(event.endDateTime)}
              </span>
            )}
          </div>

          {calculateDuration() && (
            <div className={styles.detailItem}>
              <Clock size={16} />
              <span>Duration: {calculateDuration()}</span>
            </div>
          )}

          <div className={styles.detailItem}>
            <MapPin size={16} />
            <span>{event.locationDto?.address || "TBA"}</span>
            {event.locationDto?.locationType && (
              <span className={styles.locationType}>
                {event.locationDto.locationType.toLowerCase()}
              </span>
            )}
          </div>

          {!event.freeEvent && event.eventPrice > 0 && (
            <div className={styles.detailItem}>
              <span className={styles.priceIcon}>$</span>
              <span>Price: ${event.eventPrice}</span>
            </div>
          )}
        </div>
      </div>

      <div className={styles.hoverOverlay}></div>
    </LocaleLink>
  );
};

export default Event;
