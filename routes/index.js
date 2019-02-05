const express = require('express');
const { Pool } = require('pg');

const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const moviePageQuery = 'SELECT "title__c", "budget__c", "revenue__c", "release_date__c", "temp_cast__c", overview__c, ( SELECT STRING_AGG("keyword__c"."name", \', \') AS "Keywords" FROM "salesforce"."keyword__c" LEFT OUTER JOIN "salesforce"."moviekeyword__c" ON "keyword__c"."external_id__c" = "moviekeyword__c"."keyword__r__external_id__c" WHERE "moviekeyword__c"."movie__r__external_id__c" = $1 ), ( SELECT STRING_AGG("production_company__c"."name", \', \') AS "companies" FROM "salesforce"."production_company__c" LEFT OUTER JOIN "salesforce"."movieproductioncompany__c" ON "production_company__c"."external_id__c" = "movieproductioncompany__c"."production_company__r__external_id__c" WHERE "movieproductioncompany__c"."movie__r__external_id__c" = $1), (SELECT STRING_AGG("production_country__c"."name", \', \') AS "countries" FROM "salesforce"."production_country__c" LEFT OUTER JOIN "salesforce"."movieproductioncountry__c" ON "production_country__c"."iso_3166_1__c" = "movieproductioncountry__c"."production_country__r__iso_3166_1__c" WHERE "movieproductioncountry__c"."movie__r__external_id__c" = $1),(SELECT STRING_AGG("genre__c"."name", \', \') AS "Genres" FROM "salesforce"."genre__c" LEFT OUTER JOIN "salesforce"."moviegenre__c" ON "genre__c"."external_id__c" = "moviegenre__c"."genre__r__external_id__c" WHERE "moviegenre__c"."movie__r__external_id__c" = $1 )FROM "salesforce"."movie__c" WHERE "external_id__c" = $1';

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
      const movie = qres.rows[0];
      movie.shortCast = [];
      console.log(JSON.parse(movie.temp_cast__c).slice(0, 3));
      movie.previouslyViewedList = [];
      movie.recommendedList = [];
      console.log(movie);
      res.render('movieView', { movie });
    }
  });
});

router.get('/test/moviePage', (req, res, next) => {
  const movie = {
    title__c: 'King Kong',
    overview__c: 'In 1933 New York, an overly ambitious movie producer coerces hiscast and hired ship crew to travel to mysterious Skull Island, where they encounter Kong, a giant ape who is immediately smitten with the leading lady.',
    Keywords: 'exotic island, dinosaur, indigenous, film business, film making,film producer, monster, ship, show business, screenplay',
    companies: 'WingNut Films, Universal Pictures, Big Primate Pictures, MFPV Film',
    countries: 'New Zealand, United States of America, Germany',
    Genres: 'Adventure, Drama, Action',
    budget__c: '3000',
    revenue__c: '4000',
    release_date__c: '2015-06-09',
    shortCast: [
      {
        cast_id: 5,
        character: 'Ann Darrow',
        credit_id: '52fe422ec3a36847f800a19f',
        gender: 1,
        id: 3489,
        name: 'Naomi Watts',
        order: 0
      },
      {
        cast_id: 6,
        character: 'Carl Denham',
        credit_id: '52fe422ec3a36847f800a1a3',
        gender: 2,
        id: 70851,
        name: 'Jack Black',
        order: 1 
      },
      {
        cast_id: 7,
        character: 'Jack Driscoll',
        credit_id: '52fe422ec3a36847f800a1a7',
        gender: 2,
        id: 3490,
        name: 'Adrien Brody',
        order: 2
      }
    ],
    previouslyViewedList: [
      {
        title: 'Godzilla',
        movieID: '12345',
      },
      {
        title: 'Kong: Skull Island',
        movieID: '23456',
      }
    ],
    recommendedList: [
      {
        title: 'Furious 7',
        movieID: '7',
        reason: 'Great Franchise.',
      },
      {
        title: 'Fast 5',
        movieID: '5',
        reason: 'Good movie.',
      },
    ],
    reviewsList: [],
  };
  res.render('movieView', { movie });
});

router.get('/movies/movieList', (req, res, next) => {

});


module.exports = router;
