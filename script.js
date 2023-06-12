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


    class Enemy {

        constructor(game, x, y) {

            this.game = game;

            // Enemy stats

            this.attackStrength = 10;
            this.attacking = false;



            this.images = {
                idle: './EnemyIdle.png',
                idle2: './EnemyIdle2.png',
                jump: './EnemyJump.png',
                run: './EnemyRun.png',
                run2: './EnemyRun2.png',
                attack: './EnemyAttack.png',

            }

            this.image = new Image();
            this.image.src = './EnemyIdle2.png';
            

            this.x = x;
            this.y = y;
            this.width = 70;
            this.height = 71;
            this.yVelocity = 5
            this.xVelocity = 0;
            this.spriteX = 0;
            this.spriteY = 0;
            

        }

        draw(context) {

            // Enemy Animation

                if (animationCount == 0) {
                    this.spriteX = this.spriteX+95.8
                    if (this.spriteX >= 514) {
                        this.spriteX = 0;
                        if (this.attacking){
                            this.attacking = false;
                        }
                    }
                }


            context.drawImage(this.image, this.spriteX, this.spriteY, this.width, this.height, this.x, this.y, this.width, this.height);
        
            
        }

        update() {


            // ENEMY AI
            if (this.attacking) {
                this.image.src = this.images.attack;
            }

            else if (this.x >= this.game.player.x + 40) {
                this.xVelocity = -5;
                this.image.src = this.images.run2;
            } else if (this.x <= this.game.player.x - 40) {
                this.xVelocity = 5;
                this.image.src = this.images.run;
            } else if (((this.x <= (this.game.player.x + 40)) || (this.x >= (this.game.player.x - 40)) && 
                        (this.y <= (this.game.player.y + 5)) || (this.y >= (this.game.player.y - 5))
                )) {
                this.xVelocity = 0;
                
                if((Math.random()*50)>49){
                    
                    this.attacking = true;
                    this.attack();
                } else {
                    this.image.src = this.images.idle;
                }
                

            } else if (this.x <= this.game.player.x + 40 || this.x >= this.game.player.x -40) {
                this.image.src = this.images.idle;
            } else if (this.game.dead) {
                this.image.src = this.images.idle;
            }


            

            for (let i = 0; i < this.game.platformPositions.length; i++) {

                // vertical collision detection

                if (((this.x+(this.width)-40) >= this.game.platformPositions[i][0] && (this.x <= this.game.platformPositions[i][0]+(this.game.platforms[0].width-20))) &&
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
            
        }


        attack() {

            this.game.player.health -= this.attackStrength;



        }
    }






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


    class JumpEffect {

        constructor(game) {

            this.game = game;
            this.image = new Image();
            this.image.src = './jump-effect.png';

        }
    }

    class Player {

        constructor(game) {
            this.game = game;

            this.health = 100;

            this.images = {
                idle: './Idle.png',
                jump: './Jump.png',
                run: './Run.png',
                run2: './Run2.png',
                attack: './Attack_1.png',

            }

            this.image = new Image();
            this.image.src = './Idle.png';
            

            this.x = 50;
            this.y = 50;
            this.width = 90;
            this.height = 71;
            this.yVelocity = 5
            this.xVelocity = 0;
            this.spriteX = 0;
            this.spriteY = 0;

        }

        draw(context) {


            // Check which sprites to draw

            // if (this.yVelocity !== 0){
            //     this.image.src = this.images.jump;
            // } else if(this.yVelocity == 0){
            //     this.image.src = this.images.idle;
            // }

            // Player Animation

            

                if (animationCount == 0) {
                    this.spriteX = this.spriteX+95.8
                if (this.spriteX >= 610) {
                    this.spriteX = 0;
                }
                }

          

            context.drawImage(this.image, this.spriteX, this.spriteY, this.width, this.height, this.x, this.y, this.width, this.height);
            

            

            
        }

        update() {

            

            for (let i = 0; i < this.game.platformPositions.length; i++) {

                // vertical collision detection

                if (((this.x+(this.width)-40) >= this.game.platformPositions[i][0] && (this.x <= this.game.platformPositions[i][0]+(this.game.platforms[0].width-20))) &&
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


            // create platforms
            this.platforms = [];
            this.platformPositions = [[50, 150], 
                                    [140, 110], 
                                    [500, 150], 
                                    [500, 150], 
                                    [300, 350,], 
                                    [0, this.height-50], 
                                    [50, this.height-50], 
                                    [100, this.height-50], 
                                    [150, this.height-50], 
                                    [200, this.height-50],
                                    [250, this.height-50], 
                                    [300, this.height-50], 
                                    [350, this.height-50], 
                                    [400, this.height-50], 
                                    [450, this.height-50],  
                                    [(this.width/5)*2, this.height-50], 
                                    [(this.width/5)*4, this.height-50], 
                                    [(this.width/5)*3, this.height-200]];

            for(let i = 0; i < this.platformPositions.length; i++) {
                this.platforms.push(new Platform(this, this.platformPositions[i][0], this.platformPositions[i][1]));
            }


            // create enemies

            this.enemies = [];
            this.enemyPositions = [[500, 50]];

            for(let i = 0; i < this.enemyPositions.length; i++) {
                this.enemies.push(new Enemy(this, this.enemyPositions[i][0], this.enemyPositions[i][1]));
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
                    this.player.image.src = this.player.images.run2;
                    
                } else if (event.key === "d") {
                    this.player.xVelocity = 20;
                    this.player.image.src = this.player.images.run;
                } else if (event.key === 'w') {
                    this.player.image.src = this.player.images.jump;
                    this.player.y -= 80;
                    
                } else if (event.key === 's') {
                    this.player.yVelocity = 10
                } else if(event.key === ' ') {
                    this.player.animationCount = 0;
                    this.player.image.src = this.player.images.attack;
                }


                

            })
            document.addEventListener('keyup', (event) => {

                if (event.key === 'a') {
                    this.player.xVelocity = 0;
                    this.player.image.src = this.player.images.idle;
                } else if (event.key === "d") {
                    this.player.xVelocity = 0;
                    this.player.image.src = this.player.images.idle;
                } else if (event.key === 'w') {
                    this.player.image.src = this.player.images.idle;
                    this.player.yVelocity = 0;
                } else if (event.key === ' ') {
                    this.player.image.src = this.player.images.idle;
                    
                }

            })




        }


    
        restart() {

            this.player.x = 50;
            this.player.y = 50;
            
            this.dead = false;
            music.play();


        }
            


        render(context) {

            context.clearRect(0, 0, canvas.width, canvas.height);

            // draw background
            context.drawImage(this.backgroundImage, 0, 0, this.width, this.height);

            // draw platforms on the screen
            
            for (let i = 0; i < this.platforms.length; i++) {

                this.platforms[i].draw(context);
                
            }

            // draw enemies on the screen

            this.enemies.forEach((i) => {

                i.draw(context);
                i.update();

            });

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









