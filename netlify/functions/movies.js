// allows us to read csv files
let csv = require('neat-csv')

// allows us to read files from disk
let fs = require('fs')

// defines a lambda function
exports.handler = async function(event) {
  // write the event object to the back-end console
  console.log(event)

  // read movies CSV file from disk
  let moviesFile = fs.readFileSync(`./movies.csv`)
  
  // turn the movies file into a JavaScript object, wait for that to happen
  let moviesFromCsv = await csv(moviesFile)

  // write the movies to the back-end console, check it out
  console.log(moviesFromCsv)

  // 🔥 hw6: your recipe and code starts here!
  // define year and genre variables
  let year = event.queryStringParameters.year
  let genre = event.queryStringParameters.genre
  
  // set if criteria to make sure we are passing through year and genre query string parameters
  if (year == undefined || genre == undefined) {
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: `Nope!` // a string of data
    }
  }
  else {
    // create new movie object containing pertinent fields
    let returnValue = {
      numResults: 0,
      movies: []
    }

    // loop through movies, for each one
    for (let i=0; i < moviesFromCsv.length; i++) {
      //store each movie in memory
      let movie = moviesFromCsv[i]

      // ignore results with no genre or run-time
      if (movie.genres !== '\\N' && movie.runtimeMinutes !== '\\N') {
        // create new movies object with necessary criteria
        let moviesObject = {
          title: movie.primaryTitle,
          datePublished: movie.startYear,
          genres: movie.genres
        }
        
      // push the movies object to returnValue.movies array
      returnValue.movies.push(moviesObject)
      }
    }
  
  // add number of listings to object
  returnValue.numResults = moviesFromCsv.length

    // a lambda function returns a status code and a string of data
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: JSON.stringify(returnValue) // a string of data
    }
  }
}