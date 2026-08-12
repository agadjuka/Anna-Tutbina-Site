import {defineType, defineField} from 'sanity'

/**
 * «Индивидуальный тур» — отдельная страница /custom-tour и блок «Сотрудничество»
 * на главной (макет, нода 5:253).
 */
const customTour = defineType({
  name: 'customTour',
  title: "Страница 'Индивидуальный тур'",
  type: 'document',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Надзаголовок',
      description: 'Мелкая строка над заголовком в блоке на главной. Выводится заглавными буквами.',
      type: 'string',
      initialValue: 'Сотрудничество',
    }),
    defineField({
      name: 'title',
      title: 'Заголовок',
      description: 'Используется как H1 на отдельной странице /custom-tour.',
      type: 'string',
      initialValue: 'Индивидуальные маршруты и туры под ключ',
    }),
    defineField({
      name: 'homeHeading',
      title: 'Заголовок блока на главной',
      description: 'Отдельный текст для блока «Сотрудничество» на главной — короче и цепляющее, не совпадает с H1 страницы /custom-tour.',
      type: 'string',
      initialValue: 'Не нашли подходящий',
    }),
    defineField({
      name: 'homeHeadingAccent',
      title: 'Заголовок на главной — выделенная часть',
      description: 'Выводится курсивом сразу после homeHeading.',
      type: 'string',
      initialValue: 'формат?',
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
      name: 'images',
      title: 'Фотографии блока на главной',
      description: '3 фото: 1-2 — слева внахлёст, 3 — крупное справа.',
      type: 'array',
      validation: (Rule) => Rule.max(3),
      of: [{type: 'image', options: {hotspot: true}}],
    }),
    defineField({
      name: 'description',
      title: 'Описание',
      description: 'Основной текст на отдельной странице /custom-tour.',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'homeDescription',
      title: 'Текст блока на главной',
      description: 'Короткий текст (1-2 абзаца) для блока «Сотрудничество» на главной — отдельно от description, который идёт на странице /custom-tour.',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'tags',
      title: 'Поводы',
      description:
        'Строка тегов под кнопкой: дни рождения, девичники, корпоративные туры, групповые запросы.',
      type: 'array',
      of: [{type: 'string'}],
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
