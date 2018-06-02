var breath = 0.0;
var breath_speed = 0.1;
var breath_direction = +1;

var current_time;

var s = [];

var b = [];

var sample_idx = 0;
var reverb;

var d;
var victory_sample;

var x, y, x_w, y_w, angle_from, angle_to;

var vol, q, c;

var col;

var victory = false;

function preload(){
  reverb = new p5.Reverb();
  for (var i=0; i<25; i++){
    s.push( loadSound( "data/a"+str(i%25)+".mp3") );
    s[i].playMode('restart');
    b.push( new p5.BandPass());
    s[i].disconnect();
    s[i].connect(b[i]);
    reverb.process(b[i], 3, 2);
  }
  d = new p5.Delay();
  victory_sample = loadSound( "data/a18.mp3")
  d.process(victory_sample, .25, .7, 5300);
}

function setup() {
  createCanvas(900, 700);
  background(0);
  
  x = random(width);
  y = random(height);
  
  current_time = millis();
  
  textSize(32);
  textAlign(CENTER, CENTER);
}

function draw() {
  breath += breath_direction*breath_speed;
  if (breath > 10.0 || breath <= 0.0) breath_direction *= -1;
  if (victory){
    fill(255,255,224, breath);
    rect(0, height/2.0 - 1, width, 2);
    rect(width/2.0 - 1, 0, 2, height);
    fill(255,0,0);
    text("You won :( ", width/2.0,height/2.0);
  }else{
    fill(255,0,0, breath);
    rect(0, height/2.0 - 1, width, 2);
    rect(width/2.0 - 1, 0, 2, height);
  }
  
  fill(0, 2);
  rect(0,0,width, height);
  
  if (millis() - current_time > 50 && !victory){
    x_w = random(width)/(2.0*abs(width/2 - mouseX)+10.0) + 1.0;
    y_w = random(height)/(2.0*abs(height/2 - mouseY)+10.0) + 1.0;
    // x += random(2)/1.0*x_w - 1.0*x_w;
    x += x_w*( (mouseX*random(200)/100.0 - width/2.0)/(width/2.0) );
    if (x < 0.0) x += width;
    if (x > width) x = width-x;
    // y += random(2)/1.0*y_w - 1.0*y_w;
    y += y_w*( (mouseY*random(200)/100.0 - height/2.0)/(height/2.0) );
    if (y < 0.0) y += height;
    if (y > height) y = height-y;
    angle_from = random(1000)*PI/1000.0;
    angle_to = random(1000)*TWO_PI/1000.0;
    
    col = parseInt(random(255));
    fill(col);
    arc(x, y, x_w, y_w, angle_from, angle_to);
    
    vol = pow( (x_w + y_w)/55.0, 5.0 );
    if (vol > 1.0) vol = 1.0;
    // console.log('vol: ',vol);
    
    sample_idx = col%25;
    
    b[sample_idx].freq( 5000.0*abs(angle_from-angle_to) );
    b[sample_idx].res( 10.0*abs(angle_from-angle_to)/TWO_PI );
    s[sample_idx].pan( (2.0*x-width)/width );
    s[sample_idx].setVolume(vol*2);
    s[sample_idx].play();
    
    current_time = millis();
    
    if (x <= width/2.0 && x+x_w >= width/2.0 && y <= height/2.0 && y+y_w >= height/2.0){
      victory = true;
      fill(255,0,0);
      text("You won :( ", width/2.0,height/2.0);
      victory_sample.play();
    }
  }
}

// function mousePressed(){
//   victory = true;
//   fill(255,0,0);
//   text("You won :( ", width/2.0,height/2.0);
//   victory_sample.play();
// }