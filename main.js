var fourier_chars = [];
var stroke_list = [];
var DEG_MAX = 10;

// Output Lyric
var app_output = function(p){

    p.setup = function(){
        p.createCanvas(600, 400);
        p.background(128, 128);
    }

    p.draw = function(){
        /**
         * determine Fourier series to visualize in output frame
         */
        var fourier_charW = [];
        var charW = [];

        switch(fourier_chars.length){
            case 0:
                return;
            case 1:
                fourier_char1 = fourier_chars[0];
                // 1ストロークごとに復元する
                // console.log(fourier_char1);

                for(let si = 0; si < fourier_char1.length; si ++){
                    var stroke1 = new Stroke();
                    stroke1.p_list = fourier_char1[si].restorePoints();

                    var pl = stroke1.p_list;
                    for(let pi = 0; pi < pl.length; pi++){
                        p.point( pl[pi].x, pl[pi].y );
                    }
                }
        }

        // switch(fourier_chars.length){
        //     case 0:
        //         return;

        //     case 1:
        //         for(let si = 0; si < fourier_char1.length; si++){
        //             let fourier1 = fourier_char1[si];
        //             fourier_charW.push( fourier1 );
        //             var strokeW = new Stroke();
        //             strokeW.p_list = fourier1.restorePoints();
        //             charW.push( strokeW );
        //         }
        //         break;

        //     default:
        //         animeFrameCount++;

        //         if( animeFrameCount % SECTION == 0 ){
        //             replaceChars();
        //         }

        //         for(let si = 0; si < fourier_char1.length; si++){
        //             let fourier1 = fourier_char1[si];
        //             let fourier2 = fourier_char2[si];
        //             let len_pointsW = parseInt(fourier1.len_points * (1-_ratio) + fourier2.len_points * _ratio);
        //             var fourierW = new Fourier( len_pointsW );

        //             for(let k = 0; k < fourier1.m_aX.length; k++){
        //                 let w_aX = fourier1.m_aX[k] * (1-_ratio) + fourier2.m_aX[k] * _ratio;
        //                 let w_aY = fourier1.m_aY[k] * (1-_ratio) + fourier2.m_aY[k] * _ratio;
        //                 let w_bX = fourier1.m_bX[k] * (1-_ratio) + fourier2.m_bX[k] * _ratio;
        //                 let w_bY = fourier1.m_bY[k] * (1-_ratio) + fourier2.m_bY[k] * _ratio;
        //                 fourierW.m_aX[k] = w_aX;
        //                 fourierW.m_aY[k] = w_aY;
        //                 fourierW.m_bX[k] = w_bX;
        //                 fourierW.m_bY[k] = w_bY;
        //             }
        //             fourier_charW.push( fourierW );

        //             var strokeW = new Stroke();
        //             strokeW.p_list = fourierW.restorePoints();
        //             charW.push( strokeW );
        //         }

        //         _ratio += parseFloat(1) / SECTION;
        //         break;
        // }

        /**
        * draw strokes and circular motions
        */
        // p.strokeWeight(1);
        // p.colorMode(p.HSB, 100);
        // p.noFill();
        // for(let i = 0; i < fourier_charW.length; i++){
        //     p.strokeWeight(2.5);
        //     var col = parseFloat(i * 100) / fourier_charW.length;
        //     p.stroke(col, 100, 100);
        //     let list = charW[i].p_list;
        //     for(let pi = 0; pi < list.length; pi++){
        //         p.point( list[pi].x, list[pi].y );
        //     }

        //     var f = fourier_charW[i];
        //     var t = 2 * Math.PI * (p.frameCount % SECTION)/SECTION - Math.PI;

        //     p.push();
        //     p.translate( f.m_aX[0]/2, p.height * 3/4 );
        //     p.nextWheelX(1, f, t);
        //     p.pop();
        //     p.push();
        //     p.translate( p.width * 3/4, f.m_aY[0]/2 );
        //     p.nextWheelY(1, f, t);
        //     p.pop();
        // }
        
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

        // p.checkStrokeCount();
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

        console.log(fourier_chars);

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


var canvas_input  = new p5(  app_input,  "canvas_input" );
var canvas_output = new p5( app_output, "canvas_output" );