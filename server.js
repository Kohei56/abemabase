const express = require('express');
const router = express.Router();
const app = express();

//Basic認証
const auth = require('./auth');
router.use(auth);

//MongoDB モデルの読み込み
const model = require('./model');
const abema = model.abema;

const bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({ extended: true}))
router.use(express.static('public'));

app.engine('ejs', require('express-ejs-extend'));
app.set('view engine', 'ejs');


router.get("/", (req, res) => {
  //ランダムでx件表示
   abema.aggregate([{$sample: {size:10}}], (err, meta) => {
      res.render('index', { meta: meta})
   });
});

router.get('/search', (req, res) => {

  //クエリが空の場合 Erroページへ
  if ( !req.query.q ){
    const reason = 'キーワードを１つ以上入力してね。';
    return res.render('error', { reason: reason})
  }

  const target = req.query.t
  const regexPattern = regexMaker(req.query.q)
  const value = new RegExp(regexPattern, "i")

  const query = {};
  query[target] = value;

  abema.find(query, (err, meta) => {
    res.render('list', { meta: meta, target:req.query.t, value:req.query.q})
  });
});

router.get('/detail/*', (req, res) => {
  const query = req.params[0]

  abema.find({_id: query}
    , (err, meta) => {
    res.render('detail', { meta: meta})
  });
});

router.get('/tag/*', (req, res) => {
  const tag = req.params[0]

  abema.find({tag: tag}
    , (err, meta) => {
    res.render('list', { meta: meta, tag:tag})
  });
});

function regexMaker(q){
  //全角スペースを半角に
  q = q.replace(/　/g," ");
  queries = q.split(' ');

  regexPattern =''
  queries.forEach((value, index, queries) => {
      if(value === "") {
        return;
      }

      regexPattern += `(?=.*${value})`

  });

  return regexPattern
}

app.use('/abemabase', router);

const port = process.env.PORT || 2500;
app.listen(port);
console.log(`Server is started on port ${port}`);
