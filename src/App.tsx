import { createBrowserRouter } from "react-router-dom";

import Home from "./pages/home";
import ItemDetail from "./pages/item";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import New from "./pages/dashboard/new";
import Private from './routes/Private'

import Layout from "./components/layout";


const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home/>
      },
      {
        path: '/item:id',
        element: <ItemDetail/>
      },
      {
        path: '/dashboard',
        element: <Private><Dashboard/></Private>
      },
      {
        path: '/dashboard/new',
        element: <Private><New/></Private>
      },
    ]
  },

  {
    path: '/login',
    element: <Login/>
  },
  {
  path: '/register',
  element: <Register/>
}
])
 


export default router