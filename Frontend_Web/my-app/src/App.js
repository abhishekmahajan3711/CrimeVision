import { BrowserRouter, Routes, Route } from "react-router-dom";
import Police_home_page from "./components/Home_page/Police_home_page";
import District_home_page from "./components/Home_page/District_home_page";
import Loading from "./components/Loading/Loading";
import Sign_in from "./components/Sign_in/Sign_in";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "./components/UserContext/UserContext";

function App() {
  return (
    <>
      <UserProvider>
        {/*provides data of authority, district or police*/}
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Loading />}></Route>
            <Route path="/signin" element={<Sign_in />}></Route>
            <Route
              path="/policeHomePage"
              element={<Police_home_page />}
            ></Route>
            <Route
              path="/districtHomePage"
              element={<District_home_page />}
            ></Route>
          </Routes>
        </BrowserRouter>
        <Toaster />
      </UserProvider>
    </>
  );
}

export default App;
