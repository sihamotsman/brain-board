// Select the dark mode button
const darkModeToggle = document.getElementById('dark-mode-toggle');

// Listen for clicks
darkModeToggle.addEventListener('click', () => {
    // Toggle the dark-mode class on body
    document.body.classList.toggle('dark-mode');

    // Change button text
    if (document.body.classList.contains('dark-mode')) {
        darkModeToggle.textContent = "Light Mode";
    } else {
        darkModeToggle.textContent = "Dark Mode";
    }
});
