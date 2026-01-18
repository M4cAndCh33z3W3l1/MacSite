const icons = document.querySelectorAll('.icon');
const gridSize = 100; // Snaps every 100px

icons.forEach(icon => {
    let isDragging = false;
    let offsetX, offsetY;

    // Start Dragging
    icon.addEventListener('mousedown', (e) => {
        if (e.target.contentEditable === "true") return;
        isDragging = true;
        const rect = icon.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        icon.style.zIndex = 1000;
        icon.style.transition = "none";
    });

    // During Dragging
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        icon.style.left = `${e.clientX - offsetX}px`;
        icon.style.top = `${e.clientY - offsetY}px`;
    });

    // Stop Dragging and Snap to Grid
    window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        icon.style.zIndex = "";

        const left = parseInt(icon.style.left);
        const top = parseInt(icon.style.top);
        
        // Ensure minimum 10px offset from the left edge
        const snappedLeft = Math.max(10, Math.round(left / gridSize) * gridSize);
        const snappedTop = Math.max(10, Math.round(top / gridSize) * gridSize);

        icon.style.transition = "all 0.2s ease-out";
        icon.style.left = `${snappedLeft}px`;
        icon.style.top = `${snappedTop}px`;
    });
});
