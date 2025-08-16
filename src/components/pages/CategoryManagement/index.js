import { useFormik } from 'formik'
import { useContext, useEffect, useState } from 'react'
import * as yup from 'yup'
import CategoriesApi from '../../../api/categories'
import { errorMessages } from '../../../common'
import { AuthContext } from '../../../contexts/AuthContext'
import Badge from '../../atoms/Badge'
import Input from '../../atoms/Input'
import Label from '../../atoms/Label'
import Button from '../../molecules/Button'
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
        const response = await CategoriesApi.getAllCategory()
        setCategories(response.result)
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
      active: true,
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
      active: yup.bool(),
    }),
  })
  const refreshListView = (newData) => {
    const { id, name, description, active } = newData

    const updatedList = categories.map((row) => {
      if (row.id === id) {
        return { ...row, name, description, active }
      }
      return row
    })

    setCategories(updatedList)
  }
  const handleSaveChange = async () => {
    const data = formik.values
    data.role = role
    if (data.id) {
      const result = await CategoriesApi.update(data, token)
      if (!result) {
        setErrorMessage('Fail to save category')
        return
      }
      refreshListView(data)
      formik.resetForm()
    } else {
      const result = await CategoriesApi.create(data, token)
      categories.push(result)
      formik.resetForm()
    }
  }

  const handleChangeUpdate = async (category) => {
    const data = category
    data.active = !data.active
    data.role = role
    const result = await CategoriesApi.update(data, token)
    if (result) {
      refreshListView(result)
    }
  }

  const top = (
    <>
      {' '}
      <div className='row'>
        <div className='row'>
          <div className='col-3'>
            <Label text='Category Name' />
            <Input
              placeholder='Enter a category name'
              name='name'
              value={formik.values.name}
              onChange={formik.handleChange}
              isValid={formik.touched.name && !formik.errors.name}
              isInvalid={formik.errors.name}
            />
            <div className='invalid-feedback d-block'>{formik.errors.name}</div>
          </div>
          <div className='col-3'>
            <Label text='Description' />
            <Input
              placeholder='Enter a description'
              name='description'
              value={formik.values.description}
              onChange={formik.handleChange}
            />
          </div>
          <div className='col'>
            <Label text='Set active' />
            <div className='form-check form-switch'>
              <input
                className='form-check-input mt-2'
                type='checkbox'
                onChange={formik.handleChange}
                checked={formik.values.active}
                name='active'
              />
            </div>
          </div>
        </div>
        <div className='col'>{showBadge && <Badge text={errorMessage} variant='danger' />}</div>
      </div>
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
      <table className='table table-striped table-category'>
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
                <div className='form-check form-switch'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    checked={category.active}
                    onChange={() => handleChangeUpdate(category)}
                  />
                </div>
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
      </table>
    </>
  )

  return (
    <>
      <ProtectedRoute />
      <form noValidate onSubmit={formik.handleSubmit}>
        <Template
          headerIcon={'images/list-solid.svg'}
          headerTitle={'Categories management'}
          top={top}
          middle={middle}
          bottom={bottom}
        />
      </form>
    </>
  )
}

export default CategoryManagement
