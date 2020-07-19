const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/wikiDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model('Article', articleSchema);

app.get('/articles', (req, res) => {
  Article.find({}, (err, foundArticles) => {
    err ? res.send(err) : res.send(foundArticles);
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Server started on port 3000');
});
