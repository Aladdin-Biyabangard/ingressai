import styles from './container.module.css'

const Container = ({ children, isExtendable = false }) => {
  return (
    <div
      className={`${styles.container} ${isExtendable ? styles.extendable : ""}`}
    >
      {children}
    </div>
  );
};

export default Container;