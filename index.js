var PNGIO = require('png-io');
var clamp = require('clamp');

var cameraNames = ['PX', 'NX', 'PY', 'NY', 'PZ', 'NZ'];

function exportTexture(renderer, texture, filename, callback) {
	var width = texture.width;
	var height = texture.height;

	// Create canvas append to document body
	var canvas = document.createElement('canvas');
	canvas.id     = 'canvas';
	canvas.width  = width;
	canvas.height = height;
	canvas.style.zIndex   = 8;
	canvas.style.position = 'absolute';

	document.body.appendChild(canvas);

	var context2D = canvas.getContext('2d');
	var context3D = renderer.getContext();
	var target = new THREE.WebGLRenderTarget(width, height);

	var scene = new THREE.Scene();
	var camera = new THREE.OrthographicCamera(-width * 0.5, width * 0.5, -height * 0.5, height * 0.5, -100, 100);
	scene.add(camera);
	var quad = new THREE.Mesh(
		new THREE.PlaneGeometry(width, height, 1, 1), 
		new THREE.MeshBasicMaterial({
			map: texture,
			side: THREE.DoubleSide
		})
	);
	scene.add(quad);
	renderer.render(scene, camera, target);

	// Create a data string
	var data = new Uint8Array(width * height * 4);
	context3D.readPixels(0, 0, width, height, context3D.RGBA, context3D.UNSIGNED_BYTE, data);

	var imageData = context2D.createImageData(width, height);
	imageData.data.set(data);

	context2D.putImageData(imageData, 0, 0);

	var pngUrl = canvas.toDataURL('image/jpeg'); // PNG is the default

	var startIndex = pngUrl.indexOf(',') + 1;
	var pngDataRaw = pngUrl.substring(startIndex);

	var pngio = new PNGIO(filename);
	pngio.save(pngDataRaw, function() {
		console.log('success');
		callback();
	}, 
	function() {
		console.log('failure');
		callback();
	});

}

module.exports = exportTexture;
