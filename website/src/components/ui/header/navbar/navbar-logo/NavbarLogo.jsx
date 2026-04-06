"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

import { useI18n } from "@/locales/client";

import Logo from "@/components/shared/logo/Logo";
const ExploreCourses = dynamic(
  () => import("../../explore-courses/ExploreCourses"),
  { ssr: false}
);

import styles from "./navbar-logo.module.css";

const NavbarLogo = () => {
  const t = useI18n();
  const menuContainerRef = useRef(null);
  const buttonRef = useRef(null);

  const [isCourseMenuOpen, setIsCourseMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleOpenExploreCoursesMenu = () => {
    setIsCourseMenuOpen(!isCourseMenuOpen);
    setIsAnimating(true);
  };

  const handleCloseMenu = () => {
    setIsCourseMenuOpen(false);
    setIsAnimating(true);
  };

  useEffect(() => {
    if (isCourseMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    const handleClickOutside = (event) => {
      if (
        menuContainerRef.current &&
        !menuContainerRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        handleCloseMenu();
      }
    };

    if (isCourseMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCourseMenuOpen]);

  const handleAnimationEnd = () => {
    setIsAnimating(false);
  };

  return (
    <>
      <div className={styles.navbarLeft}>
        <Logo theme="light" isShownBottom={false} />
        <div className={styles.navbarLeftButton}>
          <button
            ref={buttonRef}
            className={`${styles.navbarLeftButtonContainer} ${
              isCourseMenuOpen ? styles.navbarLeftButtonContainerOpen : ""
            }`}
            onClick={handleOpenExploreCoursesMenu}
          >
            <Image
              src={
                isCourseMenuOpen ? "/icons/grid-blue.svg" : "/icons/grid.svg"
              }
              loading="lazy"
              height={14}
              width={14}
              alt="Grid"
            />
            <div className={styles.navbarLeftButtonText}>
              {t("exploreCourses")}
            </div>
            <Image
              src={
                isCourseMenuOpen
                  ? "/icons/arrow-up.svg"
                  : "/icons/arrow-down.svg"
              }
              height={14}
              width={8}
              alt="Arrow down"
              loading="lazy"
            />
          </button>
        </div>
      </div>
      {(isCourseMenuOpen || isAnimating) && (
        <div
          ref={menuContainerRef}
          className={`${styles.menuContainer} ${
            isCourseMenuOpen ? styles.menuOpen : styles.menuClose
          }`}
          onAnimationEnd={handleAnimationEnd}
        >
          <ExploreCourses onClose={handleCloseMenu} />
        </div>
      )}
    </>
  );
};

export default NavbarLogo;
