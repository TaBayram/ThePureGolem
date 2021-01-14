class DungeonType {
  constructor(background, yOffset,cColor) {
    this.back = background;
    this.y = yOffset;
    this.tint = cColor;
  }
}


class Dungeon {
  constructor(dungeonType) {
    this.back = dungeonType.back;
    this.y = dungeonType.y;
    this.isFinished = false;
    this.tint = dungeonType.tint;
    this.WallYBot = 150;
    this.WallYTop = 250;
    this.leftRect = new CollideRect(-width/2,-height/2,5,height,true);
    this.rightRect = new CollideRect(width/2-5,-height/2,5,height,true);
    this.upRect = new CollideRect(-width/2,-height/2,width,this.WallYTop,true);
    this.downRect = new CollideRect(-width/2,height/2-this.WallYBot,width,this.WallYBot,true);
    this.dLevel = 1;
    this.monsterCount =  int(random(4,9));

  }
  draw() {
    push();
    imageMode(CENTER);
    image(this.back, 0, this.y, width, height);
    pop();
  }
  start(){
    shopScreen.isOn = false;
  let n = freeSpaceCheck(floatText);
  floatText[n] = new FloatText(-width/2,-height/2 + 100, 'Wave ' + this.dLevel + '!', 80, color(125, 255, 20), 3, 3, 10);
  //this.monsterCount = this.dLevel * 2 + int(random(0,2));
  setTimeout(this.spawn.bind(this),1000);
  }
  spawn(){
    let i = 0;
    while(1){
      let n = freeSpaceCheck(monster);
      monster[n] = new Monster(-width / 1.75, random(-height/2+300,height/2-300), monsterType[0]);
      monster[n].lvlIncrease((0.9 + this.dLevel/10));
      i++; if( i >= this.monsterCount) break;
      n = freeSpaceCheck(monster);
      monster[n] = new Monster(+width / 1.75, random(-height/2+300,height/2-300), monsterType[1]);
      monster[n].lvlIncrease((0.9 + this.dLevel/10));
      i++; if( i >= this.monsterCount) break;
    }
    if(this.dLevel % 5 == 0){
      this.monsterCount++;
      setTimeout(this.bossSpawn.bind(this),3000);
    }
  }
  bossSpawn(){
    let n = freeSpaceCheck(floatText);
  floatText[n] = new FloatText(-width/2,-height/2 + 100, 'BOSS INCOMING!', 50, color(255, 200, 20), 5, 3, 5);
    n = freeSpaceCheck(monster);
    if(this.dLevel % 10 == 0){
       monster[n] = new Monster(-width / 1.5, random(-height/2+300,height/2-300), monsterType[2]);
    }
    else{
      monster[n] = new Monster(-width / 1.5, random(-height/2+300,height/2-300), monsterType[3]);}
    monster[n].lvlIncrease((0.9 + this.dLevel/10));
  
  }
  winCheck(){
    this.monsterCount --;
    if(this.monsterCount == 0){
      restore(player,player.healthMax/3);
      restoreMana(player,player.manaMax/3);
      swaveFinish.play();
      this.isFinished = true;
      let n = freeSpaceCheck(floatText);
  floatText[n] = new FloatText(0,-height/3, 'Wave ' + this.dLevel + ' is completed!', 80, color(125, 155, 20), 5, 5, 0);
    
      shopScreen.changeItems();
      shopScreen.isOn = true;
  }

  }
  nextWave(cBody){
    if(collision(cBody,this.rightRect) || collision(cBody,this.leftRect)){
      item = [];
      projectile = [];
      blood = [];
      fireParticles = [];
      let cDungeonNo = int(random(0,dungeonType.length));
      cDungeon = new Dungeon(dungeonType[cDungeonNo]);
      player.x = 0; player.y = 0;
      cDungeon.dLevel = this.dLevel + 1;
      cDungeon.start();
    }
  
  }
  
}