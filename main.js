document.addEventListener('DOMContentLoaded', () => {
    const icons = document.querySelectorAll('.icon');
    const desktop = document.querySelector('.desktop');
    const gridSize = 100; 

    // 1. Load saved grid positions
    const savedPositions = JSON.parse(localStorage.getItem('xpGridPositions')) || {};

    icons.forEach((icon, index) => {
        const id = icon.id;
        if (savedPositions[id]) {
            icon.style.left = savedPositions[id].left;
            icon.style.top = savedPositions[id].top;
        } else {
            // Default: Vertical column on the left
            icon.style.left = '0px';
            icon.style.top = (index * gridSize) + 'px';
        }

        icon.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData("text/plain", id);
        });
    });

    // 2. Desktop Drop & Snap Logic
    desktop.addEventListener('dragover', (e) => e.preventDefault());

    desktop.addEventListener('drop', (e) => {
        e.preventDefault();
        const id = e.dataTransfer.getData("text/plain");
        const icon = document.getElementById(id);

        // Snap to nearest 100px grid
        const snapX = Math.round((e.clientX - 50) / gridSize) * gridSize;
        const snapY = Math.round((e.clientY - 50) / gridSize) * gridSize;

        const newLeft = snapX + 'px';
        const newTop = snapY + 'px';

        icon.style.left = newLeft;
        icon.style.top = newTop;

        // Save to local storage
        savedPositions[id] = { left: newLeft, top: newTop };
        localStorage.setItem('xpGridPositions', JSON.stringify(savedPositions));
    });

    // 3. Simple XP Clock
    setInterval(() => {
        const clock = document.querySelector('.clock');
        if(clock) clock.innerText = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }, 1000);
});
