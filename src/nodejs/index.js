// @ts-check
// http://localhost:3000/2015-09-01/script/page_history.js

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const apiVersion = '/2015-09-01';
const servicePath = '/script';

// 読み込んだスクリプトをハンドラーとして定義
const execScriptNames = ['page_history.js'];
execScriptNames.forEach(execScriptName => {
  app.get(
    apiVersion + servicePath + '/' + execScriptName,
    require('./' + execScriptName)
  );
});

// expressでサーバーを起動
app.listen(3000, function() {
  console.log('app listening on port 3000');
});
