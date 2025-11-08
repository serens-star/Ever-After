// Location API integration for card swipe page
document.addEventListener("DOMContentLoaded", function () {
  // Elements to update with location data
  const distanceText = document.getElementById("distance-text");
  const locationText = document.getElementById("location-text");

  // Get user's location and calculate distance
  getLocationAndCalculateDistance();

  // Button event listeners
  document.querySelector(".btn-reject").addEventListener("click", function () {
    handleSwipeAction("reject");
  });

  document.querySelector(".btn-accept").addEventListener("click", function () {
    handleSwipeAction("accept");
  });

  // Function to get user's location and calculate distance
  function getLocationAndCalculateDistance() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const userLat = position.coords.latitude;
          const userLon = position.coords.longitude;

          // For demo purposes, using a fixed location (Johannesburg)
          const profileLat = -26.2041;
          const profileLon = 28.0473;

          // Calculate distance
          const distance = calculateDistance(
            userLat,
            userLon,
            profileLat,
            profileLon
          );

          // Update UI with distance - format like your screenshot
          distanceText.textContent = `${distance} miles away`;

          // Get location name using LocationIQ API
          getLocationName(userLat, userLon);
        },
        function (error) {
          console.error("Error getting location:", error);
          distanceText.textContent = "Location unavailable";
        }
      );
    } else {
      distanceText.textContent = "Geolocation not supported";
    }
  }

  // Calculate distance between two coordinates using Haversine formula
  function calculateDistance(lat1, lon1, lat2, lon2) {
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

  // Get location name using LocationIQ API
  function getLocationName(lat, lon) {
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
          "Unknown location";
        locationText.textContent = `(${city})`;
      })
      .catch((error) => {
        console.error("Error fetching location name:", error);
        locationText.textContent = "(Location unknown)";
      });
  }

  // Handle swipe actions
  function handleSwipeAction(action) {
    // Add animation to the card
    const polaroidFrame = document.querySelector(".polaroid-frame");
    polaroidFrame.style.transition = "transform 0.5s ease";

    if (action === "reject") {
      polaroidFrame.style.transform = "translateX(-100%) rotate(-15deg)";
    } else {
      polaroidFrame.style.transform = "translateX(100%) rotate(15deg)";
    }

    // After animation, reset and load next card
    setTimeout(() => {
      polaroidFrame.style.transition = "none";
      polaroidFrame.style.transform = "translateX(0) rotate(0)";

      // In a real app, you would load the next profile here
      // For demo purposes, we'll just update the distance
      setTimeout(() => {
        getLocationAndCalculateDistance();
      }, 100);
    }, 500);

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
});
