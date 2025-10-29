import { groq } from "next-sanity";

export const toursQuery = groq`
  *[_type == "tour"]{
    _id,
    name,
    slug,
    mainImage,
    shortDescription,
    dates,
    price
  }
`;


export const tourBySlugQuery = groq`
  *[_type == "tour" && slug.current == $slug][0]{
    _id,
    name,
    slug,
    mainImage,
    gallery,
    fullProgram,
    dates,
    price
  }
`;


export const aboutQuery = groq`
  *[_type == "about"][0]{
    "image": images[0],
    bio
  }
`;


export const reviewsQuery = groq`
  *[_type == "review"]{
    _id,
    authorName,
    authorImage,
    text
  }
`;


export const customTourQuery = groq`
  *[_type == "customTour"][0]{
    title,
    mainImage,
    description
  }
`;