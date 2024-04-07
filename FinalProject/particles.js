class Particle {
    constructor(image, position, direction, size, lifespan, timeCreated, context) {
        this.position = position;
        this.lifespan = lifespan;
        this.timeCreated = timeCreated;
        this.direction = direction;
        this.image = image;
        this.size = size;
        this.context = context; // Adding context property
    }

    update(currentTime) {
        this.position.x += this.direction.x;
        this.position.y += this.direction.y;
        return (currentTime - this.timeCreated > this.lifespan);
    }

    draw() {
        this.context.drawImage(this.image, this.position.x, this.position.y, this.size, this.size);
    }
}

class ParticleManager {
    constructor(context, gameState){
        this.context = context;
        this.gameState = gameState;
        this.particlesList = [];
    }
    
    update() {
        for (let i = 0; i < this.particlesList.length; i++) {
            let particle = this.particlesList[i];
            let remove = particle.update(this.gameState.totalTime);
            if (remove) {
                this.particlesList.splice(i, 1); // Remove particle from the list
                i--; // Decrement i to account for the removed particle
            }
        }
    }
    draw() {
        if(this.particlesList.length > 0){
        for (let i = 0; i < this.particlesList.length; i++) {
            this.particlesList[i].draw();
        }
    }
}   
      createParticle(image, origin, speed, size, lifespan, time, speedScale, spreadScale, sizeScale, spread) {
        let particleOrigin = {
            x: origin.x + (Math.random() * 2 - 1) * spread * spreadScale,
            y: origin.y + (Math.random() * 2 - 1) * spread * spreadScale
        };

        let particleDirection = {
            x: (Math.random() * 2 - 1) * speed.x * speedScale,
            y: (Math.random() * 2 - 1) * speed.y * speedScale
        };

        let particleSize = size + (Math.random() * 2 - 1) * sizeScale;

        let particle = new Particle(image, particleOrigin, particleDirection, particleSize, lifespan, time, this.context);
        this.particlesList.push(particle);
    }
    //New particle functions go here, a Thrust would take the format of ThrustParticleEffects as a function, this function should loop through
    //and make as many particle objects as needed
    
}


