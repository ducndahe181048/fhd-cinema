import React, { useState, useEffect, useContext } from 'react'
import { Modal, Form, Button } from 'react-bootstrap'
import { SeatContext } from '../context/SeatContext'

function UpdateSeatModal({ seatId, show, fetchSeats, onHide }) {
  const { state } = useContext(SeatContext)

  const [updateShow, setUpdateShow] = useState(false)

  const [form, setForm] = useState({ seatName: '', seatType: 0 })
  const [validated, setValidated] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setUpdateShow(show)
  }, [show])

  // setForm by seatId
  useEffect(() => {
    if (seatId) {
      const seat = state.seats.find((seat) => seat.seatId === seatId)
      setForm(seat)
    }
  }, [seatId])

  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    })
  }
  const validateForm = () => {
    const newErrors = {}
    if (!form.seatName) newErrors.seatName = 'Seat name is required'
    if (!form.seatType) newErrors.seatType = 'Seat type is required'
    if (!form.seatPassword && !form.seatId) newErrors.seatPassword = 'Seat password is required'
    return newErrors
  }

  const closeUpdateShow = () => {
    onHide()
    setUpdateShow(false)
    setForm({ seatName: '', seatType: '' })
    setValidated(false)
    setErrors({})
  }

  const handleUpdate = (e) => {
    e.preventDefault()

    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      e.stopPropagation()
    } else {
      const { seatId, seatPassword, ...updateData } = form
      fetch(`http://localhost:8080/seats/${seatId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })
        .then((response) => {
          if (response.ok) {
            fetchSeats()
          } else {
            console.error('Failed to update the seat')
          }
        })
        .catch((error) => {
          console.error('Error:', error)
        })
      setUpdateShow(false)
      onHide()
      setForm({ seatName: '', seatType: '' })
      setErrors({})
    }
    setValidated(true)
  }
  return (
    <Modal show={updateShow} onHide={() => closeUpdateShow()}>
      <Modal.Header closeButton>
        <Modal.Title>Update Modal</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated} onSubmit={handleUpdate} id="updateForm">
          <Form.Group className="m-2">
            <Form.Label>Seat name</Form.Label>
            <Form.Control
              required
              type="text"
              onChange={(e) => setField('seatName', e.target.value)}
              placeholder="Seat name"
              name="seatName"
              value={form.seatName}
              isInvalid={!!errors.seatName}
            />
            <Form.Control.Feedback type="invalid">{errors.seatName}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="m-2">
            <Form.Label>Seat type</Form.Label>
            <Form.Select
              required
              name="seatType"
              onChange={(e) => setField('seatType', Number(e.target.value))}
              className="bg-body text-dark border-secondary"
              value={form.seatType}
              isInvalid={!!errors.seatType}>
              <option value="">Select seat type</option>
              <option value={1}>Customer</option>
              <option value={2}>Staff</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.seatType}</Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => closeUpdateShow()}>
          Close
        </Button>
        <Button variant="primary" type="submit" form="updateForm">
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default UpdateSeatModal