import {defineType, defineField} from 'sanity'

/**
 * Синглтон «Главная страница».
 *
 * Здесь лежит только тот контент главной, которого нет в других документах.
 * Туры, отзывы, FAQ и «Индивидуальный тур» живут в своих типах и подтягиваются
 * на главную запросами — дублировать их здесь нельзя.
 *
 * Секции идут в том же порядке, что и блоки на странице.
 * Соответствие блокам макета — docs/redesign/blocks.md.
 */

/** Общий пресет для надзаголовка секции — мелкая строка капсом над заголовком. */
const eyebrowField = (initialValue: string) =>
  defineField({
    name: 'eyebrow',
    title: 'Надзаголовок',
    description: 'Мелкая строка над заголовком. Выводится заглавными буквами.',
    type: 'string',
    initialValue,
  })

const homePage = defineType({
  name: 'homePage',
  title: 'Главная страница',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Первый экран'},
    {name: 'about', title: 'О проекте'},
    {name: 'calendar', title: 'Календарь'},
    {name: 'values', title: 'Ценности'},
    {name: 'guests', title: 'Кому подойдёт'},
    {name: 'founders', title: 'Создатели'},
    {name: 'testimonials', title: 'Отзывы'},
    {name: 'faq', title: 'FAQ'},
  ],
  fields: [
    // --- Блок 1. Первый экран -------------------------------------------
    defineField({
      name: 'hero',
      title: 'Первый экран',
      type: 'object',
      group: 'hero',
      options: {collapsible: true, collapsed: false},
      fields: [
        eyebrowField('wellness lifestyle · комьюнити · путешествия через состояния'),
        defineField({
          name: 'heading',
          title: 'Заголовок',
          type: 'string',
          initialValue: 'Больше, чем путешествия.',
        }),
        defineField({
          name: 'subheading',
          title: 'Подзаголовок',
          type: 'text',
          rows: 2,
          initialValue: 'Пространство для женщин, которые выбирают',
        }),
        defineField({
          name: 'subheadingAccent',
          title: 'Подзаголовок — курсивная часть',
          description: 'Продолжение подзаголовка, выводится курсивом. Можно оставить пустым.',
          type: 'string',
          initialValue: 'не просто отдых, а состояние.',
        }),
        defineField({
          name: 'photos',
          title: 'Фотографии коллажа',
          description:
            'До 5 фото. Порядок важен: 1-3 — левая группа (слева направо), 4-5 — правая. ' +
            'Пропорции жёстко заданы макетом, поэтому включайте hotspot и ставьте точку на главном объекте.',
          type: 'array',
          validation: (Rule) => Rule.max(5),
          of: [{type: 'image', options: {hotspot: true}}],
        }),
      ],
    }),

    // --- Блок 2. О проекте ------------------------------------------------
    defineField({
      name: 'about',
      title: 'О проекте',
      type: 'object',
      group: 'about',
      options: {collapsible: true, collapsed: true},
      fields: [
        eyebrowField('О проекте'),
        defineField({
          name: 'heading',
          title: 'Заголовок',
          type: 'string',
          initialValue: 'Искусство путешествовать красиво',
        }),
        defineField({
          name: 'body',
          title: 'Текст',
          description: 'Три абзаца в макете, но можно любое количество.',
          type: 'array',
          of: [{type: 'block'}],
        }),
        defineField({
          name: 'photos',
          title: 'Фотографии',
          description: '2 фото: 1 — крупное слева, 2 — справа за текстом.',
          type: 'array',
          validation: (Rule) => Rule.max(2),
          of: [{type: 'image', options: {hotspot: true}}],
        }),
      ],
    }),

    // --- Блок 3. Календарь ------------------------------------------------
    defineField({
      name: 'calendar',
      title: 'Календарь',
      description: 'Сами туры берутся из раздела «Туры». Здесь только заголовки секции.',
      type: 'object',
      group: 'calendar',
      options: {collapsible: true, collapsed: true},
      fields: [
        eyebrowField('Календарь'),
        defineField({
          name: 'heading',
          title: 'Заголовок',
          type: 'string',
          initialValue: 'Ближайшие путешествия',
        }),
      ],
    }),

    // --- Блок 4. Ценности -------------------------------------------------
    defineField({
      name: 'values',
      title: 'Ценности',
      type: 'object',
      group: 'values',
      options: {collapsible: true, collapsed: true},
      fields: [
        eyebrowField('Наши ценности'),
        defineField({
          name: 'heading',
          title: 'Заголовок',
          type: 'string',
          initialValue: 'Почему нас выбирают',
        }),
        defineField({
          name: 'backgroundImage',
          title: 'Фоновое фото (левая половина)',
          type: 'image',
          options: {hotspot: true},
        }),
        defineField({
          name: 'backgroundImageRight',
          title: 'Фоновое фото (правая половина)',
          type: 'image',
          options: {hotspot: true},
          description: 'В макете фон секции — два разных фото по половинам, не одно на всю ширину.',
        }),
        defineField({
          name: 'items',
          title: 'Карточки',
          description: 'Номера 01, 02, 03… проставляются автоматически по порядку в списке.',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {name: 'title', title: 'Заголовок', type: 'string'},
                {name: 'text', title: 'Текст', type: 'text', rows: 3},
              ],
              preview: {select: {title: 'title', subtitle: 'text'}},
            },
          ],
        }),
      ],
    }),

    // --- Блок 5. Кому подойдут наши путешествия ---------------------------
    defineField({
      name: 'guests',
      title: 'Кому подойдёт',
      type: 'object',
      group: 'guests',
      options: {collapsible: true, collapsed: true},
      fields: [
        eyebrowField('Кому подойдут наши путешествия'),
        defineField({
          name: 'heading',
          title: 'Заголовок',
          type: 'string',
          initialValue: 'Нам по пути,',
        }),
        defineField({
          name: 'headingAccent',
          title: 'Заголовок — выделенная часть',
          type: 'string',
          initialValue: 'если ты —',
        }),
        defineField({
          name: 'items',
          title: 'Пункты списка',
          description: 'Каждый пункт выводится с маркером ✦.',
          type: 'array',
          of: [{type: 'string'}],
        }),
        defineField({
          name: 'body',
          title: 'Текст под списком',
          type: 'array',
          of: [{type: 'block'}],
        }),
        defineField({
          name: 'photos',
          title: 'Фотографии',
          description: '3 фото коллажа справа, в порядке макета.',
          type: 'array',
          validation: (Rule) => Rule.max(3),
          of: [{type: 'image', options: {hotspot: true}}],
        }),
      ],
    }),

    // --- Блок 6. Создатели проекта ----------------------------------------
    defineField({
      name: 'founders',
      title: 'Создатели',
      type: 'object',
      group: 'founders',
      options: {collapsible: true, collapsed: true},
      fields: [
        eyebrowField('Создатели проекта'),
        defineField({
          name: 'heading',
          title: 'Заголовок',
          type: 'string',
          initialValue: 'За каждым путешествием стоят люди',
        }),
        defineField({
          name: 'body',
          title: 'Текст',
          type: 'array',
          of: [{type: 'block'}],
        }),
        defineField({
          name: 'photo',
          title: 'Фотография',
          type: 'image',
          options: {hotspot: true},
        }),
        defineField({
          name: 'links',
          title: 'Ссылки на соцсети',
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
          name: 'founderOne',
          title: 'Создатель 1',
          type: 'object',
          fields: [
            {name: 'photo', title: 'Фотография', type: 'image', options: {hotspot: true}},
            {name: 'name', title: 'Имя', type: 'string'},
            {name: 'role', title: 'Роль', type: 'string', initialValue: 'основатель'},
            {name: 'description', title: 'Описание', type: 'text', rows: 4},
          ],
          preview: {select: {title: 'name', subtitle: 'role', media: 'photo'}},
        }),
        defineField({
          name: 'founderTwo',
          title: 'Создатель 2',
          type: 'object',
          fields: [
            {name: 'photo', title: 'Фотография', type: 'image', options: {hotspot: true}},
            {name: 'name', title: 'Имя', type: 'string'},
            {name: 'role', title: 'Роль', type: 'string', initialValue: 'основатель'},
            {name: 'description', title: 'Описание', type: 'text', rows: 4},
          ],
          preview: {select: {title: 'name', subtitle: 'role', media: 'photo'}},
        }),
      ],
    }),

    // --- Блок 7. Отзывы ---------------------------------------------------
    defineField({
      name: 'testimonials',
      title: 'Отзывы',
      description: 'Сами отзывы берутся из туров. Здесь только заголовки секции.',
      type: 'object',
      group: 'testimonials',
      options: {collapsible: true, collapsed: true},
      fields: [
        eyebrowField('Отзывы'),
        defineField({
          name: 'heading',
          title: 'Заголовок',
          type: 'string',
          initialValue: 'Что говорят наши участницы',
        }),
      ],
    }),

    // --- Блок 9. FAQ ------------------------------------------------------
    defineField({
      name: 'faq',
      title: 'FAQ',
      description: 'Сами вопросы берутся из раздела «FAQ». Здесь только заголовки секции.',
      type: 'object',
      group: 'faq',
      options: {collapsible: true, collapsed: true},
      fields: [
        eyebrowField('Частые вопросы'),
        defineField({
          name: 'heading',
          title: 'Заголовок',
          type: 'string',
          initialValue: 'Вопросы и ответы',
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({title: 'Главная страница'}),
  },
})

export default homePage
