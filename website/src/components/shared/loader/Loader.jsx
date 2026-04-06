import React from 'react';

import styles from './loader.module.css';

const Loader = ({ size = 'medium', color = 'primary', fullscreen = false }) => {
  const sizeClasses = {
    small: styles.loaderSmall,
    medium: styles.loaderMedium,
    large: styles.loaderLarge
  };
  
  const colorClasses = {
    primary: styles.loaderPrimary,
    secondary: styles.loaderSecondary,
    white: styles.loaderWhite
  };
  
  const loaderClass = `${styles.loader} ${sizeClasses[size] || styles.loaderMedium} ${colorClasses[color] || styles.loaderPrimary}`;
  
  if (fullscreen) {
    return (
      <div className={styles.loaderFullscreen}>
        <div className={loaderClass}></div>
      </div>
    );
  }
  
  return <div className={loaderClass}></div>;
};

export default Loader;