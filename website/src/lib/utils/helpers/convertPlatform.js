import { SHARE_CERTIFICATE_ENUMS } from "@/lib/constants/shareCertificateEnums";

export const convertPlatform = (platform) => {
  platform = platform?.toUpperCase();
  if (Object.values(SHARE_CERTIFICATE_ENUMS).includes(platform))
    return platform;
  return SHARE_CERTIFICATE_ENUMS.other;
};
