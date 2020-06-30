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
import SideMainComponent from '../app/side_main.component.js';
import IndexService from '../app/index.service.js';
import ApplicationService from '../app/application.service.js';
import { StatusService } from '../app/status.service.js';
import LoginHistoryComponent from '../app/login_history.component.js';

export const Components = {
  HeaderComponent,
  FooterComponent,
  WikiApp,
  EditorApp,
  MenuComponent,
  HistoryComponent,
  SideMainComponent,
  LoginHistoryComponent,
};

export const Services = {
  IndexService,
  ApplicationService,
  StatusService,
};
