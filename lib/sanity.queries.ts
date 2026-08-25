import { groq } from "next-sanity";
import { GROQ_TOUR_VISIBLE_ON_SITE } from "./tour-visibility";

export const toursQuery = groq`
  *[_type == "tour" && (${GROQ_TOUR_VISIBLE_ON_SITE})]|order(orderRank){
    _id,
    name,
    place,
    slug,
    hideFromSite,
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
    year,
    price,
    "overlayName": pt::text(overlayName),
    "overlayDate": pt::text(overlayDate)
  }
`;


export const tourBySlugQuery = groq`
  *[_type == "tour" && slug.current == $slug && (${GROQ_TOUR_VISIBLE_ON_SITE})][0]{
    _id,
    name,
    place,
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

/* `place` нужен для склейки «Место · Название» в <title> и OpenGraph —
   см. `lib/utils/tour-title.ts`. */
export const tourMetadataQuery = groq`
  *[_type == "tour" && slug.current == $slug && (${GROQ_TOUR_VISIBLE_ON_SITE})][0]{
    name,
    place,
    shortDescription
  }
`;


/** Раскрытие ассета изображения — метаданные нужны для корректных пропорций. */
const IMAGE_PROJECTION = `
  ...,
  asset->{
    _id,
    metadata{dimensions{width,height,aspectRatio}}
  }
`;

/** Синглтон «Главная страница»: контент главной, которого нет в других типах. */
export const homePageQuery = groq`
  *[_type == "homePage"][0]{
    hero{
      eyebrow,
      heading,
      subheading,
      subheadingAccent,
      photos[]{${IMAGE_PROJECTION}}
    },
    about{
      eyebrow,
      heading,
      body,
      photos[]{${IMAGE_PROJECTION}}
    },
    calendar{eyebrow, heading},
    values{
      eyebrow,
      heading,
      backgroundImage{${IMAGE_PROJECTION}},
      backgroundImageRight{${IMAGE_PROJECTION}},
      items[]{title, text}
    },
    guests{
      eyebrow,
      heading,
      headingAccent,
      items,
      body,
      photos[]{${IMAGE_PROJECTION}}
    },
    founders{
      eyebrow,
      heading,
      body,
      photo{${IMAGE_PROJECTION}},
      links[]{label, url},
      founderOne{photo{${IMAGE_PROJECTION}}, name, role, description},
      founderTwo{photo{${IMAGE_PROJECTION}}, name, role, description}
    },
    testimonials{eyebrow, heading},
    faq{eyebrow, heading}
  }
`;

/** Синглтон «Настройки сайта»: футер и контакты, общие для всех страниц. */
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0]{
    slogan,
    contactLinks[]{label, url},
    communityLinks[]{label, url},
    primaryContacts[]{label, url, icon},
    footerNote
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
    eyebrow,
    title,
    homeHeading,
    homeHeadingAccent,
    mainImage,
    decorPhoto{${IMAGE_PROJECTION}},
    images[]{${IMAGE_PROJECTION}},
    description,
    homeDescription,
    tags
  }
`;

export const faqQuery = groq`
  *[_type == "faq"]|order(orderRank){
    _id,
    question,
    answer
  }
`;

export const toursSlugsQuery = groq`
  *[_type == "tour" && (${GROQ_TOUR_VISIBLE_ON_SITE})]{
    "slug": slug.current,
    _updatedAt
  }
`;