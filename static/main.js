var lWidth = 7;
var nSize = 37;

var nodeCanWidth = Math.round(d3.select('#node-canvas').style('width').slice(0, -2));
var cCenter = [nodeCanWidth / 2, nodeCanWidth / 2];
var cRadius = nodeCanWidth / 2 - 50;

var nodeCanvas = d3.select("#node-canvas").append("svg")
    .attr("width", nodeCanWidth)
    .attr("height", nodeCanWidth)




var defs = nodeCanvas.append("defs");
var imgLen = (Array(100))
defs.selectAll(null)
    .data(imgLen)
    .enter()
    .append("pattern")
    .attr("id", function(d, i) {
        return "img-" + ('00' + i).slice(-2)
    })
    .attr("height", "100%")
    .attr("width", "100%")
    .attr("patternContentUnits", "objectBoundingBox")
    .append("image")
    .attr('x', 0.15)
    .attr('y', 0.155)
    .attr("height", 0.7)
    .attr("width", 0.7)
    .attr("preserveAspectRatio", "none")
    .attr("xlink:href", function(d, i) {
        return "static/data/" + ((i + 1) + '.png')
    });




function drawPoint(canvas, center, r = 10, _id = "rand", fill = '#FF8A65', _class = 'unclass') {
    var circle = canvas.append("circle")
        //.attr("stroke", "#FF8A65")
        .attr("fill", fill)
        .attr('id', _id)
        .attr('class', _class)
        .attr("cx", center[0])
        .attr("cy", center[1])
        .attr("r", r);
    return circle;
}

function drawCurve(points, _id = 'rand', clr = "#CFD8DC", anim = false) {
    var curveFunc = d3.line()
        .x(function(d) { return d[0] })
        .y(function(d) { return d[1] })
        .curve(d3.curveBasis);
    var stWidth = lWidth;
    var op = 0.2;
    if (anim) {
        stWidth = 10;
        op = 0.5;
    }

    var curve = nodeCanvas.append("path")
        .attr('id', _id)
        .attr("d", curveFunc(points))
        .attr("stroke", clr)
        .attr("stroke-opacity", op)
        .attr('stroke-linecap', 'round')
        .attr("stroke-width", stWidth)
        .attr("fill", "none");

    if (anim) {
        var totalLength = curve.node().getTotalLength();
        curve
            .attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(1000)
            .ease(d3.easeSin)
            .attr("stroke-dashoffset", totalLength * 3)
            .remove()
    }
}


function plotNodes(center, radius, numNode) {
    var theta = 2 * Math.PI / numNode;
    var nodes = []
    for (var i = 0; i < numNode; i++) {
        var x = center[0] + Math.sin(theta * i) * radius
        var y = center[1] - Math.cos(theta * i) * radius
        drawPoint(nodeCanvas, [x, y], r = nSize, _id = 'node-' + i, fill = 'url(#img-' + nodeList[i] + ')')
        nodes.push([x, y])
    }
    return nodes;

}

function findBend(center, numNode, ind1, ind2, sRadius) {
    var theta = 2 * Math.PI / numNode;
    var cx = center[0] + Math.sin(theta * ind1) * sRadius;
    var cy = center[1] - Math.cos(theta * ind1) * sRadius;
    var x = cx + Math.sin(theta * ind2) * sRadius
    var y = cy - Math.cos(theta * ind2) * sRadius
    return [x, y]
}


function drawLink(center, radius, nodes, ind1, ind2, clr = "#CFD8DC", anim = false) {
    var bend = findBend(center, nodes.length, ind1, ind2, radius / 4)
    drawCurve([nodes[ind1], bend, nodes[ind2]], 'link-' + ind1 + '-' + ind2, clr, anim)
}




nodes = plotNodes(cCenter, cRadius, nodeList.length)
for (var i = 0; i < nodeData.length; i++) {
    a = nodeList.indexOf(nodeData[i].slice(0, 2))
    b = nodeList.indexOf(nodeData[i].slice(2, 4))
    drawLink(cCenter, cRadius, nodes, a, b, clr = "#CFD8DC");
    d3.selectAll('circle').each(function() { this.parentNode.appendChild(this) })
}



//rank

archiveRank = [
    ['0500', 2225],
    ['0005', 1722],
    ['1238', 1666],
    ['0301', 1028],
    ['0060', 967],
    ['0501', 841],
    ['0001', 832],
    ['5327', 821],
    ['0532', 814],
    ['0024', 802],
    ['1900', 662],
    ['0524', 656],
    ['0528', 606],
    ['1101', 534],
    ['2753', 524],
    ['0300', 501]
]


rankOrder = ['0500', '0005', '1238', '0301', '0060', '0501', '0001',
    '5327', '0532', '0024', '1900', '0524', '0528', '1101', '2753',
    '0300'
]





var rankCanWidth = Math.round(d3.select('#rank-canvas').style('width').slice(0, -2));
var rankCanheight = Math.round(d3.select('#rank-canvas').style('height').slice(0, -2));

var rankCanvas = d3.select("#rank-canvas").append("svg")
    .attr("width", rankCanWidth)
    .attr("height", rankCanheight)




var rh = (rankCanheight / 8) - 5;


function drawRank(rankList) {

    rankCanvas.html("");

    rankList.sort(function(a, b) { return b[1] - a[1] })
    for (var i = 0; i < 8; i++) {
        rankCanvas.append("rect")
            .attr("rx", 23)
            .attr("ry", 23)
            .attr("x", 0)
            .attr("y", rh * i)
            .attr("width", 200)
            .attr("height", 46)
            .attr('id', 'rank-' + rankList[i][0])
            .style("fill", '#ECEFF1')

        rankCanvas.append("text")
            .attr("x", 105)
            .attr("y", (rh / 2) + rh * i)
            .attr('font-family', 'Montserrat')
            .attr('font-size', rh / 3 + 'px')
            .attr('fill', '#455A64')
            .attr('id', 'rval-' + rankList[i][0])
            .text(("000000" + rankList[i][1]).slice(-6));

        var a = rankList[i][0].slice(0, 2)
        var b = rankList[i][0].slice(2, 4)

        drawPoint(rankCanvas, [27, 23 + rh * i], r = 25, _id = 'rnke-' + a, fill = 'url(#img-' + a + ')')
        drawPoint(rankCanvas, [67, 23 + rh * i], r = 25, _id = 'rnke-' + b, fill = 'url(#img-' + b + ')')



    }

    for (var i = 0; i < 8; i++) {
        rankCanvas.append("rect")
            .attr("rx", 23)
            .attr("ry", 23)
            .attr("x", 250)
            .attr("y", rh * i)
            .attr("width", 200)
            .attr("height", 46)
            .attr('id', 'rank-' + rankList[8 + i][0])
            .style("fill", '#ECEFF1');

        var a = rankList[8 + i][0].slice(0, 2)
        var b = rankList[8 + i][0].slice(2, 4)


        drawPoint(rankCanvas, [277, 23 + rh * i], r = 25, _id = 'rnke-' + a, fill = 'url(#img-' + a + ')')
        drawPoint(rankCanvas, [317, 23 + rh * i], r = 25, _id = 'rnke-' + b, fill = 'url(#img-' + b + ')')


        rankCanvas.append("text")
            .attr("x", 355)
            .attr("y", (rh / 2) + rh * i)
            .attr('font-family', 'Montserrat')
            .attr('font-size', rh / 3 + 'px')
            .attr('fill', '#455A64')
            .attr('id', 'rval-' + rankList[i + 8][0])
            .text(("000000" + rankList[i + 8][1]).slice(-6));

    }

}


function blinkRank(comb) {

    d3.select("#rank-" + comb).transition()
        .duration(200)
        .style("fill", "#FFCC80")
        .transition()
        .duration(500)
        .style("fill", "#ECEFF1")
}

function updateRank(comb) {
    var j = rankOrder.indexOf(comb[0]);
    archiveRank[j][1] = comb[1];
    archiveRank.sort(function(a, b) { return b[1] - a[1] });

    var rv = ("000000" + comb[1]).slice(-6)
    d3.select('#rval-' + comb[0]).text(rv)

    var orderChange = false;
    for (var i = 0; i < archiveRank.length; i++) {
        if (archiveRank[i][0] != rankOrder[i]) orderChange = true;
        rankOrder[i] = archiveRank[i][0]
    }
    if (orderChange)
        drawRank(archiveRank)

}

drawRank(archiveRank)



//BUBBLE


var bubCanWidth = Math.round(d3.select('#bub-canvas').style('width').slice(0, -2));
var bubCanvas = d3.select("#bub-canvas").append("svg")
    .attr("width", bubCanWidth)
    .attr("height", bubCanWidth)



function packer(raw) {
    data = [{
        "name": "Root",
        "id": 0
    }];
    for (var i = 0; i < raw.length; i++)
        data.push({ 'size': raw[i], 'id': i + 1, 'parent': 0 })

    return data
}



var stratify = d3.stratify()
    .id(function(d) { return d.id; })
    .parentId(function(d) { return d.parent; });

var pack = d3.pack()
    .size([bubCanWidth, bubCanWidth]);



function getRoot(data) {
    return stratify(data)
        .sum(function(d) {
            return d.size;
        })
        .sort(function(a, b) {
            return 0;
        });
}


var selBub;

function updateData(emId) {
    selBub = emId
    raw = bubData[emId]
    data = packer(raw)
    render(getRoot(data));
};

function render(root) {
    var packedNodes = pack(root);
    var children = packedNodes.leaves();


    var circles = bubCanvas.selectAll("circle")
        .data(children, function(d) {
            return d.id;
        });

    var entering = circles.enter()
        .append("circle");



    circles.merge(entering)
        .transition().duration(500)
        .attr("cx", function(d) {
            return d.x
        })
        .attr("cy", function(d) {
            return d.y
        })
        .attr('fill', function(d, i) {
            return 'url(#img-' + ('00' + i).slice(-2) + ')'
        })
        .attr('r', function(d) { return d.r })
        .attr('stroke', '#CFD8DC')

}

updateData('00')

//BUBSEL

var bubselCanWidth = Math.round(d3.select('#bubsel-canvas').style('width').slice(0, -2));
var bubselCanHeight = Math.round(d3.select('#bubsel-canvas').style('height').slice(0, -2));
var bubselCanvas = d3.select("#bubsel-canvas").append("svg")
    .attr("width", bubselCanWidth)
    .attr("height", bubselCanHeight)



var bubemCanWidth = Math.round(d3.select('#bub-em').style('width').slice(0, -2));
var bubemCanvas = d3.select("#bub-em").append("svg")
    .attr("width", bubemCanWidth)
    .attr("height", bubemCanWidth)


drawPoint(bubemCanvas, [bubemCanWidth / 2, bubemCanWidth / 2], r = bubemCanWidth / 2, _id = 'bubem-sel', fill = 'url(#img-' + bubList[0] + ')');


bgr = bubselCanHeight / 16;
emr = bubselCanHeight / 15;

for (var i = 0; i < bubList.length; i++) {
    drawPoint(bubselCanvas, [(bgr + 1) + (bgr + 2) * 2 * (i % 8), (bgr + 1) + (2 * (bgr + 3)) * parseInt(i / 8)], r = emr,
        _id = 'bubsel-' + bubList[i], fill = 'url(#img-' + bubList[i] + ')', _class = 'bubsel-btn')

    drawPoint(bubselCanvas, [(bgr + 1) + (bgr + 2) * 2 * (i % 8), (bgr + 1) + (2 * (bgr + 3)) * parseInt(i / 8)], r = bgr,
        _id = 'bubselbg-' + bubList[i], fill = 'None', _class = 'bubselbg')

}



d3.select('#bubselbg-' + bubList[0])
    .attr('stroke', '#FFCC80')
    .attr('stroke-width', '4px');


d3.selectAll(".bubsel-btn")
    .on('mouseover', bub_mouseover)

d3.selectAll(".bubsel-btn")
    .on('mouseout', bub_mouseout)

d3.selectAll(".bubselbg")
    .on('mouseover', bub_mouseover)

d3.selectAll(".bubselbg")
    .on('mouseout', bub_mouseout)


function bub_mouseover() {
        var _id = d3.select(this).attr('id').split('-')[1]
        if(_id==curr_bubsel)return
        d3.select('#bubselbg-' + _id).attr('stroke', '#FFCC80')
            .attr('stroke-width', '4px');
    }


function bub_mouseout() {

        var _id = d3.select(this).attr('id').split('-')[1]
        if(_id==curr_bubsel)return
        d3.select('#bubselbg-' + _id).attr('stroke', 'none')
            .attr('stroke-width', '4px');
    }


var curr_bubsel=bubList[0]
d3.selectAll(".bubsel-btn")
    .on("click", function() {
        _ind = d3.select(this).attr('id').slice(-2);
        curr_bubsel=_ind;
        d3.selectAll(".bubselbg").attr('stroke', 'none');
        d3.select('#bubselbg-' + _ind)
            .attr('stroke', '#FFCC80')
            .attr('stroke-width', '4px');
        updateData(_ind);
        d3.select('#bubem-sel').attr('fill', 'url(#img-' + _ind + ')')
    });


window.addEventListener("scroll", function(event) {
    var scroll = this.scrollY;
    var height = window.innerHeight;
    if (scroll < height / 4) {
        d3.select("#down").transition().duration(100).style("opacity", "0.3");
        d3.select("#up").transition().duration(100).style("opacity", "0");
    } else if (scroll < height * (7 / 8)) {
        d3.select("#down").transition().duration(100).style("opacity", "0");
        d3.select("#up").transition().duration(100).style("opacity", "0");
    } else {
        d3.select("#down").transition().duration(100).style("opacity", "0");
        d3.select("#up").transition().duration(100).style("opacity", "0.3");
    }
});


d3.select("#down").on("click", function() {
    d3.transition()
        .duration(400)
        .ease(d3.easeSin)
        .tween("scroll", scrollTween(window.innerHeight + 100));
})


d3.select("#up").on("click", function() {
    d3.transition()
        .duration(400)
        .ease(d3.easeSin)
        .tween("scroll", scrollTween(0));
})



//SCROLL

function scrollTween(offset) {
    return function() {
        var i = d3.interpolateNumber(window.pageYOffset || document.documentElement.scrollTop, offset);
        return function(t) { scrollTo(0, i(t)); };
    };
}