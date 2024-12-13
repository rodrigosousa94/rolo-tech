import Container from "../../components/container"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

import { db } from "../../services/firebaseConnection"
import { query, collection, getDocs, orderBy, where } from "firebase/firestore"

function Home() {

  interface ItemsProps {
    id: string;
    uid: string;
    name: string;
    model: string;
    stateOption: string;
    city: string;
    price: string | number;
    images: ItemImageProps[];
  }

  interface ItemImageProps {
    name: string;
    uid: string;
    url: string;
  }

  const [items, setItems] = useState<ItemsProps[]>([])
  const [loadImages, setLoadImages] = useState<string[]>([])
  const [input, setInput] = useState("")

  useEffect(() => {
    loadItems()
  },[])

  function loadItems() {
    const itemsRef = collection(db, 'items')
    const queryRef = query(itemsRef, orderBy('created', 'desc'))

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

  function handleImageLoad(id: string){
    setLoadImages((prevImageLoaded) => [...prevImageLoaded, id])
  }

  async function handleSearchItem(){
    if(input == ""){
      loadItems()
      return
    }

    setItems([])
    setLoadImages([])

    const q = query(collection(db, 'items'), where("name", ">=", input.toUpperCase()), where("name", "<=", input.toUpperCase() + "\uf8ff"))

    const querySnapshot = await getDocs(q)

    let listItems = [] as ItemsProps[]

    querySnapshot.forEach((doc) => {
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

  }


    return (
      <Container>
        <section className="w-full max-w-3xl flex items-center justify-center mx-auto bg-white rounded-lg gap-2 p-4">
          <input className="rounded-lg border-2 w-full h-9 outline-none px-3" type="text" placeholder="Faça sua busca..." value={input} onChange={(e) => setInput(e.target.value)}/>
          <button className="bg-[#FF6600] text-white px-8 rounded-lg h-9 font-medium text-xl hover:bg-[#ff6600b9] transition-all" onClick={handleSearchItem}>Buscar</button>
        </section>

        <h1 className="font-bold text-center mt-6 text-2xl mb-4">Hardwares novos e usados em todo o Brasil</h1>

        <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map( item => (
            <Link key={item.id} to={`/item/${item.id}`} >
              <section className="w-full bg-white rounded-lg">
              <div className="w-full h-[18rem] rounded-lg bg-slate-200" style={{ display: loadImages.includes(item.id) ? 'none' : 'block' }}></div>
                  <img 
                    className="w-full h-72 rounded-lg mb-2 hover:scale-105 transition-all cursor-pointer object-contain p-2" 
                    src={item.images[0].url}
                    alt="produto-image"
                    onLoad={() => handleImageLoad(item.id)}
                    style={{ display: loadImages.includes(item.id) ? 'block' : 'none' }}
                  />

                <p className="font-bold mt-1 mb-2 px-2">{item.name} - {item.model}</p>
                <div className="flex flex-col px-2">
                  <span className="text-zinc-700 mb-6">{item.stateOption}</span>
                  <strong className="text-black font-medium text-xl">R${item.price}</strong>
                  <div className="w-full h-px bg-slate-200 my-2"></div>
                  <div className="px-2 pb-2">
                    <span className="text-zinc-700 ">{item.city}</span>
                  </div>
                </div>
             </section>
            </Link>
          ))}
        </main>
      </Container>
    )
  }
  
  export default Home
   