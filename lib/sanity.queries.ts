import { groq } from "next-sanity";

export const toursQuery = groq`
  *[_type == "tour" && hideFromSite != true]|order(orderRank){
    _id,
    name,
    slug,
    cardImage{
      ...,
      asset->{
        _id,
        metadata{dimensions{width,height,aspectRatio}}
      }
    },
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
  *[_type == "tour" && slug.current == $slug && hideFromSite != true][0]{
    _id,
    name,
    slug,
    cardImage{
      ...,
      asset->{
        _id,
        metadata{dimensions{width,height,aspectRatio}}
      }
    },
    mainImage{
      ...,
      asset->{
        _id,
        metadata{dimensions{width,height,aspectRatio}}
      }
    },
    overlayName,
    overlayDate,
    introText,
    atmosphereGallery[]{
      ...,
      asset->{
        _id,
        metadata{dimensions{width,height,aspectRatio}}
      }
    },
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
    price,
    pricingDetails,
    included,
    notIncluded,
    recommendedFlights{
      image{
        ...,
        asset->{
          _id,
          metadata{dimensions{width,height,aspectRatio}}
        }
      },
      text
    },
    organizers[]{
      name,
      photo{
        ...,
        asset->{
          _id,
          metadata{dimensions{width,height,aspectRatio}}
        }
      },
      bio
    },
    reviews[]{
      _key,
      authorName,
      profession,
      authorImage{
        ...,
        asset->{
          _id,
          metadata{dimensions{width,height,aspectRatio}}
        }
      },
      text
    }
  }
`;

export const tourMetadataQuery = groq`
  *[_type == "tour" && slug.current == $slug && hideFromSite != true][0]{
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


/** Все отзывы из полей туров (для главной: объединяем и перемешиваем на клиенте). Скрытые туры в списке не показываются, но их отзывы здесь учитываются. */
export const toursWithReviewsQuery = groq`
  *[_type == "tour"]|order(orderRank){
    _id,
    reviews[]{
      _key,
      authorName,
      profession,
      authorImage{
        ...,
        asset->{
          _id,
          metadata{dimensions{width,height,aspectRatio}}
        }
      },
      text
    }
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
  *[_type == "faq"]|order(orderRank){
    _id,
    question,
    answer
  }
`;