// @ts-check

import { Subject } from 'rxjs';

/** */
class Renderer {
  /**
   * @param {Element} element
   */
  constructor(element) {
    this.element = element;

    /**
     * @typedef DeltaDom
     * @property {string=} selector
     * @property {string} [type='html'] html | text | append
     * @property {string} value
     */
    /**
     * 差分をストリーム出来るようにする.
     * @type {Subject<DeltaDom>}
     */
    this.html$ = new Subject();
    /*
    {
      selector: '', // 書き換える対象セレクタ.
      type: 'html', // 書き換え方法.
      value: element.innerHTML, // 書き換え内容.
    }
    */
    // next() で書き換えられるようにする.
    this.html$.subscribe(async deltaDOM => {
      const delta = {
        selector: '',
        type: 'html',
        value: '',
        ...deltaDOM,
      };
      const targets =
        delta.selector == '' || delta.selector == null
          ? [this.element]
          : Array.from(this.element.querySelectorAll(delta.selector));

      if (delta.selector === '' && delta.type === 'html') {
        await this.update(delta.value);
      } else if (delta.type === 'html') {
        // HTML として書き換える.
        targets.map(target => {
          target.innerHTML = delta.value;
        });
      } else if (delta.type === 'text') {
        // テキストとして書き換える.
        targets.map(target => {
          target.textContent = delta.value;
        });
      } else if (delta.type === 'append') {
        // HTML として追記する.
        targets.map(target => {
          target.innerHTML = target.innerHTML + delta.value;
        });
      } else if (delta.type === 'prepend') {
        // HTML としてプリペンドする.
        targets.map(target => {
          target.innerHTML = delta.value + target.innerHTML;
        });
      }
    });
  }
  /**
   * HTML で書き換える.
   * @param {string} html
   */
  setHTML(html) {
    this.element.innerHTML = html;
  }
  /**
   * Text で書き換える.
   * @param {string} text
   */
  setText(text) {
    this.element.textContent = text;
  }
  /**
   * HTML で追記する.
   * @param {string} html
   */
  print(html) {
    this.element.innerHTML += html;
  }
  /**
   * HTML で追記する. 改行あり.
   * @param {string} html
   */
  println(html) {
    this.element.innerHTML += html + '</br>';
  }
  /**
   * 描画内容をクリアする.
   */
  cls() {
    this.element.innerHTML = null;
  }
  /**
   * 対象 DOM を更新.
   * @param {string} html
   * @return {Promise<string>}
   */
  async update(html) {
    this.setHTML(html);
    return html;
  }
}
export default Renderer;
