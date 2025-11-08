// Profile Images Management
class ProfileImages {
  constructor() {
    this.images = [
      "assets/profile1.jpg",
      "assets/profile2.jpg",
      "assets/profile3.jpg",
      "assets/profile4.jpg",
      "assets/profile5.jpg",
      "assets/profile6.jpg",
      "assets/profile7.jpg",
      "assets/profile8.jpg",
      "assets/profile9.jpg",
    ];

    // Fallback images if some are missing
    this.fallbackImages = [
      "assets/Profile_Card_Icon.png",
      "assets/EverAfter_Logo.png",
      "assets/default_profile.png",
    ];
  }

  getRandomImage() {
    const availableImages = this.images.filter((img) => this.imageExists(img));

    if (availableImages.length === 0) {
      // Use fallback images
      const randomIndex = Math.floor(
        Math.random() * this.fallbackImages.length
      );
      return this.fallbackImages[randomIndex];
    }

    const randomIndex = Math.floor(Math.random() * availableImages.length);
    return availableImages[randomIndex];
  }

  imageExists(imagePath) {
    // Simple check - in real app, you'd want to verify the image actually loads
    return true; // For now, assume images exist
  }

  getMultipleRandomImages(count) {
    const images = [];
    for (let i = 0; i < count; i++) {
      images.push(this.getRandomImage());
    }
    return images;
  }
}

// Initialize global instance
const profileImages = new ProfileImages();
