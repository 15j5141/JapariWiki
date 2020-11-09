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
    this.renderer.setHTML('<progress value="0.2"></progress><br>');
    this.renderer.print('Initialize...');
  }
  /**
   * @override
   */
  async onRender() {
    const status = this.serviceInjection.status;
    const progress = (message, v) => {
      this.renderer.print('OK<br>' + message + '...');
      if (!v) v = parseFloat('' + this.$element.find('progress').val()) + 0.1;
      this.$element.find('progress').val('' + v);
    };

    // ログインセッション切れを確認する.
    progress('Authorize', 0.6);
    const user = await this.cloud.isLogin();
    // 未ログインなら
    if (user == null) location.href = './logout.html';
    status.setUser(user);

    // 動的コンポーネント一覧を取得する.
    progress('Get dynamic components list');
    const paths = await this.getDynamicComponentPaths();
    // 動的コンポーネントを取得する.
    progress('Load dynamic components', 0.9);
    await this.loadDynamicComponents(paths);

    // 描画する.
    progress('Render', 1.0);
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
