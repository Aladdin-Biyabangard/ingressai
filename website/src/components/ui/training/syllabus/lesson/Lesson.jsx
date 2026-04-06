"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

import styles from "./lesson.module.css";

const Lesson = ({ lesson, isExpanded, pdfView }) => {
  const [isOpen, setIsOpen] = useState(isExpanded);

  useEffect(() => {
    setIsOpen(isExpanded);
  }, [isExpanded]);

  const handleToggle = () => {
    !pdfView && setIsOpen((prev) => !prev);
  };

  return (
    <article
      className={`${styles.lessonContainer} ${
        pdfView ? styles.pdfView : styles.normalView
      }`}
    >
      <header className={styles.lesson} onClick={handleToggle}>
        <Image
          src="/icons/syllabus.svg"
          height={32}
          width={32}
          alt="syllabus"
          loading="lazy"
        />
        <h3 className={styles.lessonName}>{lesson.name}</h3>
        {!pdfView && (
          <Image
            src={
              isOpen
                ? "/icons/syllabus-collapse.svg"
                : "/icons/syllabus-expand.svg"
            }
            height={30}
            width={30}
            alt="toggle"
            loading="lazy"
          />
        )}
      </header>

      <ul
        className={`${styles.taskList} ${isOpen ? styles.open : styles.closed}`}
      >
        {lesson?.children?.map((task, index) => (
          <li key={`child-${index}`} className={styles.task}>
            <div className={styles.taskInfo}>
              {!pdfView && <div>{index + 1}</div>}
              <p className={styles.taskName}>{task.name}</p>
            </div>

            {task.children && task.children.length > 0 && (
              <ul className={styles.subTaskList}>
                {task.children.map((subTask, subIndex) => (
                  <li key={`subChild-${subIndex}`} className={styles.subTask}>
                    <div className={styles.taskInfo}>
                      <p className={styles.subTaskName}>{subTask.name}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </article>
  );
};

export default Lesson;
