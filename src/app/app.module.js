// @ts-check
import { HeaderComponent } from '../app/header.component.js';
import { FooterComponent } from '../app/footer.component.js';
import { WikiApp } from '../app/wiki.component.js';
import { EditorApp } from '../app/editor.component.js';
import { MenuComponent } from '../app/menu.component.js';
import { HistoryComponent } from '../app/history.component.js';
import { SideMainComponent } from '../app/side_main.component.js';
import { LoginHistoryComponent } from '../app/login_history.component.js';
import { DebugWindowComponent } from './debug_window.component.js';
import { UploaderComponent } from './uploader.component.js';
import { AppComponent } from './app.component.js';

import { ComponentBase } from '../scripts';
import { ServiceBase } from '../scripts';
import * as services from '../app/services';

/**
 * @typedef {Object} Modules
 * @property {Array<typeof ComponentBase>} declarations 宣言されたコンポーネント
 * @property {Array<typeof ServiceBase>} services 起動するサービス
 * @property {Array<typeof ComponentBase>} bootstrap 起動するコンポーネント
 */
/**
 * @class
 */
export class AppModule {
  /**
   * decoration.
   * @static
   * @return {Modules}
   */
  static get decoration() {
    return {
      declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        SideMainComponent,
        LoginHistoryComponent,
        MenuComponent,
        HistoryComponent,
        EditorApp,
        WikiApp,
        UploaderComponent,
        DebugWindowComponent,
      ],
      // providers.
      services: Object.keys(services).map(key => services[key]),
      bootstrap: [AppComponent],
    };
  }
  /**
   * インスタンス内参照用.
   * @return {Modules}
   */
  get decoration() {
    return this.constructor.decoration;
  }
}

// コンポーネントをstaticな値に追加する.
AppModule.decoration.declarations.forEach(Component => {
  ComponentBase.classes$.next(Component);
});
