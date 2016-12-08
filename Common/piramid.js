var pir_vertices = [
    vec3(-0.5, -0.5, -0.5),     // 0
    vec3(+0.5, -0.5, -0.5),     // 1
    vec3(+0.5, +0.5, -0.5),     // 2
    vec3(-0.5, +0.5, -0.5),     // 3
                   
    vec3(0.0, 0.0, 1.0),     // 4

];

var pir_points = [];
var pir_normals = [];
var pir_faces = [];
var pir_edges = [];


var pir_points_buffer;
var pir_normals_buffer;
var pir_faces_buffer;
var pir_edges_buffer;

function pirInit(gl) {
    pirBuild();
    pirUploadData(gl);
}

function pirBuild()
{
    
   //TODO fix normal vec3s
     pirAddFace(4,0,1,vec3(0,-1.5,0.5));
     pirAddFace(4,1,2,vec3(1.5,0,0.5));
     pirAddFace(4,2,3,vec3(0,1.5,0.5));
     pirAddFace(4,3,0,vec3(-1.5,0,0.5));
    
     pirAdBotdFace(0,1,2,3,vec3(0,0,-1));
    
    
}

function pirUploadData(gl)
{
    pir_points_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pir_points_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pir_points), gl.STATIC_DRAW);
    
    pir_normals_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,  pir_normals_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pir_normals), gl.STATIC_DRAW);
    
    pir_faces_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pir_faces_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(pir_faces), gl.STATIC_DRAW);
    
    pir_edges_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pir_edges_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(pir_edges), gl.STATIC_DRAW);
}

function pirDrawWireFrame(gl, program)
{    
    gl.useProgram(program);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, pir_points_buffer);
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, pir_normals_buffer);
    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pir_edges_buffer);
    gl.drawElements(gl.LINES, pir_edges.length, gl.UNSIGNED_BYTE, 0);
}

function pirDrawFilled(gl, program)
{
    gl.useProgram(program);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, pir_points_buffer);
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, pir_normals_buffer);
    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pir_faces_buffer);
    gl.drawElements(gl.TRIANGLES, pir_faces.length, gl.UNSIGNED_BYTE, 0);
}

function pirAddFace(a, b, c, n)
{
    var offset = pir_points.length;
    
    pir_points.push(pir_vertices[a]);
    pir_points.push(pir_vertices[b]);
    pir_points.push(pir_vertices[c]);
    for(var i=0; i<3; i++)
        pir_normals.push(normalize(n));
    
    // Add triangular faces (a,b,c)
        pir_faces.push(offset);
        pir_faces.push(offset+1);
        pir_faces.push(offset+2);
    
    // Add first edge (a,b)
     pir_edges.push(offset);
     pir_edges.push(offset+1);
    
    // Add second edge (b,c)
     pir_edges.push(offset+1);
     pir_edges.push(offset+2);
}
function pirAdBotdFace(a, b, c, d, n)
{
    var offset = pir_points.length;
    
    pir_points.push(pir_vertices[a]);
    pir_points.push(pir_vertices[b]);
    pir_points.push(pir_vertices[c]);
    pir_points.push(pir_vertices[d]);
    for(var i=0; i<4; i++)
        pir_normals.push(n);
    
    // Add 2 triangular faces (a,b,c) and (a,c,d)
    pir_faces.push(offset);
    pir_faces.push(offset+1);
    pir_faces.push(offset+2);
    
    pir_faces.push(offset);
    pir_faces.push(offset+2);
    pir_faces.push(offset+3);
 
}

