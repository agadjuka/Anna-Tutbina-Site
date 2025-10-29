import {defineType, defineField} from 'sanity'

const about = defineType({
  name: 'about',
  title: "Страница 'Обо мне'",
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Заголовок',
      type: 'string',
      initialValue: 'Обо мне',
    }),
    defineField({
      name: 'images',
      title: 'Фотографии',
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
      name: 'bio',
      title: 'Биография',
      type: 'array',
      of: [{type: 'block'}],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'images.0',
    },
  },
})

export default about

