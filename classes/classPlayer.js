class Player {
  constructor(x, y, idle, walk, attack) {
    //Positions
    this.x = x;
    this.y = y;
    this.pX = x;
    this.pY = y;
    //Model Size
    this.width = 300;
    this.height = 200;
    //Movement Keyboards
    this.up = 87;
    this.down = 83;
    this.left = 65;
    this.right = 68;
    this.attackKey = 32;
    //Animation Controllers
    this.attacking = false;
    this.idle = idle;
    this.walk = walk;
    this.attack = attack;
    this.idleF = 0;
    this.walkF = 0;
    this.attackF = 0;
    this.facing = 1;
    //Character Attributes
    this.attackDamage = 32;
    this.health = 100;
    this.healthRegen = 0.4; // quarter
    this.healthMax = 100;
    this.mana = 100;
    this.manaRegen = 2;
    this.manaMax = 100;
    this.spellDamage = 100;
    this.armor = 4;
    this.walkSpeed = 6;
    this.range = 30;
    this.level = 1;
    this.hasLeveled = true;
    this.levelPoints = 0;
    this.xp = 0;
    this.xpRequired = 100;
    //Level Attributes
    this.lvlHealth = 10;
    this.lvlAttackDamage = 6;
    this.lvlArmor = 1;
    this.lvlMana = 10;
    this.lvlSpell = 10;
    //Player Attributes
    this.gold = 20;
  }
  draw() {
    this.pX = this.x;
    this.pY = this.y;
    let yAxis = false;
    let xAxis = false;
    let isWalking = false;
    push();
    let cBody = this.getColl();
    if (keyIsDown(this.up)) {
      cBody.y -= this.walkSpeed*2;
      if (!collision(cBody, cDungeon.upRect) && this.canMove(cBody)) {
        this.y -= this.walkSpeed;
        isWalking = true;
        yAxis = true;
      } else cBody.y += this.walkSpeed*2;
    }
    if (keyIsDown(this.down) && this.y <= +height / 2 - 250) {
      cBody.y += this.walkSpeed*2;
      if (!collision(cBody, cDungeon.downRect) && this.canMove(cBody)) {
        this.y += this.walkSpeed;
        isWalking = true;
        yAxis = true;
      } else cBody.y -= this.walkSpeed*2;
    }
    if (keyIsDown(this.left)) {
      cBody.x -= this.walkSpeed*2;
      this.facing = -1;
      if (this.canMove(cBody) && (
        !collision(cBody, cDungeon.leftRect) || (cDungeon.isFinished))) {
        this.x -= this.walkSpeed;
        isWalking = true;
        xAxis = true;
      } else cBody.x += this.walkSpeed*2;
    }
    if (keyIsDown(this.right)) {
      cBody.x += this.walkSpeed*2;
      this.facing = +1;
      if (this.canMove(cBody) && (
        !collision(cBody, cDungeon.rightRect) || (cDungeon.isFinished))) {
        this.x += this.walkSpeed;
        isWalking = true;
        xAxis = true;
      } else cBody.x -= this.walkSpeed*2;
    }
    if(cDungeon.isFinished) cDungeon.nextWave(this.getColl());
    translate(this.x, this.y);
    scale(this.facing, 1);
    imageMode(CENTER);
    noStroke();
    if (!this.attacking) {
      if (isWalking) {
        this.idleF = 0;
        this.attackF = 0;
        this.walkF += 0.5;
        this.shadow(this.walk[int(this.walkF)]);
        image(this.walk[int(this.walkF)], 0, 0, this.width, this.height);
        if (this.walkF == this.walk.length - 1) this.walkF = 0;
      } else {
        this.walkF = 0;
        this.attackF = 0;
        this.idleF += 0.25;
        this.shadow(this.idle[int(this.idleF)]);
        image(this.idle[int(this.idleF)], 0, 0, this.width, this.height);
        if (this.idleF == this.idle.length - 1) this.idleF = 0;
      }
    } else {
      this.walkF = 0;
      this.idleF = 0;
      this.attackF += 0.50;
      this.shadow(this.attack[int(this.attackF)]);
      image(this.attack[int(this.attackF)], 0, 0, this.width, this.height);
      if (this.attackF == this.attack.length - 1) {
        this.attacking = false;
        this.attackF = 0;
        if(keyIsDown(player.attackKey)){
        this.attacking = true;
      }
      }
      if (this.attackF == 6) {
        woodSwing.play();
        let cAttack = this.getAColl();
        for(let i = 0; i < monster.length; i++){
          if (collision(cAttack, monster[i].getColl()) && collision3D(this.getColl(), monster[i].getColl())) {
          damage(this, monster[i], this.attackDamage);
          woodHit.play();
          }
        }
      }
    }

    for (let i = 0; i < item.length; i++) {
      if (!item[i].dead && collision(item[i].getColl(), cBody)) {
        item[i].pickup();
      }
    }
    pop();
  }
  canMove(cBody){
      fill(255, 255, 255, 100);
    for(let i = 0; i < monster.length; i++){
      if(collision(cBody,monster[i].getColl())) return false;
    
    }
    //cBody = new CollideRect(this.x, this.y + this.height / 3.2, this.width / 3.2, this.height / 3.2, false);
    //let cBody3 = new CollideRect(this.x, this.y + this.height / 3.2, this.width / 2.75, this.height / 2.60, false);
    return true;
  
  }
  shadow(anim) {
    push();
    translate(0, this.height / 2);
    if (this.facing == +1) rotate(PI / 4);
    if (this.facing == -1) rotate(-PI / 4);
    tint(0, 0, 0, 100);
    image(anim, this.facing * -10, -this.height / 3 - 30, this.width / 1.5, this.height / 1.5);
    pop();
  }
  getColl() {
    let cBody = new CollideRect(this.x, this.y + this.height / 3, this.width / 3, this.height / 3, false);
    return cBody;
  }
  getAColl(){
    if(this.facing == -1){
      let cAttack = new CollideRect(this.x - (this.width / 6 + this.range),this.y - this.height / 4, this.range, this.height / 1.35,true);
      return cAttack;
    }
    let cAttack = new CollideRect(this.x + this.facing * this.width / 6,this.y - this.height / 4, this.range * this.facing, this.height / 1.35, true);
    return cAttack;  
  }
  getPColl() {
    let cBody = new CollideRect(this.x, this.y, this.width/4, this.height/1.5, false);
    return cBody;
  }
  levelUp(){
        this.level++;
        this.hasLeveled = true;
        this.levelPoints++;
        this.xp %= this.xpRequired;
        let n = freeSpaceCheck(floatText);
        slevelUp.play();
        floatText[n] = new FloatText(this.getColl().x, this.getColl().y - this.height, 'Leveled Up!', 30, color(255, 255, 20), 1.5, 1, 4);

}
}

class Inventory{
  constructor(){
    this.helmet = null;
    this.breastPlate = null;
    this.ring = null;
    this.cloak = null;
    this.gauntlet = null;
    this.weapon = null;
    this.belt = null;
    this.boots = null;
    this.item = ['helmet','breastPlate','cloak','ring','gauntlet','weapon','belt','boots'];
  }
  drop(item){
    
    player[this[item].field] -= this[item].bonus;
    this[item] = null;
  }
}