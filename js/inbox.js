class InboxPage {
  constructor() {
    this.settingsBtn = document.querySelector(".settings-btn");
    this.matchesBtn = document.querySelector(".matches-btn");
    this.navBtns = document.querySelectorAll(".nav-btn");
    this.inboxTabs = document.querySelectorAll(".inbox-tab");
    this.tabContents = document.querySelectorAll(".tab-content");

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupTabSwitching();
    this.loadLocationBasedContent();
    this.animatePageLoad();
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
    this.navBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const page = e.currentTarget.dataset.page;
        this.navigateToPage(page);
      });
    });
  }

  setupTabSwitching() {
    this.inboxTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const targetTab = tab.dataset.tab;
        
        // Update active tab
        this.inboxTabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        
        // Show corresponding content
        this.tabContents.forEach(content => {
          content.classList.remove("active");
          if (content.id === `${targetTab}-content`) {
            content.classList.add("active");
          }
        });

        // Animate content transition
        this.animateTabTransition(targetTab);
      });
    });
  }

  animateTabTransition(tab) {
    const activeContent = document.getElementById(`${tab}-content`);
    
    gsap.fromTo(
      activeContent,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      }
    );
  }

  animatePageLoad() {
    gsap.fromTo(
      ".connections-section",
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "back.out(1.2)",
      }
    );

    // Stagger animation for message cards
    gsap.fromTo(
      ".message-card, .notification-card",
      {
        opacity: 0,
        x: -50,
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.3,
      }
    );
  }

  loadLocationBasedContent() {
    // Get user's location to show relevant connections
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLon = position.coords.longitude;
          
          // Update distance information for notifications
          this.updateNotificationDistances(userLat, userLon);
          
          // Get location name for personalization
          this.getUserLocationName(userLat, userLon);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Use default distances if location unavailable
          this.updateNotificationDistances();
        }
      );
    } else {
      // Use default distances if geolocation not supported
      this.updateNotificationDistances();
    }
  }

  updateNotificationDistances(userLat = null, userLon = null) {
    const distanceElements = document.querySelectorAll(".notification-distance");
    
    distanceElements.forEach((element) => {
      if (userLat && userLon) {
        // Calculate realistic distances based on user location
        const distance = this.calculateRandomDistance(userLat, userLon);
        element.textContent = `${distance} miles away`;
      } else {
        // Use random distances as fallback
        const randomDistance = Math.floor(Math.random() * 20) + 1;
        element.textContent = `${randomDistance} miles away`;
      }
    });
  }

  calculateRandomDistance(userLat, userLon) {
    // Generate realistic distances within a reasonable range
    const baseDistance = Math.floor(Math.random() * 15) + 1;
    
    // Add some variation based on location (simulated)
    const locationVariation = Math.floor(Math.random() * 5);
    
    return baseDistance + locationVariation;
  }

  getUserLocationName(lat, lon) {
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
        // Extract city name from response
        const city =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          "your area";
        
        // You could use this to personalize the inbox content
        console.log(`Showing connections near ${city}`);
        
        // Example: Update page title or add location context
        // document.querySelector('.connections-title').textContent = `Connections in ${city}`;
      })
      .catch((error) => {
        console.error("Error fetching location name:", error);
      });
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
          case "nearby":
            window.location.href = "nearby.html";
            break;
          case "cardswipe":
            window.location.href = "cardswipe.html";
            break;
          case "inbox":
            // Already on inbox page
            break;
          default:
            console.log("Navigation to", page, "not implemented");
        }
      },
    });
  }

  // Method to simulate receiving new messages (for demo purposes)
  simulateNewMessage() {
    const inboxContent = document.getElementById("inbox-content");
    const newMessage = document.createElement("article");
    newMessage.className = "message-card";
    newMessage.innerHTML = `
      <span class="message-status unread"></span>
      <section class="message-content">
        <h3 class="sender-name">New Connection</h3>
        <p class="message-preview">Just liked your profile!</p>
        <time class="message-time">Just now</time>
      </section>
    `;
    
    inboxContent.insertBefore(newMessage, inboxContent.firstChild);
    
    // Animate new message
    gsap.fromTo(
      newMessage,
      {
        opacity: 0,
        y: -20,
        scale: 0.8,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.2)",
      }
    );
  }
}

// Initialize when DOM is loaded
let inboxPage;
document.addEventListener("DOMContentLoaded", () => {
  inboxPage = new InboxPage();
  
  // Demo: Simulate receiving a new message after 5 seconds
  setTimeout(() => {
    inboxPage.simulateNewMessage();
  }, 5000);
});