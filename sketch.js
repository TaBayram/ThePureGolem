//IMAGE ANIMATION
let golemIdle = [];
let golemWalk = [];
let golemAttack = [];

let stoneGolemAttack = [];
let stoneGolemIdle = [];
let stoneGolemWalk = [];

let axeGolemAttack = [];
let axeGolemIdle = [];
let axeGolemWalk = [];

// IMAGE
let backgroundI = [];
let inGameUImage;
let inGameUI;
let coinI;
let lvlPlusSign;
let bloodDropI;
let ifireball;

//SOUND
let woodSwing;
let stoneSwing;
let woodHit;
let goldPickUp;
let buttonHit;
let slevelUp;
let sbuyItem;
let sfireball;

//FONT
let fontRobo;
let fontSpartan;
//DESTINATION HELPER
let modelWoodG = 'models/woodGolem/';
let modelStoneG = 'models/stoneGolem/';
let modelAxeG = 'models/axeGolem/';

function preload() {
  for (let i = 0; i < 12; i++) {
    golemIdle[i] = loadImage(modelWoodG + 'idle/Golem_03_Idle_' + i + '.png');
  }
  for (let i = 0; i < 18; i++) {
    golemWalk[i] = loadImage(modelWoodG + 'walk/Golem_03_Walking_' + i + '.png');
  }
  for (let i = 0; i < 11; i++) {
    golemAttack[i] = loadImage(modelWoodG + 'attack/Golem_03_Attacking_' + i + '.png');
  }
  for (let i = 0; i < 11; i++) {
    stoneGolemAttack[i] = loadImage(modelStoneG + 'attack/0_Golem_Slashing_' + i + '.png');
  }
  for (let i = 0; i < 18; i++) {
    stoneGolemIdle[i] = loadImage(modelStoneG + 'idle/0_Golem_Idle_' + i + '.png');
  }
  for (let i = 0; i < 23; i++) {
    stoneGolemWalk[i] = loadImage(modelStoneG + 'walk/0_Golem_Walking_' + i + '.png');
  }
  for (let i = 0; i < 12; i++) {
    axeGolemIdle[i] = loadImage(modelAxeG + 'idle/Golem_02_Idle_' + i + '.png');
  }
  for (let i = 0; i < 18; i++) {
    axeGolemWalk[i] = loadImage(modelAxeG + 'walk/Golem_02_Walking_' + i + '.png');
  }
  for (let i = 0; i < 12; i++) {
    axeGolemAttack[i] = loadImage(modelAxeG + 'attack/Golem_02_Attacking_' + i + '.png');
  }

  backgroundI[0] = loadImage('dungeon/background/Under.png');
  backgroundI[1] = loadImage('dungeon/background/Desert.png');
  backgroundI[2] = loadImage('dungeon/background/Lava.png');
  inGameUImage = loadImage('dungeon/UI/UI.png');
  lvlPlusSign = loadImage('dungeon/UI/PlusSign.png');
  coinI = loadImage("Coin1.png");
  bloodDropI = loadImage('dungeon/item/bloodDrop.png');
  ifireball = loadImage('dungeon/spell/fireball.png');


  fontRobo = loadFont('RobotoMono-Medium.ttf');
  fontSpartan = loadFont('Spartan-Medium.ttf');

  woodSwing = loadSound('sounds/woodSwing.mp3');
  woodHit = loadSound('sounds/woodHit.mp3');
  stoneSwing = loadSound('sounds/stoneSwing.mp3');
  goldPickUp = loadSound('sounds/goldPickUp.mp3');
  buttonHit = loadSound('sounds/buttonHit.mp3');
  slevelUp = loadSound('sounds/levelUp.mp3');
  sbuyItem = loadSound('sounds/buyItem.mp3');
  sfireball = loadSound('sounds/fireball.mp3');
  swaveFinish = loadSound('sounds/waveFinish.mp3');


}


//GAME SETUP VARIABLES
let FSWIDTH = 1920,  //GAME SCREEN WIDTH
  FSHEIGHT = 1080;   //GAME SCREEN HEIGHT
let startScreen;     //START SCREEN OBJECT
let restartScreen;  //Restart SCREEN OBJECT
let levelScreen;    //levelScreen SCREEN OBJECT
let shopScreen;    //ShopScreen SCREEN OBJECT
let inventoryScreen;    //ShopScreen SCREEN OBJECT
let cDungeon;        //Current Dungeon that we are in
let hasRestarted = false; //Controls the outcome if the player has restarted
let grap;             // FOR ITEMS

//OBJECT ARRAYS
let player;          //PLAYER OBJECT
let inventory;
let dungeon;
let dungeonType = [];
let monsterType = [];
let monster = [];
let floatText = [];
let itemType = [];
let item = [];
let shopItemType = [];
let shopItem = [];
let rarity = [];
let projectileType = [];
let projectile = [];
let blood = [];
let fireParticles = [];
function onceSetup(){
  frameRate(60);
  createCanvas(FSWIDTH, FSHEIGHT, WEBGL);
  grap = createGraphics(FSWIDTH,FSHEIGHT,WEBGL);

  startScreen = new FullScreen(!hasRestarted,"","","Play");
  restartScreen = new FullScreen(false,"You Died!","","Restart");
  levelScreen = new LevelScreen();
  shopScreen = new ShopScreen();
  inventoryScreen = new InventoryScreen();

  //                        Image
  inGameUI = new InGameUI(inGameUImage,lvlPlusSign);

  //                       ImageBackground yOffset
  dungeonType[0] = new DungeonType(backgroundI[0], -100, color(160, 150, 250));
  dungeonType[1] = new DungeonType(backgroundI[1], -150, color(250, 220, 180));
  dungeonType[2] = new DungeonType(backgroundI[2], -100, color(200, 100, 100));

  //                                name,idle,attack,walk,width,height,
  //damage,range,health,mana,healthRegen,manaRegen,armor,walkSpeed,attackSpeed,xp,gold
  monsterType[0] = new MonsterType("Stone Golem", stoneGolemIdle, stoneGolemAttack, stoneGolemWalk, 300, 200,
    12,     20,    60,   30,       1,         1,     5,       3,        4,       20,4);
  monsterType[1] = new MonsterType("Axe Golem", axeGolemIdle, axeGolemAttack, axeGolemWalk, 250, 170,
    12,     20,    40,   30,       0.5,         1,     0,       4,        2,       20,4);
  monsterType[2] = new MonsterType("Granite Golem", stoneGolemIdle, stoneGolemAttack, stoneGolemWalk, 600, 400,
    30,     80,    200,   30,       2,         1,     12,       1,        4,       80,20);
  monsterType[3] = new MonsterType("Axemaster Golem", axeGolemIdle, axeGolemAttack, axeGolemWalk, 375, 255,
    26,     30,    100,   30,       1,         1,     0,       5,        2,       50,16);


   //                         name, width,height,image,speed,axis
  itemType[0] = new ItemType('gold', 60, 60, coinI, 0.5, 'Y');
  itemType[1] = new ItemType('health',15,30, bloodDropI, 0.2, 'Y');

  //                                  name,ID,field, scale, field name
  shopItemType[0] = new ShopItemType('Sword',"weapon","attackDamage",4,"Attack Damage");
  shopItemType[1] = new ShopItemType('Helmet',"helmet","armor",0.5,"Armor");
  shopItemType[2] = new ShopItemType('Ring',"ring","healthRegen",0.1,"Health Regen");
  shopItemType[3] = new ShopItemType('Belt',"belt","spellDamage",3,"Spell Power");
  shopItemType[4] = new ShopItemType('Boots',"boots","walkSpeed",0.10,"Walk Speed");
  shopItemType[5] = new ShopItemType('Gauntlet',"gauntlet","range",0.5,"Attack Range");
  shopItemType[6] = new ShopItemType('Cloak',"cloak","manaRegen",0.12,"Mana Regen");
  shopItemType[7] = new ShopItemType('Breast Plate',"breastPlate","armor",1,"Armor");

  // 45%, 25%, 15%, 10%, 5%
  rarity[0] = new Rarity("Common",color(169,169,169),0);
  rarity[1] = new Rarity("Uncommon",color(188,212,230),1);
  rarity[2] = new Rarity("Rare",color(0,127,255),2);
  rarity[3] = new Rarity("Epic",color(136,6,206),3);
  rarity[4] = new Rarity("Legendary",color(237,135,45),4);

                                        //Image,sound, width,height,speed,damage
  projectileType[0] = new ProjectileType(ifireball,sfireball,96,96,50,20);



}


function setup() {
  if(!hasRestarted) {
    onceSetup();
  }

  monster = [];
  item = [];
  floatText = [];
  projectile = [];
  blood = [];
  fireParticles = [];


  //                  X  , Y  , AnimIdle, AnimWalk, AnimAttack,
  player = new Player(0, 0, golemIdle, golemWalk, golemAttack);
  inventory = new Inventory();

  let cDungeonNo = int(random(0,dungeonType.length));
  cDungeon = new Dungeon(dungeonType[cDungeonNo]);

  //




  if(!hasRestarted) setInterval(function() {interval025()}, 250);
}

function draw() {
  background(120, 0, 160);
  grap.background(255,0);


  if (startScreen.isOn) {
    startScreen.draw();

  }else if(restartScreen.isOn){
    restartScreen.draw();

  }else if(true) {
    cDungeon.draw();
    for (let i = 0; i < monster.length; i++) {
      monster[i].draw();
    }

    player.draw();

    checkTargets();

    inGameUI.draw();

    for (let i = 0; i < item.length; i++) {
      item[i].draw();
    }
    for (let i = 0; i < projectile.length; i++) {
      if(!projectile[i].dead){
        projectile[i].draw();
      }
    }

    if (player.levelPoints != 0 && levelScreen.isOn) {
      levelScreen.draw();
    }
    if(shopScreen.isOn){
      shopScreen.draw();
      inventoryScreen.draw();
    }
    for (let i = 0; i < blood.length; i++) {
      if(blood[i].dead == false){
        blood[i].draw();
      }
    }
    for (let i = 0; i < fireParticles.length; i++) {
      if(fireParticles[i].dead == false){
        fireParticles[i].draw();
      }
    }
    for (let i = 0; i < floatText.length; i++) {
      if(floatText[i].dead == false)
        floatText[i].draw();
    }

  }
  image(grap,-width/2,-height/2);
}


function interval025() {
  for (let i = 0; i < monster.length; i++) {
    if (monster[i].attackCD > 0)
      monster[i].attackCD -= 0.25;
      restore(monster[i],monster[i].healthRegen/4);
  }
  for (let i = 0; i < floatText.length; i++) {
    if (floatText[i].duration >= 0) {
      floatText[i].duration -= 0.25;
    }
    if (floatText[i].duration <= 0)
      floatText[i].dead = true;
  }
  restore(player,player.healthRegen/4);
  restoreMana(player,player.manaRegen/4);
}

function keyPressed() {
  if (keyCode == player.attackKey) {
    player.attacking = true;
  }
}


function doubleClicked() {
  let mousX = mouseX - width / 2;
  let mousY = mouseY - height / 2;
  if(shopScreen.isOn){
      for( let i = 0; i < inventoryScreen.rect.length; i++){
        if (collisionPoint(mousX, mousY, inventoryScreen.rect[i]) && inventory[inventory.item[i]] != null) {
          inventory.drop(inventory.item[i]);

        }
      }
  }
}

function mouseClicked() {
  let mousX = mouseX - width / 2;
  let mousY = mouseY - height / 2;


  if (startScreen.isOn) {
    let bButton = startScreen.rectButton;
    if (collisionPoint(mousX, mousY, bButton)) {
      startScreen.isOn = false;
      buttonHit.play();
      cDungeon.start();
    }
  }
  else if(restartScreen.isOn){
   let bButton = restartScreen.rectButton;
    if (collisionPoint(mousX, mousY, bButton)) {
      restartScreen.isOn = false;
      hasRestarted = true;
      buttonHit.play();
      setup();
      cDungeon.start();
    }
  } else {
    let spellCast = true;
    if(shopScreen.isOn){
      spellCast = false;
      for( let i = 0; i < shopScreen.rect.length; i++){
        if (collisionPoint(mousX, mousY, shopScreen.rect[i]) && !shopItem[i].sold) {
          shopItem[i].sell(mousX,mousY);
        }
      }
    }
    if (player.levelPoints != 0) {
      if (collisionPoint(mousX, mousY, inGameUI.rectlvl)) {
        levelScreen.isOn = !levelScreen.isOn;
        spellCast = false;
      }
      if (levelScreen.isOn) {
        if(levelScreen.click(mousX,mousY)){
          spellCast = false;
        }
      }
    }
    if(spellCast) {
      launch();
    }
  }
  return false;
}


function freeSpaceCheck(arr) {
  let n = arr.length;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].dead) {
      n = i;
      break;
    }
  }
  return n;
}

function damage(Source, Target, Amount,ignoreArmor) {
  let armor = Target.armor;
/*  if (Target instanceof Monster) {
    armor = Target.monsterType.armor;
  }*/
  if(armor >= 100) {
    armor = 99;
  }
  if(ignoreArmor) {
    armor = 0;
  }
  else{
    for(let i = 0; i < 30; i ++ ){
        let n = freeSpaceCheck(blood);
        blood[n] = new Blood(Target.getPColl().x,Target.getPColl().y);
    }


  }
  let realAmount = (Amount) * (1.00 - armor / 100)
  Target.health -= realAmount;
  let n = freeSpaceCheck(floatText);
  floatText[n] = new FloatText(Source.getAColl().x, Source.getAColl().y, int(realAmount) + '!', (realAmount/5) + 30, color(255, 20, 20), 1.5, 0, 6);
  if (Target.health <= 0) {
    if (Source == player) {
      Target.death();
      cDungeon.winCheck();
      Source.xp += Target.xpGive;
      if (Source.xp >= Source.xpRequired) {
        player.levelUp();
      }
    } else {
      // GAME END
      restartScreen.botText = "You've lasted till Wave " + cDungeon.dLevel + "!";
      restartScreen.isOn = true;
    }
  }
}
function restore(Target, Amount){
  if(cDungeon.isFinished) return;
    if (Target.health < Target.healthMax) Target.health += Amount;
    if (Target.health > Target.healthMax) Target.health = Target.healthMax;
}
function restoreMana(Target, Amount){
  if(cDungeon.isFinished) return;
    if (Target.mana < Target.manaMax) Target.mana += Amount;
    if (Target.mana > Target.manaMax) Target.mana = Target.manaMax;
}

function divide(x,y) {
  let signX  = x/abs(x);
  x = abs(x); y = abs(y);
  return signX*(x/(x+y));
}
