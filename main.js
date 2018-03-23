var app_output = function(p){

    p.setup = function(){
        p.createCanvas(600, 400);
        p.background(128, 128);
    }

}

var canvas_output = new p5( app_output, "canvas_output" );