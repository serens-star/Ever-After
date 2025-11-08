class Chat {
  constructor() {
    this.messagesContainer = document.getElementById("messagesContainer");
    this.messageInput = document.getElementById("messageInput");
    this.sendButton = document.getElementById("sendButton");
    this.partnerName = document.getElementById("partnerName");
    this.partnerAvatar = document.getElementById("partnerAvatar");

    this.currentMatch = null;
    this.chatHistory = [];

    this.init();
  }

  init() {
    this.loadChatData();
    this.setupEventListeners();
    this.displayChatHistory();
    this.simulatePartnerTyping();
  }

  loadChatData() {
    // Get match ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const matchId = parseInt(urlParams.get("match"));

    if (matchId) {
      const matches = JSON.parse(
        localStorage.getItem("everAfterMatches") || "[]"
      );
      this.currentMatch = matches.find((match) => match.id === matchId);

      if (this.currentMatch) {
        this.updatePartnerInfo();
        this.loadChatHistory();
      } else {
        this.showError("Match not found");
      }
    } else {
      this.showError("No match specified");
    }
  }

  updatePartnerInfo() {
    if (this.currentMatch) {
      this.partnerName.textContent = this.currentMatch.name;
      this.partnerAvatar.src =
        this.currentMatch.image || "assets/default_user.png";
      this.partnerAvatar.alt = this.currentMatch.name;

      // Update page title
      document.title = `Chat with ${this.currentMatch.name} - Ever After`;
    }
  }

  loadChatHistory() {
    const allChats = JSON.parse(localStorage.getItem("everAfterChats") || "{}");
    this.chatHistory = allChats[this.currentMatch.id] || [];
  }

  saveChatHistory() {
    const allChats = JSON.parse(localStorage.getItem("everAfterChats") || "{}");
    allChats[this.currentMatch.id] = this.chatHistory;
    localStorage.setItem("everAfterChats", JSON.stringify(allChats));
  }

  setupEventListeners() {
    this.sendButton.addEventListener("click", () => this.sendMessage());

    this.messageInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.sendMessage();
      }
    });

    this.messageInput.addEventListener("input", () => {
      this.sendButton.disabled = !this.messageInput.value.trim();
    });
  }

  sendMessage() {
    const messageText = this.messageInput.value.trim();

    if (!messageText || !this.currentMatch) return;

    const message = {
      id: Date.now(),
      text: messageText,
      sender: "user",
      timestamp: new Date().toISOString(),
      read: true,
    };

    this.addMessageToChat(message);
    this.messageInput.value = "";
    this.sendButton.disabled = true;

    // Scroll to bottom
    this.scrollToBottom();

    // Simulate partner reply after a delay
    setTimeout(() => this.simulatePartnerReply(), 2000 + Math.random() * 3000);
  }

  addMessageToChat(message) {
    this.chatHistory.push(message);
    this.saveChatHistory();
    this.displayMessage(message);
  }

  displayChatHistory() {
    this.messagesContainer.innerHTML = "";

    if (this.chatHistory.length === 0) {
      this.showWelcomeMessage();
      return;
    }

    this.chatHistory.forEach((message) => this.displayMessage(message));
    this.scrollToBottom();
  }

  displayMessage(message) {
    const messageElement = document.createElement("div");
    messageElement.className = `message ${
      message.sender === "user" ? "sent" : "received"
    }`;

    const time = new Date(message.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    messageElement.innerHTML = `
            <div class="message-content">${this.escapeHtml(message.text)}</div>
            <div class="message-time">${time}</div>
        `;

    this.messagesContainer.appendChild(messageElement);
  }

  showWelcomeMessage() {
    const welcomeElement = document.createElement("div");
    welcomeElement.className = "welcome-message";
    welcomeElement.textContent = `You matched with ${
      this.currentMatch?.name || "this person"
    }! Start the conversation.`;
    this.messagesContainer.appendChild(welcomeElement);
  }

  simulatePartnerReply() {
    if (!this.currentMatch) return;

    const replies = [
      "Hey there! 👋",
      "Thanks for messaging me!",
      "I noticed we have a lot in common 😊",
      "How's your day going?",
      "I'd love to get to know you better!",
      "Your profile made me smile!",
      "What do you like to do for fun?",
      "I'm really enjoying this conversation!",
      "That's so interesting! Tell me more.",
      "You seem like a really cool person 💖",
    ];

    const randomReply = replies[Math.floor(Math.random() * replies.length)];

    const message = {
      id: Date.now(),
      text: randomReply,
      sender: "partner",
      timestamp: new Date().toISOString(),
      read: true,
    };

    this.addMessageToChat(message);
    this.scrollToBottom();
  }

  simulatePartnerTyping() {
    // Randomly show typing indicator
    if (Math.random() > 0.7 && this.chatHistory.length === 0) {
      setTimeout(() => {
        this.showTypingIndicator();
        setTimeout(() => {
          this.hideTypingIndicator();
          this.simulatePartnerReply();
        }, 2000 + Math.random() * 2000);
      }, 3000);
    }
  }

  showTypingIndicator() {
    const typingElement = document.createElement("div");
    typingElement.className = "typing-indicator";
    typingElement.id = "typingIndicator";
    typingElement.textContent = `${
      this.currentMatch?.name || "Partner"
    } is typing...`;
    this.messagesContainer.appendChild(typingElement);
    this.scrollToBottom();
  }

  hideTypingIndicator() {
    const typingElement = document.getElementById("typingIndicator");
    if (typingElement) {
      typingElement.remove();
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }, 100);
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  showError(message) {
    this.messagesContainer.innerHTML = `
            <div class="error-message">
                <h3>Oops! 😔</h3>
                <p>${message}</p>
                <button onclick="window.history.back()" class="back-home-btn">Go Back</button>
            </div>
        `;
  }
}

// Initialize chat when page loads
let chat;
document.addEventListener("DOMContentLoaded", () => {
  chat = new Chat();
});
