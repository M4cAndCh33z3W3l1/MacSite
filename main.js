const icons = document.querySelectorAll('.icon');
const GRID_SIZE = 100;
const SNAP_OFFSET = 10; // Start icons 10px from edge

// Function to update the clock (as requested previously)
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const clockElement = document.getElementById('clock');
    if (clockElement) {
        clockElement.textContent = timeString;
    }
}
updateClock();
setInterval(updateClock, 60000); 


// Function to calculate the correct snapped position
function snapIconToGrid(icon, clientX, clientY, offsetX, offsetY) {
    // Calculate where the top-left of the icon SHOULD be
    const targetLeft = clientX - offsetX;
    const targetTop = clientY - offsetY;

    // Snap that target position to the nearest grid line
    const snappedLeft = Math.round(targetLeft / GRID_SIZE) * GRID_SIZE;
    const snappedTop = Math.round(targetTop / GRID_SIZE) * GRID_SIZE;

    // Apply position, ensuring a minimum offset from the edge
    icon.style.left = `${Math.max(SNAP_OFFSET, snappedLeft)}px`;
    icon.style.top = `${Math.max(SNAP_OFFSET, snappedTop)}px`;
}

// --- DRAGGING LOGIC ---
icons.forEach((icon, index) => {
    let isDragging = false;
    let offsetX = 0, offsetY = 0;

    // 1. Initial Positioning: Snap all icons on load
    // Position vertically down the left side, starting at 10px from top
    icon.style.left = `${SNAP_OFFSET}px`;
    icon.style.top = `${SNAP_OFFSET + (index * GRID_SIZE)}px`;

    icon.addEventListener('mousedown', (e) => {
        if (e.target.contentEditable === "true") return;
        isDragging = true;
        const rect = icon.getBoundingClientRect();
        // Calculate offsets correctly from initial click point
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        icon.style.zIndex = 1000;
        icon.style.transition = "none"; // Disable smooth transition while dragging
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        // Move icon exactly with the mouse while dragging
        icon.style.left = `${e.clientX - offsetX}px`;
        icon.style.top = `${e.clientY - offsetY}px`;
    });

    window.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        icon.style.zIndex = "";
        icon.style.transition = "all 0.2s ease-out"; // Re-enable transition for snap

        // 2. Snapping on Release
        // The mouse coordinates (e.clientX/Y) are available in mouseup event
        snapIconToGrid(icon, e.clientX, e.clientY, offsetX, offsetY);
    });
});
