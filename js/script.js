const API_KEY = "pk.a5617e2068395ccb3921dcdc4103c28a";
const BASE_URL = "https://api.locationiq.com/v1/search";

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

// --- ORIGINAL PROFILE PAGE FUNCTIONALITY ---
if (document.body.classList.contains("profile-page")) {
  const profileImage = document.getElementById("profileImage");
  const savedPhoto = localStorage.getItem("userPhoto");

  if (savedPhoto) {
    profileImage.src = savedPhoto;
  }

  // Load and display profile data
  const savedProfile = JSON.parse(
    localStorage.getItem("everAfterProfile") || "{}"
  );
  const savedEnhancedProfile = JSON.parse(
    localStorage.getItem("everAfterUserProfile") || "{}"
  );

  // Use profile data if available
  if (savedProfile.name || savedEnhancedProfile.name) {
    const name = savedProfile.name || savedEnhancedProfile.name;
    const age = savedProfile.age || savedEnhancedProfile.age;
    document.getElementById("profileName").textContent = `${name}, ${age}`;
  }

  // Display bio - prioritize the enhanced bio format
  if (savedProfile.bioHTML) {
    document.getElementById("profileBio").innerHTML = savedProfile.bioHTML;
  } else if (savedEnhancedProfile.bio) {
    document.getElementById("profileBio").textContent =
      savedEnhancedProfile.bio;
  } else if (savedProfile.bioPlain) {
    document.getElementById("profileBio").textContent = savedProfile.bioPlain;
  }

  // Display enhanced profile fields if they exist
  displayEnhancedProfileFields(savedEnhancedProfile);
}

// Function to display enhanced profile fields
function displayEnhancedProfileFields(profile) {
  // Identity Section
  if (profile.gender) {
    const genderElement = document.getElementById("displayGender");
    if (genderElement) genderElement.textContent = profile.gender;
  }

  if (profile.pronouns) {
    const pronounsElement = document.getElementById("displayPronouns");
    if (pronounsElement) pronounsElement.textContent = profile.pronouns;
  }

  if (profile.sexuality) {
    const sexualityElement = document.getElementById("displaySexuality");
    if (sexualityElement) sexualityElement.textContent = profile.sexuality;
  }

  // Relationship Preferences Section
  if (profile.relationshipStyle) {
    const styleElement = document.getElementById("displayRelationshipStyle");
    if (styleElement) styleElement.textContent = profile.relationshipStyle;
  }

  if (profile.relationshipType) {
    const typeElement = document.getElementById("displayRelationshipType");
    if (typeElement) typeElement.textContent = profile.relationshipType;
  }

  if (profile.location) {
    const locationElement = document.getElementById("displayLocation");
    if (locationElement) {
      const formattedLocation =
        profile.location.charAt(0).toUpperCase() +
        profile.location.slice(1).replace("-", " ");
      locationElement.textContent = formattedLocation;
    }
  }
}

// --- ORIGINAL SIDEBAR NAVIGATION LOGIC ---
document.addEventListener("DOMContentLoaded", function () {
  const navlinks = document.querySelectorAll("#sidebarNav a");

  // Loop through each nav link
  navlinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const page = link.dataset.page;

      switch (page) {
        case "home":
          window.location.href = "index.html";
          break;
        case "matches":
          window.location.href = "search.html";
          break;
        case "likes":
          window.location.href = "likes.html";
          break;
        case "inbox":
          window.location.href = "inbox.html";
          break;
        case "profile":
          window.location.href = "profile.html";
          break;
        case "settings":
          window.location.href = "settings.html";
          break;
        default:
          console.warn("Unknown page:", page);
      }

      // Update active state
      navlinks.forEach((link) => link.classList.remove("active"));
      link.classList.add("active");
    });
  });

  // Automatically highlight the current page
  const currentPage = window.location.pathname.split("/").pop();
  navlinks.forEach((link) => {
    if (
      link.getAttribute("href") === currentPage ||
      link.getAttribute("data-page") === currentPage.replace(".html", "")
    ) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
});

// --- ENHANCED PROFILE PAGE: save handler with new fields ---
document.addEventListener("DOMContentLoaded", () => {
  if (!document.body.classList.contains("profile-page")) return;

  // Elements
  const editProfileForm = document.getElementById("editProfileForm");
  if (!editProfileForm) {
    console.error("Edit form not found: #editProfileForm");
    return;
  }

  const saveBtn = editProfileForm.querySelector(".save-btn");
  const editName = document.getElementById("editName");
  const editAge = document.getElementById("editAge");
  const editBio = document.getElementById("editBio");
  const editLocation = document.getElementById("editLocation");
  const editInterests = document.getElementById("editInterests");

  const profileName = document.getElementById("profileName");
  const profileBio = document.getElementById("profileBio");

  // --- NEW ENHANCED PROFILE FIELDS ---
  const editGender = document.getElementById("editGender");
  const editPronouns = document.getElementById("editPronouns");
  const editSexuality = document.getElementById("editSexuality");
  const editRelationshipStyle = document.getElementById(
    "editRelationshipStyle"
  );
  const editRelationshipType = document.getElementById("editRelationshipType");
  const editProfileLocation = document.getElementById("editProfileLocation");

  // --- Edit Profile Button Handler ---
  const editProfileBtn = document.getElementById("editProfileBtn");
  const profileDisplay = document.getElementById("profileDisplay");
  const profileEditSection = document.getElementById("profileEditSection");
  const editProfileImage = document.getElementById("editProfileImage");
  const profileImage = document.getElementById("profileImage");

  // When user clicks edit profile button
  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", () => {
      // Load saved data from localStorage if available
      const saved = JSON.parse(
        localStorage.getItem("everAfterProfile") || "{}"
      );
      const enhancedSaved = JSON.parse(
        localStorage.getItem("everAfterUserProfile") || "{}"
      );

      // Basic fields - use enhanced data as fallback
      if (saved.name || enhancedSaved.name)
        editName.value = saved.name || enhancedSaved.name;
      if (saved.age || enhancedSaved.age)
        editAge.value = saved.age || enhancedSaved.age;
      if (saved.bioPlain || enhancedSaved.bio)
        editBio.value = saved.bioPlain || enhancedSaved.bio;
      if (saved.location) editLocation.value = saved.location;
      if (saved.interests) editInterests.value = saved.interests;

      // Enhanced fields
      if (enhancedSaved.gender && editGender)
        editGender.value = enhancedSaved.gender;
      if (enhancedSaved.pronouns && editPronouns)
        editPronouns.value = enhancedSaved.pronouns;
      if (enhancedSaved.sexuality && editSexuality)
        editSexuality.value = enhancedSaved.sexuality;
      if (enhancedSaved.relationshipStyle && editRelationshipStyle)
        editRelationshipStyle.value = enhancedSaved.relationshipStyle;
      if (enhancedSaved.relationshipType && editRelationshipType)
        editRelationshipType.value = enhancedSaved.relationshipType;
      if (enhancedSaved.location && editProfileLocation)
        editProfileLocation.value = enhancedSaved.location;

      // Toggle visibility
      profileDisplay.classList.add("hidden");
      profileEditSection.classList.remove("hidden");
    });
  }

  // Handle profile image upload preview - ORIGINAL FUNCTIONALITY
  if (editProfileImage) {
    editProfileImage.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        profileImage.src = reader.result;
        localStorage.setItem("everAfterProfileImage", reader.result);

        // Also update enhanced profile
        const enhancedProfile = JSON.parse(
          localStorage.getItem("everAfterUserProfile") || "{}"
        );
        enhancedProfile.profilePicture = reader.result;
        localStorage.setItem(
          "everAfterUserProfile",
          JSON.stringify(enhancedProfile)
        );
      };
      reader.readAsDataURL(file);
    });
  }

  // When page loads, show saved image if available - ORIGINAL FUNCTIONALITY
  const savedImage = localStorage.getItem("everAfterProfileImage");
  if (savedImage) {
    profileImage.src = savedImage;

    // Also ensure enhanced profile has the image
    const enhancedProfile = JSON.parse(
      localStorage.getItem("everAfterUserProfile") || "{}"
    );
    if (!enhancedProfile.profilePicture) {
      enhancedProfile.profilePicture = savedImage;
      localStorage.setItem(
        "everAfterUserProfile",
        JSON.stringify(enhancedProfile)
      );
    }
  }

  // --- Prevent Enter from submitting the form prematurely ---
  editProfileForm.addEventListener("keydown", (e) => {
    const tag = e.target.tagName.toLowerCase();

    // Don't interfere if the user is typing inside a textarea
    if (tag === "textarea") return;

    // If enter is pressed inside any input, prevent form submit
    if (e.key === "Enter") {
      e.preventDefault();
      console.log("Prevented early submit on Enter");

      // Move the focus to the next input if it exists
      const formInputs = Array.from(
        editProfileForm.querySelectorAll("input, textarea, select")
      );
      const currentIndex = formInputs.indexOf(e.target);
      if (currentIndex > -1 && currentIndex < formInputs.length - 1) {
        formInputs[currentIndex + 1].focus();
      }
    }
  });

  // --- ENHANCED SAVE HANDLER - FIXED BIO SAVING ---
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

    // Build display bio HTML - ORIGINAL FORMAT
    let bioHTML = bioVal.replace(/\n/g, "<br>");
    if (editLocation.value.trim())
      bioHTML += `<br>📍 ${escapeHTML(editLocation.value.trim())}`;
    if (editInterests.value.trim())
      bioHTML += `<br>🎯 Interests: ${escapeHTML(editInterests.value.trim())}`;

    // Update the visual profile immediately - ORIGINAL FUNCTIONALITY
    profileName.textContent = `${nameVal}, ${ageVal}`;
    profileBio.innerHTML = bioHTML;

    // Save structured data to localStorage (basic profile) - ORIGINAL FORMAT
    const profileData = {
      name: nameVal,
      age: ageVal,
      bioPlain: bioVal,
      bioHTML: bioHTML,
      location: editLocation.value.trim(),
      interests: editInterests.value.trim(),
    };
    localStorage.setItem("everAfterProfile", JSON.stringify(profileData));

    // Save enhanced profile data to separate storage
    const enhancedProfileData = {
      name: nameVal,
      age: ageVal,
      bio: bioVal,
      gender: editGender ? editGender.value : "",
      pronouns: editPronouns ? editPronouns.value : "",
      sexuality: editSexuality ? editSexuality.value : "",
      relationshipStyle: editRelationshipStyle
        ? editRelationshipStyle.value
        : "",
      relationshipType: editRelationshipType ? editRelationshipType.value : "",
      location: editProfileLocation
        ? editProfileLocation.value
        : editLocation.value.trim() || "",
      profilePicture: profileImage.src,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(
      "everAfterUserProfile",
      JSON.stringify(enhancedProfileData)
    );

    console.log("[EverAfter] Basic profile saved:", profileData);
    console.log("[EverAfter] Enhanced profile saved:", enhancedProfileData);

    // Update enhanced profile display fields
    displayEnhancedProfileFields(enhancedProfileData);

    // Hide form and show profile again
    profileEditSection.classList.add("hidden");
    profileDisplay.classList.remove("hidden");
    alert("Profile updated successfully!");
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
    const enhancedSaved = localStorage.getItem("everAfterUserProfile");
    if (saved)
      console.log("[EverAfter] Loaded basic profile:", JSON.parse(saved));
    if (enhancedSaved)
      console.log(
        "[EverAfter] Loaded enhanced profile:",
        JSON.parse(enhancedSaved)
      );
  } catch (err) {
    console.warn("[EverAfter] Could not parse saved profile:", err);
  }
});
