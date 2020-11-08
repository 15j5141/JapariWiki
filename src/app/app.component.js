// @ts-check
/**
 * @fileoverview ルートコンポーネントへの一括読込を担う.
 */
import ComponentBase from '../scripts/class-component_base.js';
import { StatusService } from './status.service.js';

/**
 * コンポーネントのサンプルコード.
 * @class
 */
export class AppComponent extends ComponentBase {
  /**
   * @override
   */
  decorator() {
    /* ----- サービスのインジェクション. ----- */
    /** @type {{status: StatusService}} */
    this.serviceInjection = {
      status: StatusService.prototype,
    };

    /* ----- プロパティ宣言. ----- */

    /** History API 使用の可否. */
    this.isCanBeHistory =
      history && history.pushState && history.state !== undefined;
  }
  /**
   * @override
   */
  get decoration() {
    return {
      templateUrl: './app.component.html',
      styleUrls: ['../styles/style.css'],
      selector: '#app-root',
    };
  }
  /**
   * @override
   */
  async onInit() {
    this.status = this.serviceInjection.status._status;
    this.cloud = this.serviceInjection.status.getCloud();
  }
  /**
   * @override
   */
  async onRender() {
    const status = this.serviceInjection.status;

    // ログインセッション切れを確認する.
    this.renderer.setHTML('認証確認中...');
    const user = await this.cloud.isLogin();
    // 未ログインなら
    if (user == null) location.href = './logout.html';
    status.setUser(user);

    // 動的コンポーネント一覧を取得する.
    const paths = await this.getDynamicComponentPaths();
    // 動的コンポーネントを取得する.
    await this.loadDynamicComponents(paths);

    // 描画する.
    this.renderer.setHTML(await this.templateHTML);
  }
  /**
   * @override
   */
  onLoad() {
    const self = this;
    const $ = this.$;
    $(function() {
      $(document).on('click', '#ajaxLoad_upload_', function(event) {
        event.preventDefault();
        // キーボード操作などにより、オーバーレイが多重起動するのを防止する
        $(event.target).blur(); // ボタンからフォーカスを外す
        if ($('#modal-overlay')[0]) return false;
        // 新しくモーダルウィンドウを起動しない

        // オーバーレイ用のHTMLコードを、[body]内の最後に生成する
        $('body').append('<div id="modal-overlay"></div>');
        $('#modal-overlay').append('<div id="modal-content"></div>');
        // FixMe ajaxLoad('#modal-content', 'ajax_upload.php');
        // [$modal-overlay]をフェードインさせる
        $('#modal-overlay').fadeIn('slow');

        return false;
      });

      $(document).on('click', '#modal-overlay_', function(event) {
        // [#modal-overlay]と[#modal-close]をフェードアウトする
        if ($(event.target).is('#modal-overlay')) {
          $('#modal-close,#modal-overlay').fadeOut('slow', function() {
            // フェードアウト後、[#modal-overlay]をHTML(DOM)上から削除
            $('#modal-overlay').remove();
          });
        }
      });
    });
  }
  /**
   * @param {any} paths
   */
  async loadDynamicComponents(paths) {
    const self = this;

    // パスを通す.
    window.requirejs.config({
      paths,
    });

    // 動的コンポーネントクラスを読込開始する.
    const pathsPromise = Promise.all(
      Object.keys(paths).map(path => {
        return new Promise((resolve, reject) => {
          // RequireJS でコンポーネントを読み込む.
          window.requirejs([path], resolve, reject);
        }).catch(err => {
          // 読込失敗してもnullを返して他の読み込みを邪魔させない.
          console.log(err);
          return null;
        });
      })
    );

    // 読込完了したらコンポーネントクラス一覧に追加する.
    await pathsPromise.then(classes => {
      classes.forEach(clazz => {
        if (!clazz) return; // nullなら無視する.
        // 追加する.
        self.refObj.declarations.push(clazz);
        ComponentBase.classes$.next(clazz);
        // ログ出力する.
        console.log('loaded: ' + clazz.name);
      });
    });
  }
  /**
   * {{scriptName:URL},...} の形でコンポーネントのリンクを返す.
   * @return {Promise<any>}
   */
  async getDynamicComponentPaths() {
    const ncmb = this.serviceInjection.status.getCloud().ncmb;
    const query = ncmb.DataStore('Page').order('createDate', true);

    // 部分一致で検索できるようにクエリを微調整する.
    query._where = {
      path: { $regex: '^/components/[-a-zA-Z0-9_]*\\.component$' },
    };

    // 取得する.
    return await query.fetchAll().then(function(componentObjects) {
      // {{scriptName:URL},...}の形にして返す.
      return componentObjects.reduce((paths, componentObject) => {
        if (!componentObject.text) return paths;
        // コンポーネントのコードをURLに変換する.
        const url = window.URL.createObjectURL(
          new Blob([componentObject.text], {
            type: 'application/javascript',
          })
        );
        // ファイル名を取得する.
        const uris = componentObject.path.split('/');
        const name = uris[uris.length - 1];
        // 格納する.
        paths[name] = url;
        return paths;
      }, {});
    });
  }
}
