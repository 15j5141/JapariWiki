module.exports = function(req, res) {
  const NCMB = require('ncmb');
  const ncmb = new NCMB(
    '73214ee5293b310aba334aaf6b58cb41cb89873a1eb88ab505fa7d48dcc2b911',
    '79d3a32839ef780c0fe16236d8efc7bdd338312ec1d969945346a181ffc9442f'
  );

  const Page = ncmb.DataStore('Page');
  Page.order('updateDate', true)
    .limit(5)
    .fetchAll()
    .then(function(pages) {
      // データ成型する.
      const results = pages.map(page => {
        return { path: page.path, updateDate: page.updateDate };
      });
      // 応答する.
      res.status(200).json(results);
    })
    .catch(function(error) {
      res.status(500).json({ code: 500, error });
    });
};
