import React from "react";

import { renderStars } from "@/lib/utils/helpers";

import Loader from "../loader/Loader";

import styles from "./rating.module.css";

const Rating = ({ rating = 5, height = 31, width = 20, ratingLoading = false }) => {
  if (ratingLoading) {
    return (
      <div className={styles.ratingLoader}>
        <Loader size="small" />
      </div>
    );
  }

  return (
    <div className={styles.rating}>
      <div className={styles.ratingStars}>
        {renderStars(rating, styles.star, width, height)}
      </div>
      <div className={styles.ratingNumber}>
        <div className={styles.ratingCount}>{rating}</div>
        <div className={styles.ratingMax}>/5</div>
      </div>
    </div>
  );
};

export default Rating;
