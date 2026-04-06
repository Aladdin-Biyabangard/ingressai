import {
  defaultOrientations,
} from "@/lib/constants/shareCertificateEnums";

export const isValidOrientation = (orientation) => {
  return defaultOrientations.includes(orientation?.toLowerCase());
};
