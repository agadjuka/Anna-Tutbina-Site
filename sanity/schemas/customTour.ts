import {defineType, defineField} from 'sanity'

const customTour = defineType({
  name: 'customTour',
  title: "Страница 'Индивидуальный тур'",
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Заголовок',
      type: 'string',
    }),
    defineField({
      name: 'mainImage',
      title: 'Фотография',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'description',
      title: 'Описание',
      type: 'array',
      of: [{type: 'block'}],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
    },
  },
})

export default customTour

