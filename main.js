// Output Lyric
var app_output = function(p){

    p.setup = function(){
        p.createCanvas(600, 400);
        p.background(128, 128);
    }

}


// Input Lyric
var app_input = function(p){
    var THR_LENGTH = 10;
    var spline;
    var char_stroke = [];
    var new_stroke;

    p.setup = function(){
        p.createCanvas(600, 400);
        spline = new Spline();
    }

    p.draw = function(){
        p.background(204, 255, 255);

        for( var si = 0 ; si < char_stroke.length ; si ++ ){
            var s = char_stroke[si];
            for( var pi = 0 ; pi < s.p_list.length ; pi ++ ){
                p.point( s.p_list[pi].x, s.p_list[pi].y );
            }
        }
    }

    p.mousePressed = function(){
        char_stroke.push( new Stroke() );
    }

    p.mouseDragged = function(){
        var last = char_stroke.length-1;
        char_stroke[last].p_list.push( new Point( p.mouseX, p.mouseY ) );
    }

    p.mouseReleased = function(){
        var last = char_stroke.length-1;
        var len_last = char_stroke[last].p_list.length;

        if( len_last < THR_LENGTH ){
            char_stroke.pop();
        }else{
            var list = char_stroke[last].p_list;
            var list2 = spline.getSpline( this, list, 100 );
            char_stroke[last].p_list = list2;
        }

        p.checkStrokeCount();
    }

    p.sendStrokes = function(){
        if( fourier_chars.length > 0 ){
            if( fourier_chars[0].length != char_stroke.length ) return;
        }

        let last = fourier_chars.length-1;
        var fourier_list = [];
        for(let i = 0; i < char_stroke.length; i++){
            var f = new Fourier( char_stroke[i].p_list.length );
            var list = char_stroke[i].p_list;
            f.expandFourierSeries(list, DEG_MAX);
            fourier_list.push(f);
            f.restorePoints();
        }
        fourier_chars.push( fourier_list );
        char_stroke = [];

    }

    p.deleteLastStroke = function(){
        char_stroke.pop();
        p.checkStrokeCount();
    }

    p.checkStrokeCount = function(){
        if( fourier_chars.length == 0 ) return;

        if( fourier_chars[0].length == char_stroke.length ){
            setColorEnable();
        }else{
            setColorDisable();
        }
    }
}


function Point( x, y ){
    this.x = x;
    this.y = y;
}


function Stroke(){
    this.p_list = [];
}


var canvas_input  = new p5(  app_input,  "canvas_input" );
var canvas_output = new p5( app_output, "canvas_output" );