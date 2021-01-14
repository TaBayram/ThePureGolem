class CollideRect{
  constructor(x, y, width, height, isCorner) {
    if (isCorner) {
      this.x = x + width / 2;
      this.y = y + height / 2;
    } else {
      this.x = x;
      this.y = y;
    }
    this.w = width;
    this.h = height;
  }
  draw(){
    push();
    rectMode(CENTER)
    rect(this.x,this.y,this.w,this.h);
    pop();
  }
}

function getTar(pos) {
    let t = new CollideRect(player.x + player.width / 5, player.y + player.height / 3, player.width / 18, player.height / 12, false);
    if (pos == 'l')
      t = new CollideRect(player.x - player.width / 5, player.y + player.height / 3, player.width / 18, player.height / 12, false);
    return t;
  }

function collision3D(sourceRect, targetRect) {
  let rect1TY = sourceRect.y - sourceRect.h / 2;
  let rect2TY = targetRect.y - targetRect.h / 2;
  let rect1BY = sourceRect.y + sourceRect.h / 2;
  let rect2BY = targetRect.y + targetRect.h / 2;


  if (rect1BY >= rect2TY && rect1TY <= rect2TY)
    return true;
  else if (rect1TY <= rect2BY && rect1BY >= rect2BY)
    return true;
  else {
    rect2TY = sourceRect.y - sourceRect.h / 2;
    rect1TY = targetRect.y - targetRect.h / 2;
    rect2BY = sourceRect.y + sourceRect.h / 2;
    rect1BY = targetRect.y + targetRect.h / 2;

    if (rect1BY >= rect2TY && rect1TY <= rect2TY)
      return true;
    else if (rect1TY <= rect2BY && rect1BY >= rect2BY)
      return true;
    else {
      return false;
    }
  }
}
function collisionPoint(pointX,pointY,sourceRect){
  let rect1RX = sourceRect.x + sourceRect.w / 2;
  let rect1LX = sourceRect.x - sourceRect.w / 2;
  let rect1TY = sourceRect.y - sourceRect.h / 2;
  let rect1BY = sourceRect.y + sourceRect.h / 2;
  
  if(pointX >= rect1LX && pointX <= rect1RX &&
     pointY >= rect1TY && pointY <= rect1BY)
    return true;
  return false;
}

function genCollide(source) {
  if (collision(source, player.getColl()) || 
        collision(source, cDungeon.leftRect) || 
        collision(source, cDungeon.rightRect) || 
        collision(source, cDungeon.upRect) || 
        collision(source, cDungeon.downRect)) {
    return true;
  } else {
    for (let i = 0; i < monster.length; i++) {
      if (monster[i] != source && !monster[i].dead && collision(source, monster[i].getColl())) {
        return true;
      }
    }
  }
  return false;
}

function wallCollide(source) {
  if (  collision(source, cDungeon.leftRect) || 
        collision(source, cDungeon.rightRect) || 
        collision(source, cDungeon.upRect) || 
        collision(source, cDungeon.downRect)) {
    return true;
  }
  return false;
}

function monCollide(source){
  for (let i = 0; i < monster.length; i++) {
      if (monster[i] != source && !monster[i].dead && collision(source, monster[i].getColl())) {
        return true;
      }
    }
  return false;
}

function collision(sourceRect, targetRect) {
  let rect1RX = sourceRect.x + sourceRect.w / 2;
  let rect2RX = targetRect.x + targetRect.w / 2;
  let rect1LX = sourceRect.x - sourceRect.w / 2;
  let rect2LX = targetRect.x - targetRect.w / 2;
  let rect1TY = sourceRect.y - sourceRect.h / 2;
  let rect2TY = targetRect.y - targetRect.h / 2;
  let rect1BY = sourceRect.y + sourceRect.h / 2;
  let rect2BY = targetRect.y + targetRect.h / 2;

  if (rect1RX >= rect2LX && rect1LX <= rect2RX && rect1BY >= rect2TY && rect1TY <= rect2BY) {
    return true;
  }
return false;
}

