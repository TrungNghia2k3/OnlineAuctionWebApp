import classnames from 'classnames'
import { Nav, Navbar as NavbarLibrary } from 'react-bootstrap'
import AppRoutes from '../../../../AppRoutes'
import Label from '../../../atoms/forms/label'
import Button from '../../../molecules/buttons/button'
import Image from '../../../molecules/images/rounded'
import './style.scss'

const NavbarHeader = ({ className, role, handleCreateItem, maxIndex, currentUser, handleClick }) => {
  var classNamesCombine = classnames({ 'navbar-library': true, ...className })
  return (
    <>
      <div className='navbar-menu'>
        <NavbarLibrary className={classNamesCombine}>
          <Nav>
            {AppRoutes.map((item) => {
              if (item.isMenu && item.roles.includes(role)) {
                return (
                  <div className='header-menu'>
                    <Nav.Link key={item.name} className='text-nowrap'>
                      <span onClick={() => handleClick(item)} className='span-test'>
                        {item.name === 'notification' && maxIndex > 0 ? (
                          <Label text={maxIndex} className={{ 'notification-label-menu': true }} />
                        ) : null}
                        <Image path={item.icon} className={{ 'image-children': true }} />
                        {item.title}
                      </span>
                    </Nav.Link>
                  </div>
                )
              }
            })}
          </Nav>
        </NavbarLibrary>
        {currentUser?.role === 1 ? (
          <Button
            type='submit'
            variant='light'
            text='Add Item'
            onClick={handleCreateItem}
            className={{ 'button-add-item': true }}
            iconPath='images/square-plus-solid.svg'
          />
        ) : null}
      </div>
    </>
  )
}

export default NavbarHeader
