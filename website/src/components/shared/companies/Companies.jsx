'use client'
import React, { useEffect, useRef, useState } from "react";

import { getCustomers } from "@/lib/utils/api/customers";

import styles from './companies.module.css'
import Customer from "@/components/ui/home/customers/customer/Customer";
import Loader from "../loader/Loader";

const Companies = () => {
    const [customers, setCustomers] = useState([]);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);
      const sliderRef = useRef(null);
      const animationRef = useRef();
      const sliderContentRef = useRef(null);
      const [slideWidth, setSlideWidth] = useState(0);
      const [isMobile, setIsMobile] = useState(false);
    
    
      useEffect(() => {
        const fetchCustomers = async () => {
          try {
            setLoading(true);
            const res = await getCustomers(0, 100);
            setCustomers(res?.content);
          } catch (error) {
            setError(error?.message || "Failed to load customers");
          } finally {
            setLoading(false);
          }
        };
        fetchCustomers();
      }, []);
    
      useEffect(() => {
        const calculateSlideWidth = () => {
          if (sliderRef.current) {
            const containerWidth = sliderRef.current.offsetWidth;
            setSlideWidth(containerWidth / 8);
            setIsMobile(window.innerWidth <= 1024);
          }
        };
    
        calculateSlideWidth();
        window.addEventListener("resize", calculateSlideWidth);
        return () => window.removeEventListener("resize", calculateSlideWidth);
      }, []);
    
      useEffect(() => {
        if (!isMobile) {
          if (
            !customers.length ||
            !sliderRef.current ||
            !sliderContentRef.current ||
            slideWidth === 0
          )
            return;
    
          const totalWidth = slideWidth * customers.length;
    
          sliderContentRef.current.style.width = `${totalWidth * 2}px`;
    
          let position = 0;
          const speed = 2;
    
          const animate = () => {
            position -= speed;
    
            if (position <= -totalWidth) {
              position = 0;
            }
    
            if (sliderContentRef.current) {
              sliderContentRef.current.style.transform = `translateX(${position}px)`;
            }
    
            animationRef.current = requestAnimationFrame(animate);
          };
    
          animationRef.current = requestAnimationFrame(animate);
        }
    
        return () => {
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
          }
        };
      }, [customers, slideWidth, isMobile]);
    
      const safeCustomers = Array.isArray(customers) ? customers : [];
      const displayedCustomers = isMobile ? safeCustomers.slice(0, 8) : safeCustomers;
  return (
    <>
      {loading ? (
        <div className={styles.customerLoaderContainer}>
          <Loader size="medium" color="primary" />
        </div>
      ) : error ? (
        <div className={styles.errorMessage}>
          Failed to load companies: {error}
        </div>
      ) : (
        <div className={styles.customersSliderContainer} ref={sliderRef}>
          <div
            className={styles.customersSliderTrack}
            style={{
              gridTemplateColumns: isMobile
                ? ""
                : `repeat(${customers.length * 2},1fr)`,
            }}
            ref={sliderContentRef}
          >
            {displayedCustomers.map((customer, index) => (
              <div
                key={`${customer?.id}-${index}`}
                className={styles.customerSlide}
                style={{ width: isMobile ? "100%" : `${slideWidth}px` }}
              >
                <Customer customer={customer} />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Companies;
