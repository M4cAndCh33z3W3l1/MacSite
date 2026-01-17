document.addEventListener('DOMContentLoaded', () => {
    const icons = document.querySelectorAll('.icon');
    const desktop = document.querySelector('.desktop');
    const gridSize = 100;

    const savedPositions = JSON.parse(localStorage.getItem('xpGrid')) || {};

    icons.forEach((icon, index) => {
        const id = icon.id;
        if (savedPositions[id]) {
            icon.style.left = savedPositions[id].left;
            icon.style.top = savedPositions[id].top;
        } else {
            icon.style.left = '10px';
            icon.style.top = (10 + (index * gridSize)) + 'px';
        }

        icon.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData("text/plain", id);
        });
    });

    desktop.addEventListener('dragover', (e) => e.preventDefault());

    desktop.addEventListener('drop', (e) => {
        e.preventDefault();
        const id = e.dataTransfer.getData("text/plain");
        const icon = document.getElementById(id);

        const snapX = Math.round((e.clientX - 50) / gridSize) * gridSize;
        const snapY = Math.round((e.clientY - 50) / gridSize) * gridSize;

        icon.style.left = snapX + 'px';
        icon.style.top = snapY + 'px';

        savedPositions[id] = { left: icon.style.left, top: icon.style.top };
        localStorage.setItem('xpGrid', JSON.stringify(savedPositions));
    });

    // Clock Logic
    setInterval(() => {
        document.querySelector('.clock').innerText = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }, 1000);
});
