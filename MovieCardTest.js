import React, { useContext } from 'react'
import 'antd/dist/reset.css'
import './MovieCard.css'
import { format } from 'date-fns'
import { enGB } from 'date-fns/locale'
import { Rate, Tag } from 'antd'
import { TabContext } from '../TabContext/TabContext'
import { GuestSessionContext } from '../../GuestSessionContext'
import PropTypes from 'prop-types'
import errorPoster from './images/no-poster-found.png'

const useRating = (movie) => {
  const { setMovies } = useContext(TabContext)
  const { movies } = useContext(TabContext)
  const { genres } = useContext(GuestSessionContext)
  const rated = movie.rated || 0 // Default to 0 if rated doesn't exist
  
  const onChangeStar = (number) => {
    const newMovies = [...movies]
    let currentMovieId = movie.id

    if (newMovies.length) {
      newMovies.forEach((item) => {
        if (item.id === movie.id) item['rated'] = number
        return item
      })
    }

    let newRatedMovie = []
    let ratedMovies = JSON.parse(localStorage.getItem('ratedMovies'))

    if (number === 0) {
      if (ratedMovies.length > 0) {
        let indx = ratedMovies.findIndex((obj) => obj.id === currentMovieId)
        ratedMovies = [...ratedMovies.slice(0, indx), ...ratedMovies.slice(indx + 1)]
        localStorage.setItem('ratedMovies', JSON.stringify(ratedMovies))
        setMovies(newMovies)
      } else {
        localStorage.setItem('ratedMovies', JSON.stringify([]))
        setMovies(newMovies)
      }
    } else {
      newRatedMovie[0] = movie
      newRatedMovie[0]['rated'] = number

      if (ratedMovies) {
        let indx = ratedMovies.findIndex((obj) => obj.id === movie.id)
        if (indx >= 0) {
          ratedMovies[indx]['rated'] = number
          localStorage.setItem('ratedMovies', JSON.stringify(ratedMovies))
          setMovies(newMovies)
        } else {
          ratedMovies = [...ratedMovies, ...newRatedMovie]
          localStorage.setItem('ratedMovies', JSON.stringify(ratedMovies))
          setMovies(newMovies)
        }
      } else {
        ratedMovies[0] = newRatedMovie[0]
        localStorage.setItem('ratedMovies', JSON.stringify(ratedMovies))
        setMovies(newMovies)
      }
    }
  }
    return [rated, onChangeStar]
  }

  const MovieCard = ({ movie }) => {
    const { activeTab } = useContext(TabContext)
    const { genres } = useContext(GuestSessionContext)
    const genresArray = getGenres()
  
    const [ratedStars, onChangeStar] = useRating(movie)
  
    const getGenres = () => {
      const { genre_ids } = movie
      if (movie && genre_ids && genres) {
        const genres_array = genre_ids.map((id) => {
          const genre = genres.find((obj) => obj.id === id)
          return genre ? genre.name : null
        })
        return genres_array
      } else return null
    }
    let ratedStars = 0
    if (activeTab === 0) {
      movies.forEach((item) => {
        if (item.id === movie.id) ratedStars = item['rated']
        return item
      })
    }
  
    if (activeTab === 1) ratedStars = movie['rated']
  
    const genresArr = getGenres()
    
      const { title, overview, release_date, poster_path, vote_average, genre_ids } = movie
      const posterUrl = poster_path ? 'https://image.tmdb.org/t/p/w185/' + poster_path : errorPoster
      const releaseDate = release_date ? format(new Date(release_date), 'MMMM dd, yyyy', { locale: enGB }) : null
      let descriptionLines = ''
      let circleColorRate = ''
      if (vote_average <= 3) circleColorRate = 'border-bad'
      if (vote_average > 3 && vote_average <= 5) circleColorRate = 'border-good'
      if (vote_average > 5 && vote_average <= 7) circleColorRate = 'border-best'
      if (vote_average > 7) circleColorRate = 'border-genius'
      if (title.length > 19) descriptionLines = 'clamp--four'
      if (title.length > 35) descriptionLines = 'clamp--three'
      if (title.length > 50) descriptionLines = 'clamp--two'
      if (title.length > 19 && genre_ids.length > 3) descriptionLines = 'clamp--three'
      if (title.length > 35 && genre_ids.length > 3) descriptionLines = 'clamp--two'
      if (title.length > 50 && genre_ids.length > 3) descriptionLines = 'clamp--one'
    
      return (
        <>
          {(activeTab === 0 || (activeTab === 1 && movie['rated'] > 0)) && (
            <div className="card">
              <img className="card-poster" src={posterUrl} alt={title} />
              <div className="card-info">
                <div className={`circle ${circleColorRate}`}>{vote_average.toFixed(1)}</div>
                <div className="card-title">{title}</div>
                {genresArr && (
                  <div className="genres">
                    {genresArr.map((genreItem, index) => {
                      return <Tag key={index}>{genreItem}</Tag>
                    })}
                  </div>
                )}
                <div className="card-date">{releaseDate}</div>
                <div className={`card-description ${descriptionLines}`}>{overview}</div>
                <Rate className="rate" count={10} value={ratedStars} onChange={onChangeStar} />
              </div>
            </div>
          )}
        </>
      )
    }
    // }
    
    // MovieCard.contextType = TabContext
    
    MovieCard.propTypes = {
      movie: PropTypes.object,
    }
    
  // export default MovieCard
