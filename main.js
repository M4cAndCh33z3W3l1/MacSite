const icons = document.querySelectorAll('.icon');
const desktop = document.getElementById('desktop');
const taskbarApps = document.getElementById('taskbar-apps');
let highestZIndex = 1001; 

const GRID_SIZE = 100;
const SNAP_OFFSET = 10; 

// Clock Logic
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const clockElement = document.getElementById('clock');
    if (clockElement) clockElement.textContent = timeString;
}
updateClock();
setInterval(updateClock, 60000); 

// Z-Index Management & Focus
function bringWindowToFront(windowEl) {
    highestZIndex++;
    windowEl.style.zIndex = highestZIndex;
    document.querySelectorAll('.taskbar-btn').forEach(btn => btn.classList.remove('active'));
    const taskbarBtn = document.getElementById(`taskbar-btn-${windowEl.id}`);
    if (taskbarBtn) taskbarBtn.classList.add('active');
}

// Window Management Logic
function createWindow(appName, title, content) {
    const windowEl = document.createElement('div');
    const windowId = `window-${Date.now()}`; 
    windowEl.id = windowId;
    windowEl.className = 'window window-animated';
    // Store the application type so we can check for single instances
    windowEl.setAttribute('data-app-type', appName); 
    windowEl.style.cssText = `position: absolute; width: 300px; left: ${150 + Math.random() * 50}px; top: ${100 + Math.random() * 50}px;`;

    windowEl.innerHTML = `
        <div class="title-bar" style="cursor: grab;">
            <div class="title-bar-text">${title}</div>
            <div class="title-bar-controls">
                <button aria-label="Minimize" class="minimize-window-btn"></button>
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
    createTaskbarButton(windowEl, title);

    windowEl.querySelectorAll('.close-window-btn').forEach(button => {
        button.addEventListener('click', () => closeWindow(windowEl));
    });
     windowEl.querySelectorAll('.minimize-window-btn').forEach(button => {
        button.addEventListener('click', () => minimizeWindow(windowEl));
    });
    
    windowEl.addEventListener('mousedown', () => bringWindowToFront(windowEl));

    makeWindowDraggable(windowEl);
}

function closeWindow(windowEl) {
    const taskbarBtn = document.getElementById(`taskbar-btn-${windowEl.id}`);
    if (taskbarBtn) taskbarBtn.remove();
    windowEl.style.display = 'none';
    windowEl.remove(); 
}

function minimizeWindow(windowEl) {
    windowEl.style.display = 'none';
    const taskbarBtn = document.getElementById(`taskbar-btn-${windowEl.id}`);
    if (taskbarBtn) taskbarBtn.classList.remove('active');
}

function restoreWindow(windowEl) {
    windowEl.style.display = 'block';
    bringWindowToFront(windowEl);
}

// Open App Logic (SINGLE INSTANCE CHECK)
function openApp(appName) {
    if (appName === 'settings') {
        // Find if a settings window is already open
        const existingSettings = document.querySelector('.window[data-app-type="settings"]');
        if (existingSettings) {
            restoreWindow(existingSettings);
            return; // Exit function if settings is already open
        }
        createWindow(appName, 'Settings', 'Control Panel: System settings are locked.');
    } else if (appName === 'maccraft') {
        // Allows multiple instances of maccraft
        createWindow(appName, 'MacCraft', 'Loading MacCraft assets... Please wait.');
    }
}

// Taskbar Button Logic
function createTaskbarButton(windowEl, title) {
    const btn = document.createElement('div');
    btn.id = `taskbar-btn-${windowEl.id}`;
    btn.className = 'taskbar-btn active';
    btn.innerText = title;
    taskbarApps.appendChild(btn);

    btn.addEventListener('click', () => {
        if (windowEl.style.display === 'none') {
            restoreWindow(windowEl);
        } else if (windowEl.style.zIndex === highestZIndex.toString()) {
            minimizeWindow(windowEl);
        } else {
            bringWindowToFront(windowEl);
        }
    });
}


// Draggable Windows Logic (No functional changes here)
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


// Icon Dragging & Collision Detection
function checkIconCollision(snappedLeft, snappedTop, currentIcon) {
    const iconsArray = Array.from(icons);
    for (const otherIcon of iconsArray) {
        if (otherIcon === currentIcon) continue;

        const otherLeft = parseInt(otherIcon.style.left, 10);
        const otherTop = parseInt(otherIcon.style.top, 10);

        if (snappedLeft === otherLeft && snappedTop === otherTop) {
            return true; // Collision detected
        }
    }
    return false; // No collision
}


function snapIconToGrid(icon, clientX, clientY, offsetX, offsetY, originalPos) {
    const targetLeft = clientX - offsetX;
    const targetTop = clientY - offsetY;
    // Calculate the nearest valid grid position
    const snappedLeft = Math.round(targetLeft / GRID_SIZE) * GRID_SIZE;
    const snappedTop = Math.round(targetTop / GRID_SIZE) * GRID_SIZE;
    
    // Check for collision before committing the move
    if (checkIconCollision(snappedLeft, snappedTop, icon)) {
        // If collision, snap back to original position
        icon.style.left = `${originalPos.left}px`;
        icon.style.top = `${originalPos.top}px`;
    } else {
        // No collision, apply new position
        icon.style.left = `${Math.max(SNAP_OFFSET, snappedLeft)}px`;
        icon.style.top = `${Math.max(SNAP_OFFSET, snappedTop)}px`;
    }
}

icons.forEach((icon, index) => {
    let isDragging = false;
    let offsetX = 0, offsetY = 0;
    let originalPos = { left: 0, top: 0 };

    icon.style.left = `${SNAP_OFFSET}px`;
    icon.style.top = `${SNAP_OFFSET + (index * GRID_SIZE)}px`;

    icon.addEventListener('mousedown', (e) => {
        isDragging = true;
        const rect = icon.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        originalPos.left = parseInt(icon.style.left, 10);
        originalPos.top = parseInt(icon.style.top, 10);
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
        snapIconToGrid(icon, e.clientX, e.clientY, offsetX, offsetY, originalPos);
    });
});
