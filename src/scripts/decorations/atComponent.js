import ComponentBase from '../class-component_base.js';
/** @typedef {(clazz?: typeof ComponentBase) => typeof ComponentBase} ComponentDecorator */
/** @typedef {import("../class-component_base.js").ComponentDecoration} ComponentDecoration */

/**
 * 渡された内容をデコレートする関数を生成する.
 * @param {ComponentDecoration} option
 * @return {ComponentDecorator}
 */
export const atComponent = option => {
  return (
    /**
     * @param {typeof ComponentBase=} clazz
     * @return {typeof ComponentBase}
     */
    function(clazz = ComponentBase) {
      /**
       * デコレートする内容.
       * @type {ComponentDecoration}
       */
      const decoration = {
        selector: '',
        template: '',
        templateUrl: null,
        styleUrls: [],
        styles: [],
        ...option,
      };

      /**
       * デコレートするクラス.
       * ComponentBaseの派生クラスが渡されたらそれを直接加工する.
       * 未知のクラスやComponentBaseが渡されたら元のクラスに影響がないように新規クラスを生成する.
       */
      const targetClass =
        clazz.prototype instanceof ComponentBase
          ? clazz
          : class extends clazz {};

      // getterとしてデコレーションをセットする.
      Object.defineProperty(targetClass.prototype, 'decoration', {
        get() {
          return decoration;
        },
        enumerable: true,
        configurable: true,
      });
      // 以下のように, getterをdeleteしても代入時にprototypeチェーン先にsetterが無くエラーする.
      // delete targetClass.prototype.decoration;
      // targetClass.prototype.decoration = decoration;

      return targetClass;
    }
  );
};
