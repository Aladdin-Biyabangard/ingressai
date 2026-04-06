import React from "react";

import styles from "./category.module.css";

const Category = ({ category }) => {
  return (
    <div className={styles.category}>
      <img
        className={styles.categoryImg}
        src={category?.icon}
        alt={category?.name}
        width={40}
        height={40}
        loading="lazy"
      />
      <div className={styles.categoryName}>{category?.name}</div>
    </div>
  );
};

export default Category;
