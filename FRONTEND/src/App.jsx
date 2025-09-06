import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import UserProfile from "./pages/UserProfile";
import Header from "./components/Header";
import PostDetails from "./pages/PostDetails";
import { Container } from "react-bootstrap";
import AddPost from "./pages/AddPost";
import { LoggedUserContext } from "./contexts/loggedUserContext";
import AddAuthor from "./pages/AddAuthor";

function App() {
  return (
    <BrowserRouter>
        <Header />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/posts/:id" element={<PostDetails />} />
            <Route path="/posts/add-post" element={<AddPost />} />
            <Route path="/posts/edit-post/:id" element={<AddPost />} />
            <Route path="/authors/:id" element={<UserProfile />} />
            <Route path="/authors/add-author" element={<AddAuthor />} />
          </Routes>
        </Container>
    </BrowserRouter>
  );
}

export default App;
