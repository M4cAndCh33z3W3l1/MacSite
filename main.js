const icons = document.querySelectorAll('.icon');
const GRID_SIZE = 100;
const SNAP_OFFSET = 10; 

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

function snapIconToGrid(icon, clientX, clientY, offsetX, offsetY) {
    const targetLeft = clientX - offsetX;
    const targetTop = clientY - offsetY;
    const snappedLeft = Math.round(targetLeft / GRID_SIZE) * GRID_SIZE;
    const snappedTop = Math.round(targetTop / GRID_SIZE) * GRID_SIZE;
    icon.style.left = `${Math.max(SNAP_OFFSET, snappedLeft)}px`;
    icon.style.top = `${Math.max(SNAP_OFFSET, snappedTop)}px`;
}

icons.forEach((icon, index) => {
    let isDragging = false;
    let offsetX = 0, offsetY = 0;

    // Set initial position immediately on load
    icon.style.left = `${SNAP_OFFSET}px`;
    icon.style.top = `${SNAP_OFFSET + (index * GRID_SIZE)}px`;

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

    window.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        icon.style.zIndex = "";
        icon.style.transition = "all 0.2s ease-out"; 
        snapIconToGrid(icon, e.clientX, e.clientY, offsetX, offsetY);
    });
});
