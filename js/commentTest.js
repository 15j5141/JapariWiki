var appKey = "73214ee5293b310aba334aaf6b58cb41cb89873a1eb88ab505fa7d48dcc2b911";
var clientKey = "79d3a32839ef780c0fe16236d8efc7bdd338312ec1d969945346a181ffc9442f";
var ncmb = new NCMB(appKey, clientKey);
var user = new ncmb.User();
username = 'commenter';
password = 'commenter';
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
ncmb.User.login(username, password)
  .then(function(user) {
    /*
    var Comment = ncmb.DataStore("Comment");
    var comment = new Comment();
    comment.set("content", "コンテンツ")
      .set("contributor", "19j5000")
      .save()
      .then(function(gameScore) {
        console.log("zz1");
      })
      .catch(function(err) {
        console.log("zz2");
      });
      */
    var Comment = ncmb.DataStore("Comment");
    Comment.equalTo("objectId", "8IiBSttkFYmyKG3G")
      //.order("score", true)
      .fetchAll()
      .then(function(results) {
        console.log("Successfully retrieved " + results.length + " scores.");
        for (var i = 0; i < results.length; i++) {
          var object = results[i];
          console.log(object.content + " - " + object.get("contributor"));
        }
      })
      .catch(function(err) {
        console.log(err);
      });
  })
  .catch(function(err) {});
