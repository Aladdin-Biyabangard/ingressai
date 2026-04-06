
import { generateSitemap } from "@/lib/utils/helpers/generateSitemap";


export async function GET() {
  const res = await fetch('https://api.ingress.academy/course-ms/api/v1/home');
  const data = await res.json()
  const sitemap = generateSitemap(data?.courses);

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
