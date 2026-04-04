const canvas = document.querySelector('#cursor-canvas');
const ctx = canvas.getContext('2d');

let mouse = { x: 0, y: 0 };
let isActive = false;

// Physics parameters
const pointer = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
};

const params = {
    pointsNumber: 20,
    widthFactor: 0.3,
    spring: 0.4,
    friction: 0.5,
    baseWidth: 2
};

const trail = new Array(params.pointsNumber).fill(null).map(() => ({
    x: pointer.x,
    y: pointer.y,
    dx: 0,
    dy: 0
}));

window.addEventListener('mousemove', e => {
    isActive = true;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('touchstart', e => {
    isActive = true;
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
});

window.addEventListener('resize', () => {
    setupCanvas();
});

function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function update(t) {
    // Smoothly transition pointer to mouse
    pointer.x += (mouse.x - pointer.x) * 0.15;
    pointer.y += (mouse.y - pointer.y) * 0.15;

    trail.forEach((p, i) => {
        const prev = i === 0 ? pointer : trail[i - 1];
        const spring = i === 0 ? 0.4 : params.spring;
        
        p.dx += (prev.x - p.x) * spring;
        p.dy += (prev.y - p.y) * spring;
        
        p.dx *= params.friction;
        p.dy *= params.friction;
        
        p.x += p.dx;
        p.y += p.dy;
    });

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (!isActive) return;

    // Draw the thread
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (let i = 0; i < trail.length - 1; i++) {
        const p1 = trail[i];
        const p2 = trail[i + 1];
        
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineWidth = params.baseWidth * (1 - i / trail.length);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
    }
}

function render(t) {
    update(t);
    requestAnimationFrame(render);
}

setupCanvas();
render();
