if (typeof API_KEY === "undefined") {
  const API_KEY = "pk.a5617e2068395ccb3921dcdc4103c28a";
}

if (typeof BASE_URL === "undefined") {
  const BASE_URL = "https://api.locationiq.com/v1/search";
}

// ==================== AUTHENTICATION FUNCTIONALITY ====================
document.addEventListener("DOMContentLoaded", function () {
  // Welcome page - no specific functionality needed

  // Sign Up Page
  const signupForm = document.getElementById("signup-form");

  if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("signup-name").value.trim();
      const email = document.getElementById("signup-email").value.trim();
      const confirmEmail = document
        .getElementById("confirm-email")
        .value.trim();
      const password = document.getElementById("signup-password").value.trim();
      const confirmPassword = document
        .getElementById("confirm-password")
        .value.trim();

      // Validation
      if (!name || !email || !confirmEmail || !password || !confirmPassword) {
        alert("Please fill in all fields.");
        return;
      }

      if (email !== confirmEmail) {
        alert("Email addresses do not match.");
        highlightField("confirm-email");
        return;
      }

      if (password !== confirmPassword) {
        alert("Passwords do not match.");
        highlightField("confirm-password");
        return;
      }

      if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        highlightField("signup-password");
        return;
      }

      // Save user data (no email confirmation needed)
      const userData = {
        name: name,
        email: email,
        password: password,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem("everAfterUser", JSON.stringify(userData));

      // Auto-login and redirect
      localStorage.setItem("everAfterUsername", name);
      localStorage.setItem("everAfterPassword", password);
      localStorage.setItem("everAfterKeepLoggedIn", "true");

      alert(`Welcome to Ever After, ${name}! Your account has been created.`);
      window.location.href = "upload.html";
    });
  }

  // Login Page
  const loginForm = document.getElementById("login-form");
  const forgotPasswordModal = document.getElementById("forgotPasswordModal");
  const forgotPasswordBtn = document.getElementById("forgotPasswordBtn");
  const sendResetBtn = document.getElementById("sendResetBtn");
  const cancelResetBtn = document.getElementById("cancelResetBtn");
  const keepLoggedIn = document.getElementById("keepLoggedIn");

  if (loginForm) {
    // Load saved credentials if "Keep me logged in" was checked
    loadSavedCredentials();

    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!username || !password) {
        alert("Please fill in all fields.");
        highlightField(!username ? "username" : "password");
        return;
      }

      // Check if user exists and credentials match
      const savedUser = JSON.parse(
        localStorage.getItem("everAfterUser") || "{}"
      );

      if (savedUser.name === username && savedUser.password === password) {
        // Save credentials if "Keep me logged in" is checked
        if (keepLoggedIn && keepLoggedIn.checked) {
          localStorage.setItem("everAfterUsername", username);
          localStorage.setItem("everAfterPassword", password);
          localStorage.setItem("everAfterKeepLoggedIn", "true");
        } else {
          // Still remember for this session, but don't persist
          localStorage.setItem("everAfterUsername", username);
          localStorage.setItem("everAfterKeepLoggedIn", "false");
        }

        // Get user preferences and find compatible matches
        const userPreferences = {
          seekingRelationshipStyle: savedUser.seekingRelationshipStyle || "",
          seekingRelationshipType: savedUser.seekingRelationshipType || "",
          preferredLocation: savedUser.preferredLocation || "",
          age: savedUser.age || "25",
        };

        const compatibleMatches = getCompatibleMatches(userPreferences);

        console.log("Compatible matches found:", compatibleMatches);
        alert(
          `Welcome back, ${username}! Found ${compatibleMatches.length} compatible matches for you.`
        );
        window.location.href = "upload.html";
      } else {
        alert("Invalid username or password. Please try again.");
        highlightField("username");
        highlightField("password");

        if (typeof gsap !== "undefined") {
          gsap.to(".submit-btn", {
            x: -10,
            yoyo: true,
            repeat: 5,
            duration: 0.5,
          });
        }
      }
    });
  }

  // Forgot password functionality for login page
  if (forgotPasswordBtn) {
    forgotPasswordBtn.addEventListener("click", function () {
      if (forgotPasswordModal) {
        forgotPasswordModal.style.display = "flex";
      }
    });
  }

  if (sendResetBtn) {
    sendResetBtn.addEventListener("click", function () {
      const resetEmail = document.getElementById("reset-email").value.trim();

      if (!resetEmail) {
        alert("Please enter your email address.");
        return;
      }

      // Check if email exists in system
      const savedUser = JSON.parse(
        localStorage.getItem("everAfterUser") || "{}"
      );
      if (savedUser.email !== resetEmail) {
        alert("No account found with that email address.");
        return;
      }

      // Simulate sending password reset email
      console.log("Password reset email sent to:", resetEmail);
      alert("Password reset link has been sent to your email!");

      if (forgotPasswordModal) {
        forgotPasswordModal.style.display = "none";
      }
    });
  }

  if (cancelResetBtn) {
    cancelResetBtn.addEventListener("click", function () {
      if (forgotPasswordModal) {
        forgotPasswordModal.style.display = "none";
      }
    });
  }

  // Close modals when clicking outside
  window.addEventListener("click", function (e) {
    if (forgotPasswordModal && e.target === forgotPasswordModal) {
      forgotPasswordModal.style.display = "none";
    }
  });

  // Helper functions
  function loadSavedCredentials() {
    const savedUsername = localStorage.getItem("everAfterUsername");
    const savedPassword = localStorage.getItem("everAfterPassword");
    const keepLoggedIn = localStorage.getItem("everAfterKeepLoggedIn");

    if (savedUsername) {
      document.getElementById("username").value = savedUsername;
      if (savedPassword) {
        document.getElementById("password").value = savedPassword;
      }
      if (document.getElementById("keepLoggedIn")) {
        document.getElementById("keepLoggedIn").checked = keepLoggedIn === "true";
      }
    }
  }

  function highlightField(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
      field.style.borderColor = "#ff6b6b";
      field.style.boxShadow = "0 0 0 3px rgba(255, 107, 107, 0.3)";

      setTimeout(() => {
        field.style.borderColor = "";
        field.style.boxShadow = "";
      }, 2000);
    }
  }
});
// === END AUTHENTICATION FUNCTIONALITY ===

// ==================== MATCHING ALGORITHM ====================
function getCompatibleMatches(userPreferences) {
  // Sample database of potential matches (in real app, this would come from a server)
  const potentialMatches = [
    {
      id: 1,
      name: "Alex",
      age: 28,
      gender: "Non-binary",
      pronouns: "They/them",
      sexuality: "Pansexual",
      relationshipStyle: "Monogamous",
      relationshipType: "Serious Relationship",
      location: "New York",
      bio: "Artist and nature lover looking for meaningful connections",
      profilePicture: "assets/profile1.jpg",
    },
    {
      id: 2,
      name: "Sam",
      age: 25,
      gender: "Trans Man",
      pronouns: "He/him",
      sexuality: "Queer",
      relationshipStyle: "Polyamorous",
      relationshipType: "Casual Dating",
      location: "Los Angeles",
      bio: "Musician and coffee enthusiast",
      profilePicture: "assets/profile2.jpg",
    },
    {
      id: 3,
      name: "Riley",
      age: 30,
      gender: "Genderfluid",
      pronouns: "They/them",
      sexuality: "Bisexual",
      relationshipStyle: "Monogamous",
      relationshipType: "Serious Relationship",
      location: "Chicago",
      bio: "Bookworm and adventure seeker",
      profilePicture: "assets/profile3.jpg",
    },
    {
      id: 4,
      name: "Jordan",
      age: 26,
      gender: "Non-binary",
      pronouns: "They/them",
      sexuality: "Pansexual",
      relationshipStyle: "Open to different styles",
      relationshipType: "Friendship first",
      location: "New York",
      bio: "Yoga instructor and plant parent",
      profilePicture: "assets/profile4.jpg",
    },
    {
      id: 5,
      name: "Casey",
      age: 29,
      gender: "Trans Woman",
      pronouns: "She/her",
      sexuality: "Lesbian",
      relationshipStyle: "Monogamous",
      relationshipType: "Serious Relationship",
      location: "Boston",
      bio: "Software developer and gamer",
      profilePicture: "assets/profile5.jpg",
    },
  ];

  // Filter matches based on user preferences
  const compatibleMatches = potentialMatches.filter((match) => {
    let score = 0;

    // Relationship Style Match (40% weight)
    if (
      userPreferences.seekingRelationshipStyle &&
      match.relationshipStyle
        .toLowerCase()
        .includes(userPreferences.seekingRelationshipStyle.toLowerCase())
    ) {
      score += 40;
    } else if (
      userPreferences.seekingRelationshipStyle &&
      match.relationshipStyle === "Open to different styles"
    ) {
      score += 20;
    }

    // Relationship Type Match (30% weight)
    if (
      userPreferences.seekingRelationshipType &&
      match.relationshipType === userPreferences.seekingRelationshipType
    ) {
      score += 30;
    }

    // Location Match (20% weight) - in real app, this would use geolocation
    if (
      userPreferences.preferredLocation &&
      match.location
        .toLowerCase()
        .includes(userPreferences.preferredLocation.toLowerCase())
    ) {
      score += 20;
    }

    // Age compatibility (10% weight) - within 5 years
    const userAge = parseInt(userPreferences.age) || 25;
    const matchAge = match.age;
    if (Math.abs(userAge - matchAge) <= 5) {
      score += 10;
    }

    match.compatibilityScore = score;
    return score >= 30; // Only show matches with at least 30% compatibility
  });

  // Sort by compatibility score (highest first)
  return compatibleMatches.sort(
    (a, b) => b.compatibilityScore - a.compatibilityScore
  );
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
            window.location.href = "search.html";
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
        
        seekingRelationshipStyle: editRelationshipStyle
          ? editRelationshipStyle.value
          : "",
        seekingRelationshipType: editRelationshipType
          ? editRelationshipType.value
          : "",
        preferredLocation: editLocation ? editLocation.value.trim() : "",
      };

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

// Your existing script.js code ends here...

// ==================== SCROLL TRIGGER ANIMATIONS FOR PROFILE PAGE ====================
function initScrollAnimations() {
  // Check if we're on the profile page and GSAP is loaded
  if (
    !document.body.classList.contains("profile-page") ||
    typeof gsap === "undefined"
  ) {
    return;
  }

  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  // Animation for profile header elements
  const profileHeader = document.querySelector(".profile-header");
  const profilePicture = document.querySelector(".profile-picture-large");
  const profileName = document.querySelector(".profile-name");
  const editButton = document.querySelector(".edit-profile-btn");

  if (profileHeader) {
    gsap.fromTo(
      profileHeader,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: profileHeader,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }

  if (profilePicture) {
    gsap.fromTo(
      profilePicture,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: profilePicture,
          start: "top 85%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }

  if (profileName) {
    gsap.fromTo(
      profileName,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: profileName,
          start: "top 85%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }

  if (editButton) {
    gsap.fromTo(
      editButton,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.4,
        ease: "power2.out",
        scrollTrigger: {
          trigger: editButton,
          start: "top 85%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }

  // Animation for profile sections
  const profileSections = document.querySelectorAll(".profile-info-section");

  profileSections.forEach((section, index) => {
    gsap.fromTo(
      section,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: index * 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Animate info grids within sections
    const infoGrid = section.querySelector(".info-grid");
    if (infoGrid) {
      const infoItems = infoGrid.querySelectorAll(".info-item");

      gsap.fromTo(
        infoItems,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: infoGrid,
            start: "top 85%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // Animate bio text
    const bioText = section.querySelector(".profile-bio");
    if (bioText) {
      gsap.fromTo(
        bioText,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: bioText,
            start: "top 85%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }
  });

  // Animation for section titles
  const sectionTitles = document.querySelectorAll(".section-title");

  sectionTitles.forEach((title, index) => {
    gsap.fromTo(
      title,
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: title,
          start: "top 85%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  // Refresh ScrollTrigger on page load to ensure proper calculations
  ScrollTrigger.refresh();
}

// Alternative CSS-based animations for fallback
function initCSSAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");

        // If it's an info-grid, animate its children
        if (entry.target.classList.contains("info-grid")) {
          const items = entry.target.querySelectorAll(".info-item");
          items.forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.1}s`;
          });
        }
      }
    });
  }, observerOptions);

  // Observe all animatable elements
  const elementsToAnimate = document.querySelectorAll(
    ".profile-header, .profile-picture-large, .profile-name, .edit-profile-btn, .profile-info-section, .info-grid, .section-title"
  );

  elementsToAnimate.forEach((el) => observer.observe(el));
}

// Initialize animations when DOM is loaded - ADD THIS TO YOUR EXISTING DOMCONTENTLOADED
document.addEventListener("DOMContentLoaded", function () {
  // Your existing DOMContentLoaded code here...

  // Add this animation initialization at the end of your existing DOMContentLoaded function:

  // Try GSAP ScrollTrigger first, fall back to CSS animations
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    initScrollAnimations();
  } else {
    initCSSAnimations();
    console.log("GSAP ScrollTrigger not available, using CSS animations");
  }

  // Refresh animations when switching between view and edit modes
  const editProfileBtn = document.getElementById("editProfileBtn");
  const backToProfileBtn = document.getElementById("backToProfileBtn");

  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", function () {
      // Small delay to ensure DOM update
      setTimeout(() => {
        if (typeof ScrollTrigger !== "undefined") {
          ScrollTrigger.refresh();
        }
      }, 100);
    });
  }

  if (backToProfileBtn) {
    backToProfileBtn.addEventListener("click", function () {
      // Refresh animations when returning to profile view
      setTimeout(() => {
        if (typeof ScrollTrigger !== "undefined") {
          ScrollTrigger.refresh();
        } else {
          // Re-initialize CSS animations
          initCSSAnimations();
        }
      }, 100);
    });
  }
});
