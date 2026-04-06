export const ERROR_ENUMS = {
  notFound: 404,
  maintenance: 502,
  unknown: 500,
};

export const errorCodes = {
  training: {
    notFound: ERROR_ENUMS.notFound,
    maintenance: ERROR_ENUMS.maintenance,
  },
  home: {
    maintenance: ERROR_ENUMS.maintenance,
  },
  certificate: {
    notFound: ERROR_ENUMS.notFound,
    maintenance: ERROR_ENUMS.maintenance,
  },
};

export const errorResponses = {
  [ERROR_ENUMS.notFound]: {
    title: "Not found",
    description: "The requested object could not be found.",
    keywords: "not found, not, found",
    robots: {
      index: false,
      follow: false,
    },
  },
  [ERROR_ENUMS.maintenance]: {
    title: "Website Under Maintenance",
    description:
      "Our website is currently undergoing scheduled maintenance. We apologize for the inconvenience and appreciate your patience.",
    keywords: "maintenance, site down, temporary unavailable",
    robots: {
      index: false,
      follow: false,
    },
  },
  [ERROR_ENUMS.unknown]: {
    title: "Unexpected Error Occurred",
    description:
      "An unknown error occurred while processing your request. Our team has been notified and is working to resolve the issue as soon as possible.",
    keywords: "500 internal server error, unknown error, unexpected problem",
    robots: {
      index: false,
      follow: false,
    },
  },
};
