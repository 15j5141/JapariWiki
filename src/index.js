// @ts-check
import ServiceManager from './scripts/class-service_manager.js';
import ComponentsManager from './scripts/class-components_manager.js';
import { AppModule } from './app/app.module.js';

/**
 * app.component を起動する.
 * @param {AppModule} Module
 */
function bootstrapModule(Module) {
  // 管理系の宣言する.
  const serviceManager = new ServiceManager();
  const componentsManager = new ComponentsManager();

  // サービスを立ち上げる.
  Module.decoration.services.forEach(Service => {
    const service = new Service({ componentsManager, serviceManager });
    // サービスを登録する.
    serviceManager.register(service);
  });

  // 読み込む.
  Module.decoration.bootstrap.forEach(Component => {
    const component = new Component({
      selector: null,
      jQuery: window.jQuery,
      serviceManager: serviceManager,
      declarations: Module.decoration.declarations,
      element: null,
    });
    // 各コンポーネントを登録する.
    componentsManager.register(component);
    (async () => {
      await component.init();
      await component.draw();
    })();
  });
}

// app.component を起動する.
bootstrapModule(AppModule);
