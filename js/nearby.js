const API_KEY = "pk.a5617e2068395ccb3921dcdc4103c28a";
const BASE_URL = "https://api.locationiq.com/v1/search";

class NearbyProfiles {
  constructor() {
    this.profilesContainer = document.getElementById("profilesContainer");
    this.settingsBtn = document.querySelector(".settings-btn");
    this.matchesBtn = document.querySelector(".matches-btn");
    this.searchInput = document.querySelector(".search-input");
    this.navBtns = document.querySelectorAll(".nav-btn");

    this.init();
  }

  init() {
    this.loadProfiles();
    this.setupEventListeners();
    this.checkSearchCriteria();
  }

  setupEventListeners() {
    // Settings button - go to search criteria
    this.settingsBtn.addEventListener("click", () => {
      this.navigateToPage("search-criteria");
    });

    // Matches button - refresh page
    this.matchesBtn.addEventListener("click", () => {
      location.reload();
    });

    // Search functionality
    this.searchInput.addEventListener("input", (e) => {
      this.filterProfiles(e.target.value);
    });

    // Navigation buttons
    this.navBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const page = e.currentTarget.dataset.page;
        this.navigateToPage(page);
      });
    });
  }

  checkSearchCriteria() {
    const criteria = JSON.parse(
      localStorage.getItem("everAfterSearchPrefs") || "{}"
    );

    // Only show message if no criteria are set, but don't auto-redirect
    if (Object.keys(criteria).length === 0) {
      this.showMessage(
        "No search criteria set. Click the settings icon to set preferences."
      );
    }
    // If criteria exist but are empty/invalid, also show message
    else if (!criteria.gender || !criteria.ageMin) {
      this.showMessage(
        "Search criteria may be incomplete. Click settings to update."
      );
    }
  }

  async loadProfiles() {
    try {
      this.showLoading();

      const criteria = JSON.parse(
        localStorage.getItem("everAfterSearchPrefs") || "{}"
      );
      const profiles = await this.fetchProfiles(criteria);

      if (profiles.length === 0) {
        this.showNoProfiles();
      } else {
        this.displayProfiles(profiles);
        this.animateProfiles();
      }
    } catch (error) {
      console.error("Error loading profiles:", error);
      this.showError("Failed to load profiles. Please try again.");
    }
  }

  async fetchProfiles(criteria) {
    // Use mock data for now - replace with actual API call
    const mockProfiles = this.generateMockProfiles(criteria);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return mockProfiles;
  }

  generateMockProfiles(criteria) {
    const names = [
      "Alex",
      "Sam",
      "Taylor",
      "Jordan",
      "Casey",
      "Riley",
      "Quinn",
      "Morgan",
    ];

    // Expanded gender options to match search criteria
    const genders = [
      "Cisgender(AFAB)",
      "Agender",
      "Genderfluid",
      "Genderqueer",
      "Non-binary",
      "Gender Non-conforming",
      "Transgender(AMAB)",
      "Demigender",
      "Woman",
      "Other",
    ];

    const pronounsList = [
      "she/her",
      "he/him",
      "they/them",
      "she/they",
      "he/they",
      "other",
    ];
    const sexualities = [
      "Queer",
      "Lesbian",
      "Bisexual",
      "Pansexual",
      "Asexual",
      "Aromantic",
      "Aro-Ace",
      "Demisexual",
      "Other",
    ];
    const relationshipStyles = [
      "Monogamous",
      "Polyamorous",
      "Open Relationship",
      "Relationship Anarchist",
    ];
    const relationshipTypes = [
      "Casual",
      "Long-term",
      "Friendship",
      "Situationship",
    ];

    // South African cities data with coordinates
    const saCities = {
      johannesburg: { city: "Johannesburg", lat: -26.2041, lon: 28.0473 },
      pretoria: { city: "Pretoria", lat: -25.7479, lon: 28.2293 },
      durban: { city: "Durban", lat: -29.8587, lon: 31.0218 },
      "east-london": { city: "East London", lat: -32.9833, lon: 27.8667 },
      any: { city: "Cape Town", lat: -33.9249, lon: 18.4241 }, // Default
    };

    // Generate profiles
    const profiles = [];
    const numProfiles = 8;

    for (let i = 0; i < numProfiles; i++) {
      // Determine location based on criteria
      let locationData;
      if (
        criteria.location &&
        criteria.location !== "any" &&
        saCities[criteria.location]
      ) {
        // Use selected city
        locationData = saCities[criteria.location];
      } else {
        // Random South African city
        const cityKeys = Object.keys(saCities).filter((key) => key !== "any");
        const randomCityKey =
          cityKeys[Math.floor(Math.random() * cityKeys.length)];
        locationData = saCities[randomCityKey];
      }

      // Add some variation to coordinates within the city
      const variedLat = locationData.lat + (Math.random() - 0.5) * 0.1;
      const variedLon = locationData.lon + (Math.random() - 0.5) * 0.1;

      // Calculate distance from user (simplified for demo)
      const distance = (Math.random() * 15 + 1).toFixed(1);

      const profile = {
        id: i + 1,
        name: names[Math.floor(Math.random() * names.length)],
        age: Math.floor(Math.random() * 25) + 20, // 20-45 age range
        gender: genders[Math.floor(Math.random() * genders.length)],
        pronouns: pronounsList[Math.floor(Math.random() * pronounsList.length)],
        sexuality: sexualities[Math.floor(Math.random() * sexualities.length)],
        relationshipStyle:
          relationshipStyles[
            Math.floor(Math.random() * relationshipStyles.length)
          ],
        relationshipType:
          relationshipTypes[
            Math.floor(Math.random() * relationshipTypes.length)
          ],
        distance: distance,
        location: locationData.city,
        coordinates: {
          latitude: variedLat,
          longitude: variedLon,
        },
        image: `assets/Profile_Card_Icon.png`,
        lastActive: new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
      };

      profiles.push(profile);
    }

    // Apply filters
    const filteredProfiles = profiles.filter((profile) =>
      this.applyCriteria(profile, criteria)
    );

    return filteredProfiles.length > 0
      ? filteredProfiles
      : profiles.slice(0, 3); // Fallback if all filtered out
  }

  applyCriteria(profile, criteria) {
    // Age filter
    if (criteria.ageMin && profile.age < parseInt(criteria.ageMin))
      return false;
    if (criteria.ageMax && profile.age > parseInt(criteria.ageMax))
      return false;

    // Gender filter
    if (criteria.gender && criteria.gender !== "any") {
      if (profile.gender !== criteria.gender) return false;
    }

    // Pronouns filter
    if (criteria.pronouns && criteria.pronouns !== "any") {
      if (profile.pronouns !== criteria.pronouns) return false;
    }

    // Sexuality filter
    if (criteria.sexuality && criteria.sexuality !== "any") {
      if (profile.sexuality !== criteria.sexuality) return false;
    }

    // Location filter
    if (criteria.location && criteria.location !== "any") {
      if (profile.location.toLowerCase() !== criteria.location.toLowerCase())
        return false;
    }

    // Relationship Style filter
    if (criteria.relationshipStyle && criteria.relationshipStyle !== "any") {
      if (profile.relationshipStyle !== criteria.relationshipStyle)
        return false;
    }

    // Relationship Type filter
    if (criteria.relationshipType && criteria.relationshipType !== "any") {
      if (profile.relationshipType !== criteria.relationshipType) return false;
    }

    return true;
  }

  animateProfiles() {
    const profiles = document.querySelectorAll(".polaroid-profile");

    gsap.fromTo(
      profiles,
      {
        opacity: 0,
        y: 60,
        rotationY: -15,
        scale: 0.8,
      },
      {
        opacity: 1,
        y: 0,
        rotationY: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.4)",
        onComplete: () => {
          // Add hover animations
          profiles.forEach((profile) => {
            profile.addEventListener("mouseenter", () => {
              gsap.to(profile, {
                y: -5,
                rotationY: 5,
                duration: 0.3,
                ease: "power2.out",
              });
            });

            profile.addEventListener("mouseleave", () => {
              gsap.to(profile, {
                y: 0,
                rotationY: 0,
                duration: 0.3,
                ease: "power2.out",
              });
            });
          });
        },
      }
    );
  }

  filterProfiles(searchTerm) {
    const profiles = document.querySelectorAll(".polaroid-profile");
    const term = searchTerm.toLowerCase();

    profiles.forEach((profile) => {
      const text = profile.textContent.toLowerCase();
      const isVisible = text.includes(term);

      gsap.to(profile, {
        opacity: isVisible ? 1 : 0.3,
        scale: isVisible ? 1 : 0.8,
        duration: 0.4,
        ease: "power2.out",
      });
    });
  }

  showLoading() {
    this.profilesContainer.innerHTML = `
            <div class="loading">
                <p>Finding amazing women near you...</p>
            </div>
        `;
  }

  showNoProfiles() {
    this.profilesContainer.innerHTML = `
            <div class="error-message">
                <p>No profiles found matching your criteria.</p>
                <button class="retry-btn" onclick="location.reload()">Try Again</button>
                <button class="retry-btn" onclick="nearbyProfiles.navigateToPage('search-criteria')">Adjust Criteria</button>
            </div>
        `;
  }

  showError(message) {
    this.profilesContainer.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
                <button class="retry-btn" onclick="location.reload()">Try Again</button>
            </div>
        `;
  }

  showMessage(message) {
    this.profilesContainer.innerHTML = `
            <div class="loading">
                <p>${message}</p>
            </div>
        `;
  }

  navigateToPage(page) {
    // Add smooth page transition
    gsap.to("body", {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        switch (page) {
          case "search-criteria":
            window.location.href = "search.html";
            break;
          case "profile":
            window.location.href = "profile.html";
            break;
          case "inbox":
            window.location.href = "inbox.html";
            break;
          case "nearby":
            // Already on nearby page
            break;
          default:
            console.log("Navigation to", page, "not implemented");
        }
      },
    });
  }
}

// Initialize when DOM is loaded
let nearbyProfiles;
document.addEventListener("DOMContentLoaded", () => {
  nearbyProfiles = new NearbyProfiles();
});
