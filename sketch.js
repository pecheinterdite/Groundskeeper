//Click once to begin enable the audio capture. This does not record audio, but simply monitors 
//the mic input and stores the amplitude value 60x per second. A second click stops the audio capture.
//An average amplitude is calculated for the captured period. The microphone remains on however no 
//audio or information is stored; instead the live amplitude is updated 60x per second. The difference 
//between the control and live amplitude is displayed in the bottom left of the canvas. One circle 
//traced in the centre of the screen represents the control amplitude. Two further circles are not 
//fixed - they move directly proportionally to each other with one on the x axis and one on the y.
//The distance they move is the difference between live and control amplitudes mapped to the canvas.
//The sensitivty of the microphone can be changed with the slider so that the movement of the circles
//is more or less pronounced. Your aim is to concentrate on maintaing a consistent volume in your 
//environment which is represented by the circles lining up. The lower the difference between control
//and live amplitudes, the closer together the circles are. The easiest way to do this is to sample 
//a quiet space and remain quiet, however for a more mindful challenge one may experiment with the 
//input amplitudes and consider effective ways to maintain volumes, situating the self at the heart 
//of the sonic enquiry.




let mic, amplitude, samplelength, control, live, fileAmp, slider;

let count = 0;

let state = 0;

let sum = 0;

let fileAmps = [];

let noiseValR = 1;
let noiseValG = 2;
let noiseValB = 5;



function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.mousePressed(canvasPressed);
  background(255);
  text('You are the caretaker of your own aurality;', 20, height - 120);
  text('The groundskeeper of your sonority;', 20, height - 100);
  text('Tend to your sounding garden.', 20, height - 80);
  text('Click to start', width-100, height - 60);
  text('May not work in Firefox', width-160, height - 40);
  text('No audio will be captured or stored', width-220, height - 20);

  slider = createSlider(1, 10, 1);
  slider.position(10, 10);
  slider.style('width', '100px');

  // create an audio in
  mic = new p5.AudioIn();

  // prompts user to enable their browser mic
  mic.start();

  //creates amplitude
  amplitude = new p5.Amplitude();

  // ensure audio is enabled
  userStartAudio();

}



function draw() {
  frameRate(15);

  //samples amplitude 60 times per second while recording
  //is enabled and pushes every value to an array
  if (state === 1 && mic.enabled) {
    fileAmp = mic.getLevel();
    fileAmps.push(fileAmp);


    //after recording is complete and average amplitude
    //defined, this section of the draw loop is the bulk
    //of the experience
  } else if (state === 3) {

    //slow background using noise
    noiseValR = noiseValR + 0.001;
    noiseValG = noiseValG + 0.001;
    noiseValB = noiseValB + 0.001;
    rVal = noise(noiseValR) * 400;
    gVal = noise(noiseValG) * 400;
    bVal = noise(noiseValB) * 400;
    background(rVal, gVal, bVal, 50);

    //get live amplitude
    live = mic.getLevel();
    //difference between control vol and live vol
    let diff = control - live;
    //rounds down to 3dp
    fill(255);
    noStroke();
    text((nf(diff, 1, 3)), 20, height - 50);

    // //centre circle, removed as suggestion of circle using ball looks more visual pleasing
    // noFill();
    // stroke(150);
    // circle(width / 2, height / 2, 300);
    
    //moving ball tracing centre circle
    var circX = width/2 + cos(count) * 150;
    var circY = height/2 + sin(count) * 150;
    noStroke();
    fill(255);
    circle(circX, circY, 5);
    count++
    if (count == 360){
      count = 0; 
    }
    
    //sensitivity of circles changes on the slider
    let sliderval = slider.value();

    //large circles which move dependent on amplitude differential
    //the closer the diff to 0, the more aligned the circles
    //both bounds mapped to 3x canvas (e.g. 0-width and width*2) so that movement is pronounced 
    noFill();

    //x circle A
    xboundA = map(diff, -1, 1, 0-(width*sliderval), width+(width*sliderval));
    stroke(rVal, bVal, gVal);
    circle(xboundA, height / 2, 300);
    
    //y circle A
    yboundA = map(diff, -1, 1, 0-(height*sliderval), height+(height*sliderval));
    stroke(gVal, bVal, rVal);
    circle(width / 2, yboundA, 300);


    // ADAPT NUMBERS FOR EAST MOTION
    //x circle B
    xboundA = map(diff, -1, 1, 0-(width*sliderval), width+(width*sliderval));
    stroke(rVal, bVal, gVal);
    circle(xboundA, height / 2, 300);
      
    //ADAPT NUMBERS FOR SOUTH MOTION
    //y circle B
    yboundA = map(diff, -1, 1, 0-(height*sliderval), height+(height*sliderval));
    stroke(gVal, bVal, rVal);
    circle(width / 2, yboundA, 300);
    


  }
}


function canvasPressed() {

  //first instance of click
  if (state === 0 && mic.enabled) {
    state++;
    background(255);
    text('Listening to your surroundings...', 20, height - 80);
    text('Calculating the average amplitude...', 20, height - 60);
    text('Click to continue', width-150, height - 40);
    console.log('Sampling audio');


    //next click
  } else if (state === 1) {
    background(255);

    //all elements in array summed
    for (let i = 0; i < fileAmps.length; i++) {
      sum = sum + fileAmps[i];
    }
    //sum divided by length of array for average amplitude of sample
    control = sum / (fileAmps.length);
    console.log('Control volume is ' + control);

    text('Listening complete', 20, height - 220);
    text('On a scale from 0 to 1, the volume of your surroundings is a ' + control, 20, height - 200);
    text('Now, try to keep this amplitude consisent, around you and on your person', 20, height - 180);
    text('Whether your surroundings are loud or quiet, focus on maintaining the volume', 20, height - 160);
    text('Maybe you need to stay entirely silent;', 20, height - 140);
    text('Maybe you need to tune in to the sonic potentialities around you', 20, height - 120);
    text('Keep the circles aligned by maintaining an equilibrium', 20, height - 100);
    text('Use the slider to increase the sensititivity of the microphone', 20, height - 80);
    text('Click again to begin your enquiry into solipsistic sonic situatedness', 20, height - 60);
    console.log('Sampling complete');
    state++

  } else if (state === 2) {
    state++


  } else if (state === 3) {

  }
}
