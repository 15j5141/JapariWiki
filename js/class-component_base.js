/**
 * @fileoverview
 */
import Renderer from './class-renderer.js';
/**
 * @typedef {Object} ReferenceObject
 * @property {Element} element
 * @property {jQuery} jQuery
 * @property {Object} status
 * @property {string} selector
 * @property {string} templateUrl
 * @property {Array<string>} styleUrls
 */
/**
 * Component の基本クラス.
 * @class
 * @property {Object} decoration
 */
export default class ComponentBase {
  /**
   * コンストラクタ.
   * 子クラスはオーバーライドしない.
   * @param {ReferenceObject} referenceObject
   */
  constructor(referenceObject) {
    /** @type {ReferenceObject} */
    const originalReferenceObject = {
      element: null,
      jQuery: null,
      status: null,
      selector: null,
      templateUrl: null,
      styleUrls: null,
    };
    /** @type {ReferenceObject} */
    this.refObj = { ...originalReferenceObject, ...referenceObject };

    // セットする.
    this.$ = this.refObj.jQuery = this.refObj.jQuery || top.jQuery;
    // element が未指定なら selector から特定する.
    this.refObj.element =
      this.refObj.element || this.refObj.jQuery(this.refObj.selector).get(0);
    this.$element = this.refObj.jQuery(this.refObj.selector);
    this.renderer = new Renderer(this.refObj.selector);
    this.decoration = {};

    const self = this;
    // 疑似デコレーターを呼ぶ.
    self.decorator();

    // 非同期でコンポーネントを初期化する.
    this.$.ajax({
      url: '../app/' + self.decoration.templateUrl,
      success: data => {
        this.renderer.setHTML(data);
        self.onInit();
      },
      error: err => {
        console.log(err);
      },
    });
  }
  /**
   * @abstract
   * 疑似デコレーター.
   */
  decorator() {
    this.decoration = {};
    this.decoration.templateUrl = '';
    this.decoration.styleUrls = [''];
  }
  /**
   * 初期化時に実行する.
   * @abstract
   * @return {Object}
   */
  onInit() {
    return Error('Not implemented');
  }
}
