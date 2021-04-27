// @ts-check
export { ComponentBase, ServiceBase } from '../scripts';
export { Renderer } from '../scripts';
import * as decorations from '../scripts/decorations';
export { decorations };
// import jQuery from 'jquery';

import { AppModule } from '../app/app.module.js';

export const components = AppModule.decoration.declarations.reduce(
  (result, component) => {
    result[component.name] = component;
    return result;
  },
  {}
);

export const services = AppModule.decoration.services.reduce(
  (result, service) => {
    result[service.name] = service;
    return result;
  },
  {}
);
