console.clear();


var gl;
var vPosition,vColor;
var xang, yang, zang, sx, cm;



var lightPosition = vec4(0.5, 0.5, 0.5, 1.0 );
var lightAmbient = vec4(0.5, 0.5, 0.5, 1.0 );
var lightDiffuse = vec4( 0.7, 0.7, 0.7, 1.0 );
var lightSpecular = vec4( .7, .7, .7, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
// var materialAmbient = vec4( .8, .8, .8, 1.0 );

var materialDiffuse = vec4( .5, .5, .5, 1.0 );
var materialSpecular = vec4(.5, .5, .5, 1.0 );
var materialShininess = 67.0;

var ambientColor, diffuseColor, specularColor;
var color, ambient, diffuse, specular;


var mesh = [];
var color = [];
var normals = [];
var color = new Array();
var xtransvar = 0.0;
var ytransvar = 0.0;
var ztransvar = 0.0;

function config() {
    $("#rotx").on("input", function(){rotateX();});
    $("#roty").on("input", function(){rotateY();});
    $("#rotz").on("input", function(){rotateZ();});
    $("#scale").on("input", function(){scale(this.value);});
    $("#xtrans").on("input", function(){xtrans(this.value);});
    $("#ytrans").on("input", function(){ytrans(this.value);});
    $("#ztrans").on("input", function(){ztrans(this.value);});
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor(0.52,0.80, 0.89, 1);

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
    vNormal = gl.getAttribLocation(program,"vNormal");
    // console.log(vColor);

    xang = gl.getUniformLocation( program, "xang" );
    yang = gl.getUniformLocation( program, "yang" );
    zang = gl.getUniformLocation( program, "zang" );
    sx = gl.getUniformLocation( program, "scale" );
    cm = gl.getUniformLocation( program, "cm" );


    ///////
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    ///////

    console.log( V.length );
    console.log( F.length );
    console.log(C.length);
    for ( var i=0; i<F.length; i++ ) {

        var v1 = V[ F[i][0] ];
        var v2 = V[ F[i][1] ];
        var v3 = V[ F[i][2] ];

        for ( var j=0; j<v1.length; j++ ) mesh.push( v1[j] );
        for ( var jj=0; jj<v2.length; jj++ ) mesh.push( v2[jj] );
        for ( var jjj=0; jjj<v3.length; jjj++ ) mesh.push( v3[jjj] );

        var t1 = subtract(v2, v1);
        var t2 = subtract(v3, v1);
        for(var nn=0;nn<3;nn++) normals.push(vec3(normalize(cross(t1,t2))));

    }
    for(var i = 0;i < C.length;i++){
      var p = mult(lightAmbient, vec4(C[i]));
      color.push(p);

    }
    bufferData();

    ///////
    gl.uniform1f( sx, 1 );
    gl.uniform4f( cm, CM[0], CM[1], CM[2], 0.0);

  /////
  // gl.uniform4fv( gl.getUniformLocation( program, "ambientProduct"), flatten(ambientProduct) );
  gl.uniform4fv( gl.getUniformLocation( program, "diffuseProduct"), flatten(diffuseProduct) );
  gl.uniform4fv( gl.getUniformLocation( program, "specularProduct"), flatten(specularProduct) );
  gl.uniform4fv( gl.getUniformLocation( program, "lightPosition" ), flatten(lightPosition) );
  gl.uniform1f( gl.getUniformLocation( program, "shininess" ),materialShininess );
  ///////



    render();

}

function rotateX() {

    var select = document.getElementById('rotx');
    ang_deg = select.value;

    var radian =  ang_deg * (Math.PI/180.0);


    gl.uniform1f( xang, radian );

    render();

}


function rotateY() {

  var select = document.getElementById('roty');
  ang_deg = select.value;
    var radian =  ang_deg * (Math.PI/180.0);


    gl.uniform1f( yang, radian );

    render();

}

function rotateZ() {
  var select = document.getElementById('rotz');
  ang_deg = select.value;
    var radian =  ang_deg * (Math.PI/180.0);


    gl.uniform1f( zang, radian );

    render();

}

function scale(s_val) {



    gl.uniform1f( sx, s_val );

    render();

}

function xtrans(s_val) {

    xtransvar = Number(s_val);

    gl.uniform4f(cm, CM[0] + xtransvar, CM[1] + ytransvar,CM[2] + ztransvar,0.0);

    render();

}
function ytrans(s_val) {

  ytransvar=Number(s_val);

gl.uniform4f(cm, CM[0]+xtransvar,CM[1] + ytransvar,CM[2] + ztransvar,0.0);

    render();

}
function ztrans(s_val) {

  ztransvar=Number(s_val);


  gl.uniform4f(cm, CM[0] + xtransvar,CM[1] + ytransvar,CM[2] + ztransvar,0.0);

    render();

}





function bufferData() {


    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);

    gl.bufferData( gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW );


    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    gl.bufferData( gl.ARRAY_BUFFER, flatten(mesh), gl.STATIC_DRAW );

    var colorId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorId);
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( vColor );

    gl.bufferData( gl.ARRAY_BUFFER, flatten(color), gl.STATIC_DRAW );
}

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for ( var i=0; i<F.length*3; i+=3) {

      gl.drawArrays( gl.TRIANGLES, i, 3 );
}}
