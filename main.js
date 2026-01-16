document.addEventListener('DOMContentLoaded', () => {
    const icons = document.querySelectorAll('.icon');
    const desktop = document.querySelector('.desktop');

    // 1. Load saved positions from LocalStorage
    const savedPositions = JSON.parse(localStorage.getItem('xpIconPositions')) || {};

    icons.forEach((icon, index) => {
        const id = icon.id;

        // Apply saved position or set default if new
        if (savedPositions[id]) {
            icon.style.left = savedPositions[id].left;
            icon.style.top = savedPositions[id].top;
        } else {
            icon.style.left = '20px';
            icon.style.top = (20 + (index * 100)) + 'px';
        }

        // 2. Drag Start Logic
        icon.addEventListener('dragstart', (e) => {
            const rect = icon.getBoundingClientRect();
            // Store the offset so the icon doesn't "jump" to the cursor corner
            const offsetX = e.clientX - rect.left;
            const offsetY = e.clientY - rect.top;
            e.dataTransfer.setData("text/plain", `${id},${offsetX},${offsetY}`);
        });
    });

    // 3. Desktop Drop Logic
    desktop.addEventListener('dragover', (e) => {
        e.preventDefault(); // Required to allow a drop
    });

    desktop.addEventListener('drop', (e) => {
        e.preventDefault();
        const data = e.dataTransfer.getData("text/plain").split(',');
        const id = data[0];
        const offsetX = parseInt(data[1]);
        const offsetY = parseInt(data[2]);

        const icon = document.getElementById(id);
        
        // Calculate new position
        const newLeft = (e.clientX - offsetX) + 'px';
        const newTop = (e.clientY - offsetY) + 'px';

        icon.style.left = newLeft;
        icon.style.top = newTop;

        // 4. Save position to LocalStorage
        savedPositions[id] = { left: newLeft, top: newTop };
        localStorage.setItem('xpIconPositions', JSON.stringify(savedPositions));
    });

    // Simple Clock logic for system tray
    function updateClock() {
        const now = new Date();
        const clock = document.querySelector('.clock');
        if(clock) clock.innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    setInterval(updateClock, 1000);
    updateClock();
});
