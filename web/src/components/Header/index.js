const Header = () => {
  return (
    <header className="container-fluid d-flex justify-content-end">
      <div className="d-flex align-items-center">
        <div className="text-right mr-3">
          <span className="d-block m-0 p-0">Barbearia Tal</span>
          <small className="m-0 p-0">Plano Gold</small>
        </div>
        <img src="https://avatars.githubusercontent.com/u/101419493?v=4"alt="logo"/>
        <span className="mdi mdi-chevron-down text-white"></span>
      </div>
    </header>
  )
}

export default Header;