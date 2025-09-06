function middErr1(error, request, response, next) {
  if (error.status) //perché è chiamato con next({status:404})
    response.status(404).send({'message':'not found'}); 
} 
export default middErr1; 