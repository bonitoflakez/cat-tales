import axios from "axios";

const handleSubmit = async (
  e,
  isLogin,
  username,
  email,
  password,
  navigate
) => {
  e.preventDefault();

  const apiUrl = isLogin
    ? "http://localhost:8000/api/auth/login"
    : "http://localhost:8000/api/auth/signup";

  const data = isLogin ? { username, password } : { username, email, password };

  try {
    const response = await axios.post(apiUrl, data);

    if (response.data.authStatus === "authorized") {
      const token = response.data.token;

      const userData = {
        user_token: token,
        user_name: username,
        user_id: response.data.user_id,
      };

      localStorage.setItem("userData", JSON.stringify(userData));

      navigate("/");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

export { handleSubmit };
