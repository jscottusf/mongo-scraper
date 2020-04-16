const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../models");

module.exports = function (app) {
  app.get("/scrape", function (req, res) {
    axios.get("https://www.npr.org").then(function (response) {
      let $ = cheerio.load(response.data);
      $("article").each(function (i, element) {
        var result = {};
        result.title = $(element)
          .children(".story-wrap")
          .find("a")
          .children(".title")
          .text();

        result.link = $(element).children(".story-wrap").find("a").attr("href");

        result.img = $(element)
          .children(".story-wrap")
          .find(".imagewrap")
          .find(".img")
          .attr("src");

        result.teaser = $(element)
          .children(".story-wrap")
          .find("a")
          .find(".teaser")
          .text();

        result.topic = $(element)
          .children(".story-wrap")
          .find(".slug")
          .find("a")
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
    res.redirect("/");
  });

  app.put("/api/favorites/:id", function (req, res) {
    console.log(req.body);
    db.Article.findOneAndUpdate(
      { _id: req.params.id },
      { favorite: req.body.favorite }
    ).then(function (err) {
      if (err) {
        res.send(err);
      } else {
        console.log("success");
      }
    });
  });
};
