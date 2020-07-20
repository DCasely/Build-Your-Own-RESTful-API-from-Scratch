const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const _ = require('lodash');

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

// =========================================
// REQUEST TARGETING ALL ARTICLES
// =========================================

app
  .route('/articles')

  .get((req, res) => {
    Article.find({}, (err, foundArticles) => {
      err ? res.send(err) : res.send(foundArticles);
    });
  })

  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save((err) => {
      err ? res.send(err) : res.send('Added Articles Successfully');
    });
  })

  .delete((req, res) => {
    Article.deleteMany({}, (err) => {
      err ? res.send(err) : res.send('Successfully Deleted');
    });
  });

// =========================================
// REQUEST TARGETING SPECIFIC ARTICLES
// =========================================

app
  .route('/articles/:articleTitle')

  .get((req, res) => {
    Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
      foundArticle
        ? res.send(foundArticle)
        : res.send('No Articles Found With That Title.');
    });
  })

  .put((req, res) => {
    Article.update(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      (err, results) => {
        err ? res.send(err) : res.send('Successfully UPDATED Article.');
      }
    );
  })

  .patch((req, res) => {
    console.log(req.body);

    Article.update(
      { title: req.params.articleTitle },
      { $set: req.body },
      (err) => {
        err ? res.send(err) : res.send('Successfully UPDATED Article.');
      }
    );
  })

  .delete((req, res) => {
    Article.deleteOne({ title: req.params.articleTitle }, (err) => {
      err ? res.send(err) : res.send('DELETE Successful');
    });
  });

app.listen(process.env.PORT || 3000, function () {
  console.log('Server started on port 3000');
});
