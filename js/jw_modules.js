/**
 * @fileoverview コンポーネント等の一括読込を担う.
 */
import HeaderComponent from '../app/header.js';
import FooterComponent from '../app/footer.js';
import WikiApp from '../app/wiki.js';
import EditorApp from '../app/edit.js';
import MenuComponent from '../app/menu.js';
import HistoryComponent from '../app/history.js';
import SiteNoticeComponent from '../app/notice.js';
import IndexService from '../app/index.service.js';

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
};
