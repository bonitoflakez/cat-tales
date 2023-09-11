import { useNavigate } from "react-router";

export default function Settings() {
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userData"));
  const username = userInfo?.user;

  if (!username) {
    navigate("/auth");
    return;
  }

  return (
    <>
      <h1>Settings</h1>
      <p>This is a testing page.</p>
    </>
  );
}
