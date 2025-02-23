import React, { useState, useEffect } from 'react'
import { Modal, Form, Button } from 'react-bootstrap'

function CreateAccountModal({ show, fetchAccounts, onHide }) {
  const [createShow, setCreateShow] = useState(false)

  useEffect(() => {
    setCreateShow(show)
  }, [show])

  const [form, setForm] = useState({
    accountName: '',
    accountType: '',
    customerEmail: '',
    customerName: '',
    customerPhone: '',
  })
  const [validated, setValidated] = useState(false)
  const [errors, setErrors] = useState({})

  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    })
  }

  const closeCreateShow = () => {
    onHide()
    setCreateShow(false)
    setForm({
      accountName: '',
      accountType: '',
      customerEmail: '',
      customerName: '',
      customerPhone: '',
    })
    setValidated(false)
    setErrors({})
  }

  const validateForm = () => {
    const newErrors = {}
    if (!form.accountName) newErrors.accountName = 'Account name is required'
    if (!form.accountType) newErrors.accountType = 'Account type is required'
    if (form.accountType === 'Customer') {
      if (!form.customerName) newErrors.customerName = 'Customer name is required'
      if (!form.customerEmail) newErrors.customerEmail = 'Customer email is required'
      if (!form.customerPhone) newErrors.customerPhone = 'Customer phone is required'
    }
    if (form.accountType === 'Admin') {
      if (!form.customerEmail) newErrors.customerEmail = 'Admin email is required'
    }
    return newErrors
  }

  const createAccount = async () => {

    console.log(form)
    debugger

    fetch('http://localhost:8080/accounts/admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    })
      .then((response) => {
        if (response.ok) {
          fetchAccounts()
        } else {
          console.error('Failed to create the account')
        }
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }

  const handleCreate = (e) => {
    e.preventDefault()

    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      e.stopPropagation()
    } else {
      createAccount()
      closeCreateShow()
    }
  }
  return (
    <Modal show={createShow} onHide={() => closeCreateShow()}>
      <Modal.Header closeButton>
        <Modal.Title>Create Modal</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated} onSubmit={handleCreate} id="createForm">
          <Form.Group className="m-2">
            <Form.Label>Account name</Form.Label>
            <Form.Control
              required
              type="text"
              onChange={(e) => setField('accountName', e.target.value)}
              placeholder="Account name"
              name="accountName"
              value={form.accountName}
              isInvalid={!!errors.accountName}
            />
            <Form.Control.Feedback type="invalid">{errors.accountName}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="m-2">
            <Form.Label>Account type</Form.Label>
            <Form.Select
              required
              name="accountType"
              onChange={(e) => setField('accountType', e.target.value)}
              className="bg-body text-dark border-secondary"
              value={form.accountType}
              isInvalid={!!errors.accountType}>
              <option value="">Select account type</option>
              <option value={'Admin'}>Admin</option>
              <option value={'Customer'}>Customer</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.accountType}</Form.Control.Feedback>
          </Form.Group>
          {form.accountType == 'Customer' ? (
            <>
              <Form.Group className="m-2">
                <Form.Label>Customer name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  onChange={(e) => setField('customerName', e.target.value)}
                  placeholder="Customer name"
                  name="accountPassword"
                  value={form.accountPassword}
                  isInvalid={!!errors.accountPassword}
                />
                <Form.Control.Feedback type="invalid">{errors.accountPassword}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="m-2">
                <Form.Label>Customer Email</Form.Label>
                <Form.Control
                  required
                  type="email"
                  onChange={(e) => setField('customerEmail', e.target.value)}
                  placeholder="Customer email"
                  name="customerEmail"
                  value={form.customerEmail}
                  isInvalid={!!errors.customerEmail}
                />
                <Form.Control.Feedback type="invalid">{errors.customerEmail}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="m-2">
                <Form.Label>Customer Phone</Form.Label>
                <Form.Control
                  required
                  type="text"
                  onChange={(e) => setField('customerPhone', e.target.value)}
                  placeholder="Customer phone"
                  name="customerPhone"
                  value={form.customerPhone}
                  isInvalid={!!errors.customerPhone}
                />
                <Form.Control.Feedback type="invalid">{errors.customerPhone}</Form.Control.Feedback>
              </Form.Group>
            </>
          ) : null}
          {form.accountType == 'Admin' ? (
            <>
              <Form.Group className="m-2">
                <Form.Label>Admin Email</Form.Label>
                <Form.Control
                  required
                  type="email"
                  onChange={(e) => setField('customerEmail', e.target.value)}
                  placeholder="Email"
                  name="email"
                  value={form.customerEmail}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">{errors.customerEmail}</Form.Control.Feedback>
              </Form.Group>
            </>
          ) : null}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => closeCreateShow()}>
          Close
        </Button>
        <Button type="submit" variant="primary" form="createForm">
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default CreateAccountModal
