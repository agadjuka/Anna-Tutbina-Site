import {defineType, defineField} from 'sanity'

/**
 * Синглтон «Настройки сайта».
 * Содержимое футера и контакты — они общие для всех страниц, поэтому лежат
 * отдельно от «Главной страницы».
 */
const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Настройки сайта',
  type: 'document',
  fields: [
    defineField({
      name: 'slogan',
      title: 'Слоган в футере',
      type: 'text',
      rows: 2,
      initialValue: 'Едешь из интереса, из желания, из себя — это и есть ONÁ.',
    }),
    defineField({
      name: 'contactLinks',
      title: 'Колонка «Связаться»',
      description: 'Telegram, WhatsApp, Instagram и т.п. Порядок — как на сайте.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'label', title: 'Подпись', type: 'string'},
            {name: 'url', title: 'Ссылка', type: 'url'},
          ],
          preview: {select: {title: 'label', subtitle: 'url'}},
        },
      ],
    }),
    defineField({
      name: 'communityLinks',
      title: 'Колонка «Сообщество»',
      description: 'Группа в Telegram, календарь путешествий, индивидуальные маршруты.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'label', title: 'Подпись', type: 'string'},
            {name: 'url', title: 'Ссылка', type: 'string'},
          ],
          preview: {select: {title: 'label', subtitle: 'url'}},
        },
      ],
    }),
    defineField({
      name: 'footerNote',
      title: 'Подпись в нижней строке',
      type: 'string',
      initialValue: 'Путешествия через состояния женщины',
    }),
  ],
  preview: {
    prepare: () => ({title: 'Настройки сайта'}),
  },
})

export default siteSettings
