import BlogDetail from "@/components/pages/blog/Blog";

import { errorCodes, errorResponses } from "@/lib/constants/errorCodes";
import { getHomeData } from "@/lib/utils/api/home";
import { getBlogBySlug } from "@/lib/utils/api/blogs";

export async function generateMetadata({ params }) {
  const { id, locale } = await params;
  try {
    const [homeData, blog] = await Promise.all([
      getHomeData(locale),
      getBlogBySlug(id)
    ]);
    const { organization } = homeData;

    // if (errorResponses[training]) {
    //   return errorResponses[training];
    // }

    return {
      title: blog?.metaTitle,
      description: blog?.metaDescription,
      keywords: blog?.searchKeys || [],
      openGraph: {
        title: blog?.metaTitle,
        description: blog?.metaDescription,
        url: `${organization?.url}/${locale}/blogs/${id}`,
        siteName: organization?.name,
        images: [
          {
            url: blog?.coverImageUrl,
            width: 1200,
            height: 630,
            alt: blog?.metaTitle,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: blog?.metaTitle,
        description: blog?.metaDescription,
        images: [
          {
            url: blog?.coverImageUrl,
            width: 1200,
            height: 630,
            alt: blog?.name,
          },
        ],
      },
      alternates: {
        canonical: `${organization?.url}/${locale}/blogs/${id}`,
        languages: {
          az: `${organization?.url}/az/blogs/${id}`,
          en: `${organization?.url}/en/blogs/${id}`,
        },
      },
    };
  } catch (err) {
    return errorResponses[errorCodes.home.maintenance];
  }
}

const BlogDetailPage = async ({ params }) => {
  const { id } = await params;
  // The route parameter is named [id] but we're using it as slug
  return <BlogDetail slug={id} />;
};

export default BlogDetailPage;
