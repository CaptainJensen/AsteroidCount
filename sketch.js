

var API = 'https://api.nasa.gov/neo/rest/v1/feed?';
var APIkey = 'LDfsZBTFBcfLBgRN2VkelfPpEQT90eav3ZJ3C3kl';

var date;


var astroidsData;

var totalNumOfnear_earth_objects;


var img;

function astroid(name, miss_distnaceMiles, hazardous, xVal, yVal, colorHaz) {

    this.Name = name;
    this.distance = miss_distnaceMiles;
    this.hazard = hazardous;
    this.xPos = xVal;
    this.yPos = yVal;
    this.colorHazard = colorHaz;
} ;

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
    img = loadImage("world.jpg");
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

        // var missDistance = nearEarthObjects[i].close_approach_data.miss_distance.miles;
        // var astroidName = nearEarthObjects[i].name;
        // var hazarddanger = nearEarthObjects[i].is_potentially_hazardous_asteroid;


        //nearEarthObjects[i].close_approach_data.miss_distance
        for (var i = 0; i < totalNumOfnear_earth_objects; i++) {
            astroids.push({
                Name: nearEarthObjects[i].name,
                distance: floor(nearEarthObjects[i].close_approach_data[0].miss_distance.lunar) ,
                hazard: nearEarthObjects[i].is_potentially_hazardous_asteroid,
                xPos: floor(random(20, innerWidth-20)),
                yPos: floor(random(20, innerHeight-20)),
                colorHazard: null

            });

            if(astroids[i].hazard) {
              astroids[i].colorHazard = color(255,0,0);
            } else {
              astroids[i].colorHazard = color(0,140,0);
            }
        }


        console.log(astroids);

    }


    button = createButton('Info');
    button.position(10, 70);
    button.mousePressed(info);




}


function draw() {

    //also slows down time therefore removed seconds from clock??
    //frameRate(10);



    //TODO: CREATE MAPS FOR ACTUAL DISTANCE

    background(0);
    fill(255);
    stroke(0);

    textSize(32);

    text("Current Near Earth Objects: " + totalNumOfnear_earth_objects, 10, 30);
    text(hour() + ':' + minute() + ':' + second(), 10, 60);

    image(img, innerWidth/4, innerHeight/3);

    for(var i = 0; i < astroids.length; i++) {
        fill(astroids[i].colorHazard);
        ellipse(astroids[i].xPos , astroids[i].yPos, astroids[i].distance, astroids[i].distance );

        if ( collidePointCircle(mouseX, mouseY, astroids[i].xPos, astroids[i].yPos, astroids[i].distance)) {
            fill(7,180,7);
            textSize(14);
            text(astroids[i].Name, astroids[i].xPos, astroids[i].yPos);
            fill(255);
        }
    }

    //noLoop();
}

function info() {
    alert("Data is based from system time and date. \nData from NASA. \nInformation can be found at: https://api.nasa.gov/ \nCreated by: Hunter Jensen");
}
