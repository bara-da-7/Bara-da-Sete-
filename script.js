function doPost(e){
  try{
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("produtos");

    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.nome || '',
      data.preco || '',
      data.categoria || '',
      data.estoque || '',
      data.descricao || '',
      data.ativo || 'sim',
      data.promocao || 'nao',
      data.precoPromo || '',
      data.imagem || ''
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({status:"ok"})
    ).setMimeType(ContentService.MimeType.JSON);

  }catch(err){
    return ContentService.createTextOutput(
      JSON.stringify({status:"erro", erro:err})
    );
  }
}
