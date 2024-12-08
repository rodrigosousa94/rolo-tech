import { signOut } from "firebase/auth"
import { auth } from "../../services/firebaseConnection"
import { Link } from "react-router-dom"

function DashboardHeader(){

    async function handleLogout(){
        await signOut(auth)
    }

return(
    <div className="w-full flex items-center h-10 bg-green-600 rounded-lg text-white font-medium gap-4 px-4 mb-4">
        <Link to='/dashboard'>Dashboard</Link>
        <Link to='/dashboard/new'>Cadastrar Item</Link>
        <button className="ml-auto" onClick={handleLogout}>Sair da conta</button>
    </div>
)
}

export default DashboardHeader