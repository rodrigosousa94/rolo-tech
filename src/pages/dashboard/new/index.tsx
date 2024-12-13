import { FiTrash, FiUpload } from "react-icons/fi"
import Container from "../../../components/container"
import DashboardHeader from "../../../components/panelheader"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Input from "../../../components/input"
import { ChangeEvent, useContext, useState } from "react"
import { AuthContext } from "../../../contexts/AuthContext"
import {v4 as uuidV4} from 'uuid'
import { storage, db } from "../../../services/firebaseConnection"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { addDoc, collection } from "firebase/firestore"

import toast from "react-hot-toast"

const schema = z.object({
  name: z.string().min(1, "campo obrigatório"),
  model: z.string().min(1, "campo obrigatório"),
  stateOption: z.string().refine((value) => value !== "Selecione", {
    message: "Por favor, selecione um opção válida"
  }),
  price: z.string().min(1, "campo obrigatório"),
  city: z.string().min(1, "campo obrigatório"),
  whatsapp: z.string().min(1,"campo obrigatório").refine((value) => /^(\d{11,12})$/.test(value)),
  description: z.string().min(1,"campo obrigatório")
})

type FormData = z.infer<typeof schema>

interface ImageItemProps {
  uid: string;
  name: string;
  previewUrl: string;
  url: string;
}




function New() {

  const { user } = useContext(AuthContext)

  const [itemImages, setItemImages] = useState<ImageItemProps[]>([])

  const {register, handleSubmit, formState: { errors }, reset} = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange"
  })

  function onSubmit(data: FormData){
    if(itemImages.length === 0) {
      toast.error("Insira a imagem do produto!")
      return
    }

    const itemListImages = itemImages.map((item) => {
      return{
        uid: item.uid,
        name: item.name,
        url: item.url
      }
    })

    addDoc(collection(db, 'items'), {
      name: data.name.toUpperCase(),
      model: data.model.toUpperCase(),
      stateOption: data.stateOption,
      price: data.price,
      city: data.city,
      whatsapp: data.whatsapp,
      description: data.description,
      created: new Date(),
      owner: user?.name,
      uid: user?.uid,
      images: itemListImages,

    })
    .then(() => {
      reset()
      setItemImages([])
      toast.success("Item Cadastrado!")
    }).catch((error) => {
      console.log(error)
    })

  }

  async function handleFile(e: ChangeEvent<HTMLInputElement>){
    if(e.target.files && e.target.files[0]){
      const image = e.target.files[0]

      if(image.type === 'image/jpeg' || image.type === 'image/png'){
      await handleUpload(image)
        
      }else{
        toast.error("Envie somente imagens no formato .jpeg ou .png")
        return
      }

    }
  }

  async function handleUpload(image: File){
    const currentUid = user?.uid

    if(!currentUid){
      return
    }

    const uidImage = uuidV4()

    const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`)

    uploadBytes(uploadRef, image)
    .then(async (snapshot) => {
      console.log("Erro snapshot", snapshot)
      await getDownloadURL(snapshot.ref).then((downloadUrl) => {

        console.log("Erro downloadURL" , downloadUrl);
        

        const imageItem = {
          name: uidImage,
          uid: currentUid,
          previewUrl: URL.createObjectURL(image),
          url: downloadUrl,
        }

        console.log("imageItem: ", imageItem);
        

        setItemImages((images) => [...images, imageItem])
      })
    }).catch((error) => {
      console.log(error)
    })
  }

  
  async function handleDeleteImage(item: ImageItemProps){
    const imagePath = `images/${item.uid}/${item.name}`

    const imageRef = ref(storage, imagePath)

    try{
      await deleteObject(imageRef)

      setItemImages(itemImages.filter((itemImg) => itemImg.url !== item.url))
    }catch(err){
      console.log(err)
      alert("Erro ao deletar, tente novamente!")
    }
  }


    return (
      <Container>
        <DashboardHeader/>

        <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
          <button className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32">
            <div className="absolute cursor-pointer">
              <FiUpload size={30} color="#000"/>
            </div>
            <div className="cursor-pointer">
              <input className="opacity-0 cursor-pointer" type="file" accept="image/*" onChange={handleFile}/>
            </div>
          </button>

          {itemImages.map((item) => (
            <div key={item.name} className="w-full h-32 flex items-center justify-center relative">
              <button  className="absolute" onClick={() => handleDeleteImage(item)}>
                <FiTrash size={28} color="#fff"/>
              </button>
              <img src={item.previewUrl} className="rounded-lg w-full h-32 object-cover" alt="img-item"/>
            </div>
          ))}

        </div>

        <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row mt-3">

          <form className="w-full" onSubmit={handleSubmit(onSubmit)}>

            <div className="mb-3">
              <p className="mb-2 font-medium">Nome do item</p>
              <Input type="text" name="name" register={register} error={errors.name?.message} placeholder="Ex: Placa de Video RTX 3060"/>
            </div>
            <div className="mb-3">
              <p className="mb-2 font-medium">Modelo</p>
              <Input type="text" name="model" register={register} error={errors.model?.message} placeholder="Ex: Zotac 8Gb"/>
            </div>

              
        
            <div className="w-full flex flex-row gap-4 items-center mb-3">

              <div className="w-full">
                <p className="font-medium mb-2">Estado de uso</p>
                <select className=" block w-full border-2 border-zinc-900 rounded-md h-9" {...register("stateOption")} name="stateOption" id="stateOption">
                  <option value="Selecione">---</option>
                  <option value="Novo">Novo</option>
                  <option value="Usado">Usado</option>
                </select>
                {errors.stateOption && <p className="mb-1 text-red-500">{errors.stateOption.message}</p>}
              </div>

              <div className="w-full">
                <p className="font-medium mb-2">Preço</p>
                <Input type="text" name="price" register={register} error={errors.price?.message} placeholder="2.000"/>
              </div>

            </div>

            <div className="w-full flex flex-row gap-4 items-center mb-3">

            <div className="w-full">
                <p className="font-medium mb-2">Cidade - Estado</p>
                <Input type="text" name="city" register={register} error={errors.city?.message} placeholder="Duque de Caxias - RJ"/>
            </div>

            <div className="w-full">
                <p className="font-medium mb-2">Telefone/WhatsApp</p>
                <Input type="text" name="whatsapp" register={register} error={errors.whatsapp?.message} placeholder="21980809977"/>
            </div>

            </div>

            <div className="mb-3">
              <p className="mb-2 font-medium">Descrição</p>
              <textarea className=" border-2 w-full rounded-md h-24 px-2" {...register("description")} name="description" id="description" placeholder="Digite a descrição do item"></textarea>
              {errors.description && <p className="mb-1 text-red-500">{errors.description.message}</p>}
            </div>

            <button className="w-full bg-green-600 rounded-md h-9 text-white" type="submit">Cadastrar Item</button>
          </form>

        </div>
      </Container>
    )
  }
  
  export default New
   