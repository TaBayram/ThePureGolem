class FloatText {
  // mode 0 grav, 1 up, 2 down, 3 right, 4 left, 5 infront, 6 back
  constructor(x, y, sText,tSize, cColor, time, mode, speed) {
    this.pos = createVector(x, y);
    this.text = sText;
    this.size = tSize;
    this.sizeChange = 1;
    this.color = cColor;
    this.time = time;
    this.duration = time;
    this.dead = false;
    this.vector = createVector(0, 0);
    this.mode = mode;
    if(mode == 0) {this.vector.x = random(-2,2); 
                   this.vector.y = -speed; 
                   this.grav = createVector(0,-(this.vector.y*2)/(this.time*60));}
    else if(mode == 1) {this.vector.y = -speed;}
    else if(mode == 2) {this.vector.y = +speed;}
    else if(mode == 3) {this.vector.x = +speed;}
    else if(mode == 4) {this.vector.x = -speed;}
    else if(mode == 5) {this.sizeChange += speed/100;}
    else if(mode == 6) {this.sizeChange -= speed/100;}
    
  }
  draw() {
    if (this.dead == false) {
      push();
      let transp = (320*this.duration*1.2)/this.time;
      this.color.setAlpha(transp);
      this.pos.add(this.vector);
      if(this.mode == 0) this.vector.add(this.grav);
      this.size *= this.sizeChange;
      textSize(this.size);
      textFont(fontSpartan);
      textAlign(CENTER);
      fill(this.color);
      text(this.text, this.pos.x,this.pos.y);
      pop();
    }
  }
}


class InGameUI {
  constructor(image,plusSign) {
    this.image = image;
    this.healthX = 285 - FSWIDTH / 2;
    this.healthY = 950 - FSHEIGHT / 2;
    this.manaX = 285 - FSWIDTH / 2;
    this.manaY = 1014 - FSHEIGHT / 2;
    this.armorX = 216 - FSWIDTH/2;
    this.armorY = 1015 - FSHEIGHT / 2;
    this.heightBar = 36;
    this.widthBar = 240;
    this.widthXP = 76;
    this.rectlvl = new CollideRect(-FSWIDTH / 2 + 555,FSHEIGHT / 2 - 180+100,64,64,true);
    this.plusSign = plusSign;
    this.plusSignSize = 1;
    this.plusSignX = -FSWIDTH / 2 + 555;
    this.plusSignY = FSHEIGHT / 2 -180 + 100;
    this.goldX = -FSWIDTH / 2 + 655;
    this.goldY = FSHEIGHT / 2 - 180 + 80;
    this.xpBarX = -FSWIDTH / 2 + 582;
    this.xpBarY = FSHEIGHT / 2 - 180 + 106;
    this.xpBarHeight = 48;
    this.spell1X = -FSWIDTH / 2 + 800;
    this.spell1Y = FSHEIGHT / 2 - 180+50;
    this.spellRect = 0;
    
    this.currentWaveX = -FSWIDTH / 2 + 1500;
    this.currentWaveY = FSHEIGHT / 2 - 180+130;

    this.moveRLX = 0;
    this.moveRLY = -FSHEIGHT / 2 + 900;

  }
  draw() {
    image(this.image, -FSWIDTH / 2, FSHEIGHT / 2-180,FSWIDTH,180);
    push();
    noStroke();    
    //SETUP
    textAlign(CENTER);
    textFont(fontRobo);
    fill(250, 0, 0);
    ellipseMode(CORNER);
    textSize(45);
    
    //ARMOR 
    fill(200, 200, 200);
    text(int(player.armor), this.armorX, this.armorY);
    
    //ATTACK
    fill(0);
    text(int(player.attackDamage), this.armorX-120, this.armorY);
    
    //HEALTH BAR
    let healthBar = (player.health / player.healthMax) * this.widthBar;
    textSize(30);
    fill(220, 0, 0);
    rect(this.healthX, this.healthY, healthBar, this.heightBar);
    fill(255, 100, 100);
    text(int(player.health) + "/" + player.healthMax, this.healthX + this.widthBar / 2, this.healthY + this.heightBar / 1.5);
    
    //MANA BAR
    let manaBar = (player.mana / player.manaMax) * this.widthBar;
    fill(0, 0, 220);
    rect(this.manaX, this.manaY, manaBar, this.heightBar);
    fill(100, 100, 255);
    text(int(player.mana) + "/" + player.manaMax, this.manaX + this.widthBar / 2, this.manaY + this.heightBar / 1.5);

    textSize(30);
    textFont(fontRobo);
    textAlign(RIGHT);
    
    //GOLD
    fill(100, 100, 0);
    text(player.gold, this.goldX, this.goldY);
    
    //XP BAR
    fill(100, 0, 155);
    let xpBar = (player.xp / player.xpRequired) * this.widthXP;
    rect(this.xpBarX, this.xpBarY, xpBar, this.xpBarHeight);
    fill(200, 0, 255);
    text(player.level, this.plusSignX + 100, this.plusSignY + 40);
    if(player.levelPoints != 0){
      push();
      imageMode(CENTER);
      let temp = 64 + 32*sin(this.plusSignSize);
      image(this.plusSign,this.plusSignX+32,this.plusSignY+32,temp,temp);
      this.plusSignSize += 0.05;
      this.plusSignSize %= 360;
      pop();
    }
    
    //SPELLS
    fill(255,50,50,150);
    rect(this.spell1X,this.spell1Y,72,72);
    image(ifireball,this.spell1X,this.spell1Y,68,68);
    let damage = int(player.spellDamage*projectileType[0].damage/100);
    textAlign(CENTER);
    fill(255,0,0);
    text(damage,this.spell1X+36,this.spell1Y+100);
    fill(255,0,0,this.spellRect);
    rect(this.spell1X,this.spell1Y,72,72);
    if(this.spellRect <= 0) this.spellRect = 0;
    else this.spellRect -= 50;
    
    textSize(90);
    fill(150,255,150);
    text(cDungeon.dLevel + ". Wave", this.currentWaveX,this.currentWaveY);
    if(cDungeon.isFinished){
      textSize(60);
      text("Move Right or Left to continue",this.moveRLX,this.moveRLY);
    }
    pop();
  }
}

class FullScreen {
  constructor(isOn,topText,botText,rectText) {
    this.x = 0;
    this.y = 0;
    this.width = FSWIDTH;
    this.height = FSHEIGHT;
    this.isOn = isOn;
    this.topText = topText;
    this.botText = botText;
    this.rectText = rectText;
    this.rectButton = new CollideRect(this.x,this.y,this.width/4,this.height/10);
  }
  draw() {
    push();
    fill(255);
    strokeWeight(5);
    textAlign(CENTER,CENTER);
    rectMode(CENTER);
    textFont(fontRobo);
    textSize(120);
    text("THE PURE GOLEM",this.x,this.y-height/2.5);
    textSize(50);
    text(this.topText, this.x, this.y - height/6);
    text(this.botText, this.x, this.y + height/6);
    text("Made by Tayyib Bayram",this.x,this.y + height/2.5);
    this.rectButton.draw();
    fill(120,0,160);
    textSize(90);
    text(this.rectText,this.x,this.y-10);
    pop();
  }
}

class LevelScreen {
  constructor() {
    this.x = 0;
    this.y = -500;
    this.rectWidth = 200;
    this.rectHeight = 50;
    this.rect = [];
    this.rect[this.rect.length] = new CollideRect(this.x,this.y+this.rectHeight*this.rect.length*1.4,this.rectWidth,this.rectHeight,false);
    this.rect[this.rect.length] = new CollideRect(this.x,this.y+this.rectHeight*this.rect.length*1.4,this.rectWidth,this.rectHeight,false);
    this.rect[this.rect.length] = new CollideRect(this.x,this.y+this.rectHeight*this.rect.length*1.4,this.rectWidth,this.rectHeight,false);
    this.rect[this.rect.length] = new CollideRect(this.x,this.y+this.rectHeight*this.rect.length*1.4,this.rectWidth,this.rectHeight,false);
    this.rect[this.rect.length] = new CollideRect(this.x,this.y+this.rectHeight*this.rect.length*1.4,this.rectWidth,this.rectHeight,false);
    this.rect[this.rect.length] = new CollideRect(this.x,this.y+this.rectHeight*this.rect.length*1.4,this.rectWidth,this.rectHeight,false);
    this.isOn = false;
  }
  draw() {
    push();
    strokeWeight(5);
    textAlign(CENTER,CENTER);
    rectMode(CENTER);
    textFont(fontRobo);
    stroke(255,255,0,100);
    fill(125,25,155,50);
    this.rect[0].draw();
    this.rect[1].draw();
    this.rect[2].draw();
    this.rect[3].draw();
    this.rect[4].draw();
    textSize(20);
    fill(255);
    let points = " Points Left!";
    if( player.levelPoints == 1) points = " Point Left!";
    text( player.levelPoints + points,this.rect[5].x,this.rect[5].y);
    text("+" +player.lvlAttackDamage +" Attack Damage",this.rect[0].x,this.rect[0].y);
    text("+" +player.lvlArmor +"  Armor",this.rect[1].x,this.rect[1].y);
    text("+" +player.lvlHealth +" Health",this.rect[2].x,this.rect[2].y);
    text("+" +player.lvlMana +" Mana",this.rect[3].x,this.rect[3].y);
    text("+" +player.lvlSpell +" Spell Power",this.rect[4].x,this.rect[4].y);
    pop();
  }
  click(mousX,mousY){
        if (collisionPoint(mousX, mousY, this.rect[0])) {
          player.attackDamage += player.lvlAttackDamage;
          return this.afterAttribute(mousX,mousY);
        }
        else if (collisionPoint(mousX, mousY, this.rect[1])) {
          player.armor += player.lvlArmor;
          return this.afterAttribute(mousX,mousY);
        }
        else if (collisionPoint(mousX, mousY, this.rect[2])) {
          player.healthMax += player.lvlHealth;
          player.health += player.lvlHealth;
          return this.afterAttribute(mousX,mousY);
        }
        else if (collisionPoint(mousX, mousY, this.rect[3])) {
          player.manaMax += player.lvlMana;
          player.mana += player.lvlMana;
          return this.afterAttribute(mousX,mousY);
        }
         else if (collisionPoint(mousX, mousY, this.rect[4])) {
          player.spellDamage += player.lvlSpell;
          return this.afterAttribute(mousX,mousY);
        }
        else
          return false;
  }
  afterAttribute(mousX,mousY) {
    buttonHit.play();
    player.hasLeveled = false;
    player.levelPoints--;
    let n = freeSpaceCheck(floatText);
    floatText[n] = new FloatText(mousX, mousY, 'Increased!', 40, color(255, 200, 20), 0.75, 5, 4);
    if (player.levelPoints == 0) {
        this.isOn = false;
    }
    return true;
}
}



class ShopScreen {
  constructor() {
    this.x = -500;
    this.y = -400;
    this.rectWidth = 350;
    this.rectHeight = 120;
    this.rect = [];
    this.rect[this.rect.length] = new CollideRect(this.x,this.y+this.rectHeight*this.rect.length*1.3,this.rectWidth,this.rectHeight,false);
    this.rect[this.rect.length] = new CollideRect(this.x,this.y+this.rectHeight*this.rect.length*1.3,this.rectWidth,this.rectHeight,false);
    this.rect[this.rect.length] = new CollideRect(this.x,this.y+this.rectHeight*this.rect.length*1.3,this.rectWidth,this.rectHeight,false);
    this.rect[this.rect.length] = new CollideRect(this.x,this.y+this.rectHeight*this.rect.length*1.3,this.rectWidth,this.rectHeight,false);
    this.rect[this.rect.length] = new CollideRect(this.x,this.y+this.rectHeight*this.rect.length*1.3,this.rectWidth,this.rectHeight,false);
    this.isOn = false;
    this.width = this.rectWidth + 50;
    this.height = this.rectHeight*(this.rect.length+1) + 100;
  }
  draw() {
    push();
    fill(160,82,45);
    rectMode(CORNER);
    rect(this.x-this.rectWidth/2-25,this.y-this.rectHeight/2-50,this.width,this.height);
    strokeWeight(5);
    textAlign(CENTER,CENTER);
    rectMode(CENTER);
    textFont(fontRobo);
    textSize(50);
    fill(150,0,255);
    text("SHOP",this.x,this.y-95);
    stroke(150,150,150,100);
    fill(125,25,155,50);
    for( let i = 0; i < this.rect.length; i++){
      this.rect[i].draw();
    }
    textSize(30);
    fill(255);
    for( let i = 0; i < shopItem.length; i++){
      push();
      text(shopItem[i].draw(),this.rect[i].x,this.rect[i].y-this.rectHeight/5);
      pop();
      push();
      text(shopItem[i].drawCost(),this.rect[i].x,this.rect[i].y+this.rectHeight/3);
      pop();
    }
    pop();
  }
  changeItems(){
    for( let i = 0; i < 5; i++){
        shopItem[i] = new ShopItem(shopItemType[int(random(0,shopItemType.length))]);
      }
  }
}

class InventoryScreen {
  constructor() {
    this.x = +500;
    this.y = -400;
    this.rectWidth = 350;
    this.rectHeight = 60;
    this.rect = [];
    this.rect[this.rect.length] = new CollideRect(this.x,this.y+this.rectHeight*this.rect.length*1.3,this.rectWidth,this.rectHeight,false);
    this.rect[this.rect.length] = new CollideRect(this.x,this.y+this.rectHeight*this.rect.length*1.3,this.rectWidth,this.rectHeight,false);
    this.rect[this.rect.length] = new CollideRect(this.x,this.y+this.rectHeight*this.rect.length*1.3,this.rectWidth,this.rectHeight,false);
    this.rect[this.rect.length] = new CollideRect(this.x,this.y+this.rectHeight*this.rect.length*1.3,this.rectWidth,this.rectHeight,false);
    this.rect[this.rect.length] = new CollideRect(this.x,this.y+this.rectHeight*this.rect.length*1.3,this.rectWidth,this.rectHeight,false);
    this.rect[this.rect.length] = new CollideRect(this.x,this.y+this.rectHeight*this.rect.length*1.3,this.rectWidth,this.rectHeight,false);
    this.rect[this.rect.length] = new CollideRect(this.x,this.y+this.rectHeight*this.rect.length*1.3,this.rectWidth,this.rectHeight,false);
    this.rect[this.rect.length] = new CollideRect(this.x,this.y+this.rectHeight*this.rect.length*1.3,this.rectWidth,this.rectHeight,false);
    this.isOn = false;
    this.width = this.rectWidth + 50;
    this.height = this.rectHeight*(this.rect.length+2) + 150;
  }
  draw() {
    push();
    fill(88, 138, 107);
    rectMode(CORNER);
    rect(this.x-this.rectWidth/2-25,this.y-this.rectHeight/2-75,this.width,this.height);
    strokeWeight(5);
    textAlign(CENTER,CENTER);
    rectMode(CENTER);
    textFont(fontRobo);
    textSize(50);
    fill(150,0,255);
    text("INVENTORY",this.x,this.y-75);
    stroke(150,150,150,100);
    fill(125,25,155,50);
    for( let i = 0; i < this.rect.length; i++){
      this.rect[i].draw();
    }
    textSize(20);
    fill(255);
    let inI= inventory.item;
    for( let i = 0; i < inI.length; i++){
      if(inventory[inI[i]] != null){
        push();
        text(inventory[inI[i]].drawInventory(),this.rect[i].x,this.rect[i].y);
        pop();
      }
      else {
        for( let j = 0; j < shopItemType.length; j++){
          if(shopItemType[j].ID == inventory.item[i]){
            text("EMPTY ["+ shopItemType[j].name +"]" ,this.rect[i].x,this.rect[i].y-this.rectHeight/5);
          }
        }
      }
    }
    
    fill(75,0,150);
    textSize(27);
    text("Double Click "+"\n" + "to Remove an Item",this.x,this.y+(this.rect.length*this.rectHeight*1.275));
    pop();
  }
}