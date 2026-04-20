const CLOUD = {
  cloudName: "dy61d0gt8",
  preset: "ml_padrao"
};

const drop = document.getElementById("drop");

drop.ondragover = e => e.preventDefault();

drop.ondrop = async e => {
  e.preventDefault();

  const file = e.dataTransfer.files[0];
  const id = document.getElementById("id").value;

  if(!file || !id){
    alert("Informe ID e imagem");
    return;
  }

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", CLOUD.preset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD.cloudName}/image/upload`,{
    method:"POST",
    body:form
  });

  const data = await res.json();

  await fetch("SUA_API_AQUI",{
    method:"POST",
    body: JSON.stringify({
      action:"updateImage",
      id,
      img:data.secure_url
    })
  });

  alert("Imagem enviada!");
};
