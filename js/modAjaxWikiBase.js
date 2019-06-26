var appKey = "73214ee5293b310aba334aaf6b58cb41cb89873a1eb88ab505fa7d48dcc2b911";
var clientKey = "79d3a32839ef780c0fe16236d8efc7bdd338312ec1d969945346a181ffc9442f";
var ncmb = new NCMB(appKey, clientKey);
var user = new ncmb.User();
username = '';
password = '';
var currentUser = ncmb.User.getCurrentUser();
if (currentUser) {
  console.log("ログイン中のユーザー: " + currentUser.get("userName"));
} else {
  //ncmb.User.logout();
  console.log("未ログインまたは取得に失敗");
}
async function koubunCheck(txt) {
  let result = await checkComment(txt, ncmb);
  console.log('koubunCheck: OK');
  return result;
}
async function OnLogin2() {
  let result = await checkComment(txt, ncmb);
  $('body').append(result);
  console.log(result);
  let b = await checkAfterLodingPage(result, ncmb);
  console.log('checkAfterLodingPage: success');
  console.log('all: success');
  return 0;
}

function OnLogin() {
  return new Promise((resolve, reject) => {
    checkComment(txt, ncmb).then(function(result) {
      $('#content_add').append(result);
      return checkAfterLodingPage(result, ncmb);
    }).then(function(result) {
      resolve('checkAfterLodingPage: success');
    }).then(function() {
      resolve('all: success');
    }).catch(function(err) {
      reject(err);
    });
  });
}

$(document).on('submit', '.CommentForm', function(e) {
  e.preventDefault(); // submit破棄
  let comObjId = $(this).attr('data-objid'); // コメントID
  let content = $('input[name=content]', this).val(); // コメント内容
  let contributor = $('input[name=contributor]', this).val(); // 投稿者
  // 調整
  contributor = contributor == '' ? '名無し' : contributor;
  if (comObjId == '' || content == '') {
    return false; // 空なら送信しない
  }
  let ncmbC = new NCMBComment();
  ncmbC.setComment(ncmb.DataStore("Comment"), comObjId, content, contributor).then(x => console.log(x)); // コメント投稿
  $('input[type=submit]', this).prop("disabled", true); // 連続投稿対策
  $('input[type=submit]', this).val('要リロード');
  return false;
});
$(document).on('change', '#content_add', function(event) {
  console.log('event');
  // ページが読み込み終わったらjsで構文チェックを行う.
  koubunCheck().then(function(result) {
    console.log('event2');
    $('#content_add').html(result);
  })
});
$(function() {
  txt = "fdgwhsdijfpv\n#comment()\nnobsgjprgnb";
  /*checkBeforeSavingPage(txt, ncmb).then(function(result){
    console.log(result);
  });*/
  txt = "start<br />\n#comment(8YxY37D1Il)<br />\n#comment(8YxY37D1I2)<br />\n#comment(8YxY37D1Il)<br />\nend<br />";
  $('body').append('<br >loading...<br ><div id="content_add"></div>');

  /*
  //ncmb.User.login(username, password)
  ncmb.User.loginAsAnonymous() // とりあえず同時ログイン対策.
    .then(function(user) {
      console.log('login: success!');
      return OnLogin();*/
});

/* // ロール追加テスト
  ncmb.User.login(username, password)
    .then(function(user) {
        console.log(user);
        //var cRole = new ncmb.Role("Commenter");
        ncmb.Role.equalTo("roleName","Commenter").fetch()
        .then(function (role){
            //会員をロールに追加
            role.addUser(user).update().then(function (role){
              console.log("qq1");
            }).catch(function(err) {
              console.log("qq2");
            });
        }).catch(function (err){
          //検索に失敗した場合
        });
        cRole.addUser(user).save()
         .then(function(gameScore){
           console.log("zz1");
         })
         .catch(function(err){
           console.log(err);
         });
        //cRole.update();
    })
    .catch(function(error) {
    });
*/