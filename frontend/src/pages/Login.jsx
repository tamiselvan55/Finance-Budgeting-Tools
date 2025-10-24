const handleSubmit = (e) => {
  e.preventDefault();

  // Get stored users
  const users = JSON.parse(localStorage.getItem("users") || "[]");

  const foundUser = users.find(
    (u) => u.username === username && u.password === password
  );

  if (foundUser) {
    login(foundUser.username);
    navigate("/dashboard");
  } else {
    alert("Invalid username or password");
  }
};
