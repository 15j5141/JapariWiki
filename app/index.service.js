// @ts-check
import ServiceBase from '../js/class-service_base.js';

/**
 * @class
 */
export default class IndexService extends ServiceBase {
  /**
   *
   * @param {string} pageURI
   */
  async openWiki(pageURI) {
    await this.components['wiki_app'].move(pageURI);
  }
  /**
   *
   * @param {string} pageURI
   */
  async openEditor(pageURI) {}
}
