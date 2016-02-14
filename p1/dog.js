console.clear();

var gl;
var vPosition;
var vColor;
var theta;

var V;
var C;
var D;

var degree = 0;
function color_z(x){
return x / 256;

}
function config() {

    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" ); // IDS MUST BE SAME HERE
    gl.useProgram( program );

     // vars from shaders - names gotta be gud
    vPosition = gl.getAttribLocation( program, "vPosition" );
    vColor = gl.getAttribLocation( program, "vColor" );
    theta = gl.getUniformLocation( program, "theta" );
    var vert_list = [
    [-1,.1,-.7,-.1,-.7,.3], // head
    [-.7,-.1,-.7,-.8,.5,-.8], // body
    [.5,-.8,.5,-.1,0,-.5], // butt
    [.5,-.1,.6,0,.6,-.2], // tail butt
    [-.7,-.8,-.5,-.8,-.6,-1], // left leg
    [-.6,-1,-.725,-.975,-.625,-.925], // left foot
    [.5,-.8,.3,-.8,.4,-1], // right leg
    [.4,-1,.3,-.975,.37,-.925], // right foot


    ] ;
    var color_list = [
    [83,140,197], // head
    [255,255,255], // body
    [255,0,0], // butt
    [83,140,197], // tail butt
    [255,0,0], // left leg
    [255,255,255], // left foot
    [83,140,197], // right leg
		[255,0,0], // right foot



    ];


    createTriangleData(vert_list,color_list);

    bufferData();

  // animate();

}


function createTriangleData( N,col ) {

    C = new Array(); // center?
    V = new Array(); // vertex
    D = new Array(); // degree
    // need to loop this in func and set

    for ( var i=0; i<N.length; i++ ) {
        scale = 1;
        var vertices = [
            vec2( N[i][0]* scale,N[i][1]* scale ),
            vec2( N[i][2]* scale,N[i][3]* scale ),
            vec2( N[i][4]* scale,N[i][5]* scale ) ];
        var colors = [
            vec4(color_z(col[i][0]),color_z(col[i][1]) ,color_z(col[i][2]), 1.0), // (r,g,b,a)
            vec4(color_z(col[i][0]),color_z(col[i][1]) ,color_z(col[i][2]), 1.0),
            vec4(color_z(col[i][0]),color_z(col[i][1]) ,color_z(col[i][2]), 1.0) ];
      	//console.log(vertices);
        V[i] = flatten( vertices );
        C[i] = flatten( colors );
        D[i] = 0;

    }


}

function bufferData() {

    var bufferId = gl.createBuffer();
    var cbufferid = gl.createBuffer();

    for ( var i=0; i<V.length; i++ ) {

        gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
        gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vPosition );
        gl.bufferData( gl.ARRAY_BUFFER, V[i], gl.STATIC_DRAW );

        gl.bindBuffer(gl.ARRAY_BUFFER, cbufferid);
        gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray( vColor );
        gl.bufferData( gl.ARRAY_BUFFER, C[i], gl.STATIC_DRAW );

        radian = D[i] * (Math.PI/180.0);
        gl.uniform1f(theta, radian );
        D[i]+=(1*(i+1));

        if ( D[i] >= 360 ) D[i] -= 360;

        gl.drawArrays( gl.TRIANGLES, 0, 3 );

    }

}

function animate() {

    timerID=setInterval( bufferData, 15);

}


function randomRange(min,max) {
    return Math.random() * (max-min) + min;
}
