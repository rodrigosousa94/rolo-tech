import { useEffect, useState } from "react"
import Container  from '../../components/container'
import { FaWhatsapp } from "react-icons/fa"
import { useParams } from "react-router-dom"
import { getDoc, doc } from "firebase/firestore"
import { db } from "../../services/firebaseConnection"
import { useNavigate } from "react-router-dom"



interface ItemProps {
  id: string;
  name: string;
  model: string;
  stateOption: string;
  city: string;
  price: string | number;
  description: string;
  images: ItemImageProps[];
  uid: string;
  created: string;
  owner: string;
  whatsapp: string;
}

interface ItemImageProps {
  uid: string;
  name: string;
  url: string;
}

function ItemDetail() {

  const [item, setItem] = useState<ItemProps>()

  const {id} = useParams()
  const navigate = useNavigate()

  useEffect(() => {

    async function loadItem(){

      if(!id){
        return
      }

      const docRef = doc(db, 'items', id)
      getDoc(docRef)
      .then((snapshot) => {

        if(!snapshot.data()) {
          navigate('/')
        }

        setItem({
          id: snapshot.id,
          name: snapshot.data()?.name,
          model: snapshot.data()?.model,
          stateOption: snapshot.data()?.stateOption,
          city: snapshot.data()?.city,
          price: snapshot.data()?.price,
          description: snapshot.data()?.description,
          images: snapshot.data()?.images,
          uid: snapshot.data()?.uid,
          created: snapshot.data()?.created,
          owner: snapshot.data()?.owner,
          whatsapp: snapshot.data()?.whatsapp
        })
      })
    }

    loadItem()

  },[id])



    return (
      <Container>
         <img src={item?.images[0].url} className="w-full h-96 object-contain"/>

        {item && (
          <main className="w-full bg-white rounded-lg p-6 my-4">
            <div className="flex flex-col sm:flex-row mb-4 items-center justify-between">
              <h1 className="font-bold text-3xl text-black">{item?.name}</h1>
              <h1  className="font-bold text-3xl text-black">R${item?.price}</h1>
            </div>
            <p>{item?.model}</p>

            <div className="flex w-full gap-6 my-4">
              <div className="flex flex-col gap-4">
                <div>
                  <p>Cidade</p>
                  <strong>{item?.city}</strong>
                </div>
                <div>
                  <p>Estado de Conservação</p>
                  <strong>{item?.stateOption}</strong>
                </div>
              </div>
            </div>

            <strong>Descrição</strong>
            <p className="mb-4">{item?.description}</p>
            <strong>Telefone / WhatsApp</strong>
            <p>{item?.whatsapp}</p>

            <a className="bg-green-500 w-full text-white flex items-center justify-center gap-2 my-6 h-11 text-xl rounded-lg font-medium cursor-pointer" target="_blank" href={`https://api.whatsapp.com/send?phone=${item?.whatsapp}&text=Olá, me interessei no ${item?.name}`}>
              Conversar com o vendedor <FaWhatsapp size={26} color="#fff"/>
            </a>
          </main>
        ) }
      </Container>
    )
  }
  
  export default ItemDetail
   