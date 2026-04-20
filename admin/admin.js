const API = "https://script.google.com/macros/s/AKfycbxGgjW2-E0wwkcNhRdxk8PtelGe3OXmMRM9USaraHtMGRCyn5niukym3Qr5zbHAFAZ5/exec"

async function criarProduto(){
  const data = {
    tipo:"produto",
    nome: nome.value,
    preco: Number(preco.value),
    categoria: categoria.value,
    estoque: Number(estoque.value),
    descricao: descricao.value
  }

  await fetch(API,{
    method:"POST",
    body: JSON.stringify(data)
  })

  alert("Produto criado")
  carregar()
}

async function carregar(){
  const res = await fetch(API)
  const produtos = await res.json()

  const el = document.getElementById("lista")
  el.innerHTML=""

  produtos.forEach(p=>{
    el.innerHTML += `
      <div class="card">
        <b>${p.nome}</b><br>
        R$ ${p.preco}<br>
        Estoque: ${p.estoque}<br>
        ID: ${p.id}
      </div>
    `
  })
}

carregar()

// DRAG UPLOAD
drop.ondragover = e => e.preventDefault()

drop.ondrop = async e=>{
  e.preventDefault()

  const file = e.dataTransfer.files[0]
  const id = idProduto.value

  const form = new FormData()
  form.append("file", file)
  form.append("upload_preset", "ml_padrao")

  const res = await fetch("https://api.cloudinary.com/v1_1/dy61d0gt8/image/upload",{
    method:"POST",
    body:form
  })

  const img = await res.json()

  await fetch(API,{
    method:"POST",
    body: JSON.stringify({
      action:"updateImage",
      id: id,
      img: img.secure_url
    })
  })

  alert("Imagem atualizada")
}
