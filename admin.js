const CLOUD={
 cloudName:"dy61d0gt8",
 uploadPreset:"ml_padrao"
};

const API="https://script.google.com/macros/s/AKfycbzJVNHNmRoMNRtBPusHXL04VyphdycYXSGyWMWTgZN0Jv4rf1HLqn7YHtJlPKq8dml8/exec";

async function upload(file){

 const f=new FormData();
 f.append("file",file);
 f.append("upload_preset",CLOUD.uploadPreset);

 const r=await fetch(`https://api.cloudinary.com/v1_1/${CLOUD.cloudName}/image/upload`,{
  method:"POST",
  body:f
 });

 const d=await r.json();
 return d.secure_url;
}
