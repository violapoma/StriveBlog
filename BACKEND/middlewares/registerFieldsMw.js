export function registerFieldsMw(request, response, next){
  const { nome, cognome, email, password, dataDiNascita } = request.body;
  if(!nome || !cognome || !email || !password || !dataDiNascita)
    return response.status(400).json({message: 'manca uno dei campi obbligatori'});
  next(); 
}