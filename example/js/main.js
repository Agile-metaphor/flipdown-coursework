document.addEventListener('DOMContentLoaded', () => {
  const countdownContainer = document.getElementById('countdown-container');
  const themeButton = document.getElementById('theme-button');
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
          themeButton.textContent = 'Night Theme'; // Set button label to "Night"

      } else if (theme === 'night') {
          body.classList.add('night-theme');
          body.style.backgroundColor = '#333'; // Dark background for night theme
          themeButton.textContent = 'Custom Theme'; // Set button label to "Custom"
      } else if (theme === 'custom' && customColor) {
          body.classList.add('custom-theme');
          body.style.backgroundColor = customColor; // Apply custom color
          themeButton.textContent = 'Day Theme'; // Set button label to "Day"
      }
  }

  // Function to toggle the theme
  function toggleTheme() {
      if (currentTheme === 'day') {
          currentTheme = 'night';
          applyTheme('night');

          //hide the color picker
          colorPicker.style.display = 'none';
      } else if (currentTheme === 'night') {
          currentTheme = 'custom';
          //applyTheme('custom');

          colorPicker.style.display = 'block'; //show the color picker
          themeButton.textContent = 'Choose a color';
          themeButton.style.display = 'none';


      } else {
          currentTheme = 'day';
          applyTheme('day');
      }
  }

  // Event listener for the theme button
  themeButton.addEventListener('click', toggleTheme);

  // Event listeners for the color picker buttons
  colorPicker.querySelectorAll('button').forEach(button => {
      button.addEventListener('click', () => {
          const color = button.dataset.color;
          applyTheme('custom', color);
          currentTheme = 'day';
          themeButton.style.display = 'block';
          themeButton.textContent = 'Day Theme';
          colorPicker.style.display = 'none';


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
