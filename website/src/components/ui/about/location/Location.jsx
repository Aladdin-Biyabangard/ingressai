import Image from "next/image";

import GetInTouch from "@/components/shared/get-in-touch/GetInTouch";

import styles from "./location.module.css";

const Location = () => {
  return (
    <section className={styles.location}>
      <div className={styles.locationContainer}>
        <GetInTouch />
        <div className={styles.locationRight}>
          <Image
            src="/images/location.png"
            fill
            alt="Location"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default Location;
