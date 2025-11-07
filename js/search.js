const API_KEY = "pk.a5617e2068395ccb3921dcdc4103c28a";
const BASE_URL = "https://api.locationiq.com/v1/search";

document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("searchForm");

  // Get form elements
  const gender = document.getElementById("gender");
  const pronouns = document.getElementById("pronouns");
  const sexuality = document.getElementById("sexuality");
  const ageMin = document.getElementById("ageMin");
  const ageMax = document.getElementById("ageMax");
  const location = document.getElementById("location");
  const relationshipStyle = document.getElementById("relationshipStyle");
  const relationshipType = document.getElementById("relationshipType");

  // Load saved preferences
  const savedPrefs = JSON.parse(
    localStorage.getItem("everAfterSearchPrefs") || "{}"
  );
  
  if (savedPrefs.gender) gender.value = savedPrefs.gender;
  if (savedPrefs.pronouns) pronouns.value = savedPrefs.pronouns;
  if (savedPrefs.sexuality) sexuality.value = savedPrefs.sexuality;
  if (savedPrefs.ageMin) ageMin.value = savedPrefs.ageMin;
  if (savedPrefs.ageMax) ageMax.value = savedPrefs.ageMax;
  if (savedPrefs.location) location.value = savedPrefs.location;
  if (savedPrefs.relationshipStyle) relationshipStyle.value = savedPrefs.relationshipStyle;
  if (savedPrefs.relationshipType) relationshipType.value = savedPrefs.relationshipType;

  // Save Preferences
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const prefs = {
      gender: gender.value,
      pronouns: pronouns.value,
      sexuality: sexuality.value,
      ageMin: parseInt(ageMin.value),
      ageMax: parseInt(ageMax.value),
      location: location.value,
      relationshipStyle: relationshipStyle.value,
      relationshipType: relationshipType.value,
      lastUpdated: new Date().toISOString()
    };

    console.log("Saving preferences:", prefs);
    localStorage.setItem("everAfterSearchPrefs", JSON.stringify(prefs));

    // Redirect to nearby screen with smooth transition
    gsap.to("body", {
      opacity: 0,
      duration: 0.6,
      onComplete: () => {
        window.location.href = "nearby.html";
      },
    });
  });

  // Add some initial animation
  gsap.from(".search-header", { y: -50, opacity: 0, duration: 0.8 });
  gsap.from("fieldset", { y: 30, opacity: 0, duration: 0.6, stagger: 0.1 });
});

