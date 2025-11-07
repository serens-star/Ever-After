document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("searchForm");

  const gender = document.getElementById("gender");
  const pronouns = document.getElementById("pronouns");
  const sexuality = document.getElementById("sexuality");
  const ageMin = document.getElementById("ageMin");
  const ageMax = document.getElementById("searchScope");
  const relationshipStyle = document.getElementById("relationshipStyle");
  const relationshipType = document.getElementById(relationshipType);

  //Load saved preferences
  const savedPrefs = JSON.parse(
    localStorage.getItem("everAfterSearchPrefs") || "{}"
  );
  if (savedPrefs.gender) gender.value = savedPrefs.gender;
  if (savedPrefs.pronouns) pronouns.value = savedPrefs.pronouns;
  if (savedPrefs.sexuality) sexuality.value = savedPrefs.sexuality;
  if (savedPrefs.ageMin) ageMin.value = savedPrefs.ageMin;
  if (savedPrefs.ageMax) ageMax.value = savedPrefs.ageMax;
  if (savedPrefs.searchScope)
    searchScope.checked = savedPrefs.searchScope === "global";
  if (savedPrefs.relationshipStyle)
    relationshipStyle.value = savedPrefs.relationshipStyle;
  if (savedPrefs.relationshipType)
    relationshipType.value = savedPrefs.relationshipType;

  //Save Preferences
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const prefs = {
      gender: gender.value,
      pronouns: pronouns.value,
      ageMin: ageMin.value,
      ageMax: ageMax.value,
      searchScope: searchScope.checked ? "global" : "local",
      relationshipStyle: relationshipStyle.value,
      relationshipType: relationshipType.value,
    };

    localStorage.setItem("everAfterSearchPrefs", JSON.stringify(prefs));

    //Redirect to nearby screen
    gsap.to("body", {
      opacity: 0,
      duration: 0.6,
      onComplete: () => {
        window.location.href = "nearby.html";
      },
    });
  });

  //Example placeholder API for user data
  fetch("https://dummyjson.com/users")
    .then((res) => res.json())
    .then((data) => {
      console.log("[EverAfter API] Sample user data", data.users.slice(0, 5));
    })
    .catch((err) => console.error("[EverAfter API] Error:", err));
});

document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("searchForm");

  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const preferences = {
        gender:
          document.querySelector('input[name="gender"]:checked')?.value || "",
        pronouns: document.getElementById("pronouns")?.value || "",
        sexuality: document.getElementById("sexuality")?.value || "",
        relationshipStyle:
          document.getElementById("relationshipStyle")?.value || "",
        relationshipType:
          document.getElementById("relationshipType")?.value || "",
        ageRange: document.getElementById("ageRange")?.value || "",
        searchArea:
          document.querySelector('input[name="searchArea"]:checked')?.value ||
          "",
      };

      localStorage.setItem("searchPreferences", JSON.stringify(preferences));

      gsap.to("body", {
        opacity: 0,
        duration: 0.6,
        onComplete: () => {
          window.location.href = "nearby.html";
        },
      });
    });
  }
});
