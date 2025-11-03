import {defineType, defineField} from 'sanity'
import {orderRankField} from '@sanity/orderable-document-list'

const faq = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    orderRankField({ type: 'faq' }),
    defineField({
      name: 'question',
      title: 'Вопрос',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Ответ',
      type: 'array',
      of: [{type: 'block'}],
      validation: Rule => Rule.required(),
    })
  ],
  preview: {
    select: {title: 'question'},
  },
});

export default faq;
