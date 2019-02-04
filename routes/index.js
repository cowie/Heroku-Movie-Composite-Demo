const express = require('express');
const { Pool } = require('pg');

const router = express.Router();
const connectionString = process.env.DATABASE_URL;

const pool = new Pool(
  connectionString,
);


pool.on('error', (err, client) => {
  console.error('Unexpected error on idle pg client', err);
  process.exit(-1);
});

/* GET home page. */
router.get('/', (req, res) => {
  const testFilm = {
    title: 'Avatarrr',
    overview: 'This movie was blue and had guns and stuff',
    shortCast: 'Sigorney Weaver, Zoe Saldana?, Mikey Shenanigans',
    genreList: 'Action, Sci Fi, Dances with Wolves',
    keywordList: 'Booms, Blue guys, Bullets',
    productionCompanyList: 'Uh Sony? And like somethign',
    productionCountryList: 'USA!, Pandora Jewelers',
  };

  const previouslyViewedList = 'Dances w Wolves, Ferngully';
  const recommendationList = 'lol like so many movies';
  const reviewsList = '"It Stinks!" - The Critic';


  res.render('index', {
    movie: testFilm,
    previouslyViewedList,
    recommendationList,
    reviewsList,
  });
});

module.exports = router;
