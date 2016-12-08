var gl;

var tx;
var ty;
var tz;

var sx;
var sy;
var sz;

var rz;
var rx;
var ry;

var mProjection;
var mModelView;
var mNormals;

var mModelViewLoc;
var mProjLoc;
var mNormalsLoc;
var transl;
var saved;
var program;

var dFunction;
var counter;

var autoRotateX;
var autoRotateY;
var autoRotateZ;
var stepsX;
var stepsY;
var stepsZ;
var myAudio;
var type;
var l;
var alfa;
var c_h;
var c_w;
var xRot = yRot = zRot =  xOffs = yOffs =  drag = 0;


window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl) { alert("WebGL isn't available"); }
     
    l = 1.0;
    alpha = 45;
        tx = 0.0;
        ty = 0.0;
        tz= 0.0;
        sx = 2.0;
        sy = 2.0;
        sz = 2.0;
        rz = 0.0;
        rx = 0.0;
        ry = 0.0;
        stepsX = 0;
        stepsY = 0;
        stepsZ = 0;
        counter = 0;
        transl = -3;
        type = true;
       dFunction = torusDrawWireFrame;
	
   	myAudio = new Audio('evangelion.mp3'); 
	myAudio.addEventListener('ended', function() {
    	this.currentTime = 0;
   	 this.play();
	}, false);
	myAudio.play();
	
    mModelView = obl(l, alpha);
    mProjection = ortho(-2,2,-2,2,10,-10);
	mNormals = transpose(inverse(mModelView));

    
    saved = [];
   var c_w = window.innerWidth - 50,  c_h = window.innerHeight - 10;
   c_w  = c_h;  x10 = c_w/10;
   canvas.width = c_w;   canvas.height = c_h;
   gl.viewport(0, 0, c_w, c_h);
    // Configure WebGL
   
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    
    // Load shaders and initialize attribute buffers
    program = initShaders(gl, "vertex-shader", "fragment-shader");

    gl.useProgram(program);
    
    gl.enable(gl.DEPTH_TEST);
  
    sphereInit(gl);
    cubeInit(gl);
    torusInit(gl);
    pirInit(gl);
    
    mModelViewLoc = gl.getUniformLocation(program , "mModelView");
    mProjLoc = gl.getUniformLocation(program , "mProjection");
	mNormalsLoc = gl.getUniformLocation(program , "mNormals");

    // Slider
    document.getElementById("tx").oninput =
        function() {
        
        tx = event.srcElement.value;
        
        
    }
    // Slider
    document.getElementById("ty").oninput =
        function() {
        
        ty = event.srcElement.value;
         
    }
        // Slider
    document.getElementById("tz").oninput =
        function() {
        
        tz = event.srcElement.value;
         
    }
    
    function mymousedown( ev ){
  drag  = 1;
  xOffs = ev.clientX;  yOffs = ev.clientY;
}
function mymouseup( ev ){
  drag  = 0;
     yRot = 0;
     xRot = 0;
   
     
    
}
function mymousemove( ev ){
  if ( drag == 0 ) return;
    
    
yRot = - xOffs + ev.clientX;  xRot = - yOffs + ev.clientY; 
  xOffs = ev.clientX;   yOffs = ev.clientY;
}
    
function wheelHandler(ev) {
  var del = 1.1;
  var ds = ((ev.detail || ev.wheelDelta) > 0) ? del : (1 / del);
    transl *= ds;
  ev.preventDefault();
}
    

    document.getElementById("mambo").onchange= function() {
           option = parseInt(event.srcElement.value);
     switch(option) {
    case 1:
        if(type)
            dFunction = torusDrawWireFrame;
        else 
            dFunction = torusDrawFilled;
        break;
    case 2:
        if(type)
            dFunction = cubeDrawWireFrame;
        else 
            dFunction = cubeDrawFilled;
        break;
    case 3:
         if(type)
            dFunction = pirDrawWireFrame;
        else 
            dFunction = pirDrawFilled;
        break;
    case 4:
         if(type)
            dFunction = sphereDrawWireFrame;
        else 
            dFunction = sphereDrawFilled;
        break;
    default:
        dFunction = torusDrawWireFrame;
}
                                                         };
    
    document.getElementById("type").onclick = function() {
            type = !type;
           var bloop = parseInt(document.getElementById("mambo").value);
        
            switch(bloop) {
    case 1:
        if(type)
            dFunction = torusDrawWireFrame;
        else 
            dFunction = torusDrawFilled;
        break;
    case 2:
        if(type)
            dFunction = cubeDrawWireFrame;
        else 
            dFunction = cubeDrawFilled;
        break;
    case 3:
         if(type)
            dFunction = pirDrawWireFrame;
        else 
            dFunction = pirDrawFilled;
        break;
    case 4:
         if(type)
            dFunction = sphereDrawWireFrame;
        else 
            dFunction = sphereDrawFilled;
        break;
    default:
        dFunction = torusDrawWireFrame;
}
         
     
                                                         };
     window.onresize = function() {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        aspect = canvas.width / canvas.height;
        
        if(aspect > 1)
            mProjection = ortho(-aspect, aspect, -1, 1, 10, -10);
        else if(aspect < 1)
            mProjection = ortho(-1, 1, -1/aspect, 1/aspect, 10, -10);
    }
    
      document.getElementById("save").onclick = function() {
            saved[counter++] = [mModelView, dFunction];
           
         
     
                                                         };
    
    document.getElementById("reset").onclick = function() {
        tx = 0.0;
        ty = 0.0;
        tz= 0.0;
        sx = 2.0;
        sy = 2.0;
        sz = 2.0;
        rz = 0.0;
        rx = 0.0;
        ry = 0.0;
        type = true;
        dFunction = torusDrawWireFrame;
        
                                                         };
    document.getElementById("resetprog").onclick = function() {
        dict = [];
        counter = 0;
        
                                                         };
    
   canvas.addEventListener('mousedown', mymousedown, false);
   canvas.addEventListener('mouseup', mymouseup, false);
   canvas.addEventListener('mousemove', mymousemove, false);
     canvas.addEventListener('mousewheel', wheelHandler, false);
    

    render();
  
    
}

function draw(mModel){
     
        
    gl.uniformMatrix4fv(mModelViewLoc, 0 , flatten(mModel));
    gl.uniformMatrix4fv(mProjLoc, 0 , flatten(mProjection));
    
   

}
function obl(l, alpha) {
    var m = mat4();
    
    m[0][2] = -l*Math.cos(alpha*(Math.PI/180));
    m[1][2] = -l*Math.sin(alpha*(Math.PI/180));
    
    return m;
}

function render() {
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
   
    
    ry += yRot;
    rx += xRot;
     
    mModelView = mult(translate(tx,ty,tz), mult( rotateZ(rz), mult( rotateY(ry), rotateX(rx))));  
    mNormals = transpose(inverse(mModelView));
	
     yRot = 0;
     xRot = 0;
    draw(mModelView);
    dFunction(gl, program);
    
        var i;
      for(i = 0; i < counter; i++){
        var tmp =  saved[i];
            draw(tmp[0]);
          var func =  tmp[1];
            func(gl, program);
          
        }
   
    window.requestAnimFrame(render);


}
