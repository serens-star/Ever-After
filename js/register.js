class Registration {
  constructor() {
    this.form = document.getElementById("registrationForm");
    this.profilePictureInput = document.getElementById("profilePicture");
    this.profilePreview = document.getElementById("profilePreview");
    this.uploadBtn = document.getElementById("uploadBtn");

    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleRegistration();
    });

    this.uploadBtn.addEventListener("click", () => {
      this.profilePictureInput.click();
    });

    this.profilePictureInput.addEventListener("change", (e) => {
      this.handleImageUpload(e);
    });
  }

  handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        this.profilePreview.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async handleRegistration() {
    const formData = new FormData(this.form);

    // Get current location for the user
    const userLocation = await this.getUserLocation();

    const userData = {
      id: Date.now(),
      name: formData.get("name"),
      age: parseInt(formData.get("age")),
      location: formData.get("location"),
      bio: formData.get("bio"),
      gender: formData.get("gender"),
      pronouns: formData.get("pronouns"),
      sexuality: formData.get("sexuality"),
      relationshipStyle: formData.get("relationshipStyle"),
      relationshipType: formData.get("relationshipType"),
      profilePicture: this.profilePreview.src,
      coordinates: userLocation,
      registeredAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    };

    // Validate required fields
    if (
      !userData.name ||
      !userData.age ||
      !userData.location ||
      !userData.bio
    ) {
      alert(
        "Please fill in all required fields (Name, Age, City, and About Me)"
      );
      return;
    }

    this.saveUserProfile(userData);

    // Also save as current user profile
    localStorage.setItem("everAfterUserProfile", JSON.stringify(userData));

    alert("Profile created successfully! Welcome to Ever After!");
    window.location.href = "nearby.html";
  }

  getUserLocation() {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            });
          },
          (error) => {
            console.error("Error getting location:", error);
            // Use city center as fallback
            const city = document.getElementById("regLocation").value;
            const cityCoords = this.getCityCoordinates(city);
            resolve(cityCoords);
          }
        );
      } else {
        const city = document.getElementById("regLocation").value;
        const cityCoords = this.getCityCoordinates(city);
        resolve(cityCoords);
      }
    });
  }

  getCityCoordinates(city) {
    const coordinates = {
      johannesburg: { lat: -26.2041, lon: 28.0473 },
      pretoria: { lat: -25.7479, lon: 28.2293 },
      durban: { lat: -29.8587, lon: 31.0218 },
      "east-london": { lat: -32.9833, lon: 27.8667 },
      "cape-town": { lat: -33.9249, lon: 18.4241 },
    };
    return coordinates[city] || coordinates.johannesburg;
  }

  saveUserProfile(userData) {
    const existingUsers = JSON.parse(
      localStorage.getItem("everAfterUsers") || "[]"
    );

    // Check if user already exists (by name or ID)
    const existingUserIndex = existingUsers.findIndex(
      (user) => user.id === userData.id || user.name === userData.name
    );

    if (existingUserIndex !== -1) {
      // Update existing user
      existingUsers[existingUserIndex] = userData;
    } else {
      // Add new user
      existingUsers.push(userData);
    }

    localStorage.setItem("everAfterUsers", JSON.stringify(existingUsers));
    console.log("User profile saved:", userData.name);
  }
}

// Initialize registration
document.addEventListener("DOMContentLoaded", () => {
  new Registration();
});
