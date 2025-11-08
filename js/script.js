if (typeof API_KEY === "undefined") {
  const API_KEY = "pk.a5617e2068395ccb3921dcdc4103c28a";
}

if (typeof BASE_URL === "undefined") {
  const BASE_URL = "https://api.locationiq.com/v1/search";
}

const form = document.getElementById("signin-form");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
      alert("Please fill in all fields.");
      // Fixed the typo in WebGLSampler to gsap
      if (typeof gsap !== "undefined") {
        gsap.to(".login-btn", {
          x: -10,
          yoyo: true,
          repeat: 5,
          duration: 0.5,
        });
      }
      return;
    }

    //Mock dating API using RandomUser
    fetch("https://randomuser.me/api/?results=3")
      .then((res) => res.json())
      .then((data) => {
        console.log("Mock dating API results:", data.results);
        alert(
          `Welcome, ${username}! Found ${data.results.length} potential matches for you.`
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

// --- PROFILE PAGE FUNCTIONALITY ---
if (document.body.classList.contains("profile-page")) {
  const profileImage = document.getElementById("profileImage");
  const savedPhoto = localStorage.getItem("userPhoto");

  if (savedPhoto) {
    profileImage.src = savedPhoto;
  } else {
    // Use a default image if no saved photo
    profileImage.src = "assets/default_profile.png";
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
    if (document.getElementById("profileName")) {
      document.getElementById("profileName").textContent = `${name}, ${age}`;
    }
  }

  // Display bio - prioritize the enhanced bio format
  const profileBioElement = document.getElementById("profileBio");
  if (profileBioElement) {
    if (savedProfile.bioHTML) {
      profileBioElement.innerHTML = savedProfile.bioHTML;
    } else if (savedEnhancedProfile.bio) {
      profileBioElement.textContent = savedEnhancedProfile.bio;
    } else if (savedProfile.bioPlain) {
      profileBioElement.textContent = savedProfile.bioPlain;
    }
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

// --- SIDEBAR NAVIGATION LOGIC ---
document.addEventListener("DOMContentLoaded", function () {
  const navlinks = document.querySelectorAll("#sidebarNav a");

  // Only run if sidebar nav exists
  if (navlinks.length > 0) {
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
            window.location.href = "nearby.html";
            break;
          case "profile":
            window.location.href = "profile.html";
            break;
          case "settings":
            window.location.href = "search-criteria.html";
            break;
          default:
            console.warn("Unknown page:", page);
        }

        // Update active state
        navlinks.forEach((navLink) => navLink.classList.remove("active"));
        link.classList.add("active");
      });
    });

    // Automatically highlight the current page
    const currentPage = window.location.pathname.split("/").pop();
    navlinks.forEach((link) => {
      const linkPage = link.getAttribute("data-page");
      if (
        linkPage === currentPage.replace(".html", "") ||
        link.getAttribute("href") === currentPage
      ) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }
});
// --- PROFILE PAGE EDIT FUNCTIONALITY ---
// Add this to your existing script.js file - replace the entire profile section

// --- PROFILE PAGE FUNCTIONALITY ---
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
    if (document.getElementById("profileName")) {
      document.getElementById("profileName").textContent = `${name}, ${age}`;
    }
  }

  // Display bio - prioritize the enhanced bio format
  const profileBioElement = document.getElementById("profileBio");
  if (profileBioElement) {
    if (savedProfile.bioHTML) {
      profileBioElement.innerHTML = savedProfile.bioHTML;
    } else if (savedEnhancedProfile.bio) {
      profileBioElement.textContent = savedEnhancedProfile.bio;
    } else if (savedProfile.bioPlain) {
      profileBioElement.textContent = savedProfile.bioPlain;
    }
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

// --- PROFILE PAGE EDIT FUNCTIONALITY ---
document.addEventListener("DOMContentLoaded", () => {
  if (!document.body.classList.contains("profile-page")) return;

  // Elements - with null checks
  const editProfileForm = document.getElementById("editProfileForm");
  if (!editProfileForm) {
    console.log("Edit profile form not found on this page");
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

  // --- Edit Profile Button Handler ---
  const editProfileBtn = document.getElementById("editProfileBtn");
  const profileDisplay = document.getElementById("profileDisplay");
  const profileEditSection = document.getElementById("profileEditSection");
  const editProfileImage = document.getElementById("editProfileImage");
  const profileImage = document.getElementById("profileImage");
  const editProfilePicture = document.getElementById("editProfilePicture");
  const changePhotoBtn = document.getElementById("changePhotoBtn");
  const backToProfileBtn = document.getElementById("backToProfileBtn");

  // When user clicks edit profile button
  if (editProfileBtn && profileDisplay && profileEditSection) {
    editProfileBtn.addEventListener("click", () => {
      // Load saved data from localStorage if available
      const saved = JSON.parse(
        localStorage.getItem("everAfterProfile") || "{}"
      );
      const enhancedSaved = JSON.parse(
        localStorage.getItem("everAfterUserProfile") || "{}"
      );

      // Basic fields - use enhanced data as fallback
      if (editName && (saved.name || enhancedSaved.name))
        editName.value = saved.name || enhancedSaved.name;
      if (editAge && (saved.age || enhancedSaved.age))
        editAge.value = saved.age || enhancedSaved.age;
      if (editBio && (saved.bioPlain || enhancedSaved.bio))
        editBio.value = saved.bioPlain || enhancedSaved.bio;
      if (editLocation && saved.location) editLocation.value = saved.location;
      if (editInterests && saved.interests)
        editInterests.value = saved.interests;

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

      // Load profile pictures
      const savedPhoto = localStorage.getItem("userPhoto");
      if (savedPhoto && editProfilePicture) {
        editProfilePicture.src = savedPhoto;
      }

      // Toggle visibility
      profileDisplay.classList.add("hidden");
      profileEditSection.classList.remove("hidden");
    });
  }

  // Back button functionality
  if (backToProfileBtn && profileDisplay && profileEditSection) {
    backToProfileBtn.addEventListener("click", () => {
      profileEditSection.classList.add("hidden");
      profileDisplay.classList.remove("hidden");
    });
  }

  // Handle profile image upload preview
  if (
    editProfileImage &&
    profileImage &&
    editProfilePicture &&
    changePhotoBtn
  ) {
    changePhotoBtn.addEventListener("click", () => {
      editProfileImage.click();
    });

    editProfileImage.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        // Update both edit mode and view mode images
        editProfilePicture.src = reader.result;
        profileImage.src = reader.result;
        localStorage.setItem("userPhoto", reader.result);

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

  // When page loads, show saved image if available
  const savedImage = localStorage.getItem("userPhoto");
  if (savedImage && profileImage) {
    profileImage.src = savedImage;
  }

  // --- Prevent Enter from submitting the form prematurely ---
  if (editProfileForm) {
    editProfileForm.addEventListener("keydown", (e) => {
      const tag = e.target.tagName.toLowerCase();

      // Don't interfere if the user is typing inside a textarea
      if (tag === "textarea") return;

      // If enter is pressed inside any input, prevent form submit
      if (e.key === "Enter") {
        e.preventDefault();

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
      const nameVal = editName ? editName.value.trim() : "";
      const ageVal = editAge ? editAge.value.trim() : "";
      const bioVal = editBio ? editBio.value.trim() : "";

      if (!nameVal || !ageVal || !bioVal) {
        alert("Please fill in Name, Age and About before saving.");
        if (!nameVal && editName) editName.focus();
        else if (!ageVal && editAge) editAge.focus();
        else if (editBio) editBio.focus();
        return;
      }

      // Build display bio HTML - ORIGINAL FORMAT
      let bioHTML = bioVal.replace(/\n/g, "<br>");
      if (editLocation && editLocation.value.trim())
        bioHTML += `<br>📍 ${escapeHTML(editLocation.value.trim())}`;
      if (editInterests && editInterests.value.trim())
        bioHTML += `<br>🎯 Interests: ${escapeHTML(
          editInterests.value.trim()
        )}`;

      // Update the visual profile immediately - ORIGINAL FUNCTIONALITY
      if (profileName) profileName.textContent = `${nameVal}, ${ageVal}`;
      if (profileBio) profileBio.innerHTML = bioHTML;

      // Save structured data to localStorage (basic profile) - ORIGINAL FORMAT
      const profileData = {
        name: nameVal,
        age: ageVal,
        bioPlain: bioVal,
        bioHTML: bioHTML,
        location: editLocation ? editLocation.value.trim() : "",
        interests: editInterests ? editInterests.value.trim() : "",
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
        relationshipType: editRelationshipType
          ? editRelationshipType.value
          : "",
        location: editLocation ? editLocation.value.trim() : "",
        profilePicture: profileImage ? profileImage.src : "",
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
      if (profileEditSection && profileDisplay) {
        profileEditSection.classList.add("hidden");
        profileDisplay.classList.remove("hidden");
      }
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
});
