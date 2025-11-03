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
      title: 'Детали стоимости',
      type: 'array',
      of: [{type: 'block'}],
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
  ],
  preview: {
    select: {
      title: 'name',
      media: 'mainImage',
    },
  },
})

export default tour

