import { BrowserRouter, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Destinations from "./components/FeaturedDestinations";
import "./index.css";
import About from "./pages/about/About";
import Blogs from "./pages/blogs/Blogs";
import DetailPage from "./pages/blogs/DetailPage";
import Contact from "./pages/contact/Contact";
import DestinationsDetailPage from "./pages/destinations/DestinationsDetailPage";
import Home from "./pages/homepage/Home";
import Layout from "./ui/Layout";
import DestinationsPage from "./pages/destinations/DestinationsPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Children of Layout */}
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="blogs" element={<Blogs />} />
            <Route path="blogs/:slug" element={<DetailPage />} />
            <Route path="/destinations" element={<DestinationsPage/>} />
            <Route
              path="/destinations/:slug"
              element={<DestinationsDetailPage />}
            />
            <Route path="/contact" element={<Contact />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
