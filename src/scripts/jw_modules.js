// @ts-check
/**
 * @fileoverview コンポーネント等の一括読込を担う.
 */
import HeaderComponent from '../app/header.component.js';
import FooterComponent from '../app/footer.component.js';
import WikiApp from '../app/wiki.component.js';
import EditorApp from '../app/editor.component.js';
import MenuComponent from '../app/menu.component.js';
import HistoryComponent from '../app/history.component.js';
import SiteNoticeComponent from '../app/notice.component.js';
import IndexService from '../app/index.service.js';
import ApplicationService from '../app/application.service.js';

export const Components = {
  HeaderComponent,
  FooterComponent,
  WikiApp,
  EditorApp,
  MenuComponent,
  HistoryComponent,
  SiteNoticeComponent,
};

export const Services = {
  IndexService,
  ApplicationService,
};
