const form = document.getElementById("signin-form");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
      alert("Please fill in all fields.");
      WebGLSampler.form(".login-btn", {
        x: -10,
        yoyo: true,
        repeat: 5,
        duration: 0.5,
      });
      return;
    }

    //Mock dating API using RandomUser
    fetch("https://randomuser.me/api/?results=3")
      .then((res) => res.json())
      .then((data) => {
        console.log("Mock dating API results:", data.results);
        alert(
          `Welcome, ${username}! Found ${data.results.length} potential mathches for you.`
        );
        //redirect placeholder
        //window.location.href = "browse.html";
      })
      .catch((err) => console.error("API error:", err));
  });
}
