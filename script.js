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

            this.health = 100;
            this.attackStrength = 10;
            this.attacking = false;
            

            this.dead = false;

            this.images = {
                idle: './EnemyIdle.png',
                idle2: './EnemyIdle2.png',
                jump: './EnemyJump.png',
                run: './EnemyRun.png',
                run2: './EnemyRun2.png',
                attack: './EnemyAttack.png',
                attack2: './EnemyAttack2.png',
                dead: './EnemyDead.png'

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

            if (this.dead) {
                this.spriteY = -20;
                if(this.spriteX < 250){
                    this.spriteX = this.spriteX+95.8;
                }
            }

            else if (animationCount == 0) {
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

            if(this.dead) {
                return
            }



            for (let i = 0; i < this.game.platformPositions.length; i++) {

                // vertical collision detection

                if (((this.x+(this.width)-40) >= this.game.platformPositions[i][0] && (this.x <= this.game.platformPositions[i][0]+(this.game.platforms[0].width-20))) &&
                    (this.y+this.height) <= (this.game.platformPositions[i][1]+1) && (this.y+this.height) >= this.game.platformPositions[i][1]-1) {
                        this.yVelocity = 0;
                        break

                } else {
                    this.yVelocity = 3;
                }

                
            }
 

            // ENEMY AI
            if (this.attacking) {
                if (this.x > this.game.player.x){
                    this.image.src = this.images.attack2;
                } else {
                    this.image.src = this.images.attack;
                }
       
            } else if ((this.x >= this.game.player.x + 40) && (Math.random()*50>45)) {
                this.xVelocity = -5;
                this.image.src = this.images.run2;
                

            } else if (this.x <= this.game.player.x - 40 && (Math.random()*50>45)) {
                this.xVelocity = 5;
                this.image.src = this.images.run;
            } else if (((this.x <= (this.game.player.x + 40)) && (this.x >= (this.game.player.x - 40))) && 
                        ((this.y <= (this.game.player.y + 5)) && (this.y >= (this.game.player.y - 5))) &&
                        !this.game.dead) {
                this.xVelocity = 0;
                
                if((Math.random()*50)>49){
                    
                    this.attacking = true;
                    this.attack();
                } else {
                    if (this.x > this.game.player.x){
                        this.image.src = this.images.idle2;
                    } else {
                        this.image.src = this.images.idle;
                    }
                }
                

            } else if (this.x <= this.game.player.x + 50 || this.x >= this.game.player.x -50) {
                if (this.x > this.game.player.x){
                    this.image.src = this.images.idle2;
                } else {
                    this.image.src = this.images.idle;
                }
                
            } else if (this.game.dead) {
                this.image.src = this.images.idle;
            }

            

            
            
            this.y += this.yVelocity;
            this.x += this.xVelocity;

            
            this.xVelocity = 0;
            


            if (this.y > this.game.height) {
                this.game.enemies.pop(this);
                this.game.enemies.push(new Enemy(this.game, Math.random()*this.game.width, Math.random()*this.game.height));
            }
            
        }


        attack() {

            if (this.game.player.health > 0) {
                this.game.player.health -= this.attackStrength;
            } else {
                this.game.player.health = 0;
            }
            

            if (this.game.player.health <= 0){
                this.game.dead = true;
                this.animationCount = 0;
            }



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

    class Tree {

        constructor(game, x, y) {
            this.game = game;
            this.images = {
                tree1: './Tree1.png',
                tree2: './Tree2.png',
            }
            this.x = x;
            this.y = y;

            

            this.image = new Image;
            if (Math.random() * 10 > 5){
                this.image.src = this.images.tree2;
            } else {
                this.image.src = this.images.tree1;
            }
            

        }

        draw(context) {

            context.drawImage(this.image, this.x, this.y);
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
                idle2: './Idle2.png',
                attack2: './Attack2.png',
                dead: './Dead.png'

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


            this.left = false;
            this.attacking = false;

        }

        draw(context) {


            // Player Animation
            
            if (this.game.dead) {
                if(this.spriteX < 350){
                    this.spriteX = this.spriteX+95.8;
                }
                
            } else if (animationCount == 0) {
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

            if (this.game.dead) {
                this.image.src = this.images.dead;
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


            if (this.y >= this.game.height) {
                this.game.dead = true;
            }
            
        }


        attack() {

            this.game.enemies.forEach((i) => {
                if (!this.attacking){

                    if ((this.x <= i.x + 40) && (this.x >= i.x - 40) && ((this.y <= i.y+40) && (this.y >= i.y-40)) ) {
                    
                        this.attacking = true;
                        setInterval(() => {
                            this.attacking = false;
    
                        }, 3000);
                        if (i.health > 0) {
                            i.health -= 25
                            
                            console.log("Successful hit!");
                            if (i.health <= 0) {
                                i.dead = true;
                                i.image.src = i.images.dead;
                                
                            
                            }
    
                        }
                    }

                }

            })
        }
    }



    class Game {

        constructor(canvas) {

            
            this.canvas = canvas
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.scrollX = 0;


            this.player = new Player(this); // this keyword refers to the entire object
            this.backgroundImage = new Image();
            this.backgroundImage.src = "./level1.png";
            this.backgroundImage.onload = () => {
                ctx.drawImage(this.backgroundImage, 0, 0, this.width, this.height);
            } 

            // create trees
            this.trees = [];
            this.treePositions = [[Math.random()*this.width, 300], [Math.random()*this.width, 300], [Math.random()*this.width, 300]];

            for(let i = 0; i < this.treePositions.length; i++) {
                this.trees.push(new Tree(this, this.treePositions[i][0], this.treePositions[i][1]));
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
                                    [500, this.height-50],
                                    [550, this.height-50],
                                    [600, this.height-50],  
                                    [650, this.height-50],  
                                    [700, this.height-50],  
                                    [750, this.height-50]];

            for(let i = 0; i < this.platformPositions.length; i++) {
                this.platforms.push(new Platform(this, this.platformPositions[i][0], this.platformPositions[i][1]));
            }


            // create enemies

            this.enemies = [];
            this.enemyPositions = [[Math.random()*this.width, 400], [Math.random()*this.width, 400]];

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

                if(!this.dead) {
                    if (event.key === 'a') {
                        this.player.xVelocity = -10;
                        this.player.image.src = this.player.images.run2;
                        this.player.left = true;
                        
                    } else if (event.key === "d") {
                        this.player.xVelocity = 10;
                        this.player.image.src = this.player.images.run;
                        this.player.left = false;
                    } else if (event.key === 'w') {
                        this.player.image.src = this.player.images.jump;
                        this.player.y -= 80;
                        
                    } else if (event.key === 's') {
                        this.player.yVelocity = 2
                    } else if(event.key === ' ') {
                        this.player.animationCount = 0;
                        this.player.attack();
                        if (this.player.left) {
                            this.player.image.src = this.player.images.attack2;
                        } else {
                            this.player.image.src = this.player.images.attack;
                        }
                        
                    }
                }
            });

            document.addEventListener('keyup', (event) => {
                if(!this.dead) {
                    if (event.key === 'a') {
                        this.player.xVelocity = 0;
                        this.player.image.src = this.player.images.idle2;
                    } else if (event.key === "d") {
                        this.player.xVelocity = 0;
                        this.player.image.src = this.player.images.idle;
                    } else if (event.key === 'w') {
                        this.player.image.src = this.player.images.idle;
                        this.player.yVelocity = 0;
                    } else if (event.key === ' ') {
                        this.player.image.src = this.player.images.idle;
                        
                    }

                }
            });

        }


    
        restart() {

            this.player.x = 50;
            this.player.y = 50;

            this.enemies = [];
            for(let i = 0; i < this.enemyPositions.length; i++) {
                this.enemies.push(new Enemy(this, this.enemyPositions[i][0], this.enemyPositions[i][1]));
            }
            
            
            this.dead = false;
            this.player.health = 100;
            this.player.image.src = this.player.images.idle;
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

            

            // add an enemy occassionally

            if(Math.random()*50>49.9 && this.enemies.length < 5) {
                this.enemies.push(new Enemy(this, Math.random()*this.width, 400));
            }

            // draw enemies on the screen

            this.enemies.forEach((i) => {
                i.update();
                i.draw(context);
                

            });

            // draw the player on the canvas
            this.player.draw(context);
            this.player.update();

            // draw trees on the screen

            for (let i = 0; i < this.trees.length; i++) {

                this.trees[i].draw(context);
            }



            // draw player health

            context.fillStyle = 'white';
            context.font = "20px Orbitron";
            context.textAlign = 'left';
            context.fillText('Player Health:', 50, 45);

            context.fillStyle = 'red';
            context.fillRect(50, 50, this.player.health*2, 20);

            // check for player death

            if (this.dead) {
                
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









