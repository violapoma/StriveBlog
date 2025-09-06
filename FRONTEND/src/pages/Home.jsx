import { Alert, Button, Col, InputGroup, Row } from "react-bootstrap";
import UserPreview from "../components/UserPreview";
import { Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "../../data/axios";
import PostPreview from "../components/PostPreview";

function Home() {

  const [authors, setAuthors] = useState([]); 
  const [posts, setPosts] = useState([]);
  
  const getAuthors = async() => {
    try {
      const res = await axios.get('/authors');
      console.log('authors',res.data);
      setAuthors(res.data);  
    } catch (e) {
      console.log('errore nel recupero degli autori', e)
    }
  }

  const getPosts = async()=>{
    try {
      const res = await axios.get('/posts'); 
      console.log('posts', res.data); 
      setPosts(res.data); 
    } catch (e) {
      console.log('errore nel recuper dei post', e);
    }
  }

  useEffect(()=>{
    getAuthors();
    getPosts();
  }, []);

  return (
    <>

      <section className="mt-3 p-4 rounded-3">              
        {
          posts && <Row >
            { posts.map(post => (
              <Col sm={12} key={post._id} >
                <PostPreview post={post}/>
              </Col>
            ))
            } 
          </Row>
        }
      </section>
      <section className="mt-3 p-4 rounded-3 mb-3">
        <h2>Our top authors:</h2>

        <InputGroup className="mb-3">
          <Form.Control
            placeholder="Browse by author"
            aria-label="Browse by author"
            aria-describedby="browse by author"
          />
          <Button variant="outline-secondary" id="button-addon2">
            <i className="bi bi-search"></i>
          </Button>
        </InputGroup>

        {authors && <Row className="mt-4">
          {authors.map((author) => (
            <Col sm={4} lg={3} key={author._id}>
              <UserPreview profile={author} />
            </Col>
          ))}
        </Row>
        }
      </section>
    </>
  );
}

export default Home;

/**
 * home coi post
 
  const [posts, setPosts] = useState([]); 

  async function getPosts() {
    const resultPosts = await getAll(); 
    setPosts(resultPosts.data);
  }

  useEffect(
    getPosts(), 
    []); 

  return(
   <Container>
  <Row>
    {posts && posts.map(post => (
      <Col key={post.id}>
        <PostPreview post={post} />
      </Col>
    ))}
  </Row>
</Container>
  )
 */
