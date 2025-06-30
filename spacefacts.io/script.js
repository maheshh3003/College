const moonFacts = {
    "moon_facts": [
      {
        "id": 1,
        "fact": "The Moon is Earth's only natural satellite and the fifth largest satellite in the Solar System",
        "category": "general"
      },
      {
        "id": 2,
        "fact": "The Moon's surface gravity is about 1/6 of Earth's gravity",
        "category": "physics"
      },
      {
        "id": 3,
        "fact": "The Moon is gradually moving away from Earth at a rate of approximately 3.8 centimeters per year",
        "category": "orbital_dynamics"
      },
      {
        "id": 4,
        "fact": "The Moon's diameter is about 3,475 kilometers, roughly one-quarter the size of Earth",
        "category": "dimensions"
      },
      {
        "id": 5,
        "fact": "The first human footprints on the Moon will last for millions of years due to no atmosphere or wind",
        "category": "exploration"
      },
      {
        "id": 6,
        "fact": "The Moon completes one rotation on its axis in the same time it takes to orbit Earth, which is why we always see the same side",
        "category": "orbital_dynamics"
      },
      {
        "id": 7,
        "fact": "The Moon's surface temperature ranges from 127°C (260°F) during the day to -173°C (-280°F) at night",
        "category": "environment"
      },
      {
        "id": 8,
        "fact": "The Moon has no atmosphere, which means no sound can travel on its surface",
        "category": "environment"
      },
      {
        "id": 9,
        "fact": "The dark patches visible from Earth are called 'maria' (seas), but they're actually basaltic plains",
        "category": "geography"
      },
      {
        "id": 10,
        "fact": "Only 12 humans have ever walked on the Moon's surface, all American men between 1969 and 1972",
        "category": "exploration"
      },
      {
        "id": 11,
        "fact": "The Moon was likely formed when a Mars-sized object collided with Earth about 4.5 billion years ago",
        "category": "formation"
      },
      {
        "id": 12,
        "fact": "The Moon's core is relatively small, with a radius of roughly 350 kilometers",
        "category": "structure"
      },
      {
        "id": 13,
        "fact": "Moonquakes, caused by the Moon's gravitational interactions with Earth, can last for up to several hours",
        "category": "geology"
      },
      {
        "id": 14,
        "fact": "The Moon's mass is about 1.2% of Earth's mass",
        "category": "physics"
      },
      {
        "id": 15,
        "fact": "There is water ice in permanently shadowed craters at the Moon's poles",
        "category": "resources"
      },
      {
        "id": 16,
        "fact": "The Moon's orbit around Earth is elliptical, not circular, causing its apparent size to vary",
        "category": "orbital_dynamics"
      },
      {
        "id": 17,
        "fact": "The Moon's surface is covered in a layer of broken rock and dust called regolith",
        "category": "geology"
      },
      {
        "id": 18,
        "fact": "The Moon has more than 300,000 craters wider than 1 kilometer on its near side",
        "category": "geography"
      },
      {
        "id": 19,
        "fact": "The Moon's presence helps stabilize Earth's axial tilt, which gives us relatively stable seasons",
        "category": "environmental_impact"
      },
      {
        "id": 20,
        "fact": "A lunar day (from one sunrise to the next) lasts about 29.5 Earth days",
        "category": "time"
      }
    ]
  }
  

document.addEventListener('DOMContentLoaded', () => {
    const factsContainer = document.getElementById('facts-container');
    const categoryFilter = document.getElementById('category-filter');
    
    // Get unique categories and populate filter
    const categories = [...new Set(moonFacts.moon_facts.map(fact => fact.category))];
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.replace('_', ' ').toUpperCase();
        categoryFilter.appendChild(option);
    });

    // Display facts function
    function displayFacts(facts) {
        factsContainer.innerHTML = '';
        facts.forEach(fact => {
            const factCard = document.createElement('div');
            factCard.className = 'fact-card';
            factCard.innerHTML = `
                <div class="fact-content">${fact.fact}</div>
                <div class="category-tag">${fact.category.replace('_', ' ').toUpperCase()}</div>
            `;
            factsContainer.appendChild(factCard);
        });
    }

    // Initial display
    displayFacts(moonFacts.moon_facts);

    // Filter change handler
    categoryFilter.addEventListener('change', (e) => {
        const selectedCategory = e.target.value;
        const filteredFacts = selectedCategory === 'all' 
            ? moonFacts.moon_facts
            : moonFacts.moon_facts.filter(fact => fact.category === selectedCategory);
        displayFacts(filteredFacts);
    });
});
