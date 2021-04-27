// @ts-check
import { ServiceBase } from '../../scripts';
import { StatusService, IndexService, ModelsService } from './';

/** @typedef {import('rxjs').Subject} Subject*/
import { BehaviorSubject } from 'rxjs';

/**
 * @class
 */
export class SampleService extends ServiceBase {
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

    /*
    サービスでのコンポーネントの取得は極力行わない.
    コンポーネント側でサービスのプロパティのオブザーバを購読する.
    */
  }
}
