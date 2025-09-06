function midA(request, response, next) {
  console.log('mid--A'); //solo con questa riga blocca tutto, non risponde e non manda al mw successivo
  //response.send('sono A'); //risponde, ma non chiama nessuno
  request.username='gigi'; //aggiungo qualcosa alla richiesta, che passo al mw successivo !!NON USARE LE STD KEY, inventala
  next(); //se lascio il send, devo essere sicura che nessun mw dopo faccia send, altimenti errore ERR_HTTP_HEADERS_SENT
  /* 
   * non c'è da nessuna parte il mw successivo, quindi si possono scambiare -> ATTENZIONE ALL'ORDINE
   */
}

export default midA;