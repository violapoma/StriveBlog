# ![Logo StriveBlog](/FRONTEND/src/assets/logo-cat.svg)
# Frontend e Backend 


## Table of contents
* [Models](#models)
* [Routers](#routers)
* [App](#app)
* [AuthContext](#authcontext)
## Models
* **Author**<br>
{<br>
  nome: {type: String, required: true, trim: true}, <br>
  cognome: {type: String, trim: true},<br>
  email: {type: String, required: true, unique: true, trim: true},<br>
  dataDiNascita: {type: String}, <br>
  avatar: {type: String, default: 'https://res.cloudinary.com/dm9gnud6j/image/upload/v1757176661/nopicuser_puf2bd.png'},<br>
  password: {type: String, minlength: 6, select: false}, <br>
  googleId: String<br>
}<br>
* **Post**<br>
  {<br>
  category: {type: String, required: true},<br>
  title: {type: String, required: true}, <br>
  cover: {type: String, default: 'https://res.cloudinary.com/dm9gnud6j/image/upload/v1757097390/noimg_tl6gzb.jpg'},<br>
  readTime: {<br>
    value: {<br>
      type: Number,<br>
      validator: Number.isInteger, <br>
    },<br>
    unit: String,<br>
  },<br>
  author: {type: Schema.Types.ObjectId, ref: 'Author'}, <br>
  content: {type: String, required: true},<br>
  comments: [CommentScheme] <br>
}, {timestamps: true}<br><br>
  **qui abbiamo l'author collegato tramite referencing, mentre i commenti sono embedded** <br><br>
  {<br>
  text: {type: String, required: true},<br>
  author: {type: Schema.Types.ObjectId, ref: 'Author'}<br>
  }, {timestamps: true})<br>
## Routers
* **authRouter** - _rotte per registrazione e login_ <br><br>
  * **authRouter.post("/register", registerFieldsMw, register);**<br>
  si occupa della registrazione di un utente su database, quindi non tramite google; il middleware registerFieldsMw controlla che il campo password e dataDiNascita siano presenti
  solo per questo tipo di registrazione<br>
  * **authRouter.post("/login", login);**<br>
  si occupa di gestire la login come utente normale (non proveniente da google)
  * **authRouter.get("/login-google", passport.authenticate("google", { scope: ["profile", "email"] }));**<br>
  si occupa di recuperare i dati dell'utente che si sta loggando con google
  * authRouter.get("/google-callback", passport.authenticate("google", { session: false }), redirectToMe);**<br>
  si occupa di tornare al mio sito dopo aver preso i dati da google<br><br>
* **profileRouter** - _rotte per gestire l'utente loggato_ <br><br>
  * **profileRouter.get("/", authMW, getMe);**<br>
    restituisce i dati dell'utente loggato, mi permette di mantere uno stato con l'utente loggato, senza dover fare tutte le volte che mi serve una chiamata al database
  * **profileRouter.put("/edit", authMW, edit);**<br>
    gestisce la modifica dei dati dell'utente
  * **profileRouter.patch("/edit/avatar",authMW,uploadAvatar.single("avatar"),addAvatar);**<br>
    gestisce l'aggiunta e la modifica dell'avatar dell'utente con upload su claudinary
  * **profileRouter.delete("/", authMW, deleteMe);**
    gestisce la cancellazione dell'utente, insieme a tutti i suoi post e ai suoi commenti<br><br>
* **authorsRouter** - _rotte per gestire tutti gli utenti_
  * **authorsRouter.get('/', getAll);**<br>
    restituisce i quattro autori più popolari, ovvero con più commenti sotto ai loro post; a parità di numero di commenti, li restituisce in ordine per nome.
    Filtro direttamente su database usando __aggregate()__, che mi permette di fare la "join" di più collection e di applicare più filtri, tra cui $add e $map.
  * **authorsRouter.get('/:id', validateId ,get);**<br>
    restituisce un solo utente<br>
  * **authorsRouter.get('/:id/posts', validateId, getAuthorPosts);**<br>
    restitisce i post di un singolo utente <br><br>
* **postsRouter** - _rotte per la gestione dei post del blog_<br>
  * **postsRouter.get('/', getAll);**<br>
    recupera tutti i post (e li manda in ordine popolarità e, a parità di questo, di data) o i post da cercare (tramite title). Anche qui ho usato _aggregate()_ per filtrare i post più
    popolari, cioè quelli con più commenti.<br>
  * **postsRouter.post('/', authMW, validatePost, add);** <br>
    crea un post <br>
  * **postsRouter.get('/:id', validateId, get);** <br>
    recupera un post
  * **postsRouter.put('/:id', authMW, validateId, validatePost, edit);** <br>
    modifica un post
  * **postsRouter.patch('/:id/cover', authMW, validateId, uploadCover.single('cover'), addCover);** <br>
    aggiunge e modifica la cover di un post, con upload su cloudinary (in una cartella diversa rispetto a quella degli avatar)
  * **postsRouter.delete('/:id', authMW, validateId, remove);** <br>
    elimina un post<br><br>
* **commentsRouter** - _gestisce i commenti di un post_<br>
  * classica CRUD con getOne, getAll, edit, add, delete.
<br><br>

## App 
- _struttura del progetto lato frontend_ <br><br>
L'applicativo è costruito in modo da obbligare l'utente a loggarsi, le uniche pagine che potrà visitare come utente guest sono la login e la register.<br><br>
![struttra progetto](/FRONTEND/src/assets/struttraStriveBlog.png)
## AuthContext 
- _gestisce l'utente loggato lato frontend_ <br><br>
Contiene lo stato per il token e per l'utente loggato; tutta App è wrappata dentro a questo componente in modo che si possa accedere alle informazioni di loggedUser in qualsiasi momento.<br> Contiene inoltre le funzioni login e logout. Rispettivamente, _login(token)_ si occupa di settare il token nel localStorage e di navigare alla home dell'utente loggato, mentre _logout()_ elimina la voce token dal localStorage, setta loggedUser a null e riporta alla pagina di login.
<br><br>
[Torna su](#frontend-e-backend)