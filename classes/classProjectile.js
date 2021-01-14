class ProjectileType{
  constructor(image,sound,width,height,speed,damage){
    this.image = image;
    this.sound = sound;
    this.speed = speed;
    this.width = width;
    this.height = height; 
    this.damage = damage;
  }
}

class Projectile{
  constructor(projectileType,x,y,rotate,owner,damage,vector){
    this.image = projectileType.image;
    this.x = x;
    this.y = y;
    this.speed = projectileType.speed;
    this.vector = vector;
    this.width = projectileType.width;
    this.height = projectileType.height; 
    this.rotate = rotate;
    this.damage = damage;
    this.owner = owner;
    this.dead = false;
    this.particleTimer = int(random(0,6));
  
  }
  draw(){
    this.x += this.vector.x*this.speed;
    this.y += this.vector.y*this.speed;
    let cRect = new CollideRect(this.x,this.y,this.width,this.height,false);
    push();
    translate(this.x,this.y);
    rotate(this.rotate);
    imageMode(CENTER);
    image(this.image,0,0,this.width,this.height);
    pop();
    this.particleTimer --;
    if(this.particleTimer <= 0){
      this.particleTimer = int(random(0,6));
      let n = freeSpaceCheck(fireParticles);
      fireParticles[n] = new FireParticles(this.x,this.y);
    }
    if(this.owner == player){ 
      for (let i = 0; i < monster.length; i++) {
        if (!monster[i].dead && collision(cRect, monster[i].getPColl())) {
          damage(this.owner,monster[i],this.damage,true);
          this.dead = true;
        }
      }
    }
  if(this.x > width/2 || this.x < -width/2 || this.y > height/2 || this.y < - height/2){
    this.dead = true;
  }
  }
}

function launch(){
  if(player.mana > 10){
  inGameUI.spellRect = 255;
  n = freeSpaceCheck(projectile);
  let mousX = mouseX - width / 2;
  let mousY = mouseY - height / 2;
  let disX = divide(mousX - player.x,mousY - player.y);
  let disY = divide(mousY - player.y,mousX - player.x);
  let rotate = atan2(disY,disX);
  let vector = createVector(disX, disY);
  let damage = projectileType[0].damage * player.spellDamage/100;
  projectileType[0].sound.play();
  projectile[n] = new Projectile(projectileType[0],player.x,player.y,rotate,player,damage,vector);
  player.mana -= 10;
  }
  else{
  n = freeSpaceCheck(floatText);
  floatText[n] = new FloatText(inGameUI.spell1X, inGameUI.spell1Y, 'Not Enough Mana!', 30, color(100, 100, 255), 0.75, 1, 1);
  
  }

}
class Blood {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(8,26);
    this.vector = createVector(random(-2.50,2.50),this.size/4);
    this.time = 30;
    this.color = color(150,0, 0);
    this.dead = false;

  }
  draw() {
    if(!this.dead){
        this.x += this.vector.x;
        this.y += this.vector.y;
        push();
        this.color.setAlpha(this.time * 7 + 45);
        fill(this.color);
        noStroke();
        translate(this.x, this.y);
        circle(0, 0, this.size);
        pop();
        this.time--;
        if (this.time <= 0) this.dead = true;
      }
  }
}
class FireParticles{
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(3,8);
    this.vector = createVector(random(-0.50,0.50),this.size/2);
    this.time = 60;
    this.color = color(200,175,0);
    this.dead = false;

  }
  draw() {
    if(!this.dead){
        this.x += this.vector.x;
        this.y += this.vector.y;
        this.size -= this.size/500;
        push();
        rectMode(CENTER);
        fill(this.color);
        stroke(255,200,0);
        strokeWeight(4);
        translate(this.x, this.y);
        rotate(millis()/10);
        square(0, 0, this.size);
        pop();
        this.time--;
        if (this.time <= 0) this.dead = true;
      }
  }
}