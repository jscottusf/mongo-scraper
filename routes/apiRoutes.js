const axios = require('axios');
const cheerio = require('cheerio');
const db = require('../models');

module.exports = function (app) {
  app.get('/scrape', function (req, res) {
    axios.get('https://www.npr.org').then(function (response) {
      let $ = cheerio.load(response.data);
      $('article').each(function (i, element) {
        var result = {};
        result.title = $(element)
          .children('.story-wrap')
          .find('a')
          .children('.title')
          .text();

        result.link = $(element).children('.story-wrap').find('a').attr('href');

        result.img = $(element)
          .children('.story-wrap')
          .find('.imagewrap')
          .find('.img')
          .attr('src');

        result.teaser = $(element)
          .children('.story-wrap')
          .find('a')
          .find('.teaser')
          .text();

        result.topic = $(element)
          .children('.story-wrap')
          .find('.slug')
          .find('a')
          .text()
          .trim();

        if (
          result.title &&
          result.link &&
          result.img &&
          result.teaser &&
          result.topic
        ) {
          db.Article.create(result)
            .then(function (dbArticle) {
              //console.log(dbArticle);
            })
            .catch(function (err) {
              console.log(err);
            });
        }
      });
    });
    setTimeout(() => res.redirect('/'), 500);
    //res.redirect('/');
  });

  //find all of the articles
  app.get('/api/articles', function (req, res) {
    db.Article.find({})
      .then(function (data) {
        //send back a response containing the data in json format
        res.json(data);
        //if error, return error
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  //find a specific article by their id and associate comments
  app.get('/api/articles/:id', function (req, res) {
    db.Article.findOne({ _id: req.params.id })
      .populate('note')
      .then(function (data) {
        res.json(data);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  app.get('/api/articles/:id', function (req, res) {
    db.Article.findOneAndUpdate(
      { _id: req.params.id },
      { favorite: req.body.favorite }
    )
      .populate('note')
      .then(function (err, results) {
        if (err) {
          res.send(err);
        } else {
          res.json(results);
        }
      });
  });

  app.put('/api/articles/:id', function (req, res) {
    console.log(req.body);
    db.Article.findOneAndUpdate(
      { _id: req.params.id },
      { favorite: req.body.favorite }
    )
      .populate('note')
      .then(function (err) {
        if (err) {
          res.send(err);
        } else {
          console.log('success');
        }
      });
  });

  app.post('/api/articles/:id', function (req, res) {
    console.log(req.body);
    var note = new db.Note(req.body);
    note.checkName();
    db.Note.create(note).then(function (dbNote) {
      db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { note: dbNote._id } },
        { new: true }
      )
        .then(function (data) {
          res.json(data);
        })
        .catch(function (err) {
          res.json(err);
        });
    });
  });
};
