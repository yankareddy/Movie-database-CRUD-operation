const express = require('express')
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const dbpath = path.join(__dirname, 'moviesData.db')
const app = express()
app.use(express.json())
let db = null

const initializeDBToServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server is running at http://localhost:3000')
    })
  } catch (e) {
    console.log(`Data Error ${e.message}`)
    process.exit(1)
  }
}

initializeDBToServer()

//API1
app.get('/movies/', async (request, response) => {
  const getMovieQuery = `
  SELECT * FROM 
  movie 
  ORDER BY
  movie_id;`
  const movieArray = await db.all(getMovieQuery)
  response.send(movieArray)
})

//API2
app.post('/movies/', async (request, response) => {
  const movieDetails = request.body
  const {director_id, movie_name, lead_actor} = movieDetails
  const addMovieQuery = `
  INSERT INTO
  movie (director_id, movie_name, lead_actor)
  VALUES
    (
      '${director_id}',
      '${movie_name}',
      '${lead_actor}'
    );`
  const dbResponse = await db.run(addMovieQuery)
  response.send('Movie Successfully Added')
})

//API3
app.get('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const getMovieQuery = `
  SELECT * FROM 
  movie
  WHERE
  movie_id = ${movieId};`
  const movie = await db.get(getMovieQuery)
  response.send(movie)
})

//API4
app.put('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const movieDetails = request.body
  const {director_id, movie_name, lead_actor} = movieDetails
  const updateMovieQuery = `
  UPDATE  
  movie
  SET
    director_id='${director_id}',
    movie_name='${movie_name}',
    lead_actor='${lead_actor}'
  WHERE
  movie_id = ${movieId};`
  const movie = await db.run(updateMovieQuery)
  response.send('Movie Details Updated')
})

//API5
app.delete('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const deleteMovieQuery = `
  DELETE FROM  
  movie
  WHERE
  movie_id = ${movieId};`
  const movie = await db.run(deleteMovieQuery)
  response.send('Movie Removed')
})

//API6
app.get('/directors/', async (request, response) => {
  const getDirectorQuery = `
  SELECT * FROM 
  director;`
  const movieArray = await db.all(getDirectorQuery)
  response.send(movieArray)
})

//API7
app.get('/directors/:directorId/movies/', async (request, response) => {
  const directorId = request.params
  const getDirectorMovieQuery = `
  SELECT * FROM 
  movie
  WHERE
  director_id='${directorId}';`
  const movieArray = await db.get(getDirectorMovieQuery)
  response.send(movieArray)
})
