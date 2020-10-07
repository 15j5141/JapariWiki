// @ts-check
import ServiceBase from '../scripts/class-service_base.js';
import JWPage from '../scripts/class-page.js';
import { StatusService } from './status.service.js';
import ApplicationService from './application.service.js';
/** @typedef {import('../scripts/class-cloud_base.js').JWFile} JWFile*/
import ModelsService from './models.service.js';

import {
  Subject,
  BehaviorSubject,
  of,
  defer,
  throwError,
  Observable,
} from 'rxjs';
import {
  switchMap,
  map,
  catchError,
  takeUntil,
  filter,
  tap,
} from 'rxjs/operators';

/**
 * @class
 */
export default class WikiService extends ServiceBase {
  /**
   * @override
   */
  decorator() {
    /* ----- デコレータセット. ----- */

    /* ----- プロパティ宣言. ----- */
    const self = this;
    /** @type {Subject} 履歴移動等でキャンセル割り込みキャンセル用 */
    this.exitSignal$ = new Subject();
    /** @type {BehaviorSubject<string>} ページ移動用 */
    this.pageURI$ = new BehaviorSubject(null);

    /** @type {Observable<JWPage>} 取得したページデータ */
    this.pulledJWPage$ = this.pageURI$.pipe(
      filter(v => v != null),
      switchMap(pageURI => {
        // Promise を Observable へ変換する.
        return defer(() => self.serviceInjection.models.readPage(pageURI)).pipe(
          catchError(err => {
            // readPage() のエラー処理.
            switch (err.message) {
              case 'Page:NotFound':
                // 指定ページが存在しない場合.
                return of(
                  new JWPage(
                    pageURI,
                    'ページがありません。<br>編集ボタンで作成します<br>' +
                      pageURI,
                    null
                  )
                );
              case 'Page:PermissionError':
                // 指定ページへのアクセス権がない場合.
                return of(new JWPage(pageURI, '権限がありません.', null));
              default:
                return throwError(err);
            }
          })
        );
      }),
      map(page => {
        // エラーチェックをする.
        if (page == null) {
          throw new Error('JW:UnknownError');
        }

        return page;
      }),
      takeUntil(self.exitSignal$),
      tap(page => {
        // 購読していなくてもページデータを読み取れるようにする.
        // self.page = page;
      })
    );

    /* ----- サービスのインジェクション. ----- */
    /** @type {{status: StatusService, application: ApplicationService, models: ModelsService}} */
    this.serviceInjection = {
      status: StatusService.prototype,
      application: ApplicationService.prototype,
      models: ModelsService.prototype,
    };

    /* ----- コンポーネント取得. ----- */
  }
  /**
   * 相対パスを絶対パスに解決.
   * @param {string} pageURI
   * @return {string}
   */
  resolveURI(pageURI) {
    const nowURI = this.pageURI$.getValue();
    if (JWPage.isAbsoluteURI(pageURI)) {
      // 絶対パスならそのまま.
      return pageURI;
    } else {
      // 相対パスなら現在のページ URI から解決.
      // 現在のページ URI を取得.
      const paths = nowURI.split('/');
      // ページ名に当たる部分を書き換え.
      paths[paths.length - 1] = pageURI;
      // 配列を結合.
      return paths.join('/');
    }
  }
}
