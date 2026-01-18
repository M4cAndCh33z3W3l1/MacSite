const icons = document.querySelectorAll('.icon');

icons.forEach(icon => {
    let isDragging = false;
    let offsetX, offsetY;

    // --- DRAG LOGIC ---
    icon.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('icon-label')) return;
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
        isDragging = false;
        icon.style.zIndex = "";
    });

    // --- LINK PASTE LOGIC ---
    // Double-click the icon to change the image URL
    icon.addEventListener('dblclick', () => {
        const imgElement = icon.querySelector('.icon-img');
        const newUrl = prompt("Paste your icon image link here:", imgElement.src);
        
        if (newUrl && newUrl.trim() !== "") {
            imgElement.src = newUrl;
        }
    });
});
