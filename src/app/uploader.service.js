// @ts-check
import { ServiceBase } from '../scripts';
import { StatusService } from './status.service.js';
import { IndexService } from './index.service.js';
import { ModelsService } from './models.service.js';

/** @typedef {import('rxjs').Subject} Subject*/
import { BehaviorSubject } from 'rxjs';

/**
 * @class
 */
export class UploaderService extends ServiceBase {
  /** @override */
  get [Symbol.toStringTag]() {
    return 'UploaderService';
  }
  /**
   * @override
   */
  decorator() {
    /* ----- デコレータセット. ----- */

    /* ----- プロパティ宣言. (コンストラクタ代わり) ----- */
    /** @type {BehaviorSubject<string>} コンポーネント操作の為のイベント発火用等 */
    this.event$ = new BehaviorSubject(null);

    /* ----- 使用するサービスを指定する. ----- */
    /** @type {{status: StatusService, index: IndexService, models: ModelsService}} */
    this.serviceInjection = {
      status: StatusService.prototype,
      index: IndexService.prototype,
      models: ModelsService.prototype,
    };
  }
  /**
   * アップローダコンポーネントを開け閉めする.
   */
  toggleUploader() {
    this.event$.next('toggle');
  }
}
