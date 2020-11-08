// @ts-check
export { default as ComponentBase } from '../scripts/class-component_base.js';
export { default as ServiceBase } from '../scripts/class-service_base.js';
export { default as Renderer } from '../scripts/class-renderer.js';
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
