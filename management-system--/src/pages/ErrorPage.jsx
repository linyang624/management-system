import { useNavigate, useLocation } from "react-router-dom";

function ErrorPage() {
    const navigate = useNavigate();
    const location = useLocation();

    //const message = location.state?.message || "Oops, something went wrong!"
    const message = "Oops, something went wrong!"

    return (
        <div>
            <h2>Error page</h2>
            <p>{message}</p>
            <button onClick={() => navigate("/")}>Go Home</button>
        </div>
    );
}

export default ErrorPage;