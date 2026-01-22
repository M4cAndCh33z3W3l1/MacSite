const icons = document.querySelectorAll('.icon');
const desktop = document.getElementById('desktop');
let highestZIndex = 1001; 

// Clock Logic
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const clockElement = document.getElementById('clock');
    if (clockElement) clockElement.textContent = timeString;
}
updateClock();
setInterval(updateClock, 60000); 

// Z-Index Management
function bringWindowToFront(windowEl) {
    highestZIndex++;
    windowEl.style.zIndex = highestZIndex;
}

// Window Management Logic
function createWindow(appName, title, content) {
    const windowEl = document.createElement('div');
    const windowId = `window-${Date.now()}`; 
    windowEl.id = windowId;
    windowEl.className = 'window window-animated';
    windowEl.style.cssText = `position: absolute; width: 300px; left: ${150 + Math.random() * 50}px; top: ${100 + Math.random() * 50}px;`;

    windowEl.innerHTML = `
        <div class="title-bar" style="cursor: grab;">
            <div class="title-bar-text">${title}</div>
            <div class="title-bar-controls">
                <button aria-label="Minimize"></button>
                <button aria-label="Maximize"></button>
                <button aria-label="Close" class="close-window-btn"></button>
            </div>
        </div>
        <div class="window-body">
            <p>${content}</p>
            <section class="field-row" style="justify-content: flex-end">
                <button class="close-window-btn">OK</button>
            </section>
        </div>
    `;

    desktop.appendChild(windowEl);
    bringWindowToFront(windowEl); 

    windowEl.querySelectorAll('.close-window-btn').forEach(button => {
        button.addEventListener('click', () => {
            windowEl.style.display = 'none';
            windowEl.remove(); 
        });
    });
    
    // Bring window to front when *anywhere* inside the window is clicked
    windowEl.addEventListener('mousedown', () => bringWindowToFront(windowEl));

    makeWindowDraggable(windowEl);
}

function openApp(appName) {
    if (appName === 'maccraft') {
        createWindow('maccraft', 'MacCraft', 'Loading MacCraft assets... Please wait.');
    } else if (appName === 'settings') {
        createWindow('settings', 'Settings', 'Control Panel: System settings are locked.');
    }
}

// Draggable Windows Logic - ONLY uses the title bar as a handle
function makeWindowDraggable(windowElement) {
    const titleBar = windowElement.querySelector('.title-bar');
    let isDragging = false;
    let offsetX = 0, offsetY = 0;

    titleBar.addEventListener('mousedown', (e) => {
        if (e.target.tagName === 'BUTTON') return; 
        isDragging = true;
        const rect = windowElement.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        windowElement.style.transition = "none";
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        windowElement.style.left = `${e.clientX - offsetX}px`;
        windowElement.style.top = `${e.clientY - offsetY}px`;
    });

    window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        windowElement.style.transition = ""; 
    });
}


// Icon Dragging and Double Click Logic (Untouched)
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

    icon.addEventListener('dblclick', () => {
        openApp(icon.getAttribute('data-app'));
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
        
        const targetLeft = e.clientX - offsetX;
        const targetTop = e.clientY - offsetY;
        const snappedLeft = Math.round(targetLeft / GRID_SIZE) * GRID_SIZE;
        const snappedTop = Math.round(targetTop / GRID_SIZE) * GRID_SIZE;
        icon.style.left = `${Math.max(SNAP_OFFSET, snappedLeft)}px`;
        icon.style.top = `${Math.max(SNAP_OFFSET, snappedTop)}px`;
    });
});
