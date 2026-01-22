const icons = document.querySelectorAll('.icon');
const appWindow = document.getElementById('app-window');
const windowTitle = document.getElementById('window-title');
const windowContent = document.getElementById('window-content');
const closeBtn = document.getElementById('close-btn');
const okBtn = document.getElementById('ok-btn');

const GRID_SIZE = 100;
const SNAP_OFFSET = 10; 

// --- Clock Logic ---
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const clockElement = document.getElementById('clock');
    if (clockElement) clockElement.textContent = timeString;
}
updateClock();
setInterval(updateClock, 60000); 

// --- Window Logic ---
function openApp(appName) {
    appWindow.style.display = 'block';
    appWindow.style.left = '150px';
    appWindow.style.top = '100px';
    
    if(appName === 'maccraft') {
        windowTitle.innerText = "MacCraft";
        windowContent.innerText = "Loading MacCraft assets... Please wait.";
    } else {
        windowTitle.innerText = "Settings";
        windowContent.innerText = "Control Panel: System settings are currently locked.";
    }
}

closeBtn.onclick = () => appWindow.style.display = 'none';
okBtn.onclick = () => appWindow.style.display = 'none';

// --- Icon Movement & Double Click ---
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

    icon.style.left = `${SNAP_OFFSET}px`;
    icon.style.top = `${SNAP_OFFSET + (index * GRID_SIZE)}px`;

    icon.addEventListener('mousedown', (e) => {
        isDragging = true;
        const rect = icon.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        icon.style.zIndex = 1000;
        icon.style.transition = "none";
    });

    // OPEN WINDOW ON DOUBLE CLICK
    icon.addEventListener('dblclick', () => {
        const app = icon.getAttribute('data-app');
        openApp(app);
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
