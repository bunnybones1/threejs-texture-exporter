/// <reference path="typings/three/three.d.ts"/>

THREE = require('three');

var View = require('threejs-managed-view').View;
var CheckerRoom = require('threejs-checkerroom');

var checkerRoom = new CheckerRoom();
var exportTexture = require('./');  

var view = new View({	
	useRafPolyfill: false,
	rendererSettings: { preserveDrawingBuffer: true }
});

view.scene.add(new THREE.AmbientLight());
view.scene.add(checkerRoom);

setTimeout(function() {
	var texture = new THREE.WebGLRenderTarget(view.domSize.x, view.domSize.y);
	view.renderer.render(view.scene, view.camera, texture);

	var quad = new THREE.Mesh(
		new THREE.PlaneGeometry(2, 2, 1, 1),
		new THREE.MeshBasicMaterial({
			map: texture,
			side: THREE.DoubleSide
		})
	);
	quad.position.y += 2;
	view.scene.add(quad);
	var filename = 'file.jpg';

	exportTexture(view.renderer, texture, filename, 
		function() {
			console.log('done');
		}
	);

}, 1000);