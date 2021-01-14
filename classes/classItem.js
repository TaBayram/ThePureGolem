class ItemType {
  constructor(name,width, height, image, rotSpeed, rotAxis) {
    this.name = name;
    this.width = width;
    this.height = height;
    this.image = image;
    this.rotSpeed = rotSpeed;
    this.rotAxis = rotAxis;
  }
}


class Item {
  constructor(x, y, itemType) {
    this.x = x;
    this.y = y;
    this.itemType = itemType;
    //this.graph = createGraphics(itemType.width * 1.2, itemType.height * 1.2, WEBGL);
    this.dead = false;
    this.speed = itemType.rotSpeed;
    this.bonus = null;
    this.duration = 5;
  }
  draw() {
    if (!this.dead) {
      push();
      if(dist(player.getColl().x,player.getColl().y,this.x,this.y) <= 200 && this.duration <= 0){
        this.x += (player.x - this.x)/100;
        this.y += (player.y - this.y)/100;
      }
      grap.push();
      let time = 60 - this.duration;
      this.duration -= 0.05;
      //let grap = this.graph;
      let iT = this.itemType;
      grap.imageMode(CENTER);
      grap.translate(this.x,this.y);
      if (iT.rotAxis == 'X') grap.rotateX(iT.rotSpeed*millis()/100);
      if (iT.rotAxis == 'Y') grap.rotateY(iT.rotSpeed*millis()/100);
      grap.image(iT.image, 0, 0, iT.width, iT.height);
      imageMode(CENTER);
      
      //image(grap, this.x, this.y);
      grap.pop();
      pop();
    }
  }
  getColl() {
    let iT = this.itemType;
    let cRect = new CollideRect(this.x + iT.width * 1.2 / 2, this.y + iT.height * 1.2 / 2, iT.width / 2, iT.height / 2, false);
    return cRect;
  }
  pickup() {
    if(!this.dead && this.itemType.name == 'gold'){
      let bountyGold = int(this.bonus + cDungeon.dLevel/2);
      player.gold += bountyGold;
      goldPickUp.play();
      let n = freeSpaceCheck(floatText);
      floatText[n] = new FloatText(this.x, this.y, bountyGold+ ' gold!', 70, color(255, 255, 20), 1.5, 6, 10);
    }
    if(!this.dead && this.itemType.name == 'health'){
      restore(player,this.bonus);
      let n = freeSpaceCheck(floatText);
      floatText[n] = new FloatText(this.x, this.y, int(this.bonus) + ' heal!', 70, color(255, 150, 20), 1.5, 6, 10);
    }
    this.dead = true;
  }
}

class ShopItemType {
  constructor(name,ID,field,scale,fieldName) {
    this.name = name;
    this.ID = ID;
    this.field = field;
    this.scale = scale;
    this.fieldName = fieldName;
  }
}

class ShopItem {
  constructor(shopItemType){
    this.rarity = this.rarityFind();
    this.name = shopItemType.name;
    this.ID = shopItemType.ID;
    this.field = shopItemType.field;
    this.fieldName = shopItemType.fieldName;
    this.bonus = shopItemType.scale * ( cDungeon.dLevel*1.25 + int(pow(this.rarity.bonus,2.5)*random(1,2)) + int(random(1,4)));
    this.cost = int(sq((this.rarity.bonus+1))) + int(random(0,10)) + int((this.bonus/ shopItemType.scale)*6);
    this.sold = false;
  }
  rarityFind(){
    // 45%, 25%, 15%, 10%, 5%
    let ranNo = int(random(0,100));
    if(ranNo < 45) { return rarity[0];}
    else if(ranNo < 70) { return rarity[1];}
    else if(ranNo < 85) { return rarity[2];}
    else if(ranNo < 95) { return rarity[3];}
    else if(ranNo < 100) { return rarity[4];}
  }
  draw(){
    if(this.sold) return "SOLD";
    let bonus = this.bonus;
    if(this.bonus%1 != 0)  bonus = nf(bonus,0,2);
    fill(this.rarity.color);
    return (this.rarity.name + ' ' + this.name + '\n +' + 
           bonus + ' ' + this.fieldName);
  }
  
  drawCost(){
    fill(color(255, 255, 20));
    return (this.cost + ' Gold.');
  }
  drawInventory(){
    let bonus = this.bonus;
    if(this.bonus%1 != 0)  bonus = nf(bonus,0,2);
    fill(this.rarity.color);
    return (this.rarity.name + ' ' + this.name + '\n +' + 
           bonus + ' ' + this.fieldName);
  }
  sell(mousX,mousY){
    if(player.gold >= this.cost){
      if(inventory[this.ID] == null){
        sbuyItem.play();
        inventory[this.ID] = this;
        player.gold -= this.cost;
        //x, y, sText,tSize, cColor, time, mode, speed
        let n = freeSpaceCheck(floatText);
         floatText[n] = new FloatText(inGameUI.goldX,inGameUI.goldY,"-"+this.cost,30,color(255,150,20),2,1,3);
        this.sold = true;
        player[this.field] += this.bonus;
      }
      else{
      let n = freeSpaceCheck(floatText);
      floatText[n] = new FloatText(mousX,mousY,"Already Wearing!",30,color(255,100,20),2,1,3);
    }
    }
    else{
      let n = freeSpaceCheck(floatText);
      floatText[n] = new FloatText(mousX,mousY,"Not Enough Gold!",30,color(255,100,20),2,1,3);
    }
  }
  
}


class Rarity{
  constructor(name,color,bonus){
    this.name = name;
    this.color = color;
    this.bonus = bonus;  
  }
}