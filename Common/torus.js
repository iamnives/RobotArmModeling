
var torus_matrix = [];

var torus_normals = [];
var torus_points = [];
var torus_faces = [];
var torus_edges = [];

var torus_points_buffer;
var torus_normals_buffer;
var torus_faces_buffer;
var torus_edges_buffer;

var ALPHA_STEP = 50;
var THETA_STEP = 50;


function torusInit(gl) {
    torusBuild();
    torusUploadData(gl);
}

function torusBuild() {
  
    
    //step
    var d_alpha = (2*Math.PI) / ALPHA_STEP;
    var d_theta = (2*Math.PI) / THETA_STEP;
    
    var r = 0.4;
    var sectionradius = 0.2;
    var i = 0;
    var j = 0;
    var f1;
    var f2;
    
    // Generate torus points
    for(var alpha=0; alpha < 2*Math.PI ;alpha+=d_alpha, i++) {
        for(var theta=0; theta < 2*Math.PI;theta+=d_theta, j++) {
            
            
            var pt = vec3(Math.cos(alpha)*(Math.cos(theta)*sectionradius+r), 
                          Math.sin(alpha)*(Math.cos(theta)*sectionradius+r), 
                          Math.sin(theta)*sectionradius);
            
            var pointX = j+1;
            var pointY = i+1;
            
            //faces
            torus_faces.push(i*THETA_STEP+j);
            
            if(pointX >= THETA_STEP)
                pointX = 0;
            
            if(pointY >= ALPHA_STEP)
                pointY = 0;
            
            f1 = i*THETA_STEP+pointX;
            f2 = pointY*THETA_STEP+j;
            
            torus_faces.push(f1);
            torus_faces.push(f2);
            
            torus_faces.push(pointY*THETA_STEP+pointX);
            torus_faces.push(f1);
            torus_faces.push(f2);
            
            //edges
            torus_edges.push(i*THETA_STEP+j);
            torus_edges.push(f1);
            torus_edges.push(i*THETA_STEP+j);
            torus_edges.push(f2);
            
            torus_points.push(pt);
            //calc normals
            //tangent of the big circle 
            var v1 = vec3(-Math.sin(alpha),
                          Math.cos(alpha),
                          0);
            //tangent of the small circle
            var v2 = vec3((Math.cos(alpha)*(-Math.sin(theta)))
                          , Math.sin(alpha)*(-Math.sin(theta))
                          ,Math.cos(theta));
           
            var n = cross(v1,v2);
            
            
            torus_normals.push(normalize(n));
        }
        j = 0;
    } 

}


function torusUploadData(gl) {
    torus_points_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, torus_points_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(torus_points), gl.STATIC_DRAW);
    
    torus_normals_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, torus_normals_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(torus_normals), gl.STATIC_DRAW);
    
    torus_faces_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, torus_faces_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(torus_faces), gl.STATIC_DRAW);
    
    torus_edges_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, torus_edges_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(torus_edges), gl.STATIC_DRAW); 
}

function torusDrawWireFrame(gl, program) {    
    gl.useProgram(program);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, torus_points_buffer);
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, torus_normals_buffer);
    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, torus_edges_buffer);
    gl.drawElements(gl.LINES, torus_edges.length, gl.UNSIGNED_SHORT, 0);
}

function torusDrawFilled(gl, program) {    
    gl.useProgram(program);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, torus_points_buffer);
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, torus_normals_buffer);
    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, torus_faces_buffer);
    gl.drawElements(gl.TRIANGLES, torus_faces.length, gl.UNSIGNED_SHORT, 0);   
}
