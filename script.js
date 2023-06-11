window.addEventListener('load', () => {
    // Create the CanvasRenderingContext2d object and store it in a variable.
    const canvas = document.getElementById("game-canvas");
    const ctx = canvas.getContext("2d");
    const FPS = 60;
    // for moving monk picture position
    let up = true;
    let verticalPos = 200;
    let wetdream = document.getElementById('wetdream');


    // animation global variables
    let animationCount = 0;

    // AUDIO
    let music = document.getElementById('music');
    



    // Wet Dream Dialogue

    const dialogueText = document.getElementById('dialogue');

    dialogueText.innerHTML = 'This is edited by JS....';







    class Platform {

        constructor(game, x, y) {

            this.game = game;
            this.image = new Image();
            this.image.src = './grass.png';
            this.x = x;
            this.y = y;
            this.width = 73;
            this.height = 15;
            this.floatY = this.y;
            this.down = true;
            this.up = false;
                       
        }

        draw(context) {

            context.drawImage(this.image, 0, 0, this.width, this.height, this.x, this.floatY, this.width, this.height);
            if (this.down){
                this.floatY += .05
                if (this.floatY >= this.y + 1.5){
                    this.down = false;
                    this.up = true;
                }
            }
            if (this.up) {
                this.floatY -= .05
                if (this.floatY <= this.y - 1.5){
                    this.up = false;
                    this.down = true;
                }
            }
            
        }
    }

    class Player {

        constructor(game) {
            this.game = game;


            this.images = {
                idle: './Idle.png',
                jump: './Jump.png'

            }

            this.image = new Image();
            this.image.src = './Idle.png';
            

            this.x = 50;
            this.y = 50;
            this.width = 34;
            this.height = 71;
            this.yVelocity = 5
            this.xVelocity = 0;
            this.spriteX = 0;
            this.spriteY = 0;

        }

        draw(context) {


            context.drawImage(this.image, this.spriteX, this.spriteY, this.width, this.height, this.x, this.y, this.width, this.height);
            

            if (animationCount == 0) {
                this.spriteX = this.spriteX+95.8
            if (this.spriteX >= 610) {
                this.spriteX = 0;
            }
            }
            
        }

        update() {

            

            for (let i = 0; i < this.game.platformPositions.length; i++) {

                // vertical collision detection

                if (((this.x+this.width) >= this.game.platformPositions[i][0] && (this.x <= this.game.platformPositions[i][0]+(this.game.platforms[0].width))) &&
                    (this.y+this.height) <= (this.game.platformPositions[i][1]+1) && (this.y+this.height) >= this.game.platformPositions[i][1]-.1) {
                        this.yVelocity = 0;
                        break

                } else {
                    this.yVelocity = 5;
                }

                
            }
 
    
            this.y += this.yVelocity;
            this.x += this.xVelocity;

            
            this.xVelocity = 0;
            this.yVelocity = 0;
        }
    }



    class Game {

        constructor(canvas) {

            
            this.canvas = canvas
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.player = new Player(this); // this keyword refers to the entire object
            this.backgroundImage = new Image();
            this.backgroundImage.src = "./level1.png";
            this.backgroundImage.onload = () => {
                ctx.drawImage(this.backgroundImage, 0, 0, this.width, this.height);
            } 
            this.platforms = [];
            this.platformPositions = [[50, 150], [140, 110], [500, 150], [500, 150], [300, 350,], [0, this.height-50], [(this.width/5)*2, this.height-50], [(this.width/5)*4, this.height-50], [(this.width/5)*3, this.height-200]];

            for(let i = 0; i < this.platformPositions.length; i++) {
                this.platforms.push(new Platform(this, this.platformPositions[i][0], this.platformPositions[i][1]));
            }
            
            this.dead = false;




            // EVENT LISTENERS
            canvas.addEventListener('mousedown', (e) => {

                if (this.dead) {
                    this.restart();
                }
                
                
            });

            document.addEventListener('keydown', (event) => {

                if (event.key === 'a') {
                    this.player.xVelocity = -20;
                    
                } else if (event.key === "d") {
                    this.player.xVelocity = 20;
                    for (let i = 0; i < this.platformPositions.length; i++) {

                        
                    }
                } else if (event.key === 'w') {
                    
                    this.player.y -= 80;
                    
                } else if (event.key === 's') {
                    this.player.yVelocity = 10
                }


                

            })
            document.addEventListener('keyup', (event) => {

                if (event.code === 'ArrowLeft') {
                    this.player.xVelocity = 0;
                } else if (event.code === "ArrowRight") {
                    this.player.xVelocity = 0;
                } 

            })




        }


    
        restart() {

            this.player.x = 50;
            this.player.y = 50;
            this.dead = false;


        }
            


        render(context) {

            context.clearRect(0, 0, canvas.width, canvas.height);

            // draw background
            context.drawImage(this.backgroundImage, 0, 0, this.width, this.height);

            // draw platforms on the screen
            
            for (let i = 0; i < this.platforms.length; i++) {

                this.platforms[i].draw(context);
                


            }

            // draw the player on the canvas
            this.player.draw(context);
            this.player.update();

            // check for player death

            if (this.player.y > this.height) {
                this.dead = true;
                context.fillStyle = 'white';
                context.font = "30px Orbitron";
                context.textAlign = 'center';
                context.fillText('You died', this.width/2, this.height/2-20);

            }

            if (this.dead) {
                context.fillStyle = 'blue';
                context.fillRect(this.width/2-100, this.height/2, 200, 50);
                context.fillStyle = 'white';
                context.fillText('Restart', this.width/2, this.height/2+35);

            }

        }


    }

     // create an instance of the game
     const game = new Game(canvas);
    let lastTime = 0;
    

    music.play();
    function gameLoop(timestamp) {

        // Calculate the time between frames
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;



        // update animation count
        animationCount += 1;
        if (animationCount > 5) {
            animationCount = 0;
        }

    
        // UPDATE THE GAME STATE


        // make wet dream float
        if(up) {
            verticalPos -= .2;
            if (verticalPos < 190) {
                up = false;
            }
        } else {
            verticalPos += .2;
            if (verticalPos > 210) {
                up = true;
            }
        }
        
        wetdream.style.top = `${verticalPos}px`;


        






        // draw the game on the canvas
        game.render(ctx);


        // calculate the delay time based on the framerate
        const delayTime = 1000/FPS - deltaTime;


        // call the game loop function again at the next frame
        setTimeout(() => {
            requestAnimationFrame(gameLoop);
        }, delayTime);
    }
    
   
    gameLoop(performance.now());

});









