import './index.scss'

/**
 * Header Organism Component
 * Main navigation header for the application
 */
const Header = () => {
  return (
    <header className="app-header">
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light">
          <a className="navbar-brand fw-bold" href="/">
            🏆 Online Auction
          </a>
          
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <a className="nav-link active" href="/">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/categories">Categories</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/auctions">Auctions</a>
              </li>
            </ul>
            
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="/login">Login</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/register">Register</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header