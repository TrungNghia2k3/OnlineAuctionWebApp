import { useContext, useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table'
import { Container } from 'reactstrap'
import userApi from '../../../api/user'
import { AuthContext } from '../../../contexts/AuthContext'
import Button from '../../molecules/buttons/button'
import Template from '../../templates/default/no-separation-template'
import './style.scss'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const { currentUser } = useContext(AuthContext)
  let token = null
  let role = null
  let userId = null
  if (currentUser) {
    token = currentUser.token
    role = currentUser.role
    userId = currentUser.id
  }

  useEffect(() => {
    if (token && role === 2) {
      const fetchUserList = async () => {
        try {
          const userList = await userApi.GetAllUser(token)
          setUsers(userList)
        } catch (error) {
          console.error('Error fetching user list:', error)
        }
      }
      fetchUserList()
    }
  }, [token, role])

  const refreshListView = (newData) => {
    const { id, isActive } = newData

    const updatedList = users.map((row) => {
      if (row.id === id) {
        return { ...row, isActive }
      }
      return row
    })

    setUsers(updatedList)
  }

  const handleSwitchChange = async (user) => {
    const updateData = user
    updateData.isActive = !updateData.isActive
    await userApi.update(updateData, token)
    refreshListView(updateData)
  }

  const content = (
    <>
      <Container fluid>
        <Table striped className='table-user'>
          <thead>
            <tr>
              <th>#</th>
              <th>UserName</th>
              <th>Role</th>
              <th>Email</th>
              <th>Fullname</th>
              <th>Phone</th>
              <th>Address</th>
              <th className='active-button-user-management'>Active</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              if (user.id !== userId) {
                return (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.role === 0 ? 'Buyer' : user.role === 1 ? 'Seller' : 'Admin'}</td>
                    <td>
                      <p className='email-text'>{user.email}</p>
                    </td>
                    <td>
                      <p className='fullname-text'>{user.fullName}</p>
                    </td>
                    <td>{user.phoneNumber}</td>
                    <td>
                      <p className='address-text'>{user.address}</p>
                    </td>
                    <td className='active-button-user-management'>
                      <Button
                        className='button-lock-user'
                        iconPath={user.isActive === true ? 'images/lock-fill.svg' : 'images/unlock-fill.svg'}
                        variant={user.isActive === true ? 'primary' : 'success'}
                        text={user.isActive === true ? 'Lock Account' : 'Unlock Account'}
                        onClick={() => handleSwitchChange(user)}
                        type='submit'
                      />
                    </td>
                  </tr>
                )
              }
            })}
          </tbody>
        </Table>
      </Container>
    </>
  )

  return (
    <Template headerIcon={'images/iconnav/person-circle.svg'} headerTitle={'User management page'} content={content} />
  )
}

export default UserManagement
