

let VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    varying vec4 v_Color;
    void main(){
        gl_Position = a_Position;
        v_Color = a_Color;
    }`;



let FSHADER_SOURCE = `
    precision mediump float;
    varying vec4 v_Color;
    void main(){
        gl_FragColor = v_Color;
    }`;

function main() {

    //henter html canvas objectet ved getElementById
    let canvas = document.getElementById('webgl');

    //utgjør rendering av context for WebGL, bruker dettet til å kjøre/referer til OpenGL funksjoner/metoder og attributer
    let gl = canvas.getContext('webgl');
    if(!gl){
        console.group('Fikk ikke tak i rendering context for WebGL');
        return;
    }

    //initialiserer shadere:
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)){
        console.log('Feil ved initialisering av shaderkoden.');
        return;
    }

    //initialisere verteksbuffer, aktiverer innholdet i buffer funksjonen initVertexBuffers, funksjonen returnere også antallet av vertekser:
    let noVertexes = initVertexBuffers(gl);

    //rensker skjermen:
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    //Tegner trekanter:
    gl.drawArrays(gl.TRIANGLES, 0, 24);
    gl.drawArrays(gl.LINES, 24, noVertexes);

}

function initVertexBuffers(gl){
    //x antall vertekser, hver har 3 vektor felt, alle floats:
    let vertices = new Float32Array([

        //Big triangle point right, body
        0.4, 0.6, 0,
        0.4, -0.6, 0,
        1, 0, 0,
        //long triangle point left, body
        0.4, 0.3, 0,
        0.4, -0.3, 0,
        -0.7, 0, 0,
        //long triangle point right, top body
        -0.9, 0.3, 0,
        0.4, 0.3, 0,
        -0.7, 0, 0,
        //long triangle point right, bottom body
        -0.9, -0.3, 0,
        0.4, -0.3, 0,
        -0.7, 0, 0,

        //top triangle
        0.05,0.95,0,
        -0.05,0.95,0,
        0,1,0,
        //bottom trinagle
        0.05,-0.95,0,
        -0.05,-0.95,0,
        0,-1,0,
        //left trinagle
        0.95,0.05,0,
        0.95,-0.05,0,
        1,0,0,
        //Right triantle
        -0.95,0.05,0,
        -0.95,-0.05, 0,
        -1, 0, 0,
        //vertical line
        0,1,0,
        0,-1,0,
        //horizontal line
        1,0,0,
        -1,0,0





    ]);

    let colors = new Float32Array([

        //triangle big body right
        0,0,0.5,0.5,
        0,0,0.5,0.5,
        0,0,0.5,0.5,
        //triangle right
        0,0,0.5,0.5,
        0,0,0.5,0.5,
        0,0,0.5,0.5,
        //triangle right
        0,0,0.5,0.5,
        0,0,0.5,0.5,
        0,0,0.5,0.5,
        //triangle right
        0,0,0.5,0.5,
        0,0,0.5,0.5,
        0,0,0.5,0.5,
        //triangle top
        0,1,0,1,
        0,1,0,1,
        0,1,0,1,
        //triangle bottom
        0,1,0,1,
        0,1,0,1,
        0,1,0,1,
        //trinagle right
        1,0,0,1,
        1,0,0,1,
        1,0,0,1,
        //triangle left
        1,0,0,1,
        1,0,0,1,
        1,0,0,1,
        //vline
        0,1,0,1,
        0,1,0,1,
        //hline
        1,0,0,1,
        1,0,0,1      
    ]);

    let noVertexes = vertices.length / 3; // Antall vertekser, hver verteks består av 3 floats

    //Opprette bufferobjekt:
    let positionBuffer = gl.createBuffer();
    if(!positionBuffer){
        console.log('Fikk ikke laget et bufferobjekt!?');

        return -1;
    }

    //Binder bufferobjektet:
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Skriver til bufferobjektet:
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    //Finner posisjonen til a_Position i shaderen:
    let posAttrib = gl.getAttribLocation(gl.program, 'a_Position');
    if(posAttrib<0){
        console.log('Fant ikke parameteret a_Position i shaderen!?');
        return -1;
    }

    //Koble verteksattributtet til bufferobjektet:
    let floatsPerVertex = 3;
    gl.vertexAttribPointer(posAttrib, floatsPerVertex, gl.FLOAT, false, 0, 0);

    //enable verteksshaderattributtpekeren:
    gl.enableVertexAttribArray(posAttrib);

    //Oppretter farge bufferobjekt:
    let colorBuffer = gl.createBuffer();
    if(!colorBuffer){
        console.log('Fikk ikke laget et fargebufferobjekt!');
        return -1;
    }

	//binder farge bufferobjektet:
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

	//skriver til bufferobjektet
	gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

	//Finer posisjonen til a_color i shaderen:
	let colAttrib = gl.getAttribLocation(gl.program, 'a_Color');
	if(colAttrib < 0){
		console.log('Fant ikke parameteret a_Color i shaderen!');
		return -1;
	}

	//kobler fargeattributtett til bufferobjektet:
	let floatsPerColor = 4;
	gl.vertexAttribPointer(colAttrib, floatsPerColor, gl.FLOAT, false, 0, 0);

	//enable fargeshaderattributtpekeren:
	gl.enableVertexAttribArray(colAttrib);

	// Kopler fra bufferobjektet:
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	return noVertexes;

}