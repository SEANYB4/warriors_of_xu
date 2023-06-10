window.addEventListener('load', () => {
    // Create the CanvasRenderingContext2d object and store it in a variable.
    const canvas = document.getElementById("game-canvas");
    const ctx = canvas.getContext("2d");


    class Player {

        constructor(game) {
            this.game = game;


        }

        draw(context) {


            context.fillStyle = 'blue';
            context.fillRect(100, 100, 100, 100);


        }

        update() {



        }
    }



    class Game {

        constructor(canvas) {

            this.canvas = canvas
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.player = new Player(this); // this keyword refers to the entire object


            canvas.addEventListener('mousedown', (e) => {

                console.log('hello')
                ctx.fillStyle = 'blue';
                ctx.fillRect(100, 100, 50, 50);
                
            });

        }


    

        


        render(context) {

            context.clearRect(0, 0, canvas.width, canvas.height);


            // draw platforms on the screen
            context.fillStyle = 'red';
            context.fillRect(50, 50, 50, 50);


            // draw the player on the canvas
            this.player.draw(context);

        }


    }


    function gameLoop() {

    

        game.render(ctx);
        requestAnimationFrame(gameLoop);
    }
    

    // create an instance of the game
    const game = new Game(canvas);
    gameLoop();

});









