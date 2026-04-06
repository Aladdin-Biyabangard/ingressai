"use client";
import { useEffect, useState } from "react";

import QRCode from "qrcode";

const QrCode = ({ url }) => {
  const [qr, setQr] = useState("");

  useEffect(() => {
    if (url) {
      QRCode.toDataURL(
        url,
        { width: "100%", height: "100%" },
        (err, dataUrl) => {
          if (!err) setQr(dataUrl);
        }
      );
    }
  }, [url]);

  return <div>{qr && <img src={qr} alt="QR Code" />}</div>;
};

export default QrCode;
