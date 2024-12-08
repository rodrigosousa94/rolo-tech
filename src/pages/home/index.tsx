import Container from "../../components/container"

function Home() {


    return (
      <Container>
        <section className="w-full max-w-3xl flex items-center justify-center mx-auto bg-white rounded-lg gap-2 p-4">
          <input className="rounded-lg border-2 w-full h-9 outline-none px-3" type="text" placeholder="Faça sua busca..."/>
          <button className="bg-[#FF6600] text-white px-8 rounded-lg h-9 font-medium text-xl hover:bg-[#ff6600b9] transition-all">Buscar</button>
        </section>

        <h1 className="font-bold text-center mt-6 text-2xl mb-4">Hardwares novos e usados em todo o Brasil</h1>

        <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <section className="w-full bg-white rounded-lg">
            < img 
              className="w-full rounded-lg mb-2 max-h-72 hover:scale-105 transition-all cursor-pointer"
              src="https://imageio.forbes.com/specials-images/imageserve/61f13eb5795d7209e9dd1fb1/0x0.jpg?format=jpg&crop=2323,1307,x0,y599,safe&height=900&width=1600&fit=bounds" 
              alt="produto-image"
            />
            <p className="font-bold mt-1 mb-2 px-2">Placa de vídeo RTX 4050 16gb RAM</p>
            <div className="flex flex-col px-2">
              <span className="text-zinc-700 mb-6">NOVO</span>
              <strong className="text-black font-medium text-xl">R$1600.00</strong>
              <div className="w-full h-px bg-slate-200 my-2"></div>
              <div className="px-2 pb-2">
                <span className="text-zinc-700 ">Rio de Janeiro - RJ</span>
              </div>
            </div>
          </section>
          
        </main>
      </Container>
    )
  }
  
  export default Home
   