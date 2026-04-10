import {defineType, defineField} from 'sanity'
import {orderRankField} from '@sanity/orderable-document-list'

const tour = defineType({
  name: 'tour',
  title: 'Тур',
  type: 'document',
  fields: [
    orderRankField({ type: 'tour' }),
    defineField({
      name: 'name',
      title: 'Название тура',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL (slug)',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'cardImage',
      title: 'Фото для карточки (на главной)',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Если указано, будет использоваться в карточке тура на главной странице. Иначе возьмется главное фото ниже.',
    }),
    defineField({
      name: 'mainImage',
      title: 'Главное фото',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required().custom((value) => {
        if (!value?.asset) {
          return true
        }
        // Валидация через API Sanity
        return true
      }),
    }),
    defineField({
      name: 'overlayName',
      title: 'Название тура на фото',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'overlayDate',
      title: 'Дата на фото',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'introText',
      title: 'Вводный текст под фото',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'atmosphereGallery',
      title: 'Атмосфера наших туров',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    }),
    defineField({
      name: 'price',
      title: 'Цена',
      type: 'object',
      fields: [
        {
          name: 'value',
          title: 'Сумма',
          type: 'number',
        },
        {
          name: 'currency',
          title: 'Валюта',
          type: 'string',
          description: 'Например: ₽, $, €',
        },
      ],
    }),
    defineField({
      name: 'dates',
      title: 'Даты проведения',
      type: 'string',
      description: 'Например: "10-20 мая"',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Краткое описание для карточки',
      type: 'text',
    }),
    defineField({
      name: 'programByDays',
      title: 'Программа по дням',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'dayTitle',
              title: 'День (напр. \'День 1: Прибытие\')',
              type: 'string',
            },
            {
              name: 'dayImage',
              title: 'Фото дня',
              type: 'array',
              of: [
                {
                  type: 'image',
                  options: {
                    hotspot: true,
                  },
                },
              ],
            },
            {
              name: 'dayDescription',
              title: 'Описание дня',
              type: 'array',
              of: [{type: 'block'}],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'accommodation',
      title: 'Размещение',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'locationName',
              title: 'Название локации',
              type: 'string',
            },
            {
              name: 'locationImages',
              title: 'Фотографии локации',
              type: 'array',
              of: [
                {
                  type: 'image',
                  options: {
                    hotspot: true,
                  },
                },
              ],
            },
            {
              name: 'locationDescription',
              title: 'Описание локации',
              type: 'array',
              of: [{type: 'block'}],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'pricingDetails',
      title: 'Стоимость',
      type: 'object',
      fields: [
        defineField({
          name: 'columns',
          title: 'Колонки',
          type: 'array',
          description:
            'До трёх колонок: у каждой — заголовок (шапка карточки) и основной текст. На сайте одна или две колонки выравниваются по центру.',
          validation: (Rule) => Rule.max(3),
          of: [
            {
              type: 'object',
              name: 'pricingColumn',
              title: 'Колонка',
              fields: [
                defineField({
                  name: 'title',
                  title: 'Заголовок колонки',
                  type: 'string',
                }),
                defineField({
                  name: 'text',
                  title: 'Текст колонки',
                  type: 'text',
                }),
              ],
              preview: {
                select: {
                  title: 'title',
                  subtitle: 'text',
                },
              },
            },
          ],
        }),
        defineField({
          name: 'mainText',
          title: 'Основной текст',
          type: 'text',
          description:
            'Общий текст раздела «Стоимость» (отдельно от колонок). Многострочный.',
        }),
      ],
    }),
    defineField({
      name: 'included',
      title: 'Что включено',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'notIncluded',
      title: 'Что не включено',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'recommendedFlights',
      title: 'Рекомендуемые рейсы',
      type: 'object',
      fields: [
        {
          name: 'image',
          title: 'Изображение (скриншот)',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'text',
          title: 'Текст с пояснениями',
          type: 'array',
          of: [{type: 'block'}],
        },
      ],
    }),
    defineField({
      name: 'organizers',
      title: 'Организаторы',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Имя организатора',
              type: 'string',
            },
            {
              name: 'photo',
              title: 'Фото',
              type: 'image',
              options: {
                hotspot: true,
              },
            },
            {
              name: 'bio',
              title: 'Краткая биография',
              type: 'text',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'reviews',
      title: 'Отзывы',
      type: 'array',
      of: [
        {
          type: 'reviewItem',
          title: 'Отзыв',
        },
      ],
      description:
        'У каждого отзыва: имя автора, фото и текст. Порядок в списке — как на сайте. Блок на главной собирает отзывы со всех туров.',
    }),
    defineField({
      name: 'hideFromSite',
      title: 'Скрыть с сайта',
      type: 'boolean',
      description:
изь        'Если включено: тур не в списке на главной, страница тура недоступна. Отзывы из этого тура по-прежнему могут показываться в общем блоке отзывов на главной.',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'mainImage',
      hidden: 'hideFromSite',
    },
    prepare({ title, media, hidden }) {
      return {
        title,
        media,
        subtitle: hidden ? 'Скрыт с сайта' : undefined,
      }
    },
  },
})

export default tour

