window.addEventListener("load", function(){
const canvas = this.document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 720;
let enemies = [];
let score = 0;
let gameOver = false;
class InputHandler {
    constructor(){
        this.keys = [];
        window.addEventListener("keydown", i =>{
            if((i.key=="ArrowDown" ||   
                i.key=="ArrowUp"|| 
                i.key=="ArrowLeft" || 
                i.key=="ArrowRight") 
                && this.keys.indexOf(i.key) == -1){
                 this.keys.push(i.key);
    }})

         window.addEventListener("keyup", i =>{
            if( i.key=="ArrowDown" || 
                i.key=="ArrowUp"|| 
                i.key=="ArrowLeft" || 
                i.key=="ArrowRight"){
            this.keys.splice(this.keys.indexOf(i.key), 1);
        }
        });
    }
}

class Player{
    constructor(gameWidth, gameHeight){
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.width = 100;
        this.height = 100;
        this.x = 0;
        this.y = this.gameHeight - this.height;
        this.image = document.getElementById("player");
        this.speed = 0;
        this.vy = 0;
        this.gravity = 1;
    }
    draw(context){
        context.strokeStyle = "white";
        context.strokeRect(this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.x, this.y);
    }
    update(input, enemies){
        enemies.forEach(enemy =>{
            const dx = enemy.x - this.x;
            const dy = enemy.y - this.y
            if(Math.abs(dx)<((enemy.width/2)+(this.width/2)) && dy<((enemy.height/2)+(this.height/2))){
                gameOver = true;
                 location.replace("gameOver.html");
            }
        });
        if(input.keys.indexOf("ArrowRight")> -1){
            this.speed = 5;
        }
         if(input.keys.indexOf("ArrowLeft")> -1){
            this.speed = -5;
        } 
        if(input.keys.indexOf("ArrowUp")> -1 && this.onGround()){
            this.vy -=22;
        }
       if(!(input.keys.indexOf("ArrowRight")> -1 || input.keys.indexOf("ArrowLeft")> -1)){
        this.speed = 0;
       }
       this.x+= this.speed;
        if(this.x < 0){
            this.x = 0;
        }
        if(this.x > this.gameWidth - this.width){
            this.x = this.gameWidth - this.width;
        }

        this.y += this.vy;
        if(!this.onGround()){
            this.vy += this.gravity;
        }else{
            this.vy = 0;
        }
        if(this.y > this.gameHeight - this.height){
            this.y = this.gameHeight - this.height;
        }
    }
    onGround(){
        return this.y >= this.gameHeight - this.height;
    }
}

class Background {
    constructor(gameWidth, gameHeight){
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.image = document.getElementById("background");
        this.x = 0;
        this.y = 0;
        this.width = 1000;
        this.height = 720;
        this.speed = 5;
    }
    draw(context){
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
    }
update(){
    this.x -= this.speed;
    if(this.x < 0 - this.width){
        this.x = 0;
    }
}

}

class Enemy {
constructor(gameWidth, gameHeight){
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.width = 100;
    this.height = 100;
    this.image = document.getElementById("enemy");
    this.x = 800;
    this.y = 620;
    this.speed = 8;
    this.markedForDeletion = false;
}
    draw(context){
        context.strokeStyle = "white";
    context.strokeRect(this.x, this.y, this.width, this.height);
    context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    update(){
        this.x-= this.speed;
        if(this.x<0 - this.width){
            this.markedForDeletion = true;
            score++;
        }
    }
}


function handleEmenies(deltaTime){
    if(enemyTimer > enemyInterval){
        enemies.push(new Enemy(canvas.width, canvas.height));
        enemyTimer = 0;
    } else{
        enemyTimer += deltaTime;
    }
    enemies.forEach(enemy => {
        enemy.draw(ctx);
        enemy.update();
});
enemies = enemies.filter(enemy => !enemy.markedForDeletion);
}

function scoreText(context){
       context.fillStyle = "black";
    context.fillText("Score: " + score, 22, 52); 
    context.fillStyle = "white";
    context.font = "40px Comic Sans MS";
    context.fillText("Score: " + score, 20, 50); 

}

const input = new InputHandler();

const player = new Player(canvas.width, canvas.height);

const background = new Background(canvas.width, canvas.height);

let lastTime = 0;
let enemyTimer = 0;
let enemyInterval = 1500;

function updateScreen(timeStamp){
const deltaTime = timeStamp - lastTime;
lastTime  = timeStamp;
enemyInterval-=.2;
ctx.clearRect(0,0, canvas.width, canvas.height);
background.draw(ctx);
background.update();
player.draw(ctx);
player.update(input, enemies);
handleEmenies(deltaTime);
if(!gameOver)requestAnimationFrame(updateScreen);
scoreText(ctx);
}
   

updateScreen(0);
});
