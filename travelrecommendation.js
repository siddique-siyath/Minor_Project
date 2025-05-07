
let searchbtn = document.getElementById("searchbtn");
let clearbtn = document.getElementById("clearbtn");
let result = document.getElementById("resultContainer");
let mydiv = document.getElementById("dropdown");
let close = document.getElementById("close-btn");
let query = document.getElementById("searchinput");

const clearsearch = () => {
  query.value = "";
  mydiv.style.display = "none";
  result.innerHTML = "";
};

clearbtn.addEventListener("click", clearsearch);

const closeDropdown = () => {
  mydiv.style.display = "none";
  query.value = "";
  result.innerHTML = "";
};

close.addEventListener("click", closeDropdown);

const searchError = () => {
  mydiv.style.display = "block";
  result.innerHTML = `<p class="notfound">Sorry, we can't find your search.</p>`;
};


const displayRecommendations = (data) => {
  const createCard = (item) => `
    <div class="recommendation-card">
      <h4>${item.name}</h4>
      <img src="${item.imageUrl}" alt="${item.name}" />
      <p>${item.description}</p>
    </div>
  `;

  const beachList = document.getElementById("beach-list");
  const templeList = document.getElementById("temple-list");
  const countryList = document.getElementById("country-list");

  beachList.innerHTML = data.beaches.slice(0, 2).map(createCard).join("");
  templeList.innerHTML = data.temples.slice(0, 2).map(createCard).join("");

  const cities = data.countries.flatMap((country) => country.cities);
  countryList.innerHTML = cities.slice(0, 2).map(createCard).join("");
};

fetch("travelrecommendation.json")
  .then((res) => res.json())
  .then((data) => {
    // Attach search logic
    const search = () => {
      const searchQuery = query.value.toLowerCase().trim();
      if (!searchQuery) return;

      let hasResults = false;
      let resultsCount = 0;
      result.innerHTML = "";
      mydiv.style.display = "none";

      const sources = [
        ...data.countries.flatMap((country) => country.cities),
        ...data.temples,
        ...data.beaches,
      ];

      for (let i = 0; i < sources.length && resultsCount < 2; i++) {
        const item = sources[i];
        if (item.name.toLowerCase().includes(searchQuery)) {
          const itemHTML = `
            <div class="search-item">
              <h2 class="title">${item.name}</h2>
              <img class="search-img" src="${item.imageUrl}" alt="${item.name}">
              <p class="description">${item.description}</p>
            </div>
          `;
          result.innerHTML += itemHTML;
          hasResults = true;
          resultsCount++;
        }
      }

      if (hasResults) {
        mydiv.style.display = "block";
      } else {
        searchError();
      }
    };

    searchbtn.addEventListener("click", search);

    // Load recommendations on page load
    displayRecommendations(data);
  });
