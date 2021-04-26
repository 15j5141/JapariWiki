// @ts-check
import { IndexService } from '../app/index.service.js';
import { StatusService } from '../app/status.service.js';

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

import ComponentBase from '../scripts/class-component_base.js';
import { ServiceBase } from '../scripts/class-service_base.js';
import { ModelsService } from './models.service.js';
import { WikiService } from './wiki.service.js';
import { EditorService } from './editor.service.js';
import { UploaderService } from './uploader.service.js';

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
      services: [
        IndexService,
        StatusService,
        ModelsService,
        WikiService,
        EditorService,
        UploaderService,
      ],
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
