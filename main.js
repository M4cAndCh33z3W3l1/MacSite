document.addEventListener('DOMContentLoaded', () => {
    const icons = document.querySelectorAll('.icon');
    const desktop = document.querySelector('.desktop');
    const toggleBtn = document.getElementById('toggle-icons');
    const gridSize = 100; // Size of each grid square

    // 1. Load saved positions
    const savedPositions = JSON.parse(localStorage.getItem('gridPositions')) || {};

    icons.forEach((icon, index) => {
        const id = icon.id;
        if (savedPositions[id]) {
            icon.style.left = savedPositions[id].left;
            icon.style.top = savedPositions[id].top;
        } else {
            // Default grid placement
            icon.style.left = '0px';
            icon.style.top = (index * gridSize) + 'px';
        }

        icon.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData("text/plain", id);
        });
    });

    // 2. Snap to Grid Logic on Drop
    desktop.addEventListener('dragover', (e) => e.preventDefault());

    desktop.addEventListener('drop', (e) => {
        e.preventDefault();
        const id = e.dataTransfer.getData("text/plain");
        const icon = document.getElementById(id);

        // Calculate nearest grid point
        const snapX = Math.round((e.clientX - 50) / gridSize) * gridSize;
        const snapY = Math.round((e.clientY - 50) / gridSize) * gridSize;

        const newLeft = snapX + 'px';
        const newTop = snapY + 'px';

        icon.style.left = newLeft;
        icon.style.top = newTop;

        // Save position
        savedPositions[id] = { left: newLeft, top: newTop };
        localStorage.setItem('gridPositions', JSON.stringify(savedPositions));
    });

    // 3. Toggle Visibility (The "Show/Hide" feature)
    toggleBtn.addEventListener('click', () => {
        icons.forEach(icon => icon.classList.toggle('hidden'));
    });

    // Clock
    setInterval(() => {
        const clock = document.querySelector('.clock');
        if(clock) clock.innerText = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }, 1000);
});
