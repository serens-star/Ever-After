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
        window.location.href = "upload.html";
      })
      .catch((err) => console.error("API error:", err));
  });
}

// ---Photo Upload Page ---
const uploadForm = document.getElementById("uploadForm");
const photoInput = document.getElementById("photoInput");
const previewImage = document.getElementById("previewImage");
const uploadStatus = document.getElementById("uploadStatus");

if (uploadForm) {
  //Preview uploaded photo
  photoInput.addEventListener("change", () => {
    const file = photoInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImage.src = e.target.result;
        uploadStatus.textContent = "Your photo has been successfully uploaded!";
        localStorage.setItem("userPhoto", e.target.result);
      };
      reader.readAsDataURL(file);
    }
  });

  uploadForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Photo upload successfully!");
    window.location.href = "profile.html";
  });
}

// ---Profile Page ---
if (document.body.classList.contains("profile-page")) {
  const profileImage = document.getElementById("profileImage");
  const savedPhoto = localStorage.getItem("userPhoto");

  if (savedPhoto) {
    profileImage.src = savedPhoto;
  }

  // Mock user info from API
  fetch("https://randomuser.me/api/")
    .then((res) => res.json())
    .then((data) => {
      const user = data.results[0];
      const name = `${(user.name, first)} ${user.name.last}`;
      const age = user.dob.age;

      document.getElementById("profileName").textContent = `${name}, ${age}`;
      document.getElementById("profileBio").textContent = `${
        user.gender === "female"
          ? "Lover of art and music"
          : "Adventurer at heart"
      } looking for love &#127775.`;
    })
    .catch((err) => console.error("API Error:", err));
}
