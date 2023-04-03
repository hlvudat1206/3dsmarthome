	import * as THREE from './build/three.module.js';
	import { OrbitControls } from './js/OrbitControls.js';
    import { GLTFLoader } from './js/GLTFLoader.js';
    import { DRACOLoader } from './js/DRACOLoader.js';
    import { CSS2DRenderer, CSS2DObject } from './js/CSS2DRenderer.js';
	import { GUI } from './js/lil-gui.module.min.js';
    import { selectSwatch } from "./utils/materialHelper.js";
	import { texturesTuongAndColors, texturesTranAndColors, texturesSanAndColors } from "./constants/constants.js";
	import { RoomEnvironment } from './js/RoomEnvironment.js';


			var camera, scene, renderer;

			var raycaster, mouse;

			var loader;

			var helper, ngoinha;

			var controls;

			var rotation_speed = 0.005;;

			var textureOption = "";
			
			var textureOption_tran = "";
			
			var textureOption_san = "";

			var pickableObjects;

			//Đo kích thước
			var ctrlDown = false;

        	var lineId = 0;

        	var line;
        	
        	var dracoLoader;

        	var labelRenderer;

        	var drawingLine = false;

        	var measurementLabels = {};

			init();

			function init() {

				raycaster = new THREE.Raycaster();

				labelRenderer = new CSS2DRenderer();

				mouse = new THREE.Vector2();
				
				dracoLoader = new DRACOLoader();

				var container = document.getElementById( 'container' );

				camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.25, 10000 );

				scene = new THREE.Scene();


				//Ảnh nền model
				var path = './cube/';
				var format = '.jpg';
				var urls = [
					path + 'pano_r' + format, path + 'pano_l' + format,
					path + 'pano_u' + format, path + 'pano_d' + format,
					path + 'pano_f' + format, path + 'pano_b' + format
				];
		

				var reflectionCube = new THREE.CubeTextureLoader().load( urls );

				

				var onProgress = function ( xhr ) {
					if ( xhr.lengthComputable ) {
						var percentCompvare = xhr.loaded / xhr.total * 100;
						document.getElementById("progress").value =  Math.round( percentCompvare, 2 ) + '% Đang tải chờ chút nhé.';
					}
				};

				pickableObjects = new Array();
				

				loader = new GLTFLoader().setPath( 'models/' );
					dracoLoader.setDecoderPath("./");
					dracoLoader.setDecoderConfig({type: 'js'});
					loader.setDRACOLoader( dracoLoader );
					loader.load( 'Toanthenhapho.gltf', function ( gltf ) {

						ngoinha = gltf.scene;

            			ngoinha.traverse(function (child) {
            				if (child.isMesh) {
                				child.material.side = THREE.DoubleSide;
								child.material.clippingPlanes = [ localPlane ];
								child.material.localClippingEnabled = [ globalPlane ];
                			var m = child;
                			
                    		switch (m.name) {
                       			case "nha_pho_2":
								m.material.transparent  = true;
								m.material.opacity = 0.5;
								m.material.color = new THREE.Color("rgb(20, 41, 81)");

                    		}
							switch (m.name) {
								case "nha_pho_140":
							 	m.material.transparent  = true;
							 	m.material.opacity = 0.5;
							 	m.material.color = new THREE.Color("rgb(20, 41, 81)");
							}
                			pickableObjects.push(child);
                			}
  						});


						//Phòng họp
						scene.add( ngoinha );

						
						animate();
						document.getElementById("js-loader").style.display =  'none';
						document.getElementById("progress").style.display =  'none';


					}, onProgress, function ( e ) {
					console.error( e );
				} );
				
				
				// ***** Clipping planes: *****

				const localPlane = new THREE.Plane( new THREE.Vector3( 0, -10, 0 ), 2 );
				const globalPlane = new THREE.Plane( new THREE.Vector3( - 1, 0, 0 ), 10 );


				//Đèn không gian


				// var HemisphereLight2 = new THREE.HemisphereLight( 0xE9EAD6, 0XF9B52F, 0.1);
				// HemisphereLight2.position.set(-3.4, 13, 0);
				// scene.add(HemisphereLight2);

				// var hemiLight1 = new THREE.HemisphereLight(0xC9C9C9, 0.1);
				// hemiLight1.position.set(0, 13, 0);
				// scene.add(hemiLight1);

				//Lights
				const directionalLight1 = new THREE.DirectionalLight( 0xffeeff, 0.1 );
				directionalLight1.position.set( 1, 1, 1 );
				scene.add( directionalLight1 );

				const directionalLight2 = new THREE.DirectionalLight( 0xffffff, 0.1 );
				directionalLight2.position.set( - 1, 15, - 1 );
				scene.add( directionalLight2 );

				const ambientLight = new THREE.AmbientLight( 0xffffee, 0.25 );
				scene.add( ambientLight );

				//Pointer
				var geometryHelper = new THREE.CircleGeometry( 0.7, 10000 );
				geometryHelper.translate( 0, 0, 0.01 );
				const marker = new THREE.TextureLoader().load( 'img/marker.png' );

				var rollOverMaterial = new THREE.MeshBasicMaterial( { map: marker, color: 0xffffff, flatShading: true, transparent: true, opacity: 0.7 } );
				helper = new THREE.Mesh( geometryHelper, rollOverMaterial );			

				renderer = new THREE.WebGLRenderer({container, camera, alpha: false, antialias : true, stencil: true,});

				renderer.rendererSize = {width: window.innerWidth, height: window.innerHeight, quality: 72, maxQuality: 300, minQuality: 20};
				
				renderer.setPixelRatio( window.devicePixelRatio );

				renderer.setSize( window.innerWidth, window.innerHeight );

				renderer.outputEncoding = THREE.sRGBEncoding;

				container.appendChild( renderer.domElement );

				const environment = new RoomEnvironment();
				const pmremGenerator = new THREE.PMREMGenerator( renderer );

				scene.background = reflectionCube;
				scene.environment = pmremGenerator.fromScene( environment ).texture;
		

        		labelRenderer.setSize(window.innerWidth, window.innerHeight);
        		labelRenderer.domElement.style.position = 'absolute';
        		labelRenderer.domElement.style.top = '2px';
        		labelRenderer.domElement.style.pointerEvents = 'none';


				document.body.appendChild( labelRenderer.domElement );
				
				camera.position.set( -10, 5, -10 );

				controls = new OrbitControls(camera, renderer.domElement);

				controls.enabled = true;

				controls.target.set(0, 5, 0);
				controls.enableDamping = true;
				controls.minDistance = 1;
				controls.maxDistance = 30;

				controls.maxPolarAngle = 1.5;

				controls.panSpeed = 5;

				controls.direction = -1;


				controls.mouseButtons = {
					LEFT: THREE.MOUSE.ROTATE,
					MIDDLE: THREE.MOUSE.DOLLY,
					RIGHT: THREE.MOUSE.PAN
				}
				
				controls.touches = {
					ONE: THREE.TOUCH.ROTATE,
					TWO: THREE.TOUCH.DOLLY_PAN
				}
				controls.update();
				
				// ***** Clipping setup (renderer): *****
				const globalPlanes = [ globalPlane, localPlane ],
				
					Empty = Object.freeze( [] );
				renderer.clippingPlanes = Empty; // GUI sets it to globalPlanes
				renderer.localClippingEnabled = true;
				
				// GUI

				const gui = new GUI(),
					folderLocal = gui.addFolder( 'Cắt mặt trên' ),
					propsLocal = {

						get 'Kích hoạt'() {

							return renderer.localClippingEnabled;

						},
						set 'Kích hoạt'( v ) {

							renderer.localClippingEnabled = v;
							ngoinha.rotation.y = 0;

						},



						get 'Mặt cắt'() {

							return localPlane.constant;

						},
						set 'Mặt cắt'( v ) {

							localPlane.constant = v;
							

						}

					},

					

					folderGlobal = gui.addFolder( 'Cắt mặt ngang' ),
					propsGlobal = {

						get 'Kích hoạt'() {

							return renderer.clippingPlanes !== Empty;

						},
						set 'Kích hoạt'( v ) {

							renderer.clippingPlanes = v ? globalPlanes : Empty;
							ngoinha.rotation.y = 0;

						},

						get 'Mặt cắt'() {

							return globalPlane.constant;

						},
						set 'Mặt cắt'( v ) {

							globalPlane.constant = v;

						}

					},

					folderGlobals = gui.addFolder( 'Xoay tự động' ),
					propsGlobals = {

						get 'Kích hoạt'() {

							return rotation_speed;

						},
						set 'Kích hoạt'( v ) {

							rotation_speed = v;

						}

					};



				folderLocal.add( propsLocal, 'Kích hoạt' );
				folderLocal.add( propsLocal, 'Mặt cắt', -3, 2 );

				folderGlobal.add( propsGlobal, 'Kích hoạt' );
				folderGlobal.add( propsGlobal, 'Mặt cắt', - 10, 20 );

				folderGlobals.add( propsGlobals, 'Kích hoạt' );


				container.addEventListener( 'pointerdown', onPointerDown );

				container.addEventListener( 'pointermove', onPointerMove_mouse, false );

				container.addEventListener( 'mouseup', moveCamera, true );

				container.addEventListener( 'mousedown', startTimer, true );

				container.addEventListener('resize', onWindowResize, false);

			}

			function startTimer(){
				rotation_speed = 0;
				scene.remove( helper );
				event.preventDefault();
				mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
				mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
				raycaster.setFromCamera( mouse, camera );

				//var intersects = raycaster.intersectObjects( scene.children, true );

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;

				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

				labelRenderer.setSize(window.innerWidth, window.innerHeight);

			}



		
			function animate() {
				
				ngoinha.rotation.y += rotation_speed;

				requestAnimationFrame( animate );

				labelRenderer.render(scene, camera);

            	renderer.render(scene, camera);

				controls.update(); // required if damping enabled

			}


			//Di chuyển trên sàn

			function moveCamera( event ) {

				event.preventDefault();
				mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
				mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
				raycaster.setFromCamera( mouse, camera );

				var intersects = raycaster.intersectObjects( scene.children, true );

			 	if ( intersects.length > 0 ) {

					console.log(intersects[0].point);
   					var clickedName = intersects[0].object.name;
    				console.log('Tên: ' + clickedName);

    				
				}

			}

			function onPointerDown( event ) {

				if ( event.isPrimary === false ) return;

				moveCameraClick = false;

				onPointerDownMouseX = event.clientX;
				onPointerDownMouseY = event.clientY;

				onPointerDownLon = lon;
				onPointerDownLat = lat;

				document.addEventListener( 'pointermove', onPointerMove );
				document.addEventListener( 'pointerup', onPointerUp );
				scene.remove( helper );

			}

			function onPointerMove( event ) {
				if ( event.isPrimary === false ) return;
				lon = ( onPointerDownMouseX - event.clientX ) * 0.4 + onPointerDownLon;
				lat = ( event.clientY - onPointerDownMouseY ) * 0.4 + onPointerDownLat;

			}

			//icon chuột
			function onPointerMove_mouse( event ) {
				mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
				mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

				raycaster.setFromCamera( mouse, camera );

				var intersects = raycaster.intersectObjects( scene.children, true  );

				if ( intersects.length > 0 ) {
					helper.position.set( 0, 0, 0 );
					helper.lookAt( intersects[ 0 ].face.normal );

					helper.position.copy( intersects[ 0 ].point );
					scene.add( helper );

				}


			}


			function onPointerUp() {

				if ( event.isPrimary === false ) return;

				document.removeEventListener( 'pointermove', onPointerMove );

				document.removeEventListener( 'pointerup', onPointerUp );

			}

	


			// Thanh thay đổi textures

			var TRAY = document.getElementById("js-tray-slide");
			var TRAY_Tran = document.getElementById("js-tray-slide-tran");
			var TRAY_San = document.getElementById("js-tray-slide-san");


			function buildColors(colors) {
				textureOption = "nhapho001_7";
  				for (var [i, color] of colors.entries()) {
    				var swatch = document.createElement("div");
    				swatch.classList.add("tray__swatch");
    				

    				if (color.texture) {
      					swatch.style.backgroundImage = "url(" + color.texture + ")";
      					

    				} else {
      					swatch.style.background = "#" + color.color;

    				}

    				swatch.setAttribute("data-key", i);
    				TRAY.append(swatch);
  				}
			}


			//Thay đổi màu trần
			function buildTranColors(colors) {
				textureOption_tran = "nhapho001_118";
  				for (var [i, color] of colors.entries()) {
    				var swatch_Tran = document.createElement("div");
    				swatch_Tran.classList.add("tray__swatch_Tran");
    				

    				if (color.texture) {
      					swatch_Tran.style.backgroundImage = "url(" + color.texture + ")";

    				} else {
      					swatch_Tran.style.background = "#" + color.color;

    				}

    				swatch_Tran.setAttribute("data-key", i);
    				TRAY_Tran.append(swatch_Tran);
  				}
			}
			

			//Thay đổi màu sàn
			function build_SanColors(colors) {
				textureOption_san = "nha_pho_45";
  				for (var [i, color] of colors.entries()) {
    				var swatch_San = document.createElement("div");
    				swatch_San.classList.add("tray__swatch_San");
    				

    				if (color.texture) {
      					swatch_San.style.backgroundImage = "url(" + color.texture + ")";

    				} else {
      					swatch_San.style.background = "#" + color.color;

    				}

    				swatch_San.setAttribute("data-key", i);
    				TRAY_San.append(swatch_San);
  				}
			}
			
			
			buildTranColors(texturesTranAndColors);
			
			buildColors(texturesTuongAndColors);
			
			build_SanColors(texturesSanAndColors);
			
			

			// Swatches
			var swatches = document.querySelectorAll(".tray__swatch");
			
			var swatches_Tran = document.querySelectorAll(".tray__swatch_Tran");
			
			var swatches_San = document.querySelectorAll(".tray__swatch_San");


			for (var swatch of swatches) {
  				swatch.addEventListener("click", (event) =>
    				selectSwatch(event, ngoinha, texturesTuongAndColors, textureOption)
 			 	);
			}
			
			for (var swatch_Tran of swatches_Tran) {
  				swatch_Tran.addEventListener("click", (event) =>
    				selectSwatch(event, ngoinha, texturesTranAndColors, textureOption_tran)
 			 	);
			}
			
			for (var swatch_San of swatches_San) {
  				swatch_San.addEventListener("click", (event) =>
    				selectSwatch(event, ngoinha, texturesSanAndColors, textureOption_san)
 			 	);
			}


			// Select Option

			var options = document.querySelectorAll(".option");

			for (var option of options) {
  				option.addEventListener("click", selectOption);
			}

			function selectOption(e) {
  				var option = e.target;
  				textureOption = e.target.dataset.option;
  				for (var otherOption of options) {
    				otherOption.classList.remove("--is-active");
  				}
  				option.classList.add("--is-active");
			}
			
		
			//Nút đo kích thước
        document.getElementById( 'openmeasure' ).addEventListener( 'click', function( e ) {
			ctrlDown = true;
            renderer.domElement.style.cursor = "crosshair";
            document.getElementById("closemeasure").style.display = "block"
            document.getElementById("openmeasure").style.display = "none"

		} );

		document.getElementById( 'closemeasure' ).addEventListener( 'click', function( e ) {
			ctrlDown = false;
            renderer.domElement.style.cursor = "pointer";
            if (drawingLine) {
                //devare the last line because it wasn't committed
                scene.remove(line);
                scene.remove(measurementLabels[lineId]);
                drawingLine = false;
            }
            document.getElementById("openmeasure").style.display = "block"
            document.getElementById("closemeasure").style.display = "none"
		} );



		//Đo kích thước
        renderer.domElement.addEventListener('pointerdown', onClickMeasure, false);

        function onClickMeasure(event) {

            if (ctrlDown) {

           	 	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;

				mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

                raycaster.setFromCamera( mouse, camera );

				var intersects = raycaster.intersectObjects( pickableObjects, true  );

				if ( intersects.length > 0 ) {
                    if (!drawingLine) {
                        //start the line
                        var points = [];
                        points.push(intersects[0].point);
                        points.push(intersects[0].point.clone());
                        var geometry = new THREE.BufferGeometry().setFromPoints(points);
                        line = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({
                            color: 0xFA0D00,
                            transparent: true,
                            opacity: 1,
                            // depthTest: false,
                            // depthWrite: false
                        }));
                        line.frustumCulled = false;
                        scene.add( line );
                        var measurementDiv = document.createElement('div');
                        measurementDiv.className = 'measurementLabel';
                        measurementDiv.innerText = "0.0m";

                        var measurementLabel = new CSS2DObject(measurementDiv);
                        measurementLabel.position.copy(intersects[0].point);
                        measurementLabels[lineId] = measurementLabel;
                        scene.add( measurementLabels[lineId] );
                        drawingLine = true;
                    } else {
                        //finish the line
                        var positions = line.geometry.attributes.position.array;
                        positions[3] = intersects[0].point.x;
                        positions[4] = intersects[0].point.y;
                        positions[5] = intersects[0].point.z;
                        line.geometry.attributes.position.needsUpdate = true;
                        lineId++;
                        drawingLine = false;
                    }
                }
            }
        }

        //Đo kích thước
		document.body.addEventListener('mousemove', onDocumentMouseMoveMeasure, false);

        function onDocumentMouseMoveMeasure(event) {

            if (drawingLine) {

               raycaster.setFromCamera( mouse, camera );

				var intersects = raycaster.intersectObjects( pickableObjects, true  );

				if ( intersects.length > 0 ) {
                    var positions = line.geometry.attributes.position.array;
                    var v0 = new THREE.Vector3(positions[0], positions[1], positions[2]);
                    var v1 = new THREE.Vector3(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
                    positions[3] = intersects[0].point.x;
                    positions[4] = intersects[0].point.y;
                    positions[5] = intersects[0].point.z;
                    line.geometry.attributes.position.needsUpdate = true;
                    var distance = v0.distanceTo(v1);
                    measurementLabels[lineId].element.innerText = distance.toFixed(2) + "m";
                    measurementLabels[lineId].position.lerpVectors(v0, v1, .5);

                    console.log(measurementLabels[lineId].element.innerText);
                }
            }
        }
