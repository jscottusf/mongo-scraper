const axios = require('axios');
const cheerio = require('cheerio');
const db = require('../models');

module.exports = function (app) {
  //scrape npr homepage and store data in MongoDB
  app.get('/scrape', function (req, res) {
    axios.get('https://www.npr.org').then(function (response) {
      let $ = cheerio.load(response.data);
      $('article').each(function (i, element) {
        var result = {};
        //story title
        result.title = $(element)
          .children('.story-wrap')
          .find('a')
          .children('.title')
          .text();

        //link
        result.link = $(element).children('.story-wrap').find('a').attr('href');

        //image
        result.img = $(element)
          .children('.story-wrap')
          .find('.imagewrap')
          .find('.img')
          .attr('src');

        //story teaser
        result.teaser = $(element)
          .children('.story-wrap')
          .find('a')
          .find('.teaser')
          .text();

        //story topic
        result.topic = $(element)
          .children('.story-wrap')
          .find('.slug')
          .find('a')
          .text()
          .trim();

        //if any of these are void, just drop it...
        if (
          result.title &&
          result.link &&
          result.img &&
          result.teaser &&
          result.topic
        ) {
          //add to DB
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

    //using ()=> allows this to work properly by only doing the redirect after half a second to cheerio can finish
    setTimeout(() => res.redirect('/'), 500);
  });

  //find all of the articles
  app.get('/api/articles', function (req, res) {
    db.Article.find({})
      .populate('note')
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

  //edit article to add to favorities
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

  //delete an article from main page
  app.delete('/api/articles/:id', function (req, res) {
    db.Article.findById({ _id: req.params.id })
      .then(dbArticle => dbArticle.remove())
      .then(dbArticle => res.json(dbArticle))
      .catch(err => res.status(422).json(err));
  });

  //make a note on the articles
  app.post('/api/articles/:id', function (req, res) {
    console.log(req.body);
    var note = new db.Note(req.body);
    note.checkName();
    db.Note.create(note).then(function (dbNote) {
      db.Article.findOneAndUpdate(
        { _id: req.params.id },
        //pushing into an array
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
