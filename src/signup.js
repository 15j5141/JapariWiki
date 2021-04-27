// @ts-check
import { CloudNCMB as Cloud } from './scripts';
import { JWStatus } from './scripts';
// NCMB用の設定.
const cloud = new Cloud();
const jWStatus = new JWStatus();

/** @type {jQuery} */
const $ = window.$;

$(function() {
  const $id = $('input[name=user_id]');
  const $pass = $('input[name=user_pass]');

  // 登録ボタン.
  $('#form_id').submit(function() {
    const user = { id: '' + $id.val(), pass: '' + $pass.val() };
    // 空白チェック.
    if (user.id === '' || user.pass === '') {
      $('#form_id').append('<br />ID or PASS is empty!');
      return false;
    }
    // 管理者が読めないようにハッシュ化.
    user.pass = window.CryptoJS.MD5(user.pass).toString();
    // $("input[name='user_pass']").val(crypted);
    let loginResult = '';
    let html = '';

    (async () => {
      // ログイン用インスタンス作成.
      try {
        // 非同期でログイン処理.
        await cloud.signUp(user.id, user.pass);
        loginResult = 'success';
        // ログイン履歴を追加する. FixMe ログイン処理をクラウドで行う.
        await cloud.addLoginHistory(loginResult, user.id);
        // ステータスを更新する.
        jWStatus._status.user = { id: user.id, name: user.id };
        jWStatus.save();
        // リダイレクトする.
        location.href = './' + (location.search ? '?' + location.search : '');
      } catch (error) {
        // 失敗した.
        loginResult = 'failure';
        // ログイン履歴を追加する. FixMe ログイン処理をクラウドで行う.
        await cloud.addLoginHistory(loginResult, user.id);

        // エラーを表示する.
        html += 'ログインに失敗しました。<br />';
        html +=
          'key:' +
          JSON.stringify({ user, error: error.message }, null, '') +
          '<br />';
        html += 'アカウント作成希望者は上記を管理者へお知らせください。<br />';
        $('p#result').html(html);
      }
    })();

    return false;
  });
});
