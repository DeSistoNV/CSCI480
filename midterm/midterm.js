console.clear();
var gl;
var vPosition, vColor;
var x_theta, y_theta, z_theta, s, cm;
var V2 = [];
var surface = [];
var surface2 = [];
var color = [];
var spin_x;
var spin_y;
var spin_z;
smooth_steps = 300; // controls speed of movement
var step_count = smooth_steps; // controller for movement iteration
// iniitalizing movement step arrays
var x_click = new Array(smooth_steps);
for (var i = 0; i <= smooth_steps; i++) x_click[i] = 0;
var y_click = new Array(smooth_steps);
for (var i = 0; i <= smooth_steps;i++) y_click[i] = 0;
var randoms = [];
n_cubes = 1;

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

function make_cube_uniforms(begin,end){
  for (var j = begin;j<end;j++){
    a = -30;
    b = 30;
  randoms[j][0] = randomRange(a,b);
  randoms[j][1] = randomRange(a,b);
  randoms[j][2] = randomRange(a,b);
  randoms[j][3] = randomRange(a,b);

}
console.log('unforms created');
}
function set_n_cubes(s_val) {
    old = n_cubes;
    n_cubes = s_val;
    make_cube_uniforms(old,n_cubes);
    $('#n_cubes_txt').text("number of cubes = " + n_cubes);



}


function graphics() { // this runs when the index is loaded
    $("#n_cubes").on("input", function(){set_n_cubes(this.value);});
    $('#n_cubes_txt').text("number of cubes = " + n_cubes);

    for (var i = 0;i <100000;i++){
      randoms[i] = new Array(4);
    }
    make_cube_uniforms(0,1);
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
    x_theta = gl.getUniformLocation( program, "xang" );
    y_theta = gl.getUniformLocation( program, "yang" );
    z_theta = gl.getUniformLocation( program, "zang" );
    s = gl.getUniformLocation( program, "s" );
    cm = gl.getUniformLocation( program, "cm" );
    var eyePosition = vec4( 1.0, 0.0, 1.0, 0.0 );
    // surface mesh array creation
    // for(var r = 0;r < 10;r++) makeSurface();
    makeSurface();
    makeSurface2();
    // color array
    makeColors();
    makeColors();
    // send it to gpu
    bufferData();
    gl.uniform4fv( gl.getUniformLocation( program, "eyePosition" ), flatten(eyePosition) );
    // scale to 0.1
    gl.uniform1f( s, 0.02 );
    // set center
    gl.uniform4f( cm, 0.0, 0.0, 0.0, 0.0);

    console.log("color: " + color.length);
    console.log("faces: " + F.length);
    console.log("vertices:" + V.length);
    console.log("surface: " + surface.length);
    spin_x = Math.random() * 100;
    spin_y = Math.random() * 100;
    spin_z = Math.random() * 1090;
    spin_step = 1;
    // console.log(surface.length);
    // console.log(color.length);

    animate();

}

function animate() {

    timerID=setInterval( render,10);

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
    var move = Math.random() * 5;
    for ( var i=0; i<F.length; i++ ) {

        var v1 = V[ F[i][0] ];
        var v2 = V[ F[i][1] ];
        var v3 = V[ F[i][2] ];

        for ( var j=0; j<v1.length; j++ ) surface.push( v1[j]  );
        for ( j=0; j<v2.length; j++ ) surface.push( v2[j] );
        for ( j=0; j<v3.length; j++ ) surface.push( v3[j]);

    }

}

function makeSurface2() {
    var move = Math.random() * 5;
    for ( var i=0; i<F.length; i++ ) {

        var v1 = V[ F[i][0]] ;
        var v2 = V[ F[i][1]];
        var v3 = V[ F[i][2]];

        for ( var j=0; j<v1.length;j++)surface2.push(v1[j]+move);
        for ( j=0; j<v2.length; j++ ) surface2.push( v2[j]+move );
        for ( j=0; j<v3.length; j++ ) surface2.push( v3[j]+move);

    }

}
// function second_cube(){
//   for(var i=0;i<V.length;i++){
//     V2[i] = new Array();
//
//     V2[i][0] = V[i][0] - 0.05;
//     V2[i][1] = V[i][1] - 0.05;
//     V2[i][2] = V[i][2] - 0.05;
//
//     // console.log(V[i]);
//     // console.log(V2[i]);
//   }
//
// }
// function makeSurface2() {
//
//
//     for ( var i=0; i<F.length; i++ ) {
//
//         var v1 = V2[ F[i][0] ];
//         var v2 = V2[ F[i][1] ];
//         var v3 = V2[ F[i][2] ];
//
//         for ( var j=0; j<v1.length; j++ ) surface.push( v1[j] );
//         for ( var j=0; j<v2.length; j++ ) surface.push( v2[j] );
//         for ( var j=0; j<v3.length; j++ ) surface.push( v3[j] );
//
//     }
//
// }
function makeColors() {
        for(var i = 0;i < 12;i++){
          color[i]= vec4(1.0, 0.0, 0.0, 1.0);
          color[i+12]= vec4(0.0, 1.0, 0.0, 1.0);
          color[i+24]= vec4(0.0, 0.0, 1.0, 1.0);

        }
        // for(var i = 24;i < 48;i++){
        //   color[i]= vec4(1.0, 0.0, 0.0, 1.0);
        //   color[i+12]= vec4(1.0, 1.0, 0.0, 1.0);
        //   color[i+24]= vec4(0.0, 0.0, 1.0, 1.0);
        // }
}

function bufferData() {

    var bufferId = gl.createBuffer();
    var bufferId2 = gl.createBuffer();

    var colorId = gl.createBuffer();

    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(surface), gl.STATIC_DRAW );

    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId2 );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(surface2), gl.STATIC_DRAW );



    gl.bindBuffer(gl.ARRAY_BUFFER, colorId);
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( vColor );

    gl.bufferData( gl.ARRAY_BUFFER, flatten(color), gl.STATIC_DRAW );
    /////////




}


var scaler = 0;

function render() {
for (var j = 0;j<n_cubes;j++){


  gl.uniform4f(cm,randoms[j][1],randoms[j][2],randoms[j][3],randoms[j][4]);
  if(scaler == 100){
    // gl.uniform1f(s,randomRange(0.01,.1));
    scaler = 0;

  }
    for ( var i=0; i<F.length*3; i+=3){

      // console.log("F.length: " + F.length);
      gl.drawArrays( gl.TRIANGLES, i, 3 ); // gl.LINE_STRIP was here...
      // gl.drawArrays( gl.TRIANGLES, i, 3 ); // gl.LINE_STRIP was here...
    }
}    scaler++;

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


function randomRange(min,max) {
    return Math.random() * (max-min) + min;
}
