import express, { request, response }  from "express";

const router = express.Router(); //router vuoto

let authors = [
  {
    _id : 1,
    name: 'Viola',
    surname: 'Lalala',
    email: 'violalala@blabla.com',
    birthDate: '16-05-1997',
    avatar: ''
  },
  {
    _id : 2,
    name: 'Viola',
    surname: 'Lalala',
    email: 'violalala@blabla.com',
    birthDate: '16-05-1997',
    avatar: ''
  },
];

//lista autori
router.get('/', (request, response) => {
  response.send({
    data: authors
  })
}); 

//autore singolo
router.get('/:authorID', (request, response) => {
  const authorID = request.params.authorID; 
  console.log('wanted author (id) : ', authorID); 
  const author = authors.find( (author) => author._id == authorID); 
  if (author) 
    response.send(author);
  else
    response.status(404).send({'message': 'author not found'});
});

router.post('/', (request, response) => {
  const body = request.body;
  authors.push(body); 
  response.send(body); 
}); 

router.put('/:authorID', (request, response) => {
  const authorID = parseInt(request.params.authorID);
  const body = request.body; 

  console.log('- author to edit (id):', authorID);
  console.log('-- request body: ', body);

  const idx = authors.findIndex(author => author._id === authorID);
  console.log('--- idx:', idx); 
  if (idx == -1)
    response.status(404).send({'message' : 'author not found'})
  else {
    authors[idx] = body ; 
    response.send(authors[idx]);
  }
});

router.delete('/:authorID', (request, response) => {
  const authorID = parseInt(request.params.authorID);
  const filtered = authors.filter( (author) => author._id != authorID); 

  if (filtered.length == authors ) 
    response.status(404).send({'message':'author not found'});
  else {
    authors = filtered; 
    response.send({'message':`author with ID ${authorID} deleted`})
  } 
});


export default router;

