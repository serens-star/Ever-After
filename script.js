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

// --- PROFILE PAGE: save handler that prevents page refresh ---
document.addEventListener("DOMContentLoaded", () => {
  if (!document.body.classList.contains("profile-page")) return;

  // Elements
  const editProfileForm = document.getElementById("editProfileForm");
  if (!editProfileForm) {
    console.error("Edit form not found: #editProfileForm");
    return;
  }

  const saveBtn = editProfileForm.querySelector(".save-btn"); // button in the form
  const editName = document.getElementById("editName");
  const editAge = document.getElementById("editAge");
  const editBio = document.getElementById("editBio");
  const editLocation = document.getElementById("editLocation");
  const editInterests = document.getElementById("editInterests");

  const profileName = document.getElementById("profileName");
  const profileBio = document.getElementById("profileBio");

  // --- Edit Profile Button Handler ---
  const editProfileBtn = document.getElementById("editProfileBtn");
  const profileDisplay = document.getElementById("profileDisplay");
  const profileEditSection = document.getElementById("profileEditSection");
  const editProfileImage = document.getElementById("editProfileImage");
  const profileImage = document.getElementById("profileImage");

  //when user clicks edit profile button
  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", () => {
      //load saved data from localStorage if available
      const saved = JSON.parse(
        localStorage.getItem("everAfterProfile") || "{}"
      );
      if (saved.name) editName.value = saved.name;
      if (saved.age) editAge.value = saved.age;
      if (saved.bioPlain) editBio.value = saved.bioPlain;
      if (saved.location) editLocation.value = saved.location;
      if (saved.interests) editInterests.value = saved.interests;

      //toggle visibility
      profileDisplay.classList.add("hidden");
      profileEditSection.classList.remove("hidden");
    });
  }

  //Handle profile image upload preview
  if (editProfileImage) {
    editProfileImage.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        profileImage.src = reader.result;
        localStorage.setItem("everAfterProfileImage", reader.result);
      };
      reader.readAsDataURL(file);
    });
  }

  //when page loads, show saved image if available
  const savedImage = localStorage.getItem("everAfterProfileImage");
  if (savedImage) profileImage.src = savedImage;

  // --- Prevent Enter from submitting the form prematurely ---
  editProfileForm.addEventListener("keydown", (e) => {
    const tag = e.target.tagName.toLowerCase();

    // Don't interfere if the user is typing inside a textarea
    if (tag === "textarea") return;

    //if enter is pressed inside any input, prevent form submit
    if (e.key === "Enter") {
      e.preventDefault();
      console.log("Prevented early submit on Enter");

      //Move the focus to the next input if it exists
      const formInputs = Array.from(
        editProfileForm.querySelectorAll("input, textarea")
      );
      const currentIndex = formInputs.indexOf(e.target);
      if (currentIndex > -1 && currentIndex < formInputs.length - 1) {
        formInputs[currentIndex + 1].focus();
      }
    }
  });

  // --- SAVE HANDLER ---
  function handleSaveSubmit(e) {
    e.preventDefault(); // stop refresh
    e.stopPropagation();

    // Custom validation (required fields)
    const nameVal = editName.value.trim();
    const ageVal = editAge.value.trim();
    const bioVal = editBio.value.trim();

    if (!nameVal || !ageVal || !bioVal) {
      alert("Please fill in Name, Age and About before saving.");
      if (!nameVal) editName.focus();
      else if (!ageVal) editAge.focus();
      else editBio.focus();
      return;
    }

    // Build display bio HTML
    let bioHTML = bioVal.replace(/\n/g, "<br>");
    if (editLocation.value.trim())
      bioHTML += `<br> ${escapeHTML(editLocation.value.trim())}`;
    if (editInterests.value.trim())
      bioHTML += `<br> Interests: ${escapeHTML(editInterests.value.trim())}`;

    // Update the visual profile immediately
    profileName.textContent = `${nameVal}, ${ageVal}`;
    profileBio.innerHTML = bioHTML;

    // Save structured data to localStorage
    const profileData = {
      name: nameVal,
      age: ageVal,
      bioPlain: bioVal,
      bioHTML,
      location: editLocation.value.trim(),
      interests: editInterests.value.trim(),
    };
    localStorage.setItem("everAfterProfile", JSON.stringify(profileData));
    console.log("[EverAfter] Profile saved to localStorage", profileData);

    //hide form and show profile again
    profileEditSection.classList.add("hidden");
    profileDisplay.classList.remove("hidden");
    alert(" Profile updated!");
  }

  // Attach submit handler
  editProfileForm.addEventListener("submit", handleSaveSubmit);

  // Attach click handler to save button
  if (saveBtn) {
    saveBtn.addEventListener("click", (ev) => {
      ev.preventDefault();
      handleSaveSubmit(ev);
    });
  }

  // Helper to escape user text
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

  // Debugging: show saved profile on load (console)
  try {
    const saved = localStorage.getItem("everAfterProfile");
    if (saved)
      console.log("[EverAfter] Loaded saved profile:", JSON.parse(saved));
  } catch (err) {
    console.warn("[EverAfter] Could not parse saved profile:", err);
  }
});
