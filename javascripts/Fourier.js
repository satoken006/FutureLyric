function Fourier( _len_points ){
    this.m_aX = [];
    this.m_bX = [];
    this.m_aY = [];
    this.m_bY = [];
    this.len_points = _len_points;
}

/**
 * convert array of points to Fourier series
 */
Fourier.prototype.expandFourierSeries = function( _arrayPt, _iMaxDegree ){
    var _iNumOfUnit = _arrayPt.length;

    this.m_aX = new Array(_iMaxDegree+1);
    this.m_bX = new Array(_iMaxDegree+1);
    this.m_aY = new Array(_iMaxDegree+1);
    this.m_bY = new Array(_iMaxDegree+1);

    for ( var k=0; k<= Math.min(_iMaxDegree, _iNumOfUnit/2); k++) {
        this.m_aX[k] = 0.0;
        this.m_bX[k] = 0.0;
        this.m_aY[k] = 0.0;
        this.m_bY[k] = 0.0;

        for ( var n=0; n<_iNumOfUnit; n++) {
            var t = 2 * Math.PI * n / _iNumOfUnit - Math.PI;
            this.m_aX[k] += _arrayPt[n].x * Math.cos( k * t );
            this.m_bX[k] += _arrayPt[n].x * Math.sin( k * t );

            this.m_aY[k] += _arrayPt[n].y * Math.cos( k * t );
            this.m_bY[k] += _arrayPt[n].y * Math.sin( k * t );
        }

        this.m_aX[k] *= 2/_iNumOfUnit;
        this.m_bX[k] *= 2/_iNumOfUnit;
        this.m_aY[k] *= 2/_iNumOfUnit;
        this.m_bY[k] *= 2/_iNumOfUnit;
    }

}

/**
 * restore array of points from Frouier series
 */
Fourier.prototype.restorePoints = function(_p){
    var _listPt = [];
    var k_MAX = this.m_aX.length-1;
    
    for( var pi = 0 ; pi < this.len_points ; pi ++ ){
        var p_restored = new Point(0, 0);
        var t = 2 * Math.PI * pi/this.len_points - Math.PI;

        var f1 = 0;
        var f2 = 0;

        p_restored.x += this.m_aX[0]/2;
        p_restored.y += this.m_aY[0]/2;
        for(let k = 1 ; k <= k_MAX ; k ++ ){
            p_restored.x += this.m_aX[k] * Math.cos(k*t);
            p_restored.x += this.m_bX[k] * Math.sin(k*t);
            p_restored.y += this.m_aY[k] * Math.cos(k*t);
            p_restored.y += this.m_bY[k] * Math.sin(k*t);

            f1 += k * (this.m_aX[k] * Math.sin(k*t) * (-1));
            f1 += k * (this.m_bX[k] * Math.cos(k*t));
            f2 += k * (this.m_aY[k] * Math.sin(k*t) * (-1));
            f2 += k * (this.m_bY[k] * Math.cos(k*t));
        }

        //console.log(_p.frameCount);

        p_restored.x += 2.5*Math.sin(t*20 + _p.frameCount * 10 * Math.PI/180) * (-1) * f2 / Math.sqrt( Math.pow(f1, 2)+Math.pow(f2, 2) );
        p_restored.y += 2.5*Math.sin(t*20 + _p.frameCount * 10 * Math.PI/180) * f1 / Math.sqrt( Math.pow(f1, 2)+Math.pow(f2, 2) );

        _listPt.push(p_restored);
    }
    
    return _listPt;
}