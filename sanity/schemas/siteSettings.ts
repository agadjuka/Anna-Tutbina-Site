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
    defineField({
      name: 'primaryContacts',
      title: 'Основные контакты',
      description: 'WhatsApp и Telegram для кнопок "Хочу с вами", "Обсудить идею" и плавающей кнопки связи.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Название',
              type: 'string',
              description: 'Например: Telegram, WhatsApp',
            },
            {
              name: 'url',
              title: 'Ссылка',
              type: 'url',
              description: 'Полная ссылка, например: https://t.me/Anna_Turbina',
            },
            {
              name: 'icon',
              title: 'Тип иконки',
              type: 'string',
              options: {
                list: [
                  {title: 'Telegram', value: 'telegram'},
                  {title: 'WhatsApp', value: 'whatsapp'},
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'Телефон', value: 'phone'},
                ],
              },
            },
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'url',
              icon: 'icon',
            },
          },
        },
      ],
      initialValue: [
        {
          label: 'Telegram',
          url: 'https://t.me/Anna_Turbina',
          icon: 'telegram',
        },
        {
          label: 'WhatsApp',
          url: 'https://wa.me/79539527212',
          icon: 'whatsapp',
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({title: 'Настройки сайта'}),
  },
})

export default siteSettings
