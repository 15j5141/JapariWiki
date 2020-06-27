// / <reference path="../typings/globals/jquery/index.d.ts" />
// @ts-check
/**
 * @fileoverview
 */
import Renderer from './class-renderer.js';
import JWStatus from './jw-status.js';
import ServiceBase from './class-service_base.js';
/**
 * @typedef {Object} ReferenceObject
 * @property {jQuery} jQuery
 * @property {JWStatus=} status
 * @property {string} selector
 * @property {ServiceBase=} service
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
      jQuery: null,
      status: null,
      selector: null,
      service: null,
    };
    /** @type {ReferenceObject} */
    this.refObj = { ...originalReferenceObject, ...referenceObject };

    // セットする.
    /** @type {jQuery}*/
    this.$ = this.refObj.jQuery = this.refObj.jQuery || top.jQuery;
    // element が未指定なら selector から特定する.
    this.element = this.refObj.jQuery(this.refObj.selector).get(0);
    this.refObj.status = this.refObj.status || new JWStatus();
    this.$element = this.refObj.jQuery(this.refObj.selector);
    this.renderer = new Renderer(this.refObj.selector);
    /**
     * @type {{templateUrl:string,styleUrls:Array<string>}}
     */
    this.decoration = {
      templateUrl: null,
      styleUrls: [],
    };

    const self = this;
    // 疑似デコレーターを呼ぶ.
    self.decorator();
  }
  /**
   * @abstract
   * 疑似デコレーター.
   */
  decorator() {}
  /* ---------- abstract. ---------- */
  /**
   * 初期化時に実行する.
   * @abstract
   * @return {Promise}
   */
  async onInit() {
    return Error('Not implemented');
  }
  /**
   * 描画させる.
   * @abstract
   * @return {Promise<void>}
   */
  async onRender() {
    await this.renderer.update(this.templateHTML);
  }
  /**
   * イベント登録する.
   * @abstract
   * @return {void}
   */
  onLoad() {}
  /* ---------- 実装の呼び出し. ---------- */
  /**
   * 非同期でコンポーネントを初期化する.
   * @return {Promise<void>}
   */
  async init() {
    // FixMe move loadTemplate() to constructor.
    // HTML を DL する.
    this.templateHTML = await this.loadTemplate();
    // DOM にセットする.
    this.renderer.setHTML(this.templateHTML);
    // 実装された初期化処理を呼ぶ.
    await this.onInit();
    // イベント登録する.
    this.onLoad();
  }
  /**
   * 描画する.
   * @return {Promise<void>}
   */
  async draw() {
    // 実装された描画処理を呼ぶ.
    await this.onRender();
  }
  /* ---------- その他メソッド. ---------- */
  /**
   * template html を読み込む.
   * @return {Promise<string>}
   */
  async loadTemplate() {
    const self = this;
    if (self.decoration.templateUrl == null) {
      return Promise.resolve('');
    }
    return new Promise((resolve, reject) => {
      this.$.ajax({
        url: '../app/' + self.decoration.templateUrl,
        success: data => {
          resolve(data);
        },
        error: err => {
          reject(err);
        },
      });
    });
  }
  /**
   * fetch.
   * @param {string} url
   * @return {Promise<string>}
   */
  async fetch(url) {
    const $ = this.$;
    return new Promise((resolve, reject) => {
      $.ajax({ url: url }).done(data => {
        resolve(data);
      });
    });
  }
  /**
   * 履歴に追加.
   * @param {string} uri
   */
  pushState(uri) {
    top.history.pushState(uri, uri, null);
  }
}
