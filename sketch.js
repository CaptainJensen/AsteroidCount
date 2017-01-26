/**
 * 
 * 
 * Created by Hunter Jensen
 * https://github.com/CaptainJensen
 * 
 * 
 * 
 */
 

var API = 'https://api.nasa.gov/neo/rest/v1/feed?';
var APIkey = 'LDfsZBTFBcfLBgRN2VkelfPpEQT90eav3ZJ3C3kl';

var date;

var astroidsData;

var totalNumOfnear_earth_objects;

var centerX, centerY;

function astroid(name, miss_distnaceMiles, hazardous,xVal, yVal, colorHaz) {

    this.Name = name;
    this.distance = miss_distnaceMiles;
    this.hazard = hazardous;
    this.xPos = xVal;
    this.yPos = yVal;
    this.colorHazard = colorHaz;
    
} 

var astroids = [];

function preload() {
    //get todays date
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd='0'+dd
    }

    if(mm<10) {
        mm='0'+mm
    }

    date = yyyy+'-'+mm+'-'+dd;

    var url = API + 'start_date=' + date + '&end_date=' + date + '&detailed=false&api_key=' + APIkey;
    console.log(url);
    loadJSON(url, gotData);
}

function gotData(data) {
    astroidsData = data;

}



function setup() {

    createCanvas(innerWidth, innerHeight);
    background(0);

    totalNumOfnear_earth_objects = astroidsData.element_count;


    if (astroidsData) {
        var nearEarthObjects = astroidsData.near_earth_objects[date];
        
        for (var i = 0; i < totalNumOfnear_earth_objects; i++) {
            astroids.push({
                Name: nearEarthObjects[i].name,
                distance: nearEarthObjects[i].close_approach_data[0].miss_distance.lunar,
                hazard: nearEarthObjects[i].is_potentially_hazardous_asteroid,
                xPos: null,
                yPos: null,
                //yPos: floor(random(20, innerHeight-20)),
                //xPos: floor(random(20, innerWidth-20)),
                colorHazard: null
              
            });
            
        
        
        
        
            //TODO: backwards for initial value so the smallest is the closest
            //TODO: find max value and min value and set set it to that max so it doesent go off screen
            astroids[i].xPos = map(astroids[i].distance, 200, 0, random(0,width) , width/2-100);
            astroids[i].yPos = map(astroids[i].distance, 200, 0, random(0,height) , height/2-100);
          
            
            if(astroids[i].hazard) {
              astroids[i].colorHazard = color(255,0,0);
            } else {
              astroids[i].colorHazard = color(0,140,0);
            }
        }
        
        
        centerX = width/2;
        centerY = height/2;
        
        

        console.log(astroids);

    }

    


    button = createButton('Info');
    button.position(10, 70);
    button.mousePressed(info);




}


function draw() {

    //also slows down time therefore removed seconds from clock??
    //frameRate(10);

    background(0);
    fill(255);
    stroke(0);
    
    
    textSize(32);
    text("Current Near Earth Objects: " + totalNumOfnear_earth_objects, 10, 30);
    text(hour() + ':' + minute() + ':' + second(), 10, 60);


    for(var i = 0; i < astroids.length; i++) {
        fill(astroids[i].colorHazard);
        stroke(255);
        line(astroids[i].xPos , astroids[i].yPos, centerX, centerY);
        stroke(0);
        
        //added 10 to fix when distance is 0
        ellipse(astroids[i].xPos , astroids[i].yPos, floor(astroids[i].distance)+10, floor(astroids[i].distance)+10 );


        if ( collidePointCircle(mouseX, mouseY, astroids[i].xPos, astroids[i].yPos, floor(astroids[i].distance)+10)) {
            fill(255);
            textSize(14);
            text(astroids[i].Name + "\n~" + floor(astroids[i].distance) + " LD", mouseX, mouseY-20);
        }
    }
    
    fill(0,255,0);
    textSize(16);
    text("Earth", centerX, centerY);
    //noLoop();
}

function info() {
    alert("Data is based from system time and date. \nData from NASA. \nInformation can be found at: https://api.nasa.gov/ \nCreated by: Hunter Jensen");
}
