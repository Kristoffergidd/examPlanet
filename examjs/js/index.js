const popup = document.getElementById("planetPopup");
const popupTitle = document.getElementById("popupTitle");
const popupInfo = document.getElementById("popupInfo");
const closeButton = document.getElementById("closePopup");

// getPlanetInfo min funktion för att hämta informationen om en planet baserat på ID
async function getPlanetInfo(planetId) {
  try {
    console.log("Requested Planet ID:", planetId);

    // här kallar vi på vår fetchApiKey funktion som hämtar api nyckeln
    const apiKey = await fetchApiKey();

    // kollar ifall api nyckeln finns
    if (!apiKey) {
      console.error("API key not available. Fetch the API key first.");
      return;
    }

    // Här hämtar vi planetinformationen med apinyckeln
    const response = await fetch(
      "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies",
      {
        method: "GET",
        headers: { "x-zocom": apiKey },
      }
    );

    // Konverterar svaret till Json
    const data = await response.json();
    console.log("API Response:", data);

    // Hittar och visar informatioen om planeten Här kallar vi även på vår funktion findPlanetInfo där data då är variablen som håller i api informationen om planeterna och planetid som identifierer de unika planeterna

    const planetInfo = findPlanetInfo(data, planetId);
    if (planetInfo) {
      displayPlanetInfo(planetInfo);
    } else {
      console.error("Planet information not found");
    }
  } catch (error) {
    console.error("Error fetching planet information:", error);
  }
}

// fetchApiKey min funktion för att hämta API nyckeln
async function fetchApiKey() {
  try {
    const postResponse = await fetch(
      "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/keys",
      {
        method: "POST",
      }
    );

    const postData = await postResponse.json();

    console.log("API Key Response:", postData);

    if (postData.key) {
      console.log("API Key fetched successfully:", postData.key);
      return postData.key;
    } else {
      console.error("API Key not found in the response");
      return null;
    }
  } catch (error) {
    console.error("Error fetching API key:", error);
    return null;
  }
}

function findPlanetInfo(data, planetId) {
  // här hämtar vi allt från api responsen
  const bodies = data.bodies;
  console.log("All planets:", bodies);

  // Här använder vi Array.find() för att hitta planeten med det angivna ID:t

  const planetInfo = bodies.find(
    (planet) => planet.id === parseInt(planetId, 10)
  );
  console.log("Found Planet ID:", parseInt(planetId, 10));
  console.log("Found Planet:", planetInfo);

  // Returnera informationen om det hittade planeten (eller null om ingen planet hittades)

  return planetInfo;
}

// displayplanetinfo är vår funktion som skriver ut datan från apin till hemsidan här skriver jag ut  informationen genom att hämta informationen från planet. och sedan  lagrar jag dom i p taggar för att kunna styla
function displayPlanetInfo(planet) {
  popupTitle.textContent = planet.name;
  popupInfo.innerHTML = `
    <div class="planet-info">  
      <p class="planet-desc">${planet.desc}</p>
      <p class="planet-latin-name">${planet.latinName}</p>
      <p class="planet-moons">MÅNAR <br>${planet.moons}</p> 
      <p class="planet-circumference">OMKRETS <br>${planet.circumference}</p>
      <p class="planet-distance">KM FRÅN SOLEN <br>${planet.distance}</p>
      <p class="planet-max-temp-day">MAX TEMPERATURE<br> ${planet.temp.day}°C</p>
      <p class="planet-max-temp-night">MAX TEMPERATURE<br> ${planet.temp.night}°C</p>
    </div>
  `;
  popup.style.display = "block";
}

// här gör vi en for loop till planeterna och lägger en eventlistener klick till planeterna. Vi kallar även här på getplanetinfo och genom planetid, 9 kan vi koppla dom så att vi får rätt information
const planets = document.querySelectorAll(".planet");
planets.forEach((planet) => {
  planet.addEventListener("click", () => getPlanetInfo(parseInt(planet.id, 9)));
});

// lägger till eventlistener klick
closeButton.addEventListener("click", function () {
  popup.style.display = "none";
});
