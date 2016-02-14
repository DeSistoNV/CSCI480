console.clear();
var gl;
var vPosition, vColor;
var x_theta, y_theta, z_theta, s, cm;
var V2 = new Array();
var surface = new Array();
var surface2 = new Array();
var color = new Array();
var spin_x;
var spin_y;
var spin_z;
const smooth_steps = 300; // controls speed of movement
var step_count = smooth_steps; // controller for movement iteration
// iniitalizing movement step arrays
var x_click = new Array(smooth_steps);
for (var i = 0; i <= smooth_steps; i++) x_click[i] = 0;
var y_click = new Array(smooth_steps);
for (var i = 0; i <= smooth_steps;i++) y_click[i] = 0;

function moveToClick(e){
  console.log("clicked!");
  orig_x = x_click[smooth_steps];
  orig_y = y_click[smooth_steps];
  new_x = -1 + 2 * e.clientX / 512;
  new_y =  -1 + 2 * (512-e.clientY) / 512;
  dist_x = new_x - orig_x;
  dist_y = new_y - orig_y;
  for(var i=0;i <= smooth_steps;i++){
    // formulas from pg 122
    x_click[i] = orig_x + dist_x * i / smooth_steps;
    y_click[i] = orig_y + dist_y * i / smooth_steps;
  }
  step_count = 0;

}

function graphics() { // this runs when the index is loaded


    // set canvas element to js variable
    canvas = document.getElementById( "gl-canvas" );

    canvas.onclick=function(event){
        moveToClick(event);

    };

    // web-gl boilerplate
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    gl.viewport( 0, 0, canvas.width, canvas.height );

    // hidden surface remove pg 92
    gl.enable(gl.DEPTH_TEST);
    gl.clearDepth( 1.0 );
    gl.depthFunc( gl.LEQUAL );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );


    // getting the stuff defined in the html, i think
    vPosition = gl.getAttribLocation( program, "vPosition" );
    vColor = gl.getAttribLocation( program, "vColor" );
    x_theta = gl.getUniformLocation( program, "x_theta" );
    y_theta = gl.getUniformLocation( program, "y_theta" );
    z_theta = gl.getUniformLocation( program, "z_theta" );
    s = gl.getUniformLocation( program, "s" );
    cm = gl.getUniformLocation( program, "cm" );

    // surface mesh array creation
    makeSurface();

    second_cube();
    makeSurface2();
    // color array
    makeColors();
    // send it to gpu
    bufferData();

    // scale to 0.1
    gl.uniform1f( s, 0.1 );
    // set center
    gl.uniform4f( cm, 0.0, 0.0, 0.0, 0.0);

    console.log(color.length);
    console.log(F.length);
    console.log(V.length);
    spin_x = Math.random() * 100;
    spin_y = Math.random() * 100;
    spin_z = Math.random() * 1090;
    spin_step = 1;
    // console.log(surface.length);
    // console.log(color.length);

    animate();

}

function animate() {

    timerID=setInterval( render,1);

}




function rotateX() {

    var spin_degree = spin_x % 360 * (Math.PI / 180.0);

    gl.uniform1f( x_theta, spin_degree );

    spin_x += Math.random();


}


function rotateY() {

  var spin_degree = spin_y % 360* (Math.PI / 180.0);


  gl.uniform1f( y_theta, spin_degree );

  spin_y += Math.random();



}


function rotateZ() {

  var spin_degree = spin_z % 360 * (Math.PI / 180.0);


  gl.uniform1f( z_theta, spin_degree );

  spin_z += Math.random();



}

function move_cube(x,y){

  gl.uniform1f( z_theta, spin_degree );

}

function makeSurface() {

    for ( var i=0; i<F.length; i++ ) {

        var v1 = V[ F[i][0] ];
        var v2 = V[ F[i][1] ];
        var v3 = V[ F[i][2] ];

        for ( var j=0; j<v1.length; j++ ) surface.push( v1[j] );
        for ( var j=0; j<v2.length; j++ ) surface.push( v2[j] );
        for ( var j=0; j<v3.length; j++ ) surface.push( v3[j] );

    }

}
function second_cube(){
  for(var i=0;i<V.length;i++){
    V2[i] = new Array();

    V2[i][0] = V[i][0] - 0.05;
    V2[i][1] = V[i][1] - 0.05;
    V2[i][2] = V[i][2] - 0.05;

    // console.log(V[i]);
    // console.log(V2[i]);
  }

}
function makeSurface2() {


    for ( var i=0; i<F.length; i++ ) {

        var v1 = V2[ F[i][0] ];
        var v2 = V2[ F[i][1] ];
        var v3 = V2[ F[i][2] ];

        for ( var j=0; j<v1.length; j++ ) surface.push( v1[j] );
        for ( var j=0; j<v2.length; j++ ) surface.push( v2[j] );
        for ( var j=0; j<v3.length; j++ ) surface.push( v3[j] );

    }

}
function makeColors() {
        for(var i = 0;i < 12;i++){
          color[i]= vec4(1.0, 0.0, 0.0, 1.0);
          color[i+12]= vec4(1.0, 1.0, 0.0, 1.0);
          color[i+24]= vec4(0.0, 0.0, 1.0, 1.0);
        }

}

function bufferData() {

    var bufferId = gl.createBuffer();
    var bufferId2 = gl.createBuffer();

    var colorId = gl.createBuffer();
    var faceId = gl.createBuffer();

    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    gl.bufferData( gl.ARRAY_BUFFER, flatten(surface), gl.STATIC_DRAW );

    gl.bindBuffer(gl.ARRAY_BUFFER, colorId);
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( vColor );

    gl.bufferData( gl.ARRAY_BUFFER, flatten(color), gl.STATIC_DRAW );
    /////////




}

function render() {
    for ( var i=0; i<F.length*3; i+=3){
      gl.drawArrays( gl.TRIANGLES, i, 3 ); // gl.LINE_STRIP was here...
      gl.drawArrays( gl.TRIANGLES, i, 3 ); // gl.LINE_STRIP was here...

    }

    rotateX();
    rotateY();
    rotateZ();
    if (step_count++ < smooth_steps){
      gl.uniform4f( cm, x_click[step_count], y_click[step_count], 0.0, 0.0 );
    }
    else{
    gl.uniform4f( cm, x_click[smooth_steps], y_click[smooth_steps], 0.0, 0.0 );
  }

  // gl.uniform4f( cm, 0,0, 0.0, 0.0 );


}
