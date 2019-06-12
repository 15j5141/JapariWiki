var appKey = "73214ee5293b310aba334aaf6b58cb41cb89873a1eb88ab505fa7d48dcc2b911";
var clientKey = "79d3a32839ef780c0fe16236d8efc7bdd338312ec1d969945346a181ffc9442f";
var ncmb = new NCMB(appKey, clientKey);
var user = new ncmb.User();
username = 'commenter';
password = 'commenter';
var currentUser = ncmb.User.getCurrentUser();
if (currentUser) {
  console.log("ログイン中のユーザー: " + currentUser.get("userName"));
} else {
  //ncmb.User.logout();
  console.log("未ログインまたは取得に失敗");
}
//ncmb.User.login(username, password)
ncmb.User.loginAsAnonymous() // とりあえず同時ログイン対策.
  .then(function(user) {
    console.log('login: success!');
    console.log(user);
    return OnLogin();
  }).then(function(out) {
    console.log(out);
  }).catch(err => console.log(err));

function OnLogin() {
  return new Promise((resolve, reject) => {
    checkComment(txt, ncmb).then(function(result) {
      $('body').append(result);
      console.log(result);
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
  if (comObjId == '' || content == '') {
    return false; // 空なら送信しない
  }
  setComment(ncmb.DataStore("Comment"), comObjId, content, 'commenter').then(x => console.log(x)); // コメント投稿
  $('input[name=content]', this).val(''); // 空にする.
  return false;
});

$(function() {
  txt = "fdgwhsdijfpv\n#comment()\nnobsgjprgnb";
  /*checkBeforeSavingPage(txt, ncmb).then(function(result){
    console.log(result);
  });*/
  txt = "start<br />\n#comment(8YxY37D1Il)<br />\n#comment(8YxY37D1I2)<br />\n#comment(8YxY37D1Il)<br />\nend<br />";
  $('body').append('<br >loading...<br >');
});

/* // TestClass
  var TestClass = ncmb.DataStore("TestClass");
  var testClass = new TestClass();
  testClass.set("message", "Hello, NCMB!");
  testClass.save()
         .then(function(){
            console.log("S");
          })
         .catch(function(err){
            console.log("B");
          });
</script>
*/
/* // ログインテスト
user.set("userName", username)
  .set("password", password)
  .signUpByAccount()
  .then(function(user) {
      // [NCMB] userインスタンスでログイン
      ncmb.User.login(user)
               .then(function(user) {
                   console.log(user);
               })
               .catch(function(error) {
                 console.log("b");
               });
  })
  .catch(function(error) {
      console.log("c");
  });
*/
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
$(function() {
  return;
  ncmb.User.login(username, password)
    .then(function(user) {
      var Comment = ncmb.DataStore("Comment");
      Comment.equalTo("objectId", "8IiBSttkFYmyKG3G")
        //.order("score", true)
        .fetchAll().then(function(results) {
          console.log("Successfully retrieved " + results.length + " scores.");
          for (var i = 0; i < results.length; i++) {
            var object = results[i];
            console.log(object.content + " - " + object.get("contributor"));
          }
        }).catch(function(err) {
          console.log(err);
        });
    })
    .catch(function(err) {
      console.log(err);
    });
});