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


