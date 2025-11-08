class CardSwipe {
  constructor() {
    this.distanceText = document.getElementById("distance-text");
    this.locationText = document.getElementById("location-text");
    this.settingsBtn = document.querySelector(".settings-btn");
    this.matchesBtn = document.querySelector(".matches-btn");
    //this.navBtns = document.querySelectorAll(".nav-btn");
    this.rejectBtn = document.querySelector(".reject-btn");
    this.acceptBtn = document.querySelector(".accept-btn");

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.getLocationAndCalculateDistance();
    this.animateCard();
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

    // Navigation buttons
    //this.navBtns.forEach((btn) => {
    //btn.addEventListener("click", (e) => {
    //const page = e.currentTarget.dataset.page;
    //this.navigateToPage(page);
    //});
    //});

    // Swipe buttons
    this.rejectBtn.addEventListener("click", () => {
      this.handleSwipeAction("reject");
    });

    this.acceptBtn.addEventListener("click", () => {
      this.handleSwipeAction("accept");
    });
  }

  animateCard() {
    const card = document.querySelector(".polaroid-card");

    gsap.fromTo(
      card,
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
        ease: "back.out(1.4)",
      }
    );
  }

  getLocationAndCalculateDistance() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLon = position.coords.longitude;

          // For demo purposes, using a fixed location (Johannesburg)
          const profileLat = -26.2041;
          const profileLon = 28.0473;

          // Calculate distance
          const distance = this.calculateDistance(
            userLat,
            userLon,
            profileLat,
            profileLon
          );

          // Update UI with distance
          this.distanceText.textContent = `${distance} miles away`;

          // Get location name using LocationIQ API
          this.getLocationName(userLat, userLon);
        },
        (error) => {
          console.error("Error getting location:", error);
          this.distanceText.textContent = "Location unavailable";
        }
      );
    } else {
      this.distanceText.textContent = "Geolocation not supported";
    }
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3959; // Earth's radius in miles
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Math.round(distance);
  }

  getLocationName(lat, lon) {
    const apiKey = "pk.a5617e2068395ccb3921dcdc4103c28a";
    const url = `https://api.locationiq.com/v1/reverse?key=${apiKey}&lat=${lat}&lon=${lon}&format=json`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Location API request failed");
        }
        return response.json();
      })
      .then((data) => {
        const city =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          "Unknown location";
        this.locationText.textContent = `(${city})`;
      })
      .catch((error) => {
        console.error("Error fetching location name:", error);
        this.locationText.textContent = "(Location unknown)";
      });
  }

  handleSwipeAction(action) {
    const card = document.querySelector(".polaroid-card");

    // Add swipe animation
    gsap.to(card, {
      x: action === "reject" ? -500 : 500,
      rotation: action === "reject" ? -30 : 30,
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
      onComplete: () => {
        // Reset card position
        gsap.set(card, {
          x: 0,
          rotation: 0,
          opacity: 0,
        });

        // Get new location data
        this.getLocationAndCalculateDistance();

        // Animate card back in
        this.animateCard();
      },
    });

    // Send action to backend (in a real app)
    // fetch('/api/swipe', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //         profileId: 'current-profile-id',
    //         action: action
    //     })
    // });
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
            window.location.href = "nearby.html";
            break;
          case "cardswipe":
            // Already on cardswipe page
            break;
          default:
            console.log("Navigation to", page, "not implemented");
        }
      },
    });
  }
}

// Initialize when DOM is loaded
let cardSwipe;
document.addEventListener("DOMContentLoaded", () => {
  cardSwipe = new CardSwipe();
});
