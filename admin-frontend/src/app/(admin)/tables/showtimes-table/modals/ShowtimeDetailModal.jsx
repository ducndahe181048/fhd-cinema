import React, { useState, useEffect, useContext } from 'react'
import { Modal, Form, Button } from 'react-bootstrap'
import { ShowtimeContext } from '../context/ShowtimeContext'

function ShowtimeDetailModal({ showtimeId, show, onHide }) {
  const { state } = useContext(ShowtimeContext)
  const [detailShow, setDetailShow] = useState(false)
  const [selectedShowtime, setSelectedShowtime] = useState({
    movieId: '',
    screenName: '',
    showtimePrice: '',
    showtimeAt: '',
  })

  useEffect(() => {
    setDetailShow(show)
  }, [show])

  useEffect(() => {
    if (showtimeId) {
      const showtime = state.showtimes.find((showtime) => showtime.showtimeId === showtimeId)
      setSelectedShowtime({
        movieId: showtime.movieId,
        screenName: showtime.screen.screenName,
        showtimePrice: showtime.showtimePrice,
        showtimeAt: showtime.showtimeAt,
      })
    }
  }, [showtimeId])

  const closeDetailShow = () => {
    onHide()
    setDetailShow(false)
    setSelectedShowtime({
      movieId: '',
      screenName: '',
      showtimePrice: '',
      showtimeAt: '',
    })
  }

  return (
    <Modal show={detailShow} onHide={() => closeDetailShow()}>
      <Modal.Header closeButton>
        <Modal.Title>Detail Modal</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form id="detailForm">

          {/* Movie Title */}
          <Form.Group className="m-2">
            <Form.Label>Movie Title</Form.Label>
            <Form.Control readOnly type="text" value={selectedShowtime.movieId} />
          </Form.Group>

          {/* Screen Name */}
          {/* <Form.Group className="m-2">
            <Form.Label>Screen Name</Form.Label>
            <Form.Control readOnly type="text" value={selectedShowtime.screen.screenName} />
          </Form.Group> */}

          {/* Showtime Price */}
          <Form.Group className="m-2">
            <Form.Label>Showtime Price</Form.Label>
            <Form.Control readOnly type="text" value={selectedShowtime.showtimePrice} />
          </Form.Group>

          {/* Showtime At */}
          <Form.Group className="m-2">
            <Form.Label>Showtime At</Form.Label>
            <Form.Control readOnly type="text" value={selectedShowtime.showtimeAt} />
          </Form.Group>

        </Form>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  )
}

export default ShowtimeDetailModal
