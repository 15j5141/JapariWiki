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
import { switchMap, map, catchError, takeUntil, filter } from 'rxjs/operators';

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
    /** @type {Subject<string>} ページ移動用 */
    this.pageURI$ = new BehaviorSubject(null);
    /** @type {Observable<JWPage>} ページ移動観測用 */
    this.page$ = this.pageURI$.pipe(
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
                    'ページがありません。<br>新規作成<br>' + pageURI,
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
      takeUntil(self.exitSignal$)
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
}
