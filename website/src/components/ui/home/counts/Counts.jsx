import { counts } from "@/lib/constants/info";

import Count from "./count/Count";

import styles from "./counts.module.css";

const Counts = ({countMeta}) => {

  return (
    <section className={styles.counts}>
      {countMeta?.map((count,index) => (
        <Count
          key={count.id}
          count={count}
          isLast={index === counts.length - 1}
         />
      ))}
    </section>
  );
};

export default Counts;
