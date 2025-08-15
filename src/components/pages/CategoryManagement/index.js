import { useFormik } from 'formik'
import { useContext, useEffect, useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import Table from 'react-bootstrap/Table'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import CategoryApi from '../../../api/category'
import { errorMessages } from '../../../common'
import { AuthContext } from '../../../contexts/AuthContext'
import Badge from '../../atoms/badge'
import Input from '../../atoms/forms/input'
import Label from '../../atoms/forms/label'
import Button from '../../molecules/buttons/button'
import ProtectedRoute from '../../protected-route'
import Template from '../../templates/default/horizontal-2-separations-template'
import './style.scss'

const CategoryManagement = () => {
  const [categories, setCategories] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [showBadge, setShowBadge] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBadge(false)
    }, 3000)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  const navigate = useNavigate()
  const { currentUser } = useContext(AuthContext)
  let token = null
  let role = null
  if (currentUser) {
    token = currentUser.token
    role = currentUser.role
  }
  useEffect(() => {
    if (token && role === 2) {
      const getListItem = async () => {
        const result = await CategoryApi.getAllCategory(token, role)
        setCategories(result)
      }
      getListItem()
    }
  }, [token, role])

  const handleButtonEditClick = (category) => {
    formik.setValues(category)
  }

  const formik = useFormik({
    initialValues: {
      id: 0,
      name: '',
      role: 0,
      description: '',
      isActive: true,
    },
    validationSchema: yup.object().shape({
      id: yup.number(),
      name: yup
        .string()
        .required(errorMessages.name.required)
        .trim()
        .test('unique-name', errorMessages.name.isValid, function (value) {
          return !categories.some(
            (category) =>
              category.name.toLocaleLowerCase().trim() === value.toLocaleLowerCase().trim() &&
              category.id !== this.parent.id,
          )
        }),
      role: yup.number(),
      description: yup.string(),
      isActive: yup.bool(),
    }),
  })
  const refreshListView = (newData) => {
    const { id, name, description, isActive } = newData

    const updatedList = categories.map((row) => {
      if (row.id === id) {
        return { ...row, name, description, isActive }
      }
      return row
    })

    setCategories(updatedList)
  }
  const handleSaveChange = async () => {
    const data = formik.values
    data.role = role
    if (data.id) {
      const result = await CategoryApi.update(data, token)
      if (!result) {
        setErrorMessage('Fail to save category')
        return
      }
      refreshListView(data)
      formik.resetForm()
    } else {
      const result = await CategoryApi.create(data, token)
      categories.push(result)
      formik.resetForm()
    }
  }

  const handleChangeUpdate = async (category) => {
    const data = category
    data.isActive = !data.isActive
    data.role = role
    const result = await CategoryApi.update(data, token)
    if (result) {
      refreshListView(result)
    }
  }

  const top = (
    <>
      {' '}
      <Row>
        <Row>
          <Col xs={3}>
            <Label text='Category Name' />
            <Input
              placeholder='Enter a category name'
              name='name'
              value={formik.values.name}
              onChange={formik.handleChange}
              isValid={formik.touched.name && !formik.errors.name}
              isInvalid={formik.errors.name}
            />
            <Form.Control.Feedback type='invalid'>{formik.errors.name}</Form.Control.Feedback>
          </Col>
          <Col xs={3}>
            <Label text='Description' />
            <Input
              placeholder='Enter a description'
              name='description'
              value={formik.values.description}
              onChange={formik.handleChange}
            />
          </Col>
          <Col>
            <Label text='Set active' />
            <Form.Check
              type='switch'
              onChange={formik.handleChange}
              checked={formik.values.isActive}
              name='isActive'
              className='mt-2'
            />
          </Col>
        </Row>
        <Col>{showBadge && <Badge text={errorMessage} variant='danger' />}</Col>
      </Row>
    </>
  )
  const middle = (
    <>
      <div className={'button-save-edit-category'}>
        <Button
          text='Refresh'
          iconPath='images/refresh.svg'
          className='button-refresh-category'
          onClick={() => formik.resetForm()}
        />
        <Button
          variant='success'
          text='Save Changes'
          iconPath='images/save.svg'
          onClick={handleSaveChange}
          type='submit'
          disabled={!(formik.isValid && formik.dirty)}
        />
      </div>
    </>
  )
  const bottom = (
    <>
      <Table striped className='table-category'>
        <thead>
          <tr>
            <th>#</th>
            <th>Category Name</th>
            <th>Description</th>
            <th>Active</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.name}</td>
              <td>
                <p className='description-text'>{category.description}</p>
              </td>
              <td>
                <Form>
                  <Form.Check type='switch' checked={category.isActive} onChange={() => handleChangeUpdate(category)} />
                </Form>
              </td>
              <td>
                <Button
                  iconPath='images/edit.svg'
                  variant='primary'
                  text='Edit'
                  onClick={() => handleButtonEditClick(category)}
                  className={'btn-action btn-edit-category'}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )

  return (
    <>
      <ProtectedRoute />
      <Form noValidate onSubmit={formik.handleSubmit}>
        <Template
          headerIcon={'images/list-solid.svg'}
          headerTitle={'Categories management'}
          top={top}
          middle={middle}
          bottom={bottom}
        />
      </Form>
    </>
  )
}

export default CategoryManagement
