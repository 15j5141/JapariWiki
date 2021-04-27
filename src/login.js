// @ts-check
import { CloudNCMB as Cloud } from './scripts';
import { JWStatus } from './scripts';
// NCMB用の設定.
const cloud = new Cloud();
const jWStatus = new JWStatus();

/** @type {jQuery} */
const $ = window.$;

const ViewSystem = {
  _doms: [
    {
      name: 'pass',
      query: "input[name='user_pass']",
      type: 'html',
      value: '',
    },
  ],
  init: function() {
    this._doms = [];
    const objs = $('.view-auto');
    for (let i = 0; i < objs.length; i++) {
      this._doms.push({
        query: objs[i].query,
        value: objs[i].val,
      });
    }
    $('.view-auto').length;
  },
  set: function(name, value) {
    const dom = this.findDom(name);
    dom.value = value;
    switch (dom.type) {
      case 'val':
        $(dom.query).val(val);
        break;
      case 'html':
        $(dom.query).html(val);
        break;
    }
  },
  get: function(name) {
    const dom = this.findDom(name);
    return dom.value;
  },
  findDom: function(name) {
    return this._doms.find(function(d) {
      return r.name === name;
    });
  },
};

$(function() {
  const $id = $('input[name=user_id]');
  const $pass = $('input[name=user_pass]');

  // ログインボタン.
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
        await cloud.signIn(user.id, user.pass);
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
        html += 'key:' + JSON.stringify(user, null, '') + '<br />';
        html += 'アカウント作成希望者は上記を管理者へお知らせください。<br />';
        $('p#result').html(html);
      }
    })();

    return false;
  });
});
