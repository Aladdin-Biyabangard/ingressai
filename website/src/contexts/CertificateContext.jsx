"use client";
import { errorCodes, errorResponses } from "@/lib/constants/errorCodes";
import { CERTIFICATE_DEFAULT_TYPE } from "@/lib/constants/shareCertificateEnums";
import { getCertificateData } from "@/lib/utils/api/certificate";
import { convertPlatform } from "@/lib/utils/helpers/convertPlatform";
import { isValidOrientation } from "@/lib/utils/helpers/isValidOrientation";
import { notFound, useParams, useSearchParams } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const CertificateContext = createContext();

export const CertificateProvider = ({ children }) => {
  const [certificate, setCertificate] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [platform, setPlatform] = useState("");
  const [orientation, setOrientation] = useState("");

  const searchParams = useSearchParams();
  const params = useParams();

  const id = params?.id;

  const defaultPlatform = searchParams.get("platform");
  const defaultOrientation =
    searchParams.get("orientation") ||
    params?.orientation ||
    CERTIFICATE_DEFAULT_TYPE;

  if (!isValidOrientation(defaultOrientation)) notFound();

  const fetchCertificate = useCallback(async () => {
    const [certificateResult] = await Promise.allSettled([
      getCertificateData(id, convertPlatform(platform)),
    ]);

    if (certificateResult.status === "fulfilled") {
      if (errorResponses[certificateResult.value]) {
        setError(certificateResult.value);
      } else {
        setCertificate(certificateResult.value);
      }
    } else {
      setError(errorCodes.certificate.maintenance);
    }
    setLoading(false);
  }, [id, platform]);

  useEffect(() => {
    fetchCertificate();
  }, [fetchCertificate, id, platform]);

  useEffect(() => {
    setPlatform(defaultPlatform);
    setOrientation(defaultOrientation);
  }, [defaultOrientation, defaultPlatform]);

  return (
    <CertificateContext.Provider
      value={{
        certificate,
        loading,
        error,
        platform,
        orientation,
        setOrientation,
      }}
    >
      {children}
    </CertificateContext.Provider>
  );
};

export const useCertificate = () => {
  const context = useContext(CertificateContext);
  if (!context) {
    throw new Error("useCertificate must be used within a CertificateProvider");
  }
  return context;
};
