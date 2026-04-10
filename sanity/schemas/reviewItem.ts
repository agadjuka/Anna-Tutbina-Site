import {defineType, defineField} from 'sanity'

const reviewItem = defineType({
  name: 'reviewItem',
  title: 'Отзыв',
  type: 'object',
  fields: [
    defineField({
      name: 'authorName',
      title: 'Имя автора',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'profession',
      title: 'Профессия',
      type: 'string',
      description: 'Например: дизайнер, психолог, предприниматель',
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
      options: {
        rows: 6,
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'authorName',
      subtitle: 'profession',
      media: 'authorImage',
    },
  },
})

export default reviewItem
