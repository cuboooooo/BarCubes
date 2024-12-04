//// I HATE CONVERTING FROM PYTHON TO JS RAHHHHHHHHH
// the swap part isnt working rn 
// it works in python :D



// an unsorted list of lists, each containing in the first 6 indices the literal letters on each block
// All in orientation order: red, white, yellow, green, grey, orange

let startVar = "fire me up barons"
let spacing = 5

let configured
let remaining

let blocks = [
    ["T","h","b","h","t","a"],
    ["a","l","a","e","e","a"],
    ["y","s","e","y","b","y"],
    ["h","b","e","m","l","h"],
    ["u","u","i","m","f","e"],
    ["y","e","g","s","l","n"],
    ["4","t","r","c","e","h"],
    ["f","h","s","s","n","o"],
    ["l","s","n","a","u","e"],
    ["p","e","s","r","t","p"],
    ["s","p","r","t","p","s"],
    ["o","s","e","i","a","l"],
    ["H","i","l","r","h","l"],
    ["j","o","s","t","k","w"], 
]

let reaches = { // letters that can be made by rotating the original letters, or inferring them in a new context.
    "a": ['v', 'c'],
    "b": [],
    "c": ["u", "n"],
    "e": ["w", "m", "3"],
    "f": [],
    "g": [], 
    "h": ["i"], 
    "i": ["h"], 
    "j": [], 
    "k": [], 
    "l": [], 
    "m": ["w", "e", "3"], 
    "n": ["z"], 
    "o": ["0"], 
    "p": ["d"], 
    "q": [], 
    "r": [], 
    "s": [], 
    "t": [], 
    "u": ["n", "c"], 
    "v": [], 
    "w": ["m", "e", "3"], 
    "x": [], 
    "y": [], 
    "z": [],
    "4": ["h", "j"],
    "H": ["4"], // lowercase h
    "T": [], // lowercase t
}
// [text, background]
let colors = [["white", "red"], ["Navy", "white"], ["yellow", "MediumPurple"], ["red", "green"], ["orange", "#242424"], ["black", "orange"]]

let block_key = "Fourth of July, Bless our home, Happy Easter, Merry Christmas, Happy Thanksgiving, Happy Halloween"

let spaceSpaces = []

let faceGraphics = {}; // dict to hold textures for each face
let cubeSize = 20;

let lines
let lineLengths

function printBlocks(list){
//   background(99);
//   idx = 0
//   for (let block of list){
//     drawCube([(cubeSize*2+5)*idx,0,0], block[0], block[1]);
    
//     idx += 1
//   }
  
  string = ""
    for (let block of list){
        if (block != 0){
            let block_orient = block[1]
            let block_letter = block[0][block_orient]
            //let block_color = colors[block_orient]
            
            //string += ("\x1b[" + block_color + "m" + block_letter + "\x1b[0m")
            string+= block_letter
        }
    }
    console.log(string)   
}

function deepcopy(list){
  let nlist = []
  for (let arr of list){
    nlist.push(arr.slice())
  }
  return nlist
}

function preload(){
    
  spacingInput = document.createElement('input');
  spacingInput.type = 'text';
  spacingInput.style.width = "394px";
  spacingInput.placeholder = 'Spacing Value (to see the sides better)';
  document.body.appendChild(spacingInput);
  function spacingSubmit() {
  const inputValue = spacingInput.value;
  spacing = int(inputValue);
}
spacingInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    spacingSubmit();
  }
});
  
  document.body.appendChild(document.createElement('br'))
  
  textInput = document.createElement('input');
  textInput.type = 'text';
  textInput.style.width = "394px";
  textInput.placeholder = 'Phrase to Find';
  document.body.appendChild(textInput);
  function textSubmit() {
  const textValue = textInput.value;
    startVar = textValue;
    spaceSpaces = [];
  setup();
}
textInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    textSubmit();
  }
});
  
  
}
function setup() {
  createCanvas(400, 400, WEBGL);

// we will approach this the same way I would.
// pick up the first block, and see if it has the letter. If it does, place it in the final configuration.
// if not, check the second one, so on. 
// if you get to a point where none of the remaining blocks have your letter, check if any of the configured blocks have that letter. If so, see if one of the remaining blocks can replace that configured block.

// keep track of where spaces are for displaying.
    let reducedString = startVar.split("").reduce((acc, char, idx) => {
        if (char === " ") {
            spaceSpaces.push(idx - spaceSpaces.length); // Adjust for previously removed spaces
            return acc;
        }
        return acc + char;
    }, "");
  lines = spaceSpaces.length + 1
  lineLengths = startVar.split(" ").map(word => word.length);
  startVar = startVar.replaceAll(" ","") // remove spaces
  
if (startVar.length > 14){
    console.log("Max Characters is 14! This will not work.")
}
let goal = startVar.slice()
console.log(`the goal is ${goal}`)
remaining = deepcopy(blocks)
configured = []

for (let i of new Array(goal.length).keys()){
    configured.push(0) // fill the configured list with empty values so the length equals the goal length
}
  
for (let goal_idx of new Array(goal.length).keys()){ // for each letter in the goal string
    let goal_letter = goal[goal_idx]
    console.log("Going for " + goal_letter + "...")
    let letter_found = false
    for (let block_idx of new Array(remaining.length).keys()){ // check each block for that letter
        let block = remaining[block_idx]
        if (block.includes(goal_letter)){
            let block_letter_idx = block.indexOf(goal_letter) // index returns the first index of the value, this is ok, because if a given block has two of the same letter, it makes no difference which one it chooses.
            configured[goal_idx] = [block, block_letter_idx] // add the block to the final configuration
            remaining.splice(block_idx, 1) // remove the block from the remaining blocks
            letter_found = true
            console.log("Letter("+goal_letter+") found!")
            break
        }
    }
    if (!letter_found){ // if we checked all the blocks, and the letter wasn't there
        console.log("Not found, trying a swap...")
        let swap_success = false
        for (let conf_block_idx of new Array(configured.length).keys()){ // check to see if the letter is in the configured blocks.
            if (!swap_success && configured[conf_block_idx] != 0 ){
                let conf_block = configured[conf_block_idx]
                console.log(`Searching ${conf_block} for ${goal_letter}`)
                console.log(configured)
                if(conf_block[0].includes(goal_letter)){ // the letter were looking for is in one of our configured blocks!
                    console.log(`Found ${goal_letter} in ${conf_block}`)
                    let conf_block_letter = conf_block[0][conf_block[1]] // this is the letter that block is currently configured to
                    for (let remaining_block_idx of Array(remaining.length).keys()){ // is that letter in our remaining blocks so we can replace it?
                        if (!swap_success){
                            let remaining_block = remaining[remaining_block_idx]
                            console.log(`Searching for ${conf_block_letter} in ${remaining_block}`)
                            if (remaining_block.includes(conf_block_letter)){ // it is!
                                console.log("found")
                                console.log(configured)
                                // we want to take this remaining block, and put it where the conf block was, and then take the conf block to the next place, and change it to the new letter
                                let temp_conf_block = conf_block[0]
                                let conf_block_letter_idx = remaining_block.indexOf(conf_block_letter)
                                console.log(conf_block_letter_idx)
                                configured[conf_block_idx] = [remaining_block, conf_block_letter_idx]
                                let temp_conf_block_letter_idx = temp_conf_block.indexOf(goal_letter)
                                console.log(temp_conf_block_letter_idx)
                                configured[goal_idx] = [temp_conf_block, temp_conf_block_letter_idx] // variable names getting a bit lengthy, but ill take it for readability with this awful code
                                letter_found = true
                                swap_success = true
                                console.log(configured)
                                console.log("Swap Successful!")
                            } 
                        }
                    }
                }
            }
        }
        if (!letter_found) { // still
            console.log("Letter not found in the configured or remaining blocks :(((( this message is impossible")
            console.log(configured, remaining)
        }
    }
    printBlocks(configured)
}
  
// at this point, the configured list should contain all the blocks and their orientation. Lets display that.
console.log("Message Success!!!")
//console.log("Block key:", block_key,"\n\n")

printBlocks(configured)
  
  
}

function draw() {
  
  background(200);
    
  line = 0
  lineLength = lineLengths[line];
  idx = 0
  // these account for the length of each line to center it
  // and the number of lines to center it.
  offsetx = -((lineLength)*cubeSize*2 + (lineLength-1)*spacing - cubeSize*2)/2
  offsety = -(lines*(cubeSize*2) + (lines-1)*spacing-cubeSize*2)/2
  //offsetx = 0 
  //offsety = 0
  
  for (let block of configured){
    if (spaceSpaces.includes(idx)){
        offsety += cubeSize*2+spacing
        line += 1
        lineLength = lineLengths[line];
      
        offsetx = -((lineLength)*cubeSize*2 + (lineLength-1)*spacing - cubeSize*2)/2
      }
    if (block[0] != undefined) {    
      drawCube([offsetx,offsety,0], block[0], block[1]);
     } else {
       drawCube([offsetx,offsety,0], [], -1)
     }
    
    idx += 1
    offsetx += cubeSize*2+spacing
  }
  // draw remaining blocks
  offsety = 0
  offsetx = -((remaining.length)*cubeSize*2 + (remaining.length-1)*spacing - cubeSize*2)/2
  offsetz = -cubeSize*4*2 - spacing*2
  for (let block of remaining){
    if (block != undefined) {    
      drawCube([offsetx,offsety,offsetz], block, 1);
     } else {
       drawCube([offsetx,offsety,offsetz], [], -1)
     }
    
    idx += 1
    offsetx += cubeSize*2+spacing
  }

  // Rotate the cube
  orbitControl();
  //drawCube([0,0,0], ["c","e","n","t","e","r"],1)
}

  
function drawCube(loc, letters, orientation){
  push();
  translate(...loc)
  if (orientation == -1) {
    push();
    for (let i = 0; i < 6; i++) {
      push();
      translateFace(i); // Move to the correct face
      plane(cubeSize*2, cubeSize*2); // Draw the face
      pop();
    }
    pop();
    pop();
  } else {
  let colors = [["white", "red"], ["Navy", "white"], ["yellow", "MediumPurple"], ["red", "green"], ["orange", "#242424"], ["black", "orange"]]
  
  // rotate the cube , not by actaully rotating it, but by rotating the arrays.
  colors = colors.slice(orientation).concat(colors.slice(0, orientation));
  letters = letters.slice(orientation).concat(letters.slice(0, orientation));

  
  for (let i = 0; i < 6; i++) {
    let name = "" + letters[i] + colors[i][0] + colors[i][1]
    if (!(name in faceGraphics)){

    let gfx = createGraphics(cubeSize*2, cubeSize*2); // Texture cubeSize
    gfx.background(colors[i][1]); // Set background color
    gfx.textAlign(CENTER, CENTER);
    gfx.textSize(cubeSize);
    gfx.fill(colors[i][0]); // Text color
    gfx.text(letters[i].toUpperCase(), cubeSize, cubeSize); // Add text to texture
    faceGraphics[name] = gfx; // Store the texture
    //gfx.remove(); // to reduce lag, removes the canvas element.
  }}
  
  noStroke();
  push();
  for (let i = 0; i < 6; i++) {
    push();
    translateFace(i); // Move to the correct face
    let name = "" + letters[i] + colors[i][0] + colors[i][1]
    texture(faceGraphics[name]); // Apply the texture
    plane(cubeSize*2, cubeSize*2); // Draw the face
    pop();
  }
  pop();
  pop();
  }
}

// Function to position each face of the cube
function translateFace(faceIndex) {
  switch (faceIndex) {
    case 0: translate(0, 0, cubeSize); break; // Front
    case 1: translate(0, 0, -cubeSize); rotateY(PI); break; // Back
    case 2: translate(cubeSize, 0, 0); rotateY(HALF_PI); break; // Right
    case 3: translate(-cubeSize, 0, 0); rotateY(-HALF_PI); break; // Left
    case 4: 
      translate(0, -cubeSize, 0); 
      rotateX(-HALF_PI); 
      scale(1, -1); // Flip texture vertically for Top
      break; 
    case 5: 
      translate(0, cubeSize, 0); 
      rotateX(HALF_PI); 
      scale(1, -1); // Flip texture vertically for Bottom
      break; 
  }
}

