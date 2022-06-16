function getRandomRgb() {
    var num = Math.round(0xffffff * Math.random());
    var r = num >> 16;
    var g = num >> 8 & 255;
    var b = num & 255;
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
}

function getRandomHexColor() {
    return "#" + ("00000" + Math.floor(Math.random() * Math.pow(16, 6)).toString(16)).slice(-6);
}

class RandomRGB {
    constructor() {
        var num = Math.round(0xffffff * Math.random());
        this.r = num >> 16;
        this.g = num >> 8 & 255;
        this.b = num & 255;
    }

    toRgba(alpha) {
        return 'rgba(' + this.r + ', ' + this.g + ', ' + this.b + ', ' + alpha + ')';
    }
}

class TextItem {
    constructor(x, y, text, rgb) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.rgb = rgb;
        this.alpha = 1;
    }

    fade(val) {
        this.alpha = this.alpha - val;
    }

    draw(canvas) {
        var ctx = canvas.getContext('2d');
        ctx.font = '48px serif';
        ctx.fillStyle = this.rgb.toRgba(this.alpha);
        ctx.fillText(this.text, this.x, this.y);
    }
}

const Application = new class {
    constructor() {
        // Some configuration options

        // The number of characters we can display on the screen at a time
        this.max_num_elements = 300;
        // The intensity at which text should fade out per re-evaluation
        this.alpha_fade_per_interval = .010;
        // How often we should re-evaluate the alpha level for each text item
        this.fade_out_refresh_interval_milliseconds = 50;
        // How many random text items we should generate per key press
        this.text_multiplier = 3;

        // Tracking of items to draw
        this.elements = [];
    }

    /**
     * Handle the key press of user. Displayable keys are added to a list of text to draw, non displayable results
     * in a refresh of the current background colour
     * 
     * @param {The key that was pressed by the user} key 
     */
    handleKeyPress(key) {
        let color = getRandomHexColor();
        if (key.match(/^[0-9A-Za-z]+$/) === null) {
            document.body.style.backgroundColor = color;
        }
        else {
            const canvas = document.getElementById('maincanvas');

            for(var i = 0; i < Application.text_multiplier; i++) {
                var x = Math.floor(Math.random() * (canvas.width));
                var y = Math.floor(Math.random() * (canvas.height));

                Application.elements.push(new TextItem(x, y, key, new RandomRGB()));
            }

            if (Application.elements.length > Application.max_num_elements)
                Application.elements.shift();
        }
    }

    /**
     * Refresh all drawable elements with their adjusted alpha fade
     */
    redraw() {
        const canvas = document.getElementById('maincanvas');
        // Clear the canvas
        canvas.width = canvas.width;


        for (var i = Application.elements.length - 1; i >= 0; i--) {
            var element = Application.elements[i];
            element.draw(canvas);

            element.fade(Application.alpha_fade_per_interval);
            if (element.alpha <= 0)
                Application.elements.splice(i, 1);
        }
    }

    /**
     * Spawn a periodic loop to fade displayed text
     */
    runLoop() {
        setInterval(this.redraw, this.fade_out_refresh_interval_milliseconds);
    }

}

window.addEventListener('click', event => {
    document.body.style.backgroundColor = getRandomHexColor();
});
window.addEventListener('keydown', function (e) {
    Application.handleKeyPress(e.key)
});

// Fill the full window with the canvas
(function () {
    var
        // Obtain a reference to the canvas element using its id.
        htmlCanvas = document.getElementById('maincanvas'),
        // Obtain a graphics context on the canvas element for drawing.
        context = htmlCanvas.getContext('2d');

    // Start listening to resize events and draw canvas.
    initialize();

    function initialize() {
        // Register an event listener to call the resizeCanvas() function 
        // each time the window is resized.
        window.addEventListener('resize', resizeCanvas, false);
        // Draw canvas border for the first time.
        resizeCanvas();
    }

    // Display custom canvas. In this case it's a blue, 5 pixel 
    // border that resizes along with the browser window.
    function redraw() {
        context.strokeStyle = 'blue';
        context.lineWidth = '5';
        context.strokeRect(0, 0, window.innerWidth, window.innerHeight);
    }

    // Runs each time the DOM window resize event fires.
    // Resets the canvas dimensions to match window,
    // then draws the new borders accordingly.
    function resizeCanvas() {
        htmlCanvas.width = window.innerWidth;
        htmlCanvas.height = window.innerHeight;
        redraw();
    }
})();

Application.runLoop();