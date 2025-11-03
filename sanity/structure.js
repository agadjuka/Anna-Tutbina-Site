import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'
import {StructureBuilder, DefaultDocumentNodeResolver, StructureResolverContext} from 'sanity/structure';

/**
 * Для совместимости с Sanity v3 Structure Tool
 * S, context — обязательные параметры
 */
export default (S, context) => S.list()
  .title('Контент')
  .items([
    orderableDocumentListDeskItem({ type: 'tour', S, context, title: 'Туры' }),
    S.documentTypeListItem('review').title('Отзывы'),
    S.documentTypeListItem('about').title('Обо мне'),
    S.documentTypeListItem('customTour').title('Индивидуальный тур'),
    orderableDocumentListDeskItem({ type: 'faq', S, context, title: 'FAQ' }),
  ]);

