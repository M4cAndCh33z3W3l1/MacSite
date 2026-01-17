document.addEventListener('DOMContentLoaded', (event) => {
    // Find the Explorer icon by its ID
    const explorerIcon = document.getElementById('explorer');

    // Check if the element exists before adding the event listener
    if (explorerIcon) {
        explorerIcon.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent the link from navigating anywhere
            alert('Welcome to Mac Site!'); // Show the alert box
        });
    }

    // You can add more listeners for your other icons here using their respective IDs
});
