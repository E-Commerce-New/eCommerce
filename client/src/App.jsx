import {BrowserRouter as Router , Route , Routes} from "react-router-dom";
import LogIn from "./pages/Login"

export default function App() {
    return (
        <>
        <Router>
            <Routes>
                <Route path="/" element={<LogIn/>} />
            </Routes>
        </Router>
        </>
    )
}