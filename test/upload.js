import CloudNCMB from '../src/scripts/class-cloud_ncmb.js';
const nc = new CloudNCMB();
console.log(nc);
(async function() {
  const a = await nc.getFileNames('PNG');
  console.log(a);
  return;
  // nc.ncmb.File.equalTo("mimeType", "text/plain")
  // JSON.stringify({ $regex: '.*PNG.*' })
  const t = nc.ncmb.File.order('createDate', true);
  t._where = { fileName: { $regex: '\\.PNG' } };
  console.log(t);

  t.fetchAll()
    .then(function(files) {
      // 検索後処理
      console.log(files);
    })
    .catch(function(err) {
      // エラー処理
      console.log(err);
    });
})();
