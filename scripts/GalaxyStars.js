const canvas = document.getElementById('galaxyCanvas');
const ctx = canvas.getContext('2d');

const config = {
    numStars: 1000,
    maxStarSize: 1,
    speed: 1,
    starLifetime: { min: 5000, max: 15000 },
    spawnInterval: 50,
    fadeInDuration: 1000,
    sizeGrowthDuration: 2000,
};

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Star {
    constructor(spawnAnywhere = true) {
        this.reset(spawnAnywhere);
        this.birth = Date.now();
        this.opacity = 0;
        this.fadeStart = Date.now();
        this.currentSize = 0;
        this.targetSize = Math.random() * config.maxStarSize;
    }

    reset(spawnAnywhere = true) {
        const screenX = Math.random() * canvas.width;
        const screenY = Math.random() * canvas.height;
        
        this.x = screenX - canvas.width / 2;
        this.y = screenY - canvas.height / 2;
        this.z = spawnAnywhere ? Math.random() * canvas.width : canvas.width;
        
        this.birth = Date.now();
        this.fadeStart = Date.now();
        this.lifetime = Math.random() * (config.starLifetime.max - config.starLifetime.min) + config.starLifetime.min;
        
        this.currentSize = 0;
        this.targetSize = Math.random() * config.maxStarSize;
    }

    update() {
        const age = Date.now() - this.birth;
        const fadeAge = Date.now() - this.fadeStart;
        
        if (fadeAge < config.fadeInDuration) {
            this.opacity = fadeAge / config.fadeInDuration;
        } else {
            this.opacity = 1;
        }

        if (fadeAge < config.sizeGrowthDuration) {
            this.currentSize = (fadeAge / config.sizeGrowthDuration) * this.targetSize;
        } else {
            this.currentSize = this.targetSize;
        }

        if (age > this.lifetime) {
            this.reset(false);
            return;
        }

        this.z -= config.speed;
        if (this.z <= 0) {
            this.reset(false);
        }
    }

    draw(ctx) {
        const k = 128.0 / this.z;
        const px = this.x * k + canvas.width / 2;
        const py = this.y * k + canvas.height / 2;

        if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
            ctx.beginPath();
            ctx.arc(px, py, this.currentSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.fill();
        }
    }
}

const stars = [];

for (let i = 0; i < config.numStars; i++) {
    stars.push(new Star(true));
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const star of stars) {
        star.update();
        star.draw(ctx);
    }

    requestAnimationFrame(update);
}

update();