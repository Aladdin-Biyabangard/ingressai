import { certificateAxios } from "@/lib/axios";

import { errorCodes } from "@/lib/constants/errorCodes";

export const getCertificateData = async (id, platform) => {
  try {
    const platformQuery = platform ? `?platform=${platform}` : "";

    const res = await certificateAxios.get(
      `/v1/certificates/${id}${platformQuery}`
    );
    return res.data;
  } catch (err) {
    return err?.status || errorCodes.certificate.maintenance;
  }
};
