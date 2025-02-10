document.addEventListener('DOMContentLoaded', () => {
  const countdownContainer = document.getElementById('countdown-container');
  const dayThemeButton = document.getElementById('day-theme-button');
  const nightThemeButton = document.getElementById('night-theme-button');
  const customThemeButton = document.getElementById('custom-theme-button');
  const colorPicker = document.getElementById('color-picker');
  let currentTheme = 'day'; // Default theme

  // Function to fetch the countdowns.json file
  async function loadCountdowns() {
      try {
          const response = await fetch('countdowns.json');
          const countdowns = await response.json();
          return countdowns;
      } catch (error) {
          console.error('Error loading countdowns.json:', error);
          return [];
      }
  }

  // Function to create a countdown timer element
  function createCountdownElement(countdownConfig) {
      const exampleDiv = document.createElement('div');
      exampleDiv.className = 'example';

      const title = document.createElement('h1');
      title.textContent = countdownConfig.title;
      exampleDiv.appendChild(title);

      const flipdownDiv = document.createElement('div');
      flipdownDiv.id = countdownConfig.id;
      flipdownDiv.className = 'flipdown';
      exampleDiv.appendChild(flipdownDiv);

      return exampleDiv;
  }

  // Function to apply the theme
  function applyTheme(theme, customColor = null) {
      const body = document.body;
      body.classList.remove('day-theme', 'night-theme', 'custom-theme');
      body.style.backgroundColor = ''; // Reset background color

      if (theme === 'day') {
          body.classList.add('day-theme');
          body.style.backgroundColor = '#fff'; // Light background for day theme
          currentTheme = 'day';
      } else if (theme === 'night') {
          body.classList.add('night-theme');
          body.style.backgroundColor = '#333'; // Dark background for night theme
          currentTheme = 'night';
      } else if (theme === 'custom' && customColor) {
          body.classList.add('custom-theme');
          body.style.backgroundColor = customColor; // Apply custom color
          currentTheme = 'custom';
      }
  }

  // Event listener for the day theme button
  dayThemeButton.addEventListener('click', () => {
      applyTheme('day');
      colorPicker.style.display = 'none'; // Hide color picker
  });

  // Event listener for the night theme button
  nightThemeButton.addEventListener('click', () => {
      applyTheme('night');
      colorPicker.style.display = 'none'; // Hide color picker
  });

  // Event listener for the custom theme button
  customThemeButton.addEventListener('click', () => {
      colorPicker.style.display = 'block'; // Show color picker
  });

  // Event listeners for the color picker buttons
  colorPicker.querySelectorAll('button').forEach(button => {
      button.addEventListener('click', () => {
          const color = button.dataset.color;
          applyTheme('custom', color);
      });
  });

  // Function to apply the theme on start
  function applyThemeOnStart() {
      applyTheme(currentTheme);
  }

  // Main function to initialize and start the countdowns
  async function initializeCountdowns() {
      let countdownConfigs = await loadCountdowns();

      // Function to calculate timestamp for sorting
      function calculateTimestamp(config) {
          const targetDate = new Date(
              config.year,
              config.month - 1, // Month is 0-indexed in JavaScript
              config.day,
              config.hours,
              config.minutes,
              config.seconds
          );
          return targetDate.getTime();
      }

      // Sort countdowns based on timestamp (closest to latest)
      countdownConfigs.sort((a, b) => {
          return calculateTimestamp(a) - calculateTimestamp(b);
      });

      // Loop through the countdown configurations and create the timers
      countdownConfigs.forEach(config => {
          const countdownElement = createCountdownElement(config);
          countdownContainer.appendChild(countdownElement);

          // Construct the date object from the JSON file
          const targetDate = new Date(
              config.year,
              config.month - 1, // Month is 0-indexed in JavaScript
              config.day,
              config.hours,
              config.minutes,
              config.seconds
          );

          // Get the Unix timestamp (in seconds)
          const targetTimestamp = targetDate.getTime() / 1000;

          const flipdown = new FlipDown(targetTimestamp, config.id);
          flipdown.start();
      });
  }

  applyThemeOnStart();
  initializeCountdowns(); // Call the main function

});
