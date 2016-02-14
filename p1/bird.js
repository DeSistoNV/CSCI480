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

    [.6,0.4,1.1,0.4,.85,.7],
    [0.85,0.39,1.1,0.39, (1.25 + 1.5) / 2 - .4,.2],
    [(1.25 + 1.5) / 2 - .4,.2,1.1,0.39,1.2,.2],
    [(1.25 + 1.5) /2 -.4 ,.2,
    1.2,.2,
    1.1,.0],
    [(1.25 + 1.5) / 2-.4,.2,
    1.1,0,
    .9,0],
    [.9,0,1.5,0,1.25,-.2],
    [1.25,-.2,1.5,0,1.9,-.2],
    [1.4,-.2,1.33,-.5,1.5,-.4],
    [1.8,-.2,1.8,-.5,1.9,-.35]
    
    ] ;
    var color_list = [

    [255,0,0],
    [0,255,0],
    [0,0,255],
    [255,0,0],
    [0,255,0],
    [0,0,255],
    [255,0,0],
    [0,255,0],
    [0,0,255]

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
        xt = 1;
        var vertices = [
            vec2( N[i][0]* scale - xt ,N[i][1]* scale ),
            vec2( N[i][2]* scale -xt,N[i][3]* scale ),
            vec2( N[i][4]* scale -xt,N[i][5]* scale ) ];
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

