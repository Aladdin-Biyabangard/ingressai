"use client";
import { useEffect, useState } from "react";

import { getPersonProfile } from "@/lib/utils/api/personProfile";

import ImgSkeleton from "../img-skeleton/ImgSkeleton";

import styles from "./person-profile.module.css";

const PersonProfile = ({ personId }) => {
  const [person, setPerson] = useState({});

  const personInfo = [
    { value: person?.name, className: styles.personName },
    { value: person?.workPlace?.name, className: styles.personWorkplace },
    { value: person?.position, className: styles.personPosition },
  ];
  useEffect(() => {
    getPersonProfile(personId)
      .then((data) => setPerson(data))
      .catch(() => setPerson({}));
  }, [personId]);

  return (
    <div className={styles.person}>
      <ImgSkeleton keyName="image" obj={person} defaultClass="speaker" />
      <div className={styles.personInfo}>
        {personInfo.map(
          (item, index) =>
            item.value && (
              <div key={index} className={item.className}>
                {item.value}
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default PersonProfile;
