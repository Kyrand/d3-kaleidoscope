// A polygon looks something like: <polygon points="200,10 250,190 160,210" />

var segments, numSegments = 12,
    numPolygons = 50,
    radius = 300,
    sz = 2*(radius+10),
    thetaDeg, theta, halfTheta;

segments = d3.select('#chart')
    .attr('class', 'kscope')
    .style('width', sz + 'px').style('height', sz + 'px')
    .append('g').attr('class', 'segments')
    .attr('transform', 'translate(' + (sz/2) + ',' + (sz/2) + ')');

var makeWindow = function() {
    thetaDeg = 360.0 / numSegments;
    theta = thetaDeg * (Math.PI/180.0);
    halfTheta = theta/2;

    segments = d3.select('.segments').selectAll('.segment')
        .data(d3.range(numSegments));

    segments.enter().append('g').attr('class', 'segment');
    segments.exit().remove();
    
    d3.selectAll('.segments .segment').attr('transform', function(d, i) {
            return 'rotate(' + (i*thetaDeg) + ')';}) 
    ; 

};

var RandomPolygon = function(numPoints) {
    numPoints = typeof numPoints !== 'undefined'? numPoints: 3;
    var ptInArc = function() {
        var ang = -halfTheta + Math.random() * theta,
            l = Math.random() * radius;
        return [l * Math.cos(ang), l * Math.sin(ang)];
    }; 
    pts = [];
    for(var i=0; i<numPoints; i++){
        pts.push(ptInArc());
    }
    return pts;
};

var reflectPoint = function(p) {
    return [p[0], -p[1]];
};

var getPolygons = function() {
    polyPoints = [];//{pts:[]};
    for(var i=0; i<numPolygons; i++){
        var poly = RandomPolygon(),
            col = '#' + Math.floor(Math.random()*16777215).toString(16);
        
        polyPoints.push({pts:poly, col:col});
        polyPoints.push({pts:poly.map(reflectPoint), col:col});
    }
    return polyPoints;
};

var update = function() {
    
    var polys = d3.selectAll('.segment').selectAll("polygon")
        .data(getPolygons());
    polys.enter().append("polygon")
        .attr('fill-opacity', 0.3);

    polys.exit().remove();
    
    d3.selectAll('.segment polygon')
        .transition()
        .duration(2000)
        .attr("points",function(d) { 
            return d.pts.map(function(d) {
                return [d[0], d[1]].join(",");
            }).join(" ");
        })
        .attr("stroke","black")
        .attr("stroke-width",2)
        .attr('fill', function(d,i) {
            return d.col;
        })
    ;
    
};

var makeSelector = function(id, data, txt, initVal, cbk) {
    initVal = typeof initVal !== 'undefined'? initVal: data[0][0];


    var slct = d3.select(id).append('span').text(txt).append('select');

    slct.selectAll('option').data(data).enter()
        .append('option').attr('value', function(d) {return d[0];})
        .html(function(d) {
            return d[1];
        });

    $(id + ' select').val(initVal);
    $(id + ' select').on('change', cbk);
};

makeSelector('#poly-selector', [[10,10], [20,20], [50,50], [100,100], [150,150]], 'Num. of polygons: ', numPolygons, function() {
        numPolygons = parseInt($(this).val());
        update();
});

makeSelector('#segment-selector', [[4,4], [6,6], [8,8], [10,10], [12,12], [16,16]], 'Num. of segments: ', numSegments, function() {
    numSegments = parseInt($(this).val());
    makeWindow();
    update();
});
// 
d3.select('#buttons').append('button').text('New window')
    .on('click', function() {
        update();
    });

var animateFlag = true;
d3.select('#buttons').append('button').text('Auto off')
    .on('click', function() {
        animateFlag = !animateFlag;
        d3.select(this).text(animateFlag?'Auto off':'Auto on');
    });

var tickFn = function() {
    if(animateFlag){
        update();
    }
};
// update window every 4s
var playTimer = setInterval(tickFn, 4000);
// $('#num-polygons').noUiSlider({
//     start: numPolygons,
//     step:10,
//     range: {'min': 10 ,'max': 200}
// });

// $('#num-polygons').on({'set': function() {
//     numPolygons = parseInt($(this).val());
//     update();
// }});  

// $('#num-polygons').Link('lower').to($('#val-num-polygons'));
makeWindow();
update();
