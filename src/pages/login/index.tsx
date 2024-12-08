import { useEffect } from "react"

import Container from "../../components/container"
import logoImg from '../../assets/logo-dark.png'
import Input from "../../components/input"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

import { signInWithEmailAndPassword, signOut } from "firebase/auth"
import { auth } from "../../services/firebaseConnection"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const schema = z.object({
  email: z.string().email("Insira um email válido").min(1, "Este campo é obrigatório"),
  password: z.string().min(1, "Este campo é obrigatório")
})

type FormData = z.infer<typeof schema>

function Login() {

  useEffect(() => {
    async function handleLogout(){
      await signOut(auth)
    }
    handleLogout()
  })

  const navigate = useNavigate()

    const {register, handleSubmit, formState: {errors}} = useForm<FormData>({
      resolver: zodResolver(schema),
      mode: "onChange",
    })

    function onSubmit(data: FormData){
      signInWithEmailAndPassword(auth, data.email, data.password)
      .then(() => {
        alert("Logado com sucesso")
        navigate('/dashboard', {replace: true})
      }).catch((error) => {
        alert("Houve um erro ao logar")
        console.log(error)
      })
    }

    return (
      <Container>
        <div className="w-full flex justify-center items-center min-h-screen flex-col gap-4 ">

          <Link className="mb-6 max-w-sm w-full" to='/'>
            <img className="w-full" src={logoImg} alt="logo"/>
          </Link>

          <form onSubmit={handleSubmit(onSubmit)} className="bg-white max-w-xl w-full rounded-lg p-4">
            
            <div className="mb-3">
              <Input type="email" name="email" placeholder="Digite seu email" error={errors.email?.message} register={register}/>
            </div>
            <div className="mb-3">
              <Input type="password" name="password" placeholder="Digite sua senha" error={errors.password?.message} register={register}/>
            </div>

            <button className="mx-auto w-full bg-blue-400 rounded-md h-9 text-white font-bold text-xl">Acessar</button>
          </form>
          <Link to='/register'>Não possui uma conta ? Cadastre-se aqui!</Link>
        </div>
      </Container>
    )
  }
  
  export default Login
   