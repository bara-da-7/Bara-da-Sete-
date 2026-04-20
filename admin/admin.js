const CONFIG = {
  API_URL: "https://script.google.com/macros/s/AKfycbxGgjW2-E0wwkcNhRdxk8PtelGe3OXmMRM9USaraHtMGRCyn5niukym3Qr5zbHAFAZ5/exec",
  CLOUDINARY_UPLOAD_URL: "https://api.cloudinary.com/v1_1/dy61d0gt8/upload",
  CLOUDINARY_PRESET: "ml_padrao"
};

async function uploadImage(file){
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CONFIG.CLOUDINARY_PRESET);

  const res = await fetch(CONFIG.CLOUDINARY_UPLOAD_URL,{
    method:"POST",
    body: formData
  });

  const data = await res.json();
  return data.secure_url;
}

async function addProduct(){
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const stock = document.getElementById("stock").value;
  const file = document.getElementById("file").files[0];

  const img = await uploadImage(file);

  await fetch(CONFIG.API_URL,{
    method:"POST",
    body: JSON.stringify({
      action:"addProduct",
      name,
      price,
      stock,
      img
    })
  });

  alert("Produto salvo!");
}
