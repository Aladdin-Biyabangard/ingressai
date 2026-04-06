import { SHARE_CERTIFICATE_ENUMS } from "@/lib/constants/shareCertificateEnums";

export const handleCopyLink = async (setCopySuccess) => {
  if (typeof window !== "undefined" && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy link: ", err);
    }
  } else {
    console.error("Clipboard API not available");
  }
};

export const handleShare = (platform, certificate) => {
  const shareText = certificate?.postMessage || "Check out my certificate!";
  const baseUrl = window.location.href;
  const url = encodeURIComponent(
    platform ? `${baseUrl}?platform=${platform}` : baseUrl
  );
  const text = encodeURIComponent(shareText);

  let shareUrl = "";

  switch (platform) {
    case SHARE_CERTIFICATE_ENUMS.whatsapp:
      shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`;
      break;
    case SHARE_CERTIFICATE_ENUMS.linkedin:
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&text=${text}`;
      break;
    case SHARE_CERTIFICATE_ENUMS.facebook:
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&text=${text}`;
      break;
    default:
      return;
  }

  window.open(shareUrl, "_blank", "noopener,noreferrer");
};
