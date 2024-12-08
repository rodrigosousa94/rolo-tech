import { FiUser, FiLogIn } from "react-icons/fi"
import Logo from '../../assets/logo-att.png'
import { Link } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../../contexts/AuthContext"

function Header() {

  const {signed, loading} = useContext(AuthContext)

    return (
      <div className="w-full flex items-center justify-center h-16 bg-blue-400 text-white mb-4 drop-shadow">
        <header className="w-full max-w-7xl flex items-center justify-between px-4 mx-auto">
          <Link to='/'>
            <img style={{width: '80px'}} src={Logo} />
          </Link>

        {!loading && signed && (
          <div className="border-2 rounded-full p-1 border-white">
            <Link to='/dashboard'>
              <FiUser size={24} color="#fff"/>
            </Link>
          </div>
        )}

        {!loading && !signed && (
          <div className="border-2 rounded-full p-1 border-white">
            <Link to='/dashboard'>
              <FiLogIn size={24} color="#fff"/>
            </Link>
          </div>
        )}

        </header>
      </div>
    )
  }
  
  export default Header
   