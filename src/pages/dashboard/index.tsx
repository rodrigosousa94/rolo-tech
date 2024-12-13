import Container from "../../components/container"
import DashboardHeader from "../../components/panelheader"
import { FiTrash2 } from "react-icons/fi"
import { useEffect, useState, useContext } from "react"
import { AuthContext } from "../../contexts/AuthContext"
import { collection, getDocs, where, query, deleteDoc, doc } from "firebase/firestore"
import { db, storage} from "../../services/firebaseConnection"

import { ref, deleteObject } from "firebase/storage"

import toast from "react-hot-toast"

function Dashboard() {

  const { user } = useContext(AuthContext)


  interface ItemsProps {
    id: string;
    name: string;
    model: string;
    stateOption: string;
    city: string;
    price: string | number;
    images: ItemImageProps[];
    uid: string;
  }

  interface ItemImageProps {
    name: string;
    uid: string;
    url: string;
  }

  const [items, setItems] = useState<ItemsProps[]>([])


  useEffect(() => {
    function loadItems() {

      if(!user?.uid){
        return
      }

      const itemsRef = collection(db, 'items')
      const queryRef = query(itemsRef, where('uid', '==', user.uid))

      getDocs(queryRef)
      .then((snapshot) => {
        let listItems = [] as ItemsProps[]

        snapshot.forEach(doc => {
          listItems.push({
            id: doc.id,
            name: doc.data().name,
            model: doc.data().model,
            stateOption: doc.data().stateOption,
            city: doc.data().city,
            price: doc.data().price,
            images: doc.data().images,
            uid: doc.data().uid
          })
        })
        setItems(listItems)
        
      })
    }
    loadItems()
  },[user])

  async function handleDeleteItem(item: ItemsProps){

    const itemItem = item

    const docRef = doc(db, 'items', itemItem.id)
    await deleteDoc(docRef)

    itemItem.images.map(async (image: any) => {
      const imagePath = `images/${image.uid}/${image.name}`

      const imageRef = ref(storage, imagePath)

      try{
        await deleteObject(imageRef)
        toast.success("Item Excluido")
        setItems(items.filter( item => item.id !== itemItem.id))
      }catch(error){
        toast.error("Erro ao excluir")
        console.log("deleteObject" + error)
      }
    })

    
  }


    return (
      <Container>
        <DashboardHeader />

        <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {
            items.map((item) => (
              <section key={item.id} className="w-full bg-white rounded-lg relative">
                <button onClick={() => handleDeleteItem(item)} className="absolute bg-white w-14 h-14 rounded-full right-2 top-2 flex justify-center items-center drop-shadow">
                  <FiTrash2 size={26} color="#000"/>
                </button>
                <img className="w-full rounded-lg mb-2 max-h-70" src={item.images[0].url}/>
                <p className="font-bold mt-1 px-2 mb-2">{item.name} - {item.model}</p>
                <div className="flex flex-col px-2">
                  <span className="text-zinc-700">{item.stateOption}</span>
                  <strong className="text-black font-bold mt-4">{item.price}R$</strong>
                </div>
    
                <div className="w-full h-px bg-slate-200 my-2"></div>
                <div className="px-2 pb-2">
                  <span className="text-black">{item.city}</span>
                </div>
            </section>
            ))
          }
        </main>
      </Container>
    )
  }
  
  export default Dashboard
   