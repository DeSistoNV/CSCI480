console.clear();


var gl;
var vPosition,vColor;
var xang, yang, zang, sx, cm;

var mesh = new Array();
color = new Array();
// var color = new Array();

function config() {
    $("#rotx").on("input", function(){rotateX(this.value)});
    $("#roty").on("input", function(){rotateY(this.value)});
    $("#rotz").on("input", function(){rotateZ(this.value)});
    $("#scale").on("input", function(){scale(this.value)});

    // document.getElementById('rotx').onmouseup = function(event) { rotateX(); }

    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor(0.5273,0.8046875, 0.8984375, 1);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // hidden surface remove pg 92
    gl.enable(gl.DEPTH_TEST);
    gl.clearDepth( 1.0 );
    gl.depthFunc( gl.LEQUAL );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    vPosition = gl.getAttribLocation( program, "vPosition" );
    vColor = gl.getAttribLocation( program, "vColor" );

    xang = gl.getUniformLocation( program, "xang" );
    yang = gl.getUniformLocation( program, "yang" );
    zang = gl.getUniformLocation( program, "zang" );
    sx = gl.getUniformLocation( program, "scale" );
    cm = gl.getUniformLocation( program, "cm" );

    console.log( V.length );
    console.log( F.length );
    console.log(C.length);
    makeColors();
    createMesh();
    bufferData();
    gl.uniform1f( sx, 1 );
    gl.uniform4f( cm, CM[0], CM[1], CM[2], 0.0);
    render();

}

function rotateX(ang_deg) {

    var select = document.getElementById('rotx');
    var ang_deg = select.value;

    var radian =  ang_deg * (Math.PI/180.0);


    gl.uniform1f( xang, radian );

    render();

}


function rotateY(ang_deg) {


    var radian =  ang_deg * (Math.PI/180.0);


    gl.uniform1f( yang, radian );

    render();

}

function rotateZ(ang_deg) {

    var radian =  ang_deg * (Math.PI/180.0);


    gl.uniform1f( zang, radian );

    render();

}

function scale(s_val) {



    gl.uniform1f( sx, s_val );

    render();

}

function makeColors() {
        for(var i = 0;i < C.length;i++){
          color.push(vec4(C));

}
}


function createMesh() {

    for ( var i=0; i<F.length; i++ ) {

        var v1 = V[ F[i][0] ];
        var v2 = V[ F[i][1] ];
        var v3 = V[ F[i][2] ];

        for ( var j=0; j<v1.length; j++ ) mesh.push( v1[j] );
        for ( var j=0; j<v2.length; j++ ) mesh.push( v2[j] );
        for ( var j=0; j<v3.length; j++ ) mesh.push( v3[j] );

    }

}

function bufferData() {

    var bufferId = gl.createBuffer();
    var colorId = gl.createBuffer();


    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    gl.bufferData( gl.ARRAY_BUFFER, flatten(mesh), gl.STATIC_DRAW );

    gl.bindBuffer(gl.ARRAY_BUFFER, colorId);
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( vColor );

    gl.bufferData( gl.ARRAY_BUFFER, flatten(C), gl.STATIC_DRAW );
}

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for ( var i=0; i<F.length*3; i+=3) {

      gl.drawArrays( gl.TRIANGLES, i, 3 );
}}
