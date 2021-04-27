import { CloudNCMB } from '../src/scripts';
import { JWPage } from '../src/scripts';
const nc = new CloudNCMB();
console.log(nc);
(async function() {
  // console.log(await nc.signIn('test', 'test'));
  // console.log(await nc.postPage('zzz', new JWPage('zzz', 'zzz')));
  // console.log(
  //   await nc.getPage('zzz').catch(err => {
  //     if (err.message === 'Page:NotFound') {
  //       console.log('Page:NotFound');
  //     } else {
  //       console.log(err.message);
  //     }
  //   })
  // );
})();
$(function() {
  // ログイン.
  $('#btn-in').on('click', function() {
    const id = $('#input-id').val();
    const pass = $('#input-pass').val();
    (async function() {
      console.log(await nc.signIn(id, pass));
    })();
  });
  // 登録.
  $('#btn-up').on('click', function() {
    const id = $('#input-id').val();
    const pass = $('#input-pass').val();
    (async function() {
      console.log(await nc.signUp(id, pass));
    })();
  });
  // ログアウト.
  $('#btn-out').on('click', function() {
    (async function() {
      console.log(await nc.signOut());
    })();
  });
  // ページ取得.
  $('#btn-get').on('click', function() {
    (async function() {
      console.log(
        await nc.getPage('zzz').catch(err => {
          if (err.message === 'Page:NotFound') {
            return 'Page:NotFound';
          } else {
            return err.message;
          }
        })
      );
    })();
  });
});
// console.log('isLogin:',nc.isLogin());
