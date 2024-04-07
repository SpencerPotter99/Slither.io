class Audio {
    constructor(options, object, sounds) {
        // Initialize with options
        this.options = options;
        this.object = object;
        this.sounds = sounds;
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.audioSource = false;
        // Other initialization if needed
    }

    // Draw method to render effects
    draw() {
        // Code to draw effects on the canvas
    }

    // Update method to update the state of effects
    update() {
        // Code to update effects' state
    }

    // Method to play sound effects
    playSound(soundName) {
        var audio = this.sounds[soundName];
        audio.crossOrigin = 'anonymous';
        if (!audio) {
            console.error("Audio element not found for sound name:", soundName);
            return;
        }
        audio.play();
        /*if (!this.audioSource) {
            this.audioSource = this.audioContext.createMediaElementSource(audioElement);
            analyser = this.audioContext.createAnalyser();
            this.audioSource.connect(analyser);
            analyser.connect(this.audioContext.destination);
        }
        */
    

    }
    crashLanding(){
        console.log("crashed")
    }
    
    // Method to create particles
    createParticles() {
        // Code to create particles
    }
}