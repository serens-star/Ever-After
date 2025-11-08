class InboxPage {
  constructor() {
    this.settingsBtn = document.querySelector(".settings-btn");
    this.matchesBtn = document.querySelector(".matches-btn");
    this.navBtns = document.querySelectorAll(".nav-btn");
    this.inboxTabs = document.querySelectorAll(".inbox-tab");
    this.tabContents = document.querySelectorAll(".tab-content");
    this.matchesContainer = document.getElementById("matchesContainer");
    this.noMatchesMessage = document.getElementById("noMatchesMessage");

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupTabSwitching();
    this.loadMatches();
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
        this.inboxTabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");

        // Show corresponding content
        this.tabContents.forEach((content) => {
          content.classList.remove("active");
          if (content.id === `${targetTab}-content`) {
            content.classList.add("active");
          }
        });

        // Load matches when matches tab is selected
        if (targetTab === "matches") {
          this.loadMatches();
        }

        // Animate content transition
        this.animateTabTransition(targetTab);
      });
    });
  }

  loadMatches() {
    const matches = this.getMatchesFromStorage();

    if (matches.length === 0) {
      this.showNoMatches();
    } else {
      this.displayMatches(matches);
    }
  }

  getMatchesFromStorage() {
    // Get matches from localStorage (saved from card swipe)
    const matches = JSON.parse(
      localStorage.getItem("everAfterMatches") || "[]"
    );

    // Sort by most recent first
    return matches.sort(
      (a, b) => new Date(b.matchedAt) - new Date(a.matchedAt)
    );
  }

  displayMatches(matches) {
    // Hide no matches message
    if (this.noMatchesMessage) {
      this.noMatchesMessage.classList.add("hidden");
    }

    // Clear container
    this.matchesContainer.innerHTML = "";

    // Add each match card
    matches.forEach((match, index) => {
      const matchCard = this.createMatchCard(match, index);
      this.matchesContainer.appendChild(matchCard);
    });

    // Animate matches entrance
    this.animateMatchesEntrance();
  }

  createMatchCard(match, index) {
    const matchCard = document.createElement("div");
    matchCard.className = `match-card ${match.unread ? "new-match" : ""}`;
    matchCard.innerHTML = `
      <img src="${match.image || "assets/default_user.png"}" alt="${
      match.name
    }" class="match-avatar">
      <div class="match-info">
        <h3 class="match-name">${match.name}, ${match.age}</h3>
        <p class="match-details">${match.pronouns}</p>
        <p class="match-location">📍 ${match.location}</p>
        <p class="match-time">Matched ${this.formatTimeAgo(match.matchedAt)}</p>
      </div>
      <div class="match-actions">
        <button class="chat-btn" onclick="inboxPage.startChat(${
          match.id
        })" title="Start chat">💬</button>
      </div>
      ${match.unread ? '<div class="unread-indicator"></div>' : ""}
    `;

    return matchCard;
  }

  showNoMatches() {
    if (this.noMatchesMessage) {
      this.noMatchesMessage.classList.remove("hidden");
    }
    this.matchesContainer.innerHTML = "";
  }

  formatTimeAgo(timestamp) {
    const now = new Date();
    const matchTime = new Date(timestamp);
    const diffInMs = now - matchTime;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return diffInMinutes < 1 ? "just now" : `${diffInMinutes}m ago`;
    }
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  }

  startChat(matchId) {
    // Mark match as read
    const matches = this.getMatchesFromStorage();
    const matchIndex = matches.findIndex((match) => match.id === matchId);

    if (matchIndex !== -1) {
      matches[matchIndex].unread = false;
      localStorage.setItem("everAfterMatches", JSON.stringify(matches));

      // Update the UI
      const matchCard = document.querySelector(
        `.match-card:nth-child(${matchIndex + 1})`
      );
      if (matchCard) {
        matchCard.classList.remove("new-match");
        const unreadIndicator = matchCard.querySelector(".unread-indicator");
        if (unreadIndicator) unreadIndicator.remove();
      }
    }

    // In a real app, you'd open a chat interface
    // For now, show a message and simulate opening chat
    this.simulateChatOpening(matchId);
  }

  simulateChatOpening(matchId) {
    const matches = this.getMatchesFromStorage();
    const match = matches.find((m) => m.id === matchId);

    if (match) {
      // Create a simple chat simulation
      const chatWindow = document.createElement("div");
      chatWindow.className = "chat-simulation";
      chatWindow.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 1000;
        max-width: 300px;
        width: 90%;
        text-align: center;
        border: 3px solid var(--accent);
      `;

      chatWindow.innerHTML = `
        <h3 style="font-family: 'Courgette', cursive; color: var(--text); margin-bottom: 15px;">
          Chat with ${match.name}
        </h3>
        <p style="margin-bottom: 20px; color: var(--text);">
          This would open a real chat interface where you can message ${match.name}.
        </p>
        <button onclick="this.parentElement.remove()" 
                style="background: var(--button); 
                       color: var(--text); 
                       border: none; 
                       padding: 10px 20px; 
                       border-radius: 20px; 
                       cursor: pointer;
                       font-family: 'Caveat', cursive;
                       font-size: 1.1rem;">
          Close
        </button>
      `;

      document.body.appendChild(chatWindow);
    }
  }

  animateMatchesEntrance() {
    const matchCards = document.querySelectorAll(".match-card");

    gsap.fromTo(
      matchCards,
      {
        opacity: 0,
        y: 30,
        scale: 0.9,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.2)",
      }
    );
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

  // Method to check for new matches (could be called periodically)
  checkForNewMatches() {
    const matches = this.getMatchesFromStorage();
    const newMatches = matches.filter((match) => match.unread);

    if (newMatches.length > 0 && this.inboxTabs[2]) {
      // Matches tab
      // Add notification badge to matches tab
      this.inboxTabs[2].innerHTML = `Matches <span class="tab-badge">${newMatches.length}</span>`;
    }
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
}

// Initialize when DOM is loaded
let inboxPage;
document.addEventListener("DOMContentLoaded", () => {
  inboxPage = new InboxPage();

  // Check for new matches every 10 seconds
  setInterval(() => {
    inboxPage.checkForNewMatches();
  }, 10000);
});
