import { CertificateProvider } from "@/contexts/CertificateContext";

const CertificateLayout = ({ children }) => {
  return <CertificateProvider>{children}</CertificateProvider>;
};

export default CertificateLayout;
