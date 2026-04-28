import type { MetadataRoute } from "next";
import { sanityClient } from "@/lib/sanity.client";
import { toursSlugsQuery } from "@/lib/sanity.queries";

const BASE_URL = "https://www.ona-womantravel.com";

type TourSlugItem = {
  slug?: string;
  _updatedAt?: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/custom-tour`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const tours = await sanityClient.fetch<TourSlugItem[]>(toursSlugsQuery);

  const tourPages: MetadataRoute.Sitemap = tours
    .filter((tour) => typeof tour.slug === "string" && tour.slug.length > 0)
    .map((tour) => ({
      url: `${BASE_URL}/tours/${tour.slug}`,
      lastModified: tour._updatedAt ? new Date(tour._updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    }));

  return [...staticPages, ...tourPages];
}
