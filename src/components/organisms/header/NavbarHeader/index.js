import AppRoutes from '../../../../AppRoutes'
import Label from '../../../atoms/Label'
import Button from '../../../molecules/Button'
import Image from '../../../molecules/Rounded'
import './style.scss'

const NavbarHeader = ({ className, role, handleCreateItem, maxIndex, currentUser, handleClick }) => {
  let navbarClasses = 'navbar navbar-expand-lg navbar-library';
  if (className) {
    navbarClasses += ' ' + className;
  }

  return (
    <div className='navbar-menu'>
      <nav className={navbarClasses}>
        <div className="navbar-nav">
          {AppRoutes.map((item) => {
            if (item.isMenu && item.roles.includes(role)) {
              return (
                <div className='header-menu' key={item.name}>
                  <button 
                    className='nav-link text-nowrap btn btn-link' 
                    onClick={() => handleClick(item)}
                  >
                    <span className='span-test'>
                      {item.name === 'notification' && maxIndex > 0 ? (
                        <Label text={maxIndex} className="notification-label-menu" />
                      ) : null}
                      <Image path={item.icon} className="image-children" />
                      {item.title}
                    </span>
                  </button>
                </div>
              )
            }
            return null;
          })}
        </div>
      </nav>
      {currentUser?.role === 1 ? (
        <Button
          type='submit'
          variant='light'
          text='Add Item'
          onClick={handleCreateItem}
          className="button-add-item"
          iconPath='images/square-plus-solid.svg'
        />
      ) : null}
    </div>
  )
}

export default NavbarHeader
