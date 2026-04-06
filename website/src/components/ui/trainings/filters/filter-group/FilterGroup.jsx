"use client";
import { useEffect, useState } from "react";

import Loader from "@/components/shared/loader/Loader";

import styles from "./filter-group.module.css";

const FilterGroup = ({ t, group, onClick, activeFilter = [], loading }) => {
  const [selectedOptions, setSelectedOptions] = useState(activeFilter);

  const handleChange = (key) => {
    let updatedOptions;
    if (selectedOptions.includes(key)) {
      updatedOptions = selectedOptions.filter((item) => item !== key);
    } else {
      updatedOptions = [...selectedOptions, key];
    }

    setSelectedOptions(updatedOptions);
    onClick?.(group.key, updatedOptions);
  };

  useEffect(() =>{
    setSelectedOptions(activeFilter)
  },[activeFilter])

  return (
    <div className={styles.filterGroup}>
      <h3 className={styles.title}>{t(group.key)}</h3>
      <div className={styles.options}>
        {loading && group.key === "category" ? (
          <div className={styles.loader}>
            <Loader />
          </div>
        ) : (
          group.options.map((option, index) => (
            <label key={index} className={styles.option}>
              <input
                type="checkbox"
                value={option?.id}
                checked={selectedOptions.includes(option.id || option.key)}
                onChange={() => handleChange(option.id || option.key)}
              />
              <span>{t(option.key)}</span>
            </label>
          ))
        )}
      </div>
    </div>
  );
};

export default FilterGroup;
