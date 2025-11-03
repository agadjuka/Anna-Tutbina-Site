import { groq } from "next-sanity";

export const toursQuery = groq`
  *[_type == "tour"]|order(orderRank){
    _id,
    name,
    slug,
    mainImage{
      ...,
      asset->{
        _id,
        metadata{dimensions{width,height,aspectRatio}}
      }
    },
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
    mainImage{
      ...,
      asset->{
        _id,
        metadata{dimensions{width,height,aspectRatio}}
      }
    },
    overlayTitle,
    introText,
    gallery[]{
      ...,
      asset->{
        _id,
        metadata{dimensions{width,height,aspectRatio}}
      }
    },
    fullProgram,
    programByDays[]{
      dayTitle,
      dayImage[]{
        ...,
        asset->{
          _id,
          metadata{dimensions{width,height,aspectRatio}}
        }
      },
      dayDescription
    },
    accommodation[]{
      locationName,
      locationImages[]{
        ...,
        asset->{
          _id,
          metadata{dimensions{width,height,aspectRatio}}
        }
      },
      locationDescription
    },
    dates,
    price
  }
`;

export const tourMetadataQuery = groq`
  *[_type == "tour" && slug.current == $slug][0]{
    name,
    shortDescription
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

export const faqQuery = groq`
  *[_type == "faq"]|order(_createdAt asc){
    _id,
    question,
    answer
  }
`;