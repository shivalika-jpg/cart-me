const backendBaseURL = "http://localhost:5000"; // adjust if needed

document.getElementById("loginBtn").addEventListener("click", async () => {
  const username = document.getElementById("username").value;  // use username instead
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`${backendBaseURL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token); // save auth token
      window.location.href = "./home.html"; // redirect to cart page
    } else {
      document.getElementById("authMessage").innerText = data.message || "Login failed.";
    }
  } catch (err) {
    document.getElementById("authMessage").innerText = "Something went wrong.";
  }
});


document.getElementById("registerBtn").addEventListener("click", async () => {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`${backendBaseURL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }), // send username too
    });

    const data = await res.json();

    if (res.ok) {
      document.getElementById("authMessage").innerText = "Registered successfully. You can now log in.";
    } else {
      document.getElementById("authMessage").innerText = data.message || "Registration failed.";
    }
  } catch (err) {
    document.getElementById("authMessage").innerText = "Something went wrong.";
  }
});
