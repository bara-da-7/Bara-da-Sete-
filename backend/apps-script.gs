function doGet(e){
  const action = e.parameter.action;

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  if(action=="getProducts"){
    const sheet = ss.getSheetByName("products");
    const data = sheet.getDataRange().getValues();

    const result = data.slice(1).map(r=>({
      id:r[0],
      name:r[1],
      price:r[2],
      img:r[3],
      stock:r[4]
    }));

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if(action=="getDashboard"){
    const sheet = ss.getSheetByName("orders");
    const data = sheet.getDataRange().getValues();

    let total = 0;

    data.slice(1).forEach(r=>{
      const cart = JSON.parse(r[3]);
      cart.forEach(p=>{
        total += p.price * p.qtd;
      });
    });

    return ContentService.createTextOutput(JSON.stringify({
      totalPedidos: data.length-1,
      faturamento: total
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e){
  const body = JSON.parse(e.postData.contents);
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  if(body.action=="addProduct"){
    const sheet = ss.getSheetByName("products");
    sheet.appendRow([Date.now(), body.name, body.price, body.img, body.stock]);
  }

  if(body.action=="createOrder"){
    const orders = ss.getSheetByName("orders");
    const products = ss.getSheetByName("products");

    orders.appendRow([new Date(), body.nome, body.fone, JSON.stringify(body.cart)]);

    const data = products.getDataRange().getValues();

    body.cart.forEach(item=>{
      for(let i=1;i<data.length;i++){
        if(data[i][0] == item.id){
          let estoque = data[i][4];
          products.getRange(i+1,5).setValue(estoque - item.qtd);
        }
      }
    });
  }

  return ContentService.createTextOutput("ok");
}
