import {defineType, defineField} from 'sanity'

const review = defineType({
  name: 'review',
  title: 'Отзыв',
  type: 'document',
  fields: [
    defineField({
      name: 'authorName',
      title: 'Имя автора',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'authorImage',
      title: 'Фото автора',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'text',
      title: 'Текст отзыва',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'authorName',
      media: 'authorImage',
      subtitle: 'text',
    },
  },
})

export default review

