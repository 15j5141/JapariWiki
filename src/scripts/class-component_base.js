// / <reference path="../typings/globals/jquery/index.d.ts" />
// @ts-check
/**
 * @fileoverview
 */
import Renderer from './class-renderer.js';
/** @typedef {import("./class-service_manager").default} ServiceManager */
/** @typedef {import("./class-service_base").default} ServiceBase */
/**
 * @typedef {Object} ReferenceObject
 * @property {string=} selectorForGetElement element取得用
 * @property {ServiceManager} serviceManager
 * @property {Array<typeof ComponentBase>} declarations
 * @property {Element=} element
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
      selectorForGetElement: null,
      serviceManager: null,
      declarations: null,
      element: null,
    };
    /** @type {ReferenceObject} */
    this.refObj = { ...originalReferenceObject, ...referenceObject };

    // セットする.
    /** @type {jQuery}*/
    this.$ = top.jQuery;
    this.selector = this.decoration.selector;
    // element が未指定なら selector から特定する.
    this.element =
      this.refObj.element ||
      this.$(this.refObj.selectorForGetElement).get(0) ||
      this.$(this.selector).get(0);
    this.$element = this.$(this.element);
    this.renderer = new Renderer(this.element);
    /** コンポーネントが初期化済み（onInit,onDraw,onStart）かどうか.  */
    this.isInitialized = false;

    /** @type {Object<string, ServiceBase>} */
    this.serviceInjection = {};

    // 疑似デコレーターを呼ぶ.
    this.decorator();

    /** <link ...> に組み立てられた CSS 一覧. */
    this.stylesLinkTag = this.decoration.styleUrls.reduce(
      (previous, current) => {
        return (
          previous +
          `<link rel="stylesheet" type="text/css" href="app/${current}" />\n`
        );
      },
      ''
    );
    // HTML を DL する.
    this.templateHTML = this.loadTemplate();

    // serviceInjectionの解決, onInit(), onLoad() などを実行する.
    this.init().then(() => {});
  }
  /**
   * 疑似デコレーターセット.
   * @abstract
   * @return {{templateUrl:string, styleUrls:Array<string>, selector:string}}
   */
  static get decoration() {
    return {
      templateUrl: null,
      styleUrls: [],
      selector: '',
    };
  }
  /**
   * インスタンス内参照用.
   * @abstract
   * @return {{templateUrl:string, styleUrls:Array<string>, selector:string}}
   */
  get decoration() {
    return this.constructor.decoration;
  }
  /**
   * @abstract
   * 疑似デコレーター.
   */
  decorator() {}
  /**
   * this.injectionService の中身の参照を解決する.
   * @return {Promise<void>}
   */
  async _inject() {
    const self = this;
    // 全てのサービス解決まで待つ.
    await Promise.all([
      // this.injection にセットされたサービス一覧を取得する.
      ...Object.keys(self.serviceInjection).map(key => {
        return new Promise((resolve, reject) => {
          // サービスを serviceManager で解決する.
          self.refObj.serviceManager
            .getService(self.serviceInjection[key])
            .subscribe(service => {
              self.serviceInjection[key] = service;
              resolve();
            });
        });
      }),
    ]);
  }
  /**
   * 描画部品初期化.
   */
  async _initChildComponents() {
    const self = this;

    // 全てのコンポーネントを解決する.
    /** @type {Array<ComponentBase>} */
    const components = [];
    // declarations に宣言されたコンポーネントを生成する.
    this.refObj.declarations.forEach(Component => {
      // テンプレート HTML からコンポーネント要素を探す.
      const foundElements = self.element.querySelectorAll(
        Component.decoration.selector
      );
      // 見つかった全てのコンポーネント要素を Component に変換する.
      for (let i = 0; i < foundElements.length; i++) {
        const element = foundElements[i];
        // コンポーネントの共通クラスを付与する.
        element.classList.add('jw-component');
        // コンポーネントに変換する.
        components.push(
          new Component({
            ...this.refObj,
            element,
          })
        );
      }
    });

    // コンポーネントの初期化, 描画処理はコンストラクタから呼ばれる.
  }
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
    await this.renderer.update(await this.templateHTML);
  }
  /**
   * イベント登録する.
   * @abstract
   * @return {void}
   */
  onLoad() {}
  /**
   * コンポーネントが最初に描画された後呼ばれる.
   * @abstract
   */
  onStart() {
    // console.log('onStart:' + this.constructor.name);
  }
  /* ---------- 実装の呼び出し. ---------- */
  /**
   * 非同期でコンポーネントを初期化する.
   * @return {Promise<void>}
   */
  async init() {
    // this.injection のサービスを解決する.
    await this._inject();

    // 実装された初期化処理を呼ぶ.
    await this.onInit();

    // templateHTML読込完了まで待つ.
    await this.templateHTML;
    // templateHTML等をDOMにセットする.
    await this.draw();

    // 子コンポーネントのインスタンスを生成する.
    await this._initChildComponents();

    // 実装された開始処理を呼ぶ.
    this.onStart();

    // 初期化済みフラグをオンにする.
    this.isInitialized = true;

    // イベント登録する.
    this.onLoad();
  }
  /**
   * 描画する.
   * @return {Promise<void>}
   */
  async draw() {
    // this.show();
    // 実装された描画処理を呼ぶ.
    await this.onRender();
  }
  /* ---------- その他メソッド. ---------- */
  /**
   *
   */
  show() {
    this.$element.show();
  }
  /**
   *
   */
  hide() {
    this.$element.hide();
  }
  /**
   * template html を読み込む.
   * @return {Promise<string>}
   */
  async loadTemplate() {
    const self = this;
    const url = self.decoration.templateUrl;
    if (url == null) {
      return Promise.resolve('');
    }
    return new Promise((resolve, reject) => {
      self.$.ajax({
        url: './app/' + url,
        success: data => {
          // CSS リンクと HTML を結合する.
          resolve(self.stylesLinkTag + data);
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
}
