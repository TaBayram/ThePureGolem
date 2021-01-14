class MonsterType {
  constructor(name, idle, attack, walk, width, height, damage, range, health, mana, healthRegen, manaRegen, armor, walkSpeed, attackSpeed,xpGive,gold) {
    this.name = name;
    this.idle = idle;
    this.walk = walk;
    this.attack = attack;
    this.height = height;
    this.width = width
    this.attackDamage = damage;
    this.range = range;
    this.health = health;
    this.healthRegen = healthRegen;
    this.mana = mana;
    this.manaRegen = manaRegen;
    this.armor = armor;
    this.walkS = walkSpeed;
    this.attackS = attackSpeed;
    this.xpGive = xpGive;
    this.gold = gold;
  }
}

let wScore = -9999; //AI WORST SCORE
let depth = 30;
let size = 30;
let maxPoint = 3;
let takenL = false;
let takenR = false;
let firstIsPoint = false;

class Monster {
  constructor(x, y, monsterType) {
    this.x = x;
    this.y = y;
    this.isAttacking = false;
    this.attackCD = 0;
    this.idleF = 0;
    this.walkF = 0;
    this.attackF = 0;
    this.facing = 1;
    this.health = monsterType.health;
    this.mana = monsterType.mana;
    this.monsterType = monsterType;
    this.dead = false;
    this.tPoint = [];
    this.mPoint = [];

    this.attackDamage = monsterType.attackDamage;
    this.range = monsterType.range;
    this.healthMax = monsterType.health;
    this.healthRegen = monsterType.healthRegen;
    this.mana = monsterType.mana;
    this.manaRegen = monsterType.manaRegen;
    this.armor = monsterType.armor;
    this.walkSpeed = monsterType.walkS;
    this.attackSpeed = monsterType.attackS;
    this.xpGive = monsterType.xpGive;
    this.gold = monsterType.gold;
  }
  draw() {
    let vW = this.monsterType.width; //Virtual Height
    let vH = this.monsterType.height; //Virtual Width
    if (!this.dead) {
      push();
      let movement;
      let walks = false;


      movement = this.movementAI();
      if (movement.move != 'n') {
        walks = true;
        this.x += movement.dirX;
        this.y += movement.dirY;
        if(movement.dirX < 0) {
          this.facing = -1;
        }
        else this.facing = 1;
        //this.facing = (movement.dirX+10) / (abs(movement.dirX+10));
      }
      if (movement.move == 'n') {
        this.facing = (player.x - this.x) / abs(player.x - this.x);
      }

      if (this.tPoint.length != 0) {
        let pEnd = this.tPoint.length - 1;
        let pointRect = new CollideRect(this.tPoint[pEnd].x, this.tPoint[pEnd].y, 10, 10, false);
        if (collision(pointRect, this.getColl())) {
          this.mPoint[pEnd] = false;
          this.tPoint.pop();
        }
      }


      if (this.attackCD == 0 && collision(this.getAColl(), player.getColl()) && collision3D(this.getColl(), player.getColl())) {
        this.isAttacking = true;
      }

      translate(this.x, this.y);
      //HealthBar
      let healthBar = (this.health / this.healthMax) * vW / 2;
      fill(100, 0, 0);
      rect(-vW / 4, -vH / 2, vW / 2, 24);
      fill(255, 0, 0);
      rect(-vW / 4, -vH / 2, healthBar, 24);

      //Model
      scale(this.facing, 1);
      rectMode(CENTER);
      imageMode(CENTER);
      noStroke();
      fill(0, 0, 0, 0);
      rect(0, 12, vW / 3, vH / 1.4);
      tint(cDungeon.tint);
      let mT = this.monsterType;
      if (!this.isAttacking) {
        if (walks) {
          this.attackF = 0;
          this.idleF = 0;
          this.walkF += 0.5;
          this.shadow(mT.walk[int(this.walkF)]);
          image(mT.walk[int(this.walkF)], 0, 0, vW, vH);
          if (this.walkF == mT.walk.length - 1) this.walkF = 0;
        } else {
          this.attackF = 0;
          this.walkF = 0;
          this.idleF += 0.25;
          this.shadow(mT.idle[int(this.idleF)]);
          image(mT.idle[int(this.idleF)], 0, 0, vW, vH);
          if (this.idleF == mT.idle.length - 1) this.idleF = 0;
        }
      } else {
        this.idleF = 0;
        this.walkF = 0;
        this.attackF += 0.25;
        this.shadow(mT.attack[int(this.attackF)]);
        image(mT.attack[int(this.attackF)], 0, 0, vW, vH);
        if (this.attackF == mT.attack.length - 1) {
          this.attackF = 0;
          this.isAttacking = false;
          this.attackCD = mT.attackS;
        }
        if (this.attackF == 6) {
          stoneSwing.play();
          if (collision(this.getAColl(), player.getColl()) && collision3D(this.getColl(), player.getColl())) {
            damage(this, player, this.attackDamage);
          }
        }
      }
      pop();
    }
  }
  shadow(anim) {
    let vW = this.monsterType.width; //Virtual Height
    let vH = this.monsterType.height; //Virtual Width
    push();
    translate(0, this.monsterType.height / 2);
    if (this.facing == +1) rotate(PI / 4);
    if (this.facing == -1) rotate(-PI / 4);
    tint(0, 0, 0, 100);
    image(anim, this.facing * -10, -vH / 3 - 30, vW / 1.5, vH / 1.5);
    pop();
  }
  lvlIncrease(multiplier){
    let mp = multiplier;
    let n = 1.2;
    this.attackDamage *= pow(mp,n);
    this.healthMax *= pow(mp,n);
    this.health *= pow(mp,n);
    this.mana *= pow(mp,n);
   // this.xpGive *= mp;
  }
  death() {
    this.dead = true;
    //Death animation
    let n = freeSpaceCheck(item)
    item[n] = new Item(this.x, this.y, itemType[0]);
    item[n].bonus = this.gold;
    let itemRandom = int(random(0,4));
    if(itemRandom == 0) {
      n = freeSpaceCheck(item);
      item[n] = new Item((this.x+random(20,50)), this.y, itemType[1]); 
      item[n].bonus = this.healthMax/10;}
    // After Death
    this.x = width * 1.5;
    this.y = height * 1.5;

  }
  getColl() {
    let mT = this.monsterType;
    let cBody = new CollideRect(this.x, this.y + mT.height / 3.5, mT.width / 4, mT.height / 4, false);
    return cBody;
  }
  getAColl() {
    let mT = this.monsterType;
    if(this.facing == -1){
      let cAttack = new CollideRect(this.x - (mT.width / 6 + this.range),
        this.y - mT.height / 4, mT.range, mT.height / 1.5, true);
      return cAttack;
    }
    let cAttack = new CollideRect(this.x + this.facing * mT.width / 6,
        this.y - mT.height / 4, mT.range * this.facing, mT.height / 1.5, true);
    return cAttack;
  }
  getPColl() {
    let mT = this.monsterType;
    let cBody = new CollideRect(this.x, this.y, mT.width/4, mT.height/1.5, false);
    return cBody;
  }
  movementAI() {
    let wS = this.walkSpeed
    let dir = [];
    dir[dir.length] = new Direction(this.scoreAI(0, 0, 'n'), 0, 0, 'n');
    dir[dir.length] = new Direction(this.scoreAI(wS, 0, 'r'), wS, 0, 'r');
    dir[dir.length] = new Direction(this.scoreAI(-wS, 0, 'l'), -wS, 0, 'l');
    dir[dir.length] = new Direction(this.scoreAI(0, -wS, 'u'), 0, -wS, 'u');
    dir[dir.length] = new Direction(this.scoreAI(0, wS, 'd'), 0, wS, 'd');
    dir[dir.length] = new Direction(this.scoreAI(wS, -wS, 'ur'), wS, -wS, 'ur');
    dir[dir.length] = new Direction(this.scoreAI(-wS, -wS, 'ul'), -wS, -wS, 'ul');
    dir[dir.length] = new Direction(this.scoreAI(wS, wS, 'dr'), wS, wS, 'dr');
    dir[dir.length] = new Direction(this.scoreAI(-wS, wS, 'dl'), -wS, wS, 'dl');
    let bestDir = dir[0];
    for (let i = 1; i < dir.length; i++) {
      if (bestDir.score < dir[i].score) bestDir = dir[i];
    }
    if (bestDir == dir[0] || bestDir.score > 2000) {
      this.tPoint = [];
      this.mPoint = [];
      return dir[0];
    }

    let cBody = this.getColl();
    let canGo = true;
    cBody.x += bestDir.dirX;
    cBody.y += bestDir.dirY;
    let obstacle;

    if ( abs(cBody.x) + cBody.w < abs(width/2) &&(
        collision(cBody, player.getColl()) || 
        collision(cBody, cDungeon.leftRect) || 
        collision(cBody, cDungeon.rightRect) || 
        collision(cBody, cDungeon.upRect) || 
        collision(cBody, cDungeon.downRect)) ) {
      canGo = false;
      obstacle = player.getColl();
    } else {
      for (let i = 0; i < monster.length; i++) {
        if (monster[i] != this && collision(cBody, monster[i].getColl())) {
          canGo = false;
          obstacle = monster[i].getColl();
          break;
        }
      }
    }
    if (canGo) {
      return bestDir;
    }

    return this.searchPath(bestDir);

  }
  searchPath(goal) {
    let wS = this.monsterType.walkS;
    let cBody = this.getColl();
    cBody.x += goal.dirX;
    cBody.y += goal.dirY;
    this.prevMov = new Point(cBody.x + goal.dirX * 10, cBody.y + goal.dirY * 10);
    let fBody = this.getColl();
    fBody.x += goal.dirX;
    fBody.y += goal.dirY;
    let pEnd = this.tPoint.length;
    if (pEnd == 0 && firstIsPoint) {
      this.tPoint[pEnd] = new Point(fBody.x, fBody.y);
      this.mPoint[pEnd] = true;
    }
    let allPoints = [];
    for (let i = 1; i < depth; i++) {
      if (goal.move != 'r' && goal.move != 'l') {
        fBody.x = cBody.x + i * size;
        if (!genCollide(fBody)) {
          if (this.pointManager(fBody, false)) {
            let n = allPoints.length;
            allPoints[n] = new Point(fBody.x, fBody.y);
            allPoints[n].direction(wS, 0, 'r')
          }
        }
        fBody.x = cBody.x;
      }
      if (goal.move != 'l' && goal.move != 'r') {
        fBody.x = cBody.x - i * size;
        if (!genCollide(fBody)) {
          if (this.pointManager(fBody, false)) {
            let n = allPoints.length;
            allPoints[n] = new Point(fBody.x, fBody.y);
            allPoints[n].direction(-wS, 0, 'l')
          }
        }
        fBody.x = cBody.x;
      }
      if (goal.move != 'u' && goal.move != 'd') {
        fBody.y = cBody.y - i * size;
        if (!genCollide(fBody)) {
          if (this.pointManager(fBody, false)) {
            let n = allPoints.length;
            allPoints[n] = new Point(fBody.x, fBody.y);
            allPoints[n].direction(0, -wS, 'u')
          }
        }
        fBody.y = cBody.y;
      }
      if (goal.move != 'd' && goal.move != 'u') {
        fBody.y = cBody.y + i * size;
        if (!genCollide(fBody)) {
          if (this.pointManager(fBody, false)) {
            let n = allPoints.length;
            allPoints[n] = new Point(fBody.x, fBody.y);
            allPoints[n].direction(0, wS, 'd')
          }
        }
        fBody.y = cBody.y;
      }
      if (goal.move != 'ur' && goal.move != 'dl') {
        fBody.y = cBody.y - i * size;
        fBody.x = cBody.x + i * size;
        if (!genCollide(fBody)) {
          if (this.pointManager(fBody, false)) {
            let n = allPoints.length;
            allPoints[n] = new Point(fBody.x, fBody.y);
            allPoints[n].direction(wS, -wS, 'ur')
          }
        }
        fBody.y = cBody.y;
        fBody.x = cBody.x;
      }
      if (goal.move != 'ul' && goal.move != 'dr') {
        fBody.y = cBody.y - i * size;
        fBody.x = cBody.x - i * size;
        if (!genCollide(fBody)) {
          if (this.pointManager(fBody, false)) {
            let n = allPoints.length;
            allPoints[n] = new Point(fBody.x, fBody.y);
            allPoints[n].direction(-wS, -wS, 'ul')
          }
        }
        fBody.y = cBody.y;
        fBody.x = cBody.x;
      }
      if (goal.move != 'dr' && goal.move != 'ul') {
        fBody.y = cBody.y + i * size;
        fBody.x = cBody.x + i * size;
        if (!genCollide(fBody)) {
          if (this.pointManager(fBody, false)) {
            let n = allPoints.length;
            allPoints[n] = new Point(fBody.x, fBody.y);
            allPoints[n].direction(wS, wS, 'dr')
          }
        }
        fBody.y = cBody.y;
        fBody.x = cBody.x;
      }
      if (goal.move != 'ul' && goal.move != 'dr') {
        fBody.y = cBody.y + i * size;
        fBody.x = cBody.x - i * size;
        if (!genCollide(fBody)) {
          if (this.pointManager(fBody, false)) {
            let n = allPoints.length;
            allPoints[n] = new Point(fBody.x, fBody.y);
            allPoints[n].direction(-wS, wS, 'dr')
          }
        }
        fBody.y = cBody.y;
        fBody.x = cBody.x;
      }
      if (allPoints.length != 0) {
        let bestPoint = allPoints[int(random(0,allPoints.length))];
        /*for (let j = 1; j < allPoints.length; j++) {
          if(dist(bestPoint.x, bestPoint.y, cBody.x, cBody.y) > dist(allPoints[j].x, allPoints[j].y,cBody.x,cBody.y)) {
            bestPoint = allPoints[j];
          }
        }*/
        fBody.x = bestPoint.x; fBody.y = bestPoint.y;
        this.pointManager(fBody,true);
        return new Direction(0,bestPoint.dirX,bestPoint.dirY,bestPoint.move);
      }
    }
    return new Direction(0, 0, 0, 'n');

  }

  pointManager(fBody, create) {
    let tempCheck = new Point(fBody.x, fBody.y);
    let isUnique = true;
    for (let i = 0; i < this.tPoint.length; i++) {
      let pointRect = new CollideRect(this.tPoint[i].x, this.tPoint[i].y, 30, 30, false);
      if (collisionPoint(fBody.x, fBody.y, pointRect)) {
        isUnique = false;
        return false;
      }
    }
    if (this.tPoint.length == maxPoint) {
      this.tPoint = [];
      this.mPoint = [];
    }
    if (isUnique && create) {
      let pEnd = this.tPoint.length;
      this.tPoint[pEnd] = new Point(fBody.x, fBody.y);
      this.mPoint[pEnd] = true;
    }
    return true;
  }

  scoreAI(newX, newY, mov) {
    let cBody = this.getColl();
    cBody.x += newX;
    cBody.y += newY;
    let cTargetL = getTar('l');
    let cTargetR = getTar('r');
    let rTarget = cTargetR;
    let targetL = sqrt(sq(this.x - cTargetL.x) + sq(this.y - cTargetL.y))
    let targetR = sqrt(sq(this.x - cTargetR.x) + sq(this.y - cTargetR.y));
    if (takenR || (!takenL && targetR > targetL)) rTarget = cTargetL;
    let pEnd = this.tPoint.length - 1;
    if (this.mPoint[pEnd]) rTarget = new CollideRect(this.tPoint[pEnd].x, this.tPoint[pEnd].y, 5, 5, false);

    let score = 0;

    let oldPos = this.getColl();
    let newD = sqrt(sq(cBody.x - rTarget.x) + sq(cBody.y - rTarget.y));
    let oldD = sqrt(sq(oldPos.x - rTarget.x) + sq(oldPos.y - rTarget.y));
    if (newD < oldD) score += 50;
    score += 200 / (newD + 1);

    let newYD = abs(rTarget.y - cBody.y);
    let oldYD = abs(rTarget.y - oldPos.y);
    if (oldYD > newYD) {
      score += 10;
    }
    score += 100 / (newYD + 1);
    if (collision3D(cBody, rTarget)) score += 5;


    if (collision(cBody, cTargetL)) {
      score += 2000;
    }
    if (collision(cBody, cTargetR)) {
      score += 2000;
    }

    return score;

  }

}
function checkTargets() {
  let cTargetL = getTar('l');
  cTargetL.w *= 1.2;
  takenR = false;
  let cTargetR = getTar('r');
  cTargetR.w *= 1.2;
  takenL = false;
  for (let i = 0; i < monster.length; i++) {
    if (collision(cTargetL, monster[i].getColl())) {
      takenL = true;
    }
    if (collision(cTargetR, monster[i].getColl())) {
      takenR = true;
    }
  }
}
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dirX = null;
    this.dirY = null;
    this.move = null;
  }
  direction(dirX, dirY, move) {
    this.dirX = dirX;
    this.dirY = dirY;
    this.move = move;
  }
}
class Direction {
  constructor(score, directionX, directionY, mov) {
    this.score = score;
    this.dirX = directionX;
    this.dirY = directionY;
    this.move = mov;
  }
}