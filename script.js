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

// ---Sidebar navigation logic ---
const navlinks = document.querySelectorAll("#navLinks li");

//loop through each nav link
navlinks.forEach((link) => {
  link.addEventListener("click", () => {
    const targetPage = link.getAttribute("data-page");

    //Redirect to selected page
    window.location.href = targetPage;
  });
});

// Automatically highlight the current page
const currentPage = window.location.pathname.split("/").pop();

navlinks.forEach((link) => {
  if (link.getAttribute("data-page") === currentPage) {
    link.classList.add("active");
  } else {
    link.classList.remove("active");
  }
});

// ---Profile Page: fetch, show, edit with custom validation---
document.addEventListener("DOMContentLoaded", () => {
  if (!document.body.classList.contains("profile-page")) return;

  //Elements
  const profileImage = document.getElementById("profileImage");
  const profileName = document.getElementById("profileName");
  const profileBio = document.getElementById("profileBio");

  const editProfileBtn = document.getElementById("editProfileBtn");
  const editProfileForm = document.getElementById("editProfileForm");

  const editName = document.getElementById("editName");
  const editAge = document.getElementById("editAge");
  const editBio = document.getElementById("editBio");
  const editLocation = document.getElementById("editLocation");
  const editInterests = document.getElementById("editInterests");

  //Move to next input when pressing enter
  editBio.addEventListener("keydown", (e) => {
    //if enter is pressed without shift, go to next field
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      editLocation.focus();
    }
  });

  //Load saved photo (from upload page) if its there
  const savedPhoto = localStorage.getItem("userPhoto");
  if (savedPhoto) profileImage.src = savedPhoto;

  //Load saved profile data (if theres any)
  const savedProfile = localStorage.getItem("everAfterProfile");
  if (savedProfile) {
    try {
      const p = JSON.parse(savedProfile);
      if (p.name) profileName.textContent = `${p.name}, ${p.age || ""}`.trim();
      if (p.bio) profileBio.innerHTML = p.bio;
      //prefill edit form
      editName.value = p.name || "";
      editAge.value = p.age || "";
      editBio.value = p.bioPlain || "";
      editLocation.value = p.location || "";
      editInterests.value = p.interests || "";
    } catch (err) {
      console.warn("Error loading profile data:", err);
    }
  } else {
    // if no saved profile, fetch a random user to seed the display
    fetch("https://randomuser.me/api/")
      .then((res) => res.json())
      .then((data) => {
        const user = data.results[0];
        profileName.textContent = `${user.name.first} ${user.name.last}, ${user.dob.age}`;
        //a set bio placeholder
        profileBio.textContent =
          "I love art and connection, I'm looking for my happily ever after!";
      })
      .catch((err) => console.error("RandomUser API error:", err));
  }

  //Toggle edit form visibility
  editProfileBtn.addEventListener("click", () => {
    editProfileForm.classList.toggle("hidden");
    //focus on the first field when opening
    if (!editProfileForm.classListList.contains("hidden")) {
      editName.focus();
    }
  });

  // Custom Validation & Save handler
  editProfileForm.addEventListener("click", () => {
    e.preventDefault();

    //Gathering required inputs inside this form
    const requiredInputs = Array.from(
      editProfileForm.querySelectorAll("[required]")
    );

    //Checking each required field for non-empty trimmed value
    const invalid = requiredInputs.filter((input) => {
      //for textarea/input type=number, we still check trimmed string
      return !(input.value && input.value.toString().trim().length > 0);
    });

    if (invalid.length > 0) {
      alert("Please complete all required fields before saving your profile.");
      invalid[0].focus();
      return;
    }

    //Validation passes, trim values and save
    const name = editName.value.trim();
    const age = editAge.value.trim();
    const bioPlain = editBio.value.trim();
    const location = editLocation.value.trim();
    const interests = editInterests.value.trim();

    //Building HTML for profileBio (keeps line breaks)
    let bioHtml = bioPlain.replace(/\n/g, "<br>");
    if (location) bioHtml += `<br> &#128205 ${escapeHTML(location)}`;
    if (interests) bioHtml += `<br> &#x1F300 ${escapeHTML(interests)}`;

    //Update UI immediately
    profileName.textContent = `${name}, ${age}`;
    profileBio.innerHTML = bioHtml;

    //Save to localStorage so profile persists across reloads
    const profileToSave = {
      name,
      age,
      bio: bioHtml,
      bioPlain,
      location,
      interests,
    };
    localStorage.setItem("everAfterProfile", JSON.stringify(profileToSave));

    //hide the form and give feedback
    editProfileForm.classList.add("hidden");
    //Replaceable
    alert("Profile updated successfully! &#127801");
  });

  //helper to avoid HTML injectionin location/interests
  function escapeHTML(str) {
    return str.replace(
      /[&<>"']/g,
      (m) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }[m])
    );
  }
});
