import {defineType, defineField} from 'sanity'

const tour = defineType({
  name: 'tour',
  title: 'Тур',
  type: 'document',
  fields: [
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
      name: 'gallery',
      title: 'Галерея фото',
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
      name: 'fullProgram',
      title: 'Полная программа тура',
      type: 'array',
      of: [{type: 'block'}],
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

