var r = 10;
const k = 30;
var grid = [];
var cellSampling = r / Math.sqrt(2);
var active = [];
var cols = 0;
var rows = 0;


function setup(){
  createCanvas(500,500);
  background(0);
  strokeWeight(4);
  cols = floor(width/cellSampling);
  rows = floor(height/cellSampling);

  for (var i = 0; i < cols * rows; i++) {
    grid[i] = undefined;
  }
  // STEP 1
  var firstSample = createVector(random(width), random(height));
  var i = floor(firstSample.x / cellSampling);
  var j = floor(firstSample.y / cellSampling);
  grid[i + j * cols] = firstSample;
  active.push(firstSample);
  frameRate(1);
}

function draw(){
  background(0);
  // STEP 2
  while(active.length > 0){
    var randIndex = floor(random(active.length));
    var position = active[randIndex];
    var found = false;

    for (var testR = 0; testR < k; testR++){
      var sample = p5.Vector.random2D();
      var magnitude = random(r, 2*r);
      sample.setMag(magnitude);
      sample.add(position);

      var col = floor(sample.x / cellSampling);
      var row = floor(sample.y / cellSampling);

      if(col > -1 && row > -1 && col < cols && row < rows && !grid[col + row * cols]){
        var ok = true;
        for (var i = -1; i <= 1; i++) {
          for (var j = -1; j <= 1; j++) {
            var indexN = col + i + (row + j) * cols;
            var neighbor = grid[indexN];
            if(neighbor){
              var distance = p5.Vector.dist(sample, neighbor);
              if(distance < r){
                ok = false;
              }
            }
          }
        }

        if(ok){
          found = true;
          grid[col + row * cols] = sample;
          active.push(sample);
          break;
        }
      }
    }
    if(!found){
      active.splice(randIndex, 1);
    }
  }

  for (var i = 0; i < grid.length; i++) {
    if(grid[i]){
      stroke(255);
      strokeWeight(4);
      point(grid[i].x, grid[i].y);
    }
  }
  for (var i = 0; i < active.length; i++) {
    stroke(255, 0, 255);
    strokeWeight(4);
    point(active[i].x, active[i].y);
  }
}
