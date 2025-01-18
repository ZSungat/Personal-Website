const canvas = document.getElementById('galaxyCanvas');
const ctx = canvas.getContext('2d');

const config = {
    numStars: 2000,
    maxStarSize: 2,
    minStarSize: 0.5,
    speed: 2,
    starLifetime: { 
        min: 8000,
        max: 20000
    },
    spawnInterval: 50,
    fadeInDuration: 1000,
    sizeGrowthDuration: 2000,
    colorMode: false,
    rainbowSpeed: 0.005
};

let activeStars = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function hslToRgb(h, s, l) {
    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

class Star {
    constructor(spawnAnywhere = true) {
        this.reset(spawnAnywhere);
    }

    reset(spawnAnywhere = true) {
        const angle = Math.random() * Math.PI * 2;
        const distance = spawnAnywhere ? 
            Math.random() * canvas.width / 2 : 
            canvas.width / 2;

        this.x = Math.cos(angle) * distance;
        this.y = Math.sin(angle) * distance;
        this.z = spawnAnywhere ? Math.random() * canvas.width : canvas.width;
        
        this.birth = Date.now();
        this.fadeStart = Date.now();
        this.lifetime = Math.random() * (config.starLifetime.max - config.starLifetime.min) + config.starLifetime.min;
        
        this.opacity = 0;
        this.currentSize = config.minStarSize;
        this.targetSize = config.minStarSize + Math.random() * (config.maxStarSize - config.minStarSize);
        
        this.velocity = {
            z: config.speed * (0.8 + Math.random() * 0.4)
        };

        this.hue = Math.random();
        this.colorSpeed = config.rainbowSpeed * (0.5 + Math.random() * 1);
    }

    update(deltaTime) {
        const age = Date.now() - this.birth;
        const fadeAge = Date.now() - this.fadeStart;
        
        if (fadeAge < config.fadeInDuration) {
            this.opacity = fadeAge / config.fadeInDuration;
        } else {
            this.opacity = 1;
        }

        if (fadeAge < config.sizeGrowthDuration) {
            this.currentSize = config.minStarSize + 
                (fadeAge / config.sizeGrowthDuration) * (this.targetSize - config.minStarSize);
        } else {
            this.currentSize = this.targetSize;
        }

        if (age > this.lifetime - config.fadeInDuration) {
            this.opacity = Math.max(0, (this.lifetime - age) / config.fadeInDuration);
        }

        if (age > this.lifetime || this.z <= 50) {
            return false;
        }

        if (config.colorMode) {
            this.hue = (this.hue + this.colorSpeed) % 1;
        }
        this.velocity.z = config.speed * (0.8 + Math.random() * 0.4);

        this.z -= this.velocity.z;
        return true;
    }

    draw(ctx) {
        const k = 128.0 / this.z;
        const px = this.x * k + canvas.width / 2;
        const py = this.y * k + canvas.height / 2;

        if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
            ctx.beginPath();
            ctx.arc(px, py, this.currentSize, 0, Math.PI * 2);
            
            let rgb;
            if (config.colorMode) {
                rgb = hslToRgb(this.hue, 1, 0.5);
                ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${this.opacity})`;
            } else {
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            }
            ctx.fill();
        }
    }
}

for (let i = 0; i < config.numStars; i++) {
    const star = new Star(true);
    activeStars.push(star);
}

let lastTime = Date.now();

function update() {
    const currentTime = Date.now();
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    activeStars = activeStars.filter(star => {
        const isActive = star.update(deltaTime);
        if (isActive) {
            star.draw(ctx);
            return true;
        }
        star.reset(false);
        return true;
    });

    requestAnimationFrame(update);
}

window.GalaxyStars = {
    setSpeed: (speed) => {
        config.speed = speed;
    },
    toggleColorMode: () => {
        config.colorMode = !config.colorMode;
        return config.colorMode;
    },
    getConfig: () => ({...config})
};

update();