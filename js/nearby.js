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
    const locations = [
      "Cape Town",
      "Johannesburg",
      "Durban",
      "Pretoria",
      "Port Elizabeth",
    ];
    const sexualities = ["Lesbian", "Bisexual", "Pansexual", "Queer"];
    const relationshipStyles = [
      "Monogamous",
      "Polyamorous",
      "Open",
      "Relationship Anarchist",
    ];
    const relationshipTypes = [
      "Casual",
      "Long-term",
      "Friendship",
      "Situationship",
    ];
    const pronouns = ["she/her", "they/them", "she/they"];

    // If no criteria are set, show all profiles
    if (Object.keys(criteria).length === 0) {
      return Array.from({ length: 6 }, (_, i) => ({
        id: i + 1,
        name: names[Math.floor(Math.random() * names.length)],
        age: Math.floor(Math.random() * 15) + 22,
        gender: "Woman",
        pronouns: pronouns[Math.floor(Math.random() * pronouns.length)],
        sexuality: sexualities[Math.floor(Math.random() * sexualities.length)],
        relationshipStyle:
          relationshipStyles[
            Math.floor(Math.random() * relationshipStyles.length)
          ],
        relationshipType:
          relationshipTypes[
            Math.floor(Math.random() * relationshipTypes.length)
          ],
        distance: (Math.random() * 15 + 1).toFixed(1),
        location: locations[Math.floor(Math.random() * locations.length)],
        image: `assets/Profile_Card_Icon.png`,
      }));
    }

    // Apply criteria filters if they exist
    const filteredProfiles = Array.from({ length: 6 }, (_, i) => {
      const profile = {
        id: i + 1,
        name: names[Math.floor(Math.random() * names.length)],
        age: Math.floor(Math.random() * 15) + 22,
        gender: "Woman",
        pronouns: pronouns[Math.floor(Math.random() * pronouns.length)],
        sexuality: sexualities[Math.floor(Math.random() * sexualities.length)],
        relationshipStyle:
          relationshipStyles[
            Math.floor(Math.random() * relationshipStyles.length)
          ],
        relationshipType:
          relationshipTypes[
            Math.floor(Math.random() * relationshipTypes.length)
          ],
        distance: (Math.random() * 15 + 1).toFixed(1),
        location: locations[Math.floor(Math.random() * locations.length)],
        image: `assets/Profile_Card_Icon.png`,
      };

      return this.applyCriteria(profile, criteria);
    }).filter((profile) => profile !== null);

    return filteredProfiles;
  }

  applyCriteria(profile, criteria) {
    // Age filter
    if (criteria.ageMin && profile.age < parseInt(criteria.ageMin)) return null;
    if (criteria.ageMax && profile.age > parseInt(criteria.ageMax)) return null;

    // Gender filter (simplified for demo)
    if (
      criteria.gender &&
      criteria.gender !== "any" &&
      criteria.gender !== "Any"
    ) {
      // Add your gender matching logic here
    }

    // Sexuality filter
    if (
      criteria.sexuality &&
      criteria.sexuality !== "any" &&
      criteria.sexuality !== "Any"
    ) {
      if (
        profile.sexuality.toLowerCase() !== criteria.sexuality.toLowerCase()
      ) {
        return null;
      }
    }

    return profile;
  }

  displayProfiles(profiles) {
    this.profilesContainer.innerHTML = "";

    profiles.forEach((profile) => {
      const profileElement = this.createProfileElement(profile);
      this.profilesContainer.appendChild(profileElement);
    });
  }

  createProfileElement(profile) {
    const article = document.createElement("article");
    article.className = "polaroid-profile";
    article.innerHTML = `
            <img src="${profile.image}" alt="${profile.name}" class="profile-image" 
                 onerror="this.src='assets/Profile_Card_Icon.png'">
            <section class="profile-info">
                <h2 class="name-age">
                    ${profile.name}, ${profile.age}
                    <svg class="diamond" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                    </svg>
                </h2>
                <div class="details-grid">
                    <div class="detail-item">
                        <span class="detail-label">Gender</span>
                        <span class="detail-value">${profile.gender}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Pronouns</span>
                        <span class="detail-value">${profile.pronouns}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Sexuality</span>
                        <span class="detail-value">${profile.sexuality}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Style</span>
                        <span class="detail-value">${profile.relationshipStyle}</span>
                    </div>
                </div>
                <div class="distance">${profile.distance} km away • ${profile.location}</div>
            </section>
        `;

    return article;
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
