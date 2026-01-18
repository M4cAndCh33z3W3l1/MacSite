const icons = document.querySelectorAll('.icon');
const gridSize = 100; // Define the size of each grid cell

icons.forEach(icon => {
    let isDragging = false;
    let offsetX, offsetY;

    icon.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('icon-label')) return;
        isDragging = true;
        const rect = icon.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        icon.style.zIndex = 1000;
        icon.style.transition = "none"; // Disable snap animation while dragging
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

        // --- GRID SNAPPING LOGIC ---
        // Get current position
        const currentLeft = parseInt(icon.style.left);
        const currentTop = parseInt(icon.style.top);

        // Snap to nearest gridSize (e.g., nearest 100px)
        const snappedLeft = Math.round(currentLeft / gridSize) * gridSize;
        const snappedTop = Math.round(currentTop / gridSize) * gridSize;

        // Apply snapped position with a smooth transition
        icon.style.transition = "all 0.2s ease-out";
        icon.style.left = `${snappedLeft}px`;
        icon.style.top = `${snappedTop}px`;
    });

    // Keep the "Paste Link" feature from before
    icon.addEventListener('dblclick', () => {
        const img = icon.querySelector('.icon-img');
        const url = prompt("Paste icon image URL:", img.src);
        if (url) img.src = url;
    });
});
