import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'
import {StructureBuilder, DefaultDocumentNodeResolver, StructureResolverContext} from 'sanity/structure';

/**
 * Для совместимости с Sanity v3 Structure Tool
 * S, context — обязательные параметры
 *
 * «Главная страница» и «Настройки сайта» — синглтоны: пункт меню открывает
 * сразу редактор документа с фиксированным id, без списка и кнопки «создать».
 */
export default (S, context) => S.list()
  .title('Контент')
  .items([
    S.listItem()
      .title('Главная страница')
      .id('homePage')
      .child(S.document().schemaType('homePage').documentId('homePage').title('Главная страница')),
    orderableDocumentListDeskItem({ type: 'tour', S, context, title: 'Туры' }),
    S.documentTypeListItem('customTour').title('Индивидуальный тур'),
    orderableDocumentListDeskItem({ type: 'faq', S, context, title: 'FAQ' }),
    S.divider(),
    S.listItem()
      .title('Настройки сайта')
      .id('siteSettings')
      .child(S.document().schemaType('siteSettings').documentId('siteSettings').title('Настройки сайта')),
  ]);
