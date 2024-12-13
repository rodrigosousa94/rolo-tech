import Container from "../../components/container"
import logoImg from '../../assets/logo-dark.png'
import Input from "../../components/input"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "react-router-dom"

import { createUserWithEmailAndPassword, updateProfile, signOut } from "firebase/auth"
import { auth } from "../../services/firebaseConnection"

import { useEffect, useContext } from "react"
import { AuthContext } from "../../contexts/AuthContext"
import { useNavigate } from "react-router-dom"

import toast from "react-hot-toast"

const schema = z.object({
  name: z.string().min(1, "Por favor preencha este campo!"),
  email: z.string().email("Insira um email válido!").min(1, "Por favor preencha este campo"),
  password: z.string().min(1, "Por favor preencha este campo!"),
})

type FormData = z.infer<typeof schema>

function Register() {

  const { handleInfoUser } = useContext(AuthContext)

  useEffect(() => {
    async function handleLogout(){
      await signOut(auth)
    }
    handleLogout()
  },[])

  const navigate = useNavigate()

  const {register, handleSubmit, formState: {errors}} = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  })

  async function onSubmit(data: FormData){
    createUserWithEmailAndPassword(auth, data.email, data.password)
    .then(async (user) => {
      await updateProfile(user.user, {
        displayName: data.name
      })

      handleInfoUser({
        name: data.name,
        email: data.email,
        uid: user.user.uid
      })

      toast.success("Cadastrado com sucesso!")
      navigate('/dashboard', {replace: true})
    }).catch((error) => {
      toast.error("Houve um problema ao cadastrar!")
      console.log(error)
    })
  }

    return (
      <Container>
        <div className="w-full min-h-screen flex justify-center items-center flex-col gap-4">
          <Link to='/' className="w-full max-w-sm mb-6">
            <img className="w-full" src={logoImg} alt="logo"/>
          </Link>
          
          <form className="w-full max-w-xl bg-white rounded-lg" onSubmit={handleSubmit(onSubmit)}>

            <div className="mb-3">
              <Input type="text" placeholder="Digite seu nome" name="name" error={errors.name?.message} register={register}/>
            </div>

            <div className="mb-3">
             <Input type="email" placeholder="Digite seu email" name="email" error={errors.email?.message} register={register}/>
            </div>

            <div className="mb-3">
              <Input type="password" placeholder="Digite sua senha" name="password" error={errors.password?.message} register={register}/>
            </div>
            <button className="mx-auto w-full bg-blue-400 rounded-md h-9 text-white font-bold text-xl">Cadastrar</button>
          </form>
          <Link to='/login'>Já possui uma conta ? Acesse aqui!</Link>
        </div>
      </Container>
    )
  }
  
  export default Register
   