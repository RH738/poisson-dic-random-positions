var r = 40;
const k = 30;
var grid = [];
var cellSampling = r / Math.sqrt(2);
var active = [];
var cols = 0;
var rows = 0;
var stacks = 0;
var rot = 0;

function setup(){
  createCanvas(500,500, WEBGL);
  camera(0, 0, 0);
  perspective(60 / 180 * PI, width/height, 0.1, 100);
  background(0);
  strokeWeight(4);
  frameRate(200);
  cols = floor(width/cellSampling);
  rows = floor(height/cellSampling);
  stacks = floor(height/cellSampling);

  for (var i = 0; i < cols * rows * stacks; i++) {
    grid[i] = undefined;
  }
  // STEP 1
  var firstSample = createVector(width/2, height/2, height/2);
  var i = floor(firstSample.x / cellSampling);
  var j = floor(firstSample.y / cellSampling);
  var h = floor(firstSample.z / cellSampling);
  grid[i + j * cols + h * rows * cols] = firstSample;
  active.push(firstSample);
}

function draw(){
  background(0);
  ambientLight(100);
  pointLight(250, 250, 250, 100, 100, 0);
  // STEP 2
  if(active.length > 0){
    var randIndex = floor(random(active.length));
    var position = active[randIndex];
    var found = false;

    for (var testR = 0; testR < k; testR++){
      var sample = p5.Vector.random3D();
      var magnitude = random(r, 2*r);
      sample.setMag(magnitude);
      sample.add(position);

      var col = floor(sample.x / cellSampling);
      var row = floor(sample.y / cellSampling);
      var stack = floor(sample.z / cellSampling);

      if(col > -1 && row > -1 && stack > -1 && col < cols && row < rows && stack < stacks && !grid[col + row * cols + stack * cols * rows]){
        var ok = true;
        for (var i = -1; i <= 1; i++) {
          for (var j = -1; j <= 1; j++) {
            for (var h = -1; h <= 1; h++){
              var indexN = col + i + (row + j) * cols + (stack + h) * rows * cols;
              var neighbor = grid[indexN];
              if(neighbor){
                var distance = p5.Vector.dist(sample, neighbor);
                if(distance < r){
                  ok = false;
                }
              }
            }
          }
        }

        if(ok){
          found = true;
          grid[col + row * cols + stack * cols * rows] = sample;
          active.push(sample);
        }
      }
    }
    if(!found){
      active.splice(randIndex, 1);
    }
  }
  rotate(rot, [0,0,1])
  translate(0,0,-height/3);
  rotate(PI/4, [0,1,0])
  for (var i = 0; i < grid.length; i++) {
    if(grid[i]){
      ambientMaterial(255);
      push();
      translate(grid[i].x - width/2, grid[i].y - height/2, grid[i].z - height / 2);
      box(r/3,r/3,r/3);
      pop();
    }
  }
  for (var i = 0; i < active.length; i++) {
    ambientMaterial(255, 0, 255);
    push();
    translate(active[i].x - width/2, active[i].y - height/2, active[i].z - height / 2);
    box(r/3,r/3,r/3);
    pop();
  }
  rot += 0.01;
}
