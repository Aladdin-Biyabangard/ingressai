export const generateSchema = (type, data) => {
  switch (type) {
    case "course":
      return {
        "@context": "https://schema.org",
        "@type": "Course",
        name: data?.training?.name,
        image: data?.training?.icon,
        description: data?.training?.description,
        instructor: data?.training?.instructors?.map((inst) => ({
          "@type": "Person",
          name: inst.name,
          sameAs: inst.linkedinUrl,
          image: inst.image,
        })),
        provider: {
          "@type": "Organization",
          name: data?.organization?.name,
          url: data?.organization?.url,
        },
      };
    case "organization":
      return {
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        name: data?.name,
        url: data?.url,
        description: data?.description,
        logo: {
          "@type": "ImageObject",
          url: data?.logo,
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: data?.phoneNumbers?.[0],
          contactType: "Customer Support",
          areaServed: "AZ",
          availableLanguage: ["English", "Azerbaijani"],
          email: data?.email,
        },
        sameAs: Object.values(data?.socialLinks || {}),
        address: data?.addresses?.map((address) => ({
          "@type": "PostalAddress",
          streetAddress: address.streetAddress,
          addressLocality: address.locality,
          addressRegion: address.region,
          addressCountry: address.country,
        })),
      };
    default:
      return null;
  }
};
