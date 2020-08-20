/* eslint-disable arrow-body-style */
const { Router } = require('express');

require('../db/database');
const {
  saveReview,
  getUser,
  findTopReviews,
  updateLikeInReview,
  updateHasRatedInReview,
  updateDislikeInReview,
  saveOrFindWebUrl,
  saveOrFindKeyWord,
  findArticleByKeyWord,
  getUserReviews,
} = require('../db/database');
const { rest } = require('lodash');

const uploadImage = require('./upload');

const reviewRoute = Router();
let changer = '';
reviewRoute.get('/url', (req, res) => {
  saveOrFindWebUrl(changer)
    .then((data) => {
      console.log(data.dataValues.id, 'this is data ofcourse');
      findTopReviews({ where: { id_web: data.dataValues.id } })
        .then((ddata) => {
          console.log('I AM DEHDDJDSK', ddata);
          res.send(ddata);
        })
        .catch((err) => console.error(err));
    })
    .catch((err) => console.error(err));
});

reviewRoute.post('/url', (req, res) => {
  changer = req.body.weburl;
  console.log(changer, 'here I am in time');
  res.end();
});

// Keyword is the keyword to search by
reviewRoute.get('/retrieve/:keyword', (req, res) => {
  const { keyword } = req.params;
  findArticleByKeyWord(keyword)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

reviewRoute.get('/retrieve', (req, res) => {
  findTopReviews(req.query.userId)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

/**
 * Uploads an image to our bucket use formData to send a file
 * @param {File} file the file you want to upload
 * @returns {String} the url to the uploaded file
 */
reviewRoute.post('/upload', (req, res) => {
  if (req.user) {
    const fileToUpload = req.file;
    uploadImage(fileToUpload)
      .then((url) => {
        console.log('I AM THE URL', url)
        res.status(201).send({ url });
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  } else {
    res.status(401).send(null);
  }
});

// Saves a review and its keywords to the db (user and url saved to db in db file)
reviewRoute.post('/submit', (req, res) => {
  if (req.user) {
    getUser(req.user).then((data) => {
      const {
        text,
        title,
        weburl,
        keyword,
        rating,
        photourl,
        id
      } = req.body;
      return saveReview(
        data.dataValues.username,
        title,
        text.message,
        weburl,
        keyword,
        rating,
        photourl,
        id
      )
        .then((data) => {
          const keywords = keyword
            .toLowerCase()
            .split(', ')
            .map((chunk) => {
              return chunk.split(',');
            })
            .flat();
          const saveKeywords = keywords.map((keyword) => {
            return saveOrFindKeyWord(keyword, data.dataValues.id);
          });
          return Promise.all(saveKeywords);
        })
        .then(() => {
          res.status(201);
          res.send('review POST');
        });
    });
  } else {
    res.status(401);
    res.send('unauthorized');
  }
});
reviewRoute.put('/update/:type', (req, res) => {
  if (req.params.type === 'type=like') {
    updateLikeInReview(req.body.reviewId)
      .then(() => {
        console.log('review updated!');
        res.status(204);
        res.end();
      })
      .catch((err) => {
        console.error(err);
      });
  } else if (req.params.type === 'type=hasRated') {
    updateHasRatedInReview(req.body.reviewId)
      .then(() => {
        console.log('hasRated updated');
        res.status(204);
        res.end();
      })
      .catch((err) => {
        console.error(err);
      });
  } else {
    updateDislikeInReview(req.body.reviewId).then(() => {
      console.log('review updated!');
      res.status(204);
      res.end();
    });
  }
});

module.exports = {
  reviewRoute,
};
