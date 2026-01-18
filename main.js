const icons = document.querySelectorAll('.icon');
const gridSize = 100;

// Function to update the clock dynamically
function updateClock() {
    const now = new Date();
    // Use user's local time formatting
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById('clock').textContent = timeString;
}

// Update clock immediately and then every minute
updateClock();
setInterval(updateClock, 60000); 

// --- DRAGGING & SNAPPING LOGIC (Remains the same) ---
icons.forEach(icon => {
    let isDragging = false;
    let offsetX, offsetY;

    icon.addEventListener('mousedown', (e) => {
        if (e.target.contentEditable === "true") return;
        isDragging = true;
        const rect = icon.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        icon.style.zIndex = 1000;
        icon.style.transition = "none";
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        icon.style.left = `${e.clientX - offsetX}px`;
        icon.style.top = `${e.clientY - offsetY}px`;
    });

    window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        icon.style.zIndex = "";

        const left = parseInt(icon.style.left);
        const top = parseInt(icon.style.top);
        
        const snappedLeft = Math.max(10, Math.round(left / gridSize) * gridSize);
        const snappedTop = Math.max(10, Math.round(top / gridSize) * gridSize);

        icon.style.transition = "all 0.2s ease-out";
        icon.style.left = `${snappedLeft}px`;
        icon.style.top = `${snappedTop}px`;
    });
});
