// Vertex shader program.
// Her er point-size fjernet, kun aktuell n�r man tegner punkter.

// NB! Legg merke til bruk av spesialenkeltapostrof (alt+�)
let VSHADER_SOURCE = `
	attribute vec4 a_Position;
	attribute vec4 a_Color;
	varying vec4 v_Color;
	void main() {
	  gl_Position = a_Position;
	  v_Color = a_Color;
	}`;

// Fragment shader program
// Bruker prefiks u_ for � indikere uniform
let FSHADER_SOURCE = ` 
   precision mediump float;
   varying vec4 v_Color;    
   void main() {
	   gl_FragColor = v_Color;
   }`;

function main() {
	// Hent <canvas> elementet
	let canvas = document.getElementById('webgl');
	// Rendering context for WebGL, brukes til � kj�re/referere OpenGL-funksjoner/metoder og attributter:
	let gl = canvas.getContext('webgl');
	if (!gl) {
		console.log('Fikk ikke tak i rendering context for WebGL');
		return;
	}
	// Initialiser shadere:
	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
		console.log('Feil ved initialisering av shaderkoden.');
		return;
	}

	//Initialiserer verteksbuffer:
	let noVertexes = initVertexBuffers(gl);

	//Kopler til fargeattributt:
	//let u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
	//if (u_FragColor < 0) {
	//	console.log('Fant ikke uniform-parametret u_FragColor i shaderen!?');
	//	return;
	//}
	//let rgba = [0.9, 0.9, 0.0, 1.0];
    //Sender inn fargeverdi:
	//gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    //Rensker skjermen:
	gl.clearColor(0.0, 0.7, 0.4, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Tegner trekanter:
	gl.drawArrays(gl.TRIANGLES, 0, noVertexes);
}

function initVertexBuffers(gl) {
	  //3 stk 2D vertekser:
	let vertices = new Float32Array([
		0.0, -0.5, 0,
		-0.5, -0.9, 0,
		0.5, -0.5, 0,
		-0.4, 0.6, 0,
		-0.1, -0.2, 0,
		0.5, -0.3, 0,
        -0.9, 0.2, 0,
        -0.9, 0.5, 0,
        -0.5, 0.5, 0
	]);

	let colors = new Float32Array([
		0.1, 0.9, 0.3, 1.0,
		0.9, 0.1, 0.3, 1.0,
		0.9, 0.1, 0.9, 1.0,
		0.9, 0.1, 0.9, 1.0,
		0.9, 0.8, 0.9, 1.0,
		0.9, 0.1, 0.1, 1.0,
		0.9, 0.9, 0.1, 1.0,
		0.9, 0.1, 0.2, 1.0,
		0.9, 0.1, 0.1, 1.0
	]);

	let noVertexes = vertices.length / 3; // Antall vertekser, hver verteks best�r av 3 floats.

	// Oppretter et bufferobjekt:
	let positionBuffer = gl.createBuffer();
	if (!positionBuffer) {
		console.log('Fikk ikke laget et bufferobjekt!?');
		return -1;
	}

	// Binder bufferobjektet:
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	// Skriver til bufferobjektet:
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	// Finner posisjonen til a_Position i shaderen:
	let posAttrib = gl.getAttribLocation(gl.program, 'a_Position');
	if (posAttrib < 0) {
	console.log('Fant ikke parametret a_Position i shaderen!?');
	return -1;
	}

	// Kople verteksattributtett til bufferobjektet:
	let floatsPerVertex = 3;
	gl.vertexAttribPointer(posAttrib, floatsPerVertex, gl.FLOAT, false, 0, 0);
	
	// Enabler verteksshaderattributtpekeren:
	gl.enableVertexAttribArray(posAttrib);
	
	//Oppretter farge bufferobjekt:
	let colorBuffer = gl.createBuffer();
	if (!colorBuffer) {
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

