import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoggedHome from "./pages/LoggedHome";
import UserProfile from "./pages/UserProfile";
import Header from "./components/Header";
import PostDetails from "./pages/PostDetails";
import { Container } from "react-bootstrap";
import AddPost from "./pages/AddPost";
import AddAuthor from "./pages/AddAuthor";
import GoogleCallback from "./components/GoogleCallback";
import Login from "./pages/Login";
import GuestsRoutes from "./components/GuestsRoutes";
import ProtectedRoutes from "./components/ProtectedRoutes";
import { AuthProvider } from "./contexts/authContext";
import ScrollToTop from "./components/ScrollToTop";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Header />
        <Container>
          <Routes>
            {/* l'unica rotta pubblica è login/register */}
            <Route element={<GuestsRoutes />}>
              <Route path="/login" element={<Login />} />
              <Route path="/auth/google-callback" element={<GoogleCallback />} />
              <Route path="/auth/register" element={<AddAuthor />} />
            </Route>
            <Route element={<ProtectedRoutes />}>
              <Route path="/" element={<LoggedHome />} />
              <Route path="/posts/:id" element={<PostDetails />} />
              <Route path="/posts/add-post" element={<AddPost />} />
              <Route path="/posts/edit-post/:id" element={<AddPost />} />
              <Route path="/me" element={<UserProfile isMe={true} />} />
              <Route path="/me/edit" element={<AddAuthor isEdit={true} />} />
              <Route path="/authors/:id" element={<UserProfile />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Container>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;



