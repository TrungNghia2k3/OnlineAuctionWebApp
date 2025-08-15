import { useContext, useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import RatingApi from '../../../api/rating'
import { AuthContext } from '../../../contexts/AuthContext'
import Template from '../../templates/default/no-separation-template'
import './style.scss'

const ReportRating = () => {
  const [listRating, setListRating] = useState([])

  const { currentUser } = useContext(AuthContext)
  let token = null
  if (currentUser) {
    token = currentUser.token
  }

  useEffect(() => {
    if (token) {
      const getListRatings = async () => {
        const result = await RatingApi.getAllRating(token)
        setListRating(result)
      }
      getListRatings()
    }
  }, [token])

  const content = (
    <>
      <Table striped className='table-item'>
        <thead>
          <tr>
            <th>Top Rating</th>
            <th>Full Name</th>
            <th>Role</th>
            <th>Average Of Score</th>
          </tr>
        </thead>
        <tbody>
          {listRating.map((rating, index) => (
            <tr key={rating.id}>
              <td>Top {index + 1}</td>
              <td>{rating.name}</td>
              <td>{rating.role}</td>
              <td>{rating.averageOfScore}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )
  return (
    <>
      <Template headerIcon='images/chart.svg' headerTitle='User Leaderboard' content={content} />
    </>
  )
}

export default ReportRating
