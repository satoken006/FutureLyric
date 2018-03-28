

var fourier_list = [];
var DEG_MAX = 10;

// Output Lyric
var app_output = function(p){
    var vid;

    p.setup = function(){
        var canvas_output = p.createCanvas(600, 400);
        p.strokeWeight(3);

        txt = p.createDiv("<iframe src='https://www.youtube.com/embed/mjzNJlOr4lg?&autoplay=1' frameborder='0'></iframe>");
        txt.position(0, 0);
    }

    p.draw = function(){
        p.background(255, 0);

        for(let fi = 0; fi < fourier_list.length; fi ++){
            var stroke1 = new Stroke();
            stroke1.p_list = fourier_list[fi].restorePoints(p);
            // console.log(stroke1.p_list);

            var pl = stroke1.p_list;
            for(let pi = 0; pi < pl.length/2; pi++){
                p.point( pl[pi].x, pl[pi].y );
            }
        }
    }

}


// Input Lyric
var app_input = function(p){
    var THR_LENGTH = 5;
    var spline;
    var stroke_list = [];
    var new_stroke;

    p.setup = function(){
        p.createCanvas(600, 400);
        spline = new Spline();
        p.strokeWeight(3);
    }

    p.draw = function(){
        p.background(204, 255, 255);

        for( var si = 0 ; si < stroke_list.length; si ++ ){
            var s = stroke_list[si];
            for( var pi = 0 ; pi < s.p_list.length; pi ++ ){
                p.point( s.p_list[pi].x, s.p_list[pi].y );
            }
        }
    }

    p.mousePressed = function(){
        stroke_list.push( new Stroke() );
    }

    p.mouseDragged = function(){
        var last = stroke_list.length-1;
        stroke_list[last].p_list.push( new Point( p.mouseX, p.mouseY ) );
    }

    p.mouseReleased = function(){
        var last = stroke_list.length-1;
        var len_last = stroke_list[last].p_list.length;

        if( len_last < THR_LENGTH ){
            stroke_list.pop();
        }else{
            var list = stroke_list[last].p_list;
            var list2 = spline.getSpline( this, list, 100 );
            stroke_list[last].p_list = list2;
        }

        // p.checkStrokeCount();
    }

    p.getFourierList = function(){
        let last = stroke_list.length-1;

        for(let i = 0; i < stroke_list.length; i++){
            var f = new Fourier( stroke_list[i].p_list.length );
            var list = stroke_list[i].p_list;
            f.expandFourierSeries(list, DEG_MAX);
            fourier_list.push(f);
            f.restorePoints();
        }
        stroke_list = [];
        console.log(fourier_list);

        return fourier_list;
    }

    p.deleteLastStroke = function(){
        char_stroke.pop();
        // p.checkStrokeCount();
    }

    // p.checkStrokeCount = function(){
    //     if( fourier_chars.length == 0 ) return;

    //     if( fourier_chars[0].length == char_stroke.length ){
    //         setColorEnable();
    //     }else{
    //         setColorDisable();
    //     }
    // }
}


function Point( x, y ){
    this.x = x;
    this.y = y;
}


function Stroke(){
    this.p_list = [];
}


var canvas_output = new p5( app_output, "canvas_output" );
var canvas_input  = new p5(  app_input,  "canvas_input" );