const express = require('express');
const { Pool } = require('pg');

const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const moviePageQuery = 'SELECT "title__c", ( SELECT STRING_AGG("keyword__c"."name", \', \') AS "Keywords" FROM "salesforce"."keyword__c" LEFT OUTER JOIN "salesforce"."moviekeyword__c" ON "keyword__c"."external_id__c" = "moviekeyword__c"."keyword__r__external_id__c" WHERE "moviekeyword__c"."movie__r__external_id__c" = $1 ), ( SELECT STRING_AGG("production_company__c"."name", \', \') AS "Production Companies" FROM "salesforce"."production_company__c" LEFT OUTER JOIN "salesforce"."movieproductioncompany__c" ON "production_company__c"."external_id__c" = "movieproductioncompany__c"."production_company__r__external_id__c" WHERE "movieproductioncompany__c"."movie__r__external_id__c" = $1), (SELECT STRING_AGG("production_country__c"."name", \', \') AS "Production Countries" FROM "salesforce"."production_country__c" LEFT OUTER JOIN "salesforce"."movieproductioncountry__c" ON "production_country__c"."iso_3166_1__c" = "movieproductioncountry__c"."production_country__r__iso_3166_1__c" WHERE "movieproductioncountry__c"."movie__r__external_id__c" = $1),(SELECT STRING_AGG("genre__c"."name", \', \') AS "Genres" FROM "salesforce"."genre__c" LEFT OUTER JOIN "salesforce"."moviegenre__c" ON "genre__c"."external_id__c" = "moviegenre__c"."genre__r__external_id__c" WHERE "moviegenre__c"."movie__r__external_id__c" = $1 )FROM "salesforce"."movie__c" WHERE "external_id__c" = $1';

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

router.get('/movies/:movieID', (req, res, next) => {
  const { movieID } = req.params;

  pool.query(moviePageQuery, [movieID], (err, qres) => {
    if (err) {
      console.log(err.stack);
      res.sendStatus(200);
    } else {
      console.log(qres.rows[0]);
      const { movie } = qres.rows[0];
      movie.overview__c = movie.thing.split('|')[2];
      res.render('movieView', { movie });
    }
  });
});

router.get('/movies/movieList', (req, res, next) => {

});


module.exports = router;
