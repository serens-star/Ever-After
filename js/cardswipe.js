class CardSwipe {
  constructor() {
    this.distanceText = document.getElementById("distance-text");
    this.locationText = document.getElementById("location-text");
    this.settingsBtn = document.querySelector(".settings-btn");
    this.matchesBtn = document.querySelector(".matches-btn");
    this.rejectBtn = document.querySelector(".reject-btn");
    this.acceptBtn = document.querySelector(".accept-btn");
    this.cardImage = document.querySelector(".card-image");
    this.profileName = document.querySelector(".profile-name");

    this.currentProfiles = [];
    this.currentProfileIndex = 0;
    this.swipesToday = 0;
    this.maxSwipes = 6; 
    this.swipeResetTime = 3 * 60 * 1000; 
    this.lastSwipeTime = null;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadSwipeData();
    this.generateProfiles();
    this.showCurrentProfile();
    this.updateSwipeCounter();
  }

  setupEventListeners() {
    this.settingsBtn.addEventListener("click", () => {
      this.navigateToPage("search-criteria");
    });

    this.matchesBtn.addEventListener("click", () => {
      location.reload();
    });

    this.rejectBtn.addEventListener("click", () => {
      this.handleSwipeAction("reject");
    });

    this.acceptBtn.addEventListener("click", () => {
      this.handleSwipeAction("accept");
    });

    // Add keyboard support
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") this.handleSwipeAction("reject");
      if (e.key === "ArrowRight") this.handleSwipeAction("accept");
    });
  }

  loadSwipeData() {
    const swipeData = JSON.parse(
      localStorage.getItem("everAfterSwipeData") || "{}"
    );

    // Check if reset time has passed
    if (
      swipeData.lastSwipeTime &&
      Date.now() - swipeData.lastSwipeTime > this.swipeResetTime
    ) {
      this.swipesToday = 0;
      this.lastSwipeTime = null;
    } else {
      this.swipesToday = swipeData.swipesToday || 0;
      this.lastSwipeTime = swipeData.lastSwipeTime || null;
    }
  }

  saveSwipeData() {
    const swipeData = {
      swipesToday: this.swipesToday,
      lastSwipeTime: this.lastSwipeTime,
    };
    localStorage.setItem("everAfterSwipeData", JSON.stringify(swipeData));
  }

  generateProfiles() {
    // Generate 10 random profiles for swiping
    this.currentProfiles = [];

    const names = [
      "Alex",
      "Sam",
      "Taylor",
      "Jordan",
      "Casey",
      "Riley",
      "Quinn",
      "Morgan",
      "Elaina",
      "Skyler",
    ];
    const pronounsList = [
      "she/her",
      "he/him",
      "they/them",
      "she/they",
      "he/they",
    ];
    const locations = [
      "Johannesburg",
      "Pretoria",
      "Durban",
      "East London",
      "Cape Town",
    ];

    for (let i = 0; i < 10; i++) {
      const profile = {
        id: i + 1,
        name: names[Math.floor(Math.random() * names.length)],
        age: Math.floor(Math.random() * 15) + 20, // 20-35 age range
        pronouns: pronounsList[Math.floor(Math.random() * pronounsList.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        image: profileImages.getRandomImage(),
        coordinates: this.getRandomCoordinates(),
        bio: "Looking for meaningful connections and shared adventures.",
      };
      this.currentProfiles.push(profile);
    }
  }

  getRandomCoordinates() {
    // South African coordinates bounds
    const southAfricaBounds = {
      minLat: -35,
      maxLat: -22,
      minLon: 16,
      maxLon: 33,
    };

    return {
      lat:
        southAfricaBounds.minLat +
        Math.random() * (southAfricaBounds.maxLat - southAfricaBounds.minLat),
      lon:
        southAfricaBounds.minLon +
        Math.random() * (southAfricaBounds.maxLon - southAfricaBounds.minLon),
    };
  }

  showCurrentProfile() {
    if (this.currentProfileIndex >= this.currentProfiles.length) {
      this.showNoMoreProfiles();
      return;
    }

    const profile = this.currentProfiles[this.currentProfileIndex];

    // Update card content
    this.cardImage.src = profile.image;
    this.cardImage.alt = profile.name;
    this.profileName.textContent = `${profile.name} (${profile.pronouns}), ${profile.age}`;

    // Calculate and display distance
    this.calculateAndDisplayDistance(profile);

    // Animate card entrance
    this.animateCard();
  }

  calculateAndDisplayDistance(profile) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLon = position.coords.longitude;

          const distance = this.calculateDistance(
            userLat,
            userLon,
            profile.coordinates.lat,
            profile.coordinates.lon
          );

          this.distanceText.textContent = `${distance} miles away`;
          this.getLocationName(userLat, userLon);
        },
        (error) => {
          console.error("Error getting location:", error);
          this.distanceText.textContent = "Location unavailable";
          this.locationText.textContent = `(${profile.location})`;
        }
      );
    } else {
      this.distanceText.textContent = "Geolocation not supported";
      this.locationText.textContent = `(${profile.location})`;
    }
  }

  handleSwipeAction(action) {
    // Check swipe limit
    if (this.swipesToday >= this.maxSwipes) {
      this.showSwipeLimitMessage();
      return;
    }

    const card = document.querySelector(".polaroid-card");
    const currentProfile = this.currentProfiles[this.currentProfileIndex];

    // Update swipe counter
    this.swipesToday++;
    this.lastSwipeTime = Date.now();
    this.saveSwipeData();
    this.updateSwipeCounter();

    // Show animation based on action
    if (action === "accept") {
      this.showHeartAnimation();
      this.addToMatches(currentProfile);
    } else {
      this.showBrokenHeartAnimation();
    }

    // Swipe card out
    gsap.to(card, {
      x: action === "reject" ? -500 : 500,
      rotation: action === "reject" ? -30 : 30,
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
      onComplete: () => {
        // Move to next profile
        this.currentProfileIndex++;

        if (this.currentProfileIndex < this.currentProfiles.length) {
          // Reset card position and show next profile
          gsap.set(card, { x: 0, rotation: 0, opacity: 0 });
          this.showCurrentProfile();
        } else {
          this.showNoMoreProfiles();
        }
      },
    });
  }

  showHeartAnimation() {
    this.createSwipeAnimation("❤️", "#2ed573", "Match Made!");
  }

  showBrokenHeartAnimation() {
    this.createSwipeAnimation("💔", "#ff4757", "");
  }

  createSwipeAnimation(emoji, color, text) {
    const animation = document.createElement("div");
    animation.className = "swipe-animation";
    animation.innerHTML = `
      <div class="animation-emoji">${emoji}</div>
      <div class="animation-text">${text}</div>
    `;

    document.querySelector(".swipe-container").appendChild(animation);

    gsap.fromTo(
      animation,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: "back.out(1.4)",
        onComplete: () => {
          gsap.to(animation, {
            scale: 1.2,
            opacity: 0,
            duration: 0.3,
            delay: 0.5,
            onComplete: () => animation.remove(),
          });
        },
      }
    );
  }

  addToMatches(profile) {
    const matches = JSON.parse(
      localStorage.getItem("everAfterMatches") || "[]"
    );

    // Check if already matched
    const existingMatch = matches.find((match) => match.id === profile.id);
    if (!existingMatch) {
      matches.push({
        ...profile,
        matchedAt: new Date().toISOString(),
        unread: true,
      });
      localStorage.setItem("everAfterMatches", JSON.stringify(matches));
    }
  }

  updateSwipeCounter() {
    const remainingSwipes = this.maxSwipes - this.swipesToday;
    const counter =
      document.querySelector(".swipe-counter") || this.createSwipeCounter();
    counter.textContent = `Swipes remaining: ${remainingSwipes}`;

    if (remainingSwipes === 0) {
      counter.style.color = "#ff4757";
    } else {
      counter.style.color = "var(--text)";
    }
  }

  createSwipeCounter() {
    const counter = document.createElement("div");
    counter.className = "swipe-counter";
    document.querySelector(".subtitle-section").appendChild(counter);
    return counter;
  }

  showSwipeLimitMessage() {
    const resetTime = new Date(this.lastSwipeTime + this.swipeResetTime);
    const timeUntilReset = resetTime - Date.now();
    const minutesLeft = Math.ceil(timeUntilReset / (60 * 1000));

    alert(
      `You've reached your daily swipe limit! You can swipe again in ${minutesLeft} minutes.`
    );
  }

  showNoMoreProfiles() {
    const swipeContainer = document.querySelector(".swipe-container");
    swipeContainer.innerHTML = `
      <div class="no-profiles-message">
        <h3>That's all for now! 🎉</h3>
        <p>Come back later to discover more amazing people.</p>
        <p>Swipes reset in: <span id="reset-timer">3:00</span></p>
        <button class="retry-btn" onclick="location.reload()">Check for New Profiles</button>
      </div>
    `;

    this.startResetTimer();
  }

  startResetTimer() {
    const timerElement = document.getElementById("reset-timer");
    let timeLeft = 180; // 3 minutes in seconds

    const timer = setInterval(() => {
      timeLeft--;
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      timerElement.textContent = `${minutes}:${seconds
        .toString()
        .padStart(2, "0")}`;

      if (timeLeft <= 0) {
        clearInterval(timer);
        timerElement.textContent = "Ready!";
      }
    }, 1000);
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

  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3959;
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

  navigateToPage(page) {
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
