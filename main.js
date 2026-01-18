const icons = document.querySelectorAll('.icon');
const gridSize = 100;

icons.forEach(icon => {
    let isDragging = false;
    let offsetX, offsetY;

    icon.addEventListener('mousedown', (e) => {
        isDragging = true;
        const rect = icon.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        icon.style.zIndex = 1000;
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        icon.style.left = `${e.clientX - offsetX}px`;
        icon.style.top = `${e.clientY - offsetY}px`;
    });

    window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;

        // Snaps to grid
        const left = parseInt(icon.style.left);
        const top = parseInt(icon.style.top);
        icon.style.left = `${Math.round(left / gridSize) * gridSize}px`;
        icon.style.top = `${Math.round(top / gridSize) * gridSize}px`;
    });

    // Double-click to go to your Wikimedia link
    icon.addEventListener('dblclick', () => {
        const link = icon.getAttribute('data-link');
        window.open(link, '_blank');
    });
});
