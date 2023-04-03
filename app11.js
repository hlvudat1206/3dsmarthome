	import * as THREE from './build/three.module.js';
	import { OrbitControls } from './js/OrbitControls.js';
    import { GLTFLoader } from './js/GLTFLoader.js';
    import { DRACOLoader } from './js/DRACOLoader.js';
    import { CSS2DRenderer, CSS2DObject } from './js/CSS2DRenderer.js';
	import { GUI } from './js/lil-gui.module.min.js';
    import { getTextureMaterial, selectSwatch } from "./utils/materialHelper.js";
	import { DragControls } from "./js/DragControls.js";
	import {MouseMeshInteraction} from "./js/mousemes_interact.js";
	import {texturesImageObject}  from "./constants/imageObject.js";

	import { texturesTuongAndColors, texturesTranAndColors, texturesSanAndColors, texturesCuaAndColors } from "./constants/constants.js";

			var camera, scene, renderer;

			var strDownloadMime = "image/octet-stream";

			var raycaster, mouse;
			let contextElement = document.getElementById("context-menu");;
			// const contextMenu = document.querySelector('.context-menu');
			
			var loader;
			// var model_url = [
				// 	"noithatlau2",
				// 	"noithatphongbep",
				// 	"noithatphongkhach",
				// 	"noithatphongngu",
				// 	"cauthang",
				// 	"hethongden",
				// 	"thietbivesinh",
				// 	"oto"
				// ];
			let noithatlau2, noithatphongbep, noithatphongkhach, noithatphongngu, 
			cauthang, hethongden, thietbivesinh, oto;
			
			let allNoithat2 = [];
			var helper, ngoinha, noithat, cuaso;

			let savePosition_x;
			let savePosition_z;
			let centerPosition_PhongbepX;
			let centerPosition_PhongbepZ;



			let getPosition_x = null;
			let getPosition_z = null;

			var controls;

			var startTime, endTime;

			var rotation_speed = 0;

			var textureOption = "";
			
			var textureOption_tran = "";
			
			var textureOption_san = "";

			var textureOption_cua = ";"

			var pickableObjects;

			//Đo kích thước
			var ctrlDown = false;

        	var lineId = 0;

        	var line;
        	
        	var dracoLoader;

        	var labelRenderer;

        	var drawingLine = false;
			let stopClickbyEdit = true;
        	var measurementLabels = {};
			let objectchoose;

			let move_object = false;
			let move_object2 = false;
			let scaling_Object ;
			let selectnoithat;
			let NameObject = '';
			let noithatgroup;
			let currentAngle;
			let menu;
			let hightlightPlaneMesh;
			let highlightPos;
			let name_Rightclick;
			let exclusive_name;
			let get_event_v;
			let getStateofclickSwatch;
			let dataObject;
			let nameDataObject;
			let savePosition_x2;
			let savePosition_z2;
			let clicktray_ChooseObject =false;

			//Move center (If designer cannot fix it in Blender)
			let fixedcenterPoint_otoX;
			let fixedcenterPoint_noithatlau2X;
			let fixedcenterPoint_noithatphongnguX;
			let fixedcenterPoint_noithatphongbepX;
			let fixedcenterPoint_noithatphongkhachX;

			let fixedcenterPoint_otoZ;
			let fixedcenterPoint_noithatlau2Z;
			let fixedcenterPoint_noithatphongnguZ;
			let fixedcenterPoint_noithatphongbepZ;
			let fixedcenterPoint_noithatphongkhachZ;

			
		
			init();

			animate();
			
			function init() {
				raycaster = new THREE.Raycaster();

				

				labelRenderer = new CSS2DRenderer();

				mouse = new THREE.Vector2();
				
				dracoLoader = new DRACOLoader();

				var container = document.getElementById( 'container' );
				scene = new THREE.Scene();
				
				camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
				camera.position.set(15,2,0);

				
				const planeMesh = new THREE.Mesh(new THREE.PlaneGeometry(20,20)
					, new THREE.MeshBasicMaterial({color: 0xffff00, side: THREE.DoubleSide,
						visible: false

					}));

				planeMesh.rotateX(Math.PI/2)
				planeMesh.name = 'ground';
				scene.add(planeMesh);
				planeMesh.position.set(0,-3.1,0);
				console.log('in planemesh: ',planeMesh)

				
				const gridHelper = new THREE.GridHelper(15, 30, 0xffffff, 0xffffff);
				gridHelper.position.set(0,-3.1,0);
				gridHelper.visible = false;
				scene.add(gridHelper);
					
				 hightlightPlaneMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.5,0.5)
					, new THREE.MeshBasicMaterial({color: 0xff0000, side: THREE.DoubleSide

					}));
				hightlightPlaneMesh.rotateX(Math.PI/2);
				hightlightPlaneMesh.rotateZ(Math.PI/30);
				scene.add(hightlightPlaneMesh);
				// hightlightPlaneMesh.position.set(0.5,-3.0,0.5);
				// camera.lookAt(0,-4,0);
				// camera.lookAt(scene.position);
				
				// {color: 0x41627E}

				//Create Ground
				// let geometryGround = new THREE.BoxGeometry(100,1,100);
				// // let texttureGround = new THREE.TextureLoader().load('./img/measurement_x.png');
				// // let materialGround = new THREE.MeshBasicMaterial({color: 0x8B8682});
				// let materialGround = new THREE.ShadowMaterial();

				// let groundGround = new THREE.Mesh(geometryGround, materialGround);
				// groundGround.position.set(0,-20,0);
				// groundGround.scale.set(3,3,3);
				// scene.add(groundGround)


				//Ảnh nền model
				var path = './cube/';
				var format = '.jpg';
				var urls = [
					path + 'pano_r' + format, path + 'pano_l' + format,
					path + 'pano_u' + format, path + 'pano_d' + format,
					path + 'pano_f' + format, path + 'pano_b' + format
				];

				var folder = "./models/";
				var duoi_file = ".gltf";
				var model_url = [
					"noithatlau2",
					"noithatphongbep",
					"noithatphongkhach",
					"noithatphongngu",
					"cauthang",
					"hethongden",
					"thietbivesinh",
					"oto"
				];
		

				var reflectionCube = new THREE.CubeTextureLoader().load( urls );

				var onProgress = function ( xhr ) {
					if ( xhr.lengthComputable ) {
						var percentCompvare = xhr.loaded / xhr.total * 100;
						document.getElementById("progress").value =  Math.round( percentCompvare, 2 ) + '% Đang tải chờ chút nhé.';
					}
				};

				
			
				pickableObjects = new Array();

				loader = new GLTFLoader();
				dracoLoader.setDecoderPath("./");
				dracoLoader.setDecoderConfig({type: 'js'});
				loader.setDRACOLoader( dracoLoader );

				
					
				loader.load( folder + 'nhapho.gltf', function ( gltf ) {

					ngoinha = gltf.scene;
					
					// console.log('in ngoi nha: ',ngoinha);
					ngoinha.position.set(0,0,0);
					ngoinha.name='ngoinha';
					console.log('in ra ngoi nha: ', ngoinha)
					gltf.scene.traverse(function (child) {
						if (child.isMesh) {
							child.material.side = THREE.DoubleSide;
							child.material.clippingPlanes = [ localPlane, yclipPlane  ];
							child.material.localClippingEnabled = [ globalPlane ];
							// child.material.clippingPlanes[0].constant = child.material.clippingPlanes[0].distanceToPoint(child.position)
							var m = child;
							
							console.log(child);
							
							switch (m.name) {
								case "nhapho_2":
								m.material.transparent  = true;
								m.material.opacity = 0.5;
								m.material.color = new THREE.Color("rgb(20, 41, 81)");

							}

						
						pickableObjects.push(child);
						}
					  });
					  console.log(' in objectchoose',objectchoose )

				
					// scene.add( ngoinha );


				});

				loader.load( folder + 'cua.gltf', function ( gltf ) {

					cuaso = gltf.scene;

					cuaso.traverse(function (child) {
						if (child.isMesh) {
							child.material.side = THREE.DoubleSide;
							child.material.clippingPlanes = [ localPlane, yclipPlane  ];
							child.material.localClippingEnabled = [ globalPlane ];
						var m = child;
						
						switch (m.name) {
							case "cua_1":
							m.material.transparent  = true;
							m.material.opacity = 0.5;
							m.material.color = new THREE.Color("rgb(20, 41, 81)");
						}

						switch (m.name) {
							case "cua_7":
							m.material.transparent  = true;
							m.material.opacity = 0.5;
							m.material.color = new THREE.Color("rgb(20, 41, 81)");
						}

						
						pickableObjects.push(child);
						}
						document.getElementById("js-loader").style.display =  'none';
						document.getElementById("progress").style.display =  'none';
					  });


					//Phòng họp
					scene.add( cuaso );


				}, onProgress, function ( e ) {
					console.error( e );
				
				
				});
				// var model_url = [
				// 	"noithatlau2",
				// 	"noithatphongbep",
				// 	"noithatphongkhach",
				// 	"noithatphongngu",
				// 	"cauthang",
				// 	"hethongden",
				// 	"thietbivesinh",
				// 	"oto"
				// ];
				loader.load( folder + 'noithatlau2.gltf', function ( gltf ) {

					noithatlau2 = gltf.scene;
					allNoithat2.push(noithatlau2)
					noithatlau2.traverse(function (child) {
								if (child.isMesh) {
									child.material.side = THREE.DoubleSide;
									child.material.clippingPlanes = [ localPlane, yclipPlane  ];
									child.material.localClippingEnabled = [ globalPlane ];
									child.material.envMap = reflectionCube;
									var m = child;


									
									pickableObjects.push(child);
								}
							});

							scene.add( noithatlau2 );
						
						
						document.getElementById("js-loader").style.display =  'none';
						document.getElementById("progress").style.display =  'none';
				}, onProgress, function ( e ) {
					console.error( e );
				
				
				});
				loader.load( folder + 'noithatphongbep.gltf', function ( gltf ) {

					noithatphongbep = gltf.scene;
					allNoithat2.push(noithatphongbep)
					noithatphongbep.traverse(function (child) {
								if (child.isMesh) {
									child.material.side = THREE.DoubleSide;
									child.material.clippingPlanes = [ localPlane, yclipPlane  ];
									child.material.localClippingEnabled = [ globalPlane ];
									child.material.envMap = reflectionCube;
									var m = child;


									
									pickableObjects.push(child);
								}
							});

							scene.add( noithatphongbep );
						
						
						document.getElementById("js-loader").style.display =  'none';
						document.getElementById("progress").style.display =  'none';
				}, onProgress, function ( e ) {
					console.error( e );
				
				
				});
				loader.load( folder + 'noithatphongkhach.gltf', function ( gltf ) {

					noithatphongkhach = gltf.scene;
					allNoithat2.push(noithatphongkhach)
					noithatphongkhach.traverse(function (child) {
								if (child.isMesh) {
									child.material.side = THREE.DoubleSide;
									child.material.clippingPlanes = [ localPlane, yclipPlane  ];
									child.material.localClippingEnabled = [ globalPlane ];
									child.material.envMap = reflectionCube;
									var m = child;


									
									pickableObjects.push(child);
								}
							});

							scene.add( noithatphongkhach );
						
						
						document.getElementById("js-loader").style.display =  'none';
						document.getElementById("progress").style.display =  'none';
				}, onProgress, function ( e ) {
					console.error( e );
				
				
				});
				loader.load( folder + 'noithatphongngu.gltf', function ( gltf ) {

					noithatphongngu = gltf.scene;
					allNoithat2.push(noithatphongngu)
					noithatphongngu.traverse(function (child) {
								if (child.isMesh) {
									child.material.side = THREE.DoubleSide;
									child.material.clippingPlanes = [ localPlane, yclipPlane  ];
									child.material.localClippingEnabled = [ globalPlane ];
									child.material.envMap = reflectionCube;
									var m = child;


									
									pickableObjects.push(child);
								}
							});

							scene.add( noithatphongngu );
						
						
						document.getElementById("js-loader").style.display =  'none';
						document.getElementById("progress").style.display =  'none';
				}, onProgress, function ( e ) {
					console.error( e );
				
				
				});
				loader.load( folder + 'cauthang.gltf', function ( gltf ) {
					
					cauthang = gltf.scene;
					allNoithat2.push(cauthang)
					cauthang.traverse(function (child) {
								if (child.isMesh) {
									child.material.side = THREE.DoubleSide;
									child.material.clippingPlanes = [ localPlane, yclipPlane  ];
									child.material.localClippingEnabled = [ globalPlane ];
									child.material.envMap = reflectionCube;
									var m = child;


									
									pickableObjects.push(child);
								}
							});

							scene.add( cauthang );
						
						
						document.getElementById("js-loader").style.display =  'none';
						document.getElementById("progress").style.display =  'none';
				}, onProgress, function ( e ) {
					console.error( e );
				
				
				});
				loader.load( folder + 'hethongden.gltf', function ( gltf ) {

					hethongden = gltf.scene;
					allNoithat2.push(hethongden)
					hethongden.traverse(function (child) {
								if (child.isMesh) {
									child.material.side = THREE.DoubleSide;
									child.material.clippingPlanes = [ localPlane, yclipPlane  ];
									child.material.localClippingEnabled = [ globalPlane ];
									child.material.envMap = reflectionCube;
									var m = child;


									
									pickableObjects.push(child);
								}
							});

							scene.add( hethongden );
						
						
						document.getElementById("js-loader").style.display =  'none';
						document.getElementById("progress").style.display =  'none';
				}, onProgress, function ( e ) {
					console.error( e );
				
				
				});
				loader.load( folder + 'thietbivesinh.gltf', function ( gltf ) {

					thietbivesinh = gltf.scene;
					allNoithat2.push(thietbivesinh)
					thietbivesinh.traverse(function (child) {
								if (child.isMesh) {
									child.material.side = THREE.DoubleSide;
									child.material.clippingPlanes = [ localPlane, yclipPlane  ];
									child.material.localClippingEnabled = [ globalPlane ];
									child.material.envMap = reflectionCube;
									var m = child;


									
									pickableObjects.push(child);
								}
							});

							scene.add( thietbivesinh );
						
						
						document.getElementById("js-loader").style.display =  'none';
						document.getElementById("progress").style.display =  'none';
				}, onProgress, function ( e ) {
					console.error( e );
				
				
				});
				loader.load( folder + 'oto.gltf', function ( gltf ) {

					oto = gltf.scene;
					allNoithat2.push(oto)

					oto.traverse(function (child) {
								if (child.isMesh) {
									child.material.side = THREE.DoubleSide;
									child.material.clippingPlanes = [ localPlane, yclipPlane  ];
									child.material.localClippingEnabled = [ globalPlane ];
									child.material.envMap = reflectionCube;
									var m = child;


									
									pickableObjects.push(child);
								}
							});

							scene.add( oto );
							

						
						document.getElementById("js-loader").style.display =  'none';
						document.getElementById("progress").style.display =  'none';
				}, onProgress, function ( e ) {
					console.error( e );
				
				
				});
				

				// ***** Clipping planes: *****
				
				const localPlane = new THREE.Plane( new THREE.Vector3( 0, -10, 0 ), 2 );
				// const localPlane = new THREE.Plane( new THREE.Vector3( 0, 0, -10 ), 2 );

				const globalPlane = new THREE.Plane( new THREE.Vector3( - 1, 0, 0 ), 20 );

				
				const yclipPlane = new THREE.Plane( new THREE.Vector3( 0, 0, -10 ), 2 );

				

				

								

				//Đèn không gian


				var HemisphereLight1 = new THREE.HemisphereLight( 0xE9EAD6, 0XF9B52F, 0.15);
				HemisphereLight1.position.set(3.4, 3, 0);
				scene.add(HemisphereLight1);
				// var HemisphereLight2 = new THREE.HemisphereLight( 0xE9EAD6, 0XF9B52F, 0.15);
				// HemisphereLight2.position.set(-3.4, 3, 0);
				// scene.add(HemisphereLight2);

				// var hemiLight1 = new THREE.HemisphereLight(0xC9C9C9, 0.1);
				// hemiLight1.position.set(0, 13, 0);
				// scene.add(hemiLight1);

				// Lights
				const directionalLight1 = new THREE.DirectionalLight( 0xffffff, 0.1 );
				directionalLight1.position.set( 5, 15, 1 );
				scene.add( directionalLight1 );

				const light = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.8 );
				scene.add( light );

				// const Light2 = new THREE.SpotLight(0xffa95c,4);
				// Light2.position.set(15,50,50);

				// Light2.castShadow = false;
				// Light2.shadow.bias = -0.001;
				// Light2.shadow.mapSize.width = 1024*4;
				// Light2.shadow.mapSize.height = 1024*4;
				// scene.add(Light2);

				// const directionalLight2 = new THREE.DirectionalLight( 0xffffff, 0.1 );
				// directionalLight2.position.set( - 5, 15, - 1 );
				// scene.add( directionalLight2 );

				//Pointer
				var geometryHelper = new THREE.CircleGeometry( 0.3, 10000 );
				geometryHelper.translate( 0, 0, 0.01 );
				const marker = new THREE.TextureLoader().load( 'img/marker.png' );

				// var rollOverMaterial = new THREE.MeshBasicMaterial( { map: marker, color: 0xffffff, flatShading: true, transparent: true, opacity: 0.7 } );
				var rollOverMaterial = new THREE.MeshBasicMaterial( {  color: 0xff0000, flatShading: true, transparent: true, opacity: 0.7 } );

				helper = new THREE.Mesh( geometryHelper, rollOverMaterial );			

				renderer = new THREE.WebGLRenderer({container, camera, alpha: false, antialias : true, preserveDrawingBuffer: true});

				renderer.rendererSize = {width: window.innerWidth, height: window.innerHeight, quality: 30, maxQuality: 50, minQuality: 20};
				
				renderer.setPixelRatio( window.devicePixelRatio );

				renderer.setSize( window.innerWidth, window.innerHeight );

				renderer.outputEncoding = THREE.sRGBEncoding;
				// renderer.toneMapping = THREE.ReinhardToneMapping;
				// renderer.toneMappingExposure = 2.3;
				renderer.shadowMap.enabled = true;

				container.appendChild( renderer.domElement );

				scene.background = reflectionCube;

		

        		labelRenderer.setSize(window.innerWidth, window.innerHeight);
        		labelRenderer.domElement.style.position = 'absolute';
        		labelRenderer.domElement.style.top = '2px';
        		labelRenderer.domElement.style.pointerEvents = 'none';


				container.appendChild( labelRenderer.domElement );
				
				camera.position.set( -10, 5, 100 );
				// camera.lookAt(0, 0, 0);

				controls = new OrbitControls(camera, renderer.domElement);
				controls.enabled = true;

				controls.target.set(0, 5, 0);
				// controls.enableDamping = true;
				controls.minDistance = 1;
				controls.maxDistance = 30;

				controls.maxPolarAngle = 2.0;

				controls.panSpeed = 3;
				
				controls.direction = -1;
				controls.enableRotate =true;

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


				var saveLink = document.createElement('div');
				saveLink.style.position = 'absolute';
				saveLink.style.top = '10px';
				saveLink.style.width = '100px';
				saveLink.style.background = '#FFFFFF';
				saveLink.style.textAlign = 'center';

				document.body.appendChild(saveLink);
				
				// ***** Clipping setup (renderer): *****
				const globalPlanes = [ globalPlane , localPlane, yclipPlane],
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

					folderLocal2 = gui.addFolder( 'Cắt mặt bên' ),
					propsLocal2 = {

						get 'Kích hoạt'() {

							return renderer.localClippingEnabled;

						},
						set 'Kích hoạt'( v ) {

							renderer.localClippingEnabled = v;
							ngoinha.rotation.y = 0;

						},



						get 'Mặt cắt'() {

							return yclipPlane.constant;

						},
						set 'Mặt cắt'( v ) {

							yclipPlane.constant = v;
							

						}

					},
					

					folderGlobal = gui.addFolder( 'Cắt mặt trước' ),
					propsGlobal = {

						get 'Kích hoạt'() {

							// return renderer.clippingPlanes !== Empty;
							return renderer.clippingPlanes !== Empty;


						},
						set 'Kích hoạt'( v ) {
					
							renderer.clippingPlanes = v ? globalPlanes : Empty;
					
						},

						get 'Mặt cắt'() {

							return globalPlane.constant;

						},
						set 'Mặt cắt'( v ) {

							globalPlane.constant = v;

						}

					}

					
					
				
				
				folderLocal.add( propsLocal, 'Kích hoạt' );
				folderLocal.add( propsLocal, 'Mặt cắt', -3, 2 );

				folderGlobal.add( propsGlobal, 'Kích hoạt' );
				folderGlobal.add( propsGlobal, 'Mặt cắt', - 10, 20 );

				folderLocal2.add( propsLocal2, 'Kích hoạt' );
				folderLocal2.add( propsLocal2, 'Mặt cắt', -3, 2 );

				//container.addEventListener( 'pointerdown', onPointerDown );

				container.addEventListener( 'pointermove', onPointerMove_mouse, false );

				container.addEventListener( 'mouseup', moveCamera, true );
				container.addEventListener( 'mousedown', startTimer, true );

				container.addEventListener('resize', onWindowResize, false);

				

			}
			
	
			document.getElementById( 'saveLink' ).addEventListener( 'click', function( e ) {
				var saveFile = function (strData, filename) {
					var link = document.createElement('a');
					if (typeof link.download === 'string') {
						document.body.appendChild(link); //Firefox requires the link to be in the body
						link.download = filename;
						link.href = strData;
						link.click();
						document.body.removeChild(link); //remove the link when done
					} else {
						location.replace(uri);
					}
				}
			
				

				var imgData, imgNode;
				startTime = new Date();

  				// get seconds
  				var seconds = Math.round(startTime);

				try {
					var strMime = "image/jpeg";
					imgData = renderer.domElement.toDataURL(strMime);
		
					saveFile(imgData.replace(strMime, strDownloadMime), "capture_"+seconds+".jpg");
		
				} catch (e) {
					console.log(e);
					return;
				}
	
			} );

			

			function startTimer(){
				//rotation_speed = 0;
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
				
				//ngoinha.rotation.y -= rotation_speed;

				requestAnimationFrame( animate );

				labelRenderer.render(scene, camera);
			

            	renderer.render(scene, camera);

				// controls.update(); // required if damping enabled
				
				

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
					// console.log('in x:', intersects[0].point.x)
					// let selectObject = intersects[0].object.userData.currentSquare;
   					var clickedName = intersects[0].object.name;
					objectchoose = clickedName;
					console.log('in object vua click: ',intersects[0].object)
					console.log('All object: ',allNoithat2)
					console.log('in ngoi nha: ', ngoinha)
    				console.log('Tên: ' + clickedName);

    				
				}
				

			}
			function click_Object (event) {
				if (move_object & stopClickbyEdit) {
					move_object2 = false;
					move_object = false;
					// console.log('Object has stopped')
					event.preventDefault();
					mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
					mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
					raycaster.setFromCamera( mouse, camera );

					var intersects = raycaster.intersectObjects( scene.children, true );

					if ( intersects.length > 0 ) {

						// console.log('Toa do click: ',intersects[0].point);
						NameObject = intersects[0].object.name;
						console.log('in toan bo Object: ',allNoithat2)
						

					

						
						// intersects[0].object.position.set(intersects[0].point.x,0,intersects[0].point.z)
						// intersects[0].object.material.opacity =0.5;
					} 


				} 


			}
			window.addEventListener('click', click_Object, false);
		
			// }
			function moveCenterObject(event){
				event.preventDefault();

				raycaster.setFromCamera(mouse, camera);
				var intersects = raycaster.intersectObjects(scene.children);

				//Tao vecto3 de lay toa do bat ky
				intersects.forEach(function(intersect) {
				highlightPos = new THREE.Vector3().copy(intersect.point).floor().addScalar(0.5);
				//Doi center
				fixedcenterPoint_otoX = highlightPos.x - 4.0 ;
				fixedcenterPoint_noithatlau2X = highlightPos.x - 4.0;
				fixedcenterPoint_noithatphongnguX = highlightPos.x + 5.0;
				fixedcenterPoint_noithatphongbepX = highlightPos.x + 2.6;
				fixedcenterPoint_noithatphongkhachX = highlightPos.x -2;

				fixedcenterPoint_otoZ = highlightPos.z - 3.3 ;
				fixedcenterPoint_noithatlau2Z = highlightPos.z + 1.0;
				fixedcenterPoint_noithatphongnguZ = highlightPos.z + 2.0;
				fixedcenterPoint_noithatphongbepZ = highlightPos.z - 2.6;
				fixedcenterPoint_noithatphongkhachZ = highlightPos.z ;

				//
				// centerPosition_PhongbepX = highlightPos.x + 2.6;
				// centerPosition_PhongbepZ = highlightPos.z - 2.6;
				})
				
			}
			window.addEventListener('mousemove', moveCenterObject, false)
			function moveObject (event) {
				// console.log('in test move_object2: ',move_object2)
				// console.log('in test stopClickbyEdit: ',stopClickbyEdit)

				if (move_object2 & stopClickbyEdit){
					// console.log('Da moveObject')
				move_object = true;
				// console.log('Object has moved')
				event.preventDefault();

				raycaster.setFromCamera(mouse, camera);
				var intersects = raycaster.intersectObjects(scene.children);
				
				intersects.forEach(function(intersect) {
					for (let i =0; i < allNoithat2.length; i ++){
						// console.log('allNoithat2[i].children[0].name: ',allNoithat2[i].children[0].name)
						// console.log('exclusive_name: ',exclusive_name)
					if(allNoithat2[i].children[0].name === exclusive_name) {

						if (exclusive_name === 'oto'){
							allNoithat2[i].children[0].position.set(fixedcenterPoint_otoX ,0,fixedcenterPoint_otoZ);
							console.log('dang vao oto')


						} else if (exclusive_name === 'noithatlau2') {
							console.log('dang vao noi that lau 2')
							allNoithat2[i].children[0].position.set(fixedcenterPoint_noithatlau2X ,0,fixedcenterPoint_noithatlau2Z);

						} else if (exclusive_name === 'noithatphongngu'){
							allNoithat2[i].children[0].position.set(fixedcenterPoint_noithatphongnguX ,0,fixedcenterPoint_noithatphongnguZ);


						} else if (exclusive_name === 'noithatphongbep' || exclusive_name === allNoithat2[i].children[0].name){
							console.log('da vao noi that phong bep')

							allNoithat2[i].children[0].position.set(fixedcenterPoint_noithatphongbepX ,0,fixedcenterPoint_noithatphongbepZ);


						} else if (exclusive_name === 'noithatphongkhach'){
							allNoithat2[i].children[0].position.set(fixedcenterPoint_noithatphongkhachX ,0,fixedcenterPoint_noithatphongkhachZ);

						}
						
						else {
							// allNoithat2[i].children[0].position.set(highlightPos.x -1.0 ,0,highlightPos.z );
							console.log('dang vao con lai')

						}

						
						}
					}})
				}
					
				

			}
			window.addEventListener('mousemove', moveObject, false);

			const objects =[];
			const moveMousegrid =(e) => {
				
				raycaster.setFromCamera(mouse, camera);
				var intersects = raycaster.intersectObjects(scene.children);
				intersects.forEach(function(intersect) {
					if(intersect.object.name === 'ground') {
						// console.log('da bat ddc ground')
						//Tao vecto3 lay toa do bat ky
						highlightPos = new THREE.Vector3().copy(intersect.point).floor().addScalar(0.5);
						// console.log('in toa do: ', highlightPos)
						hightlightPlaneMesh.position.set(highlightPos.x, -2.75, highlightPos.z);

						
			
						// 	const objectExist = objects.find(function(object) {
						// 		return (object.position.x === hightlightPlaneMesh.position.x)
						// 		&& (object.position.z === hightlightPlaneMesh.position.z)
						// 	});
					
						// 	if(!objectExist) {
						// 	hightlightPlaneMesh.material.color.setHex(0xFFFFFF);
						// }
						// 	else {
						// 	hightlightPlaneMesh.material.color.setHex(0xFF0000);
						// }
					}
				});
			};
			window.addEventListener('mousemove',moveMousegrid, false)

		const contextMenu = document.querySelector('.context-menu');
		const contextMenu2 = document.querySelector('.context-menu2');
		
		const hoverObject = (event) =>{
			console.log(' da hover')
			raycaster.setFromCamera(mouse, camera);
			var intersects = raycaster.intersectObjects(scene.children);
			if (intersects.length > 0 ){
				if (intersects[0].object.name !== ''){
				console.log('in ra hover: ',intersects[0].object);
				intersects[0].object.material.transparent = true ; 

				intersects[0].object.material.opacity = 0.2 ; 
			
			}
			}

		}
		window.addEventListener('mouseenter', hoverObject, false)

		
		function rightClickobject(e){
			//Lay name object
			e.preventDefault();
				
				raycaster.setFromCamera( mouse, camera );

				var intersects = raycaster.intersectObjects( scene.children, true );

			 	if ( intersects.length > 0 ) {

					console.log(intersects[0].point);
   					name_Rightclick = intersects[0].object.name;
					exclusive_name = intersects[0].object.parent.name;
					console.log('in ten exclusive_name: ',exclusive_name);
    				console.log('Tên: ' + name_Rightclick);

    				
				}
			
			//Lay toa do de create object
			// savePosition_x = highlightPos.x - 4;   //Xe oto
			// savePosition_z = highlightPos.z - 2.8;
			// savePosition_x = highlightPos.x  +2.6;
			// savePosition_z = highlightPos.z - 2.6;

			savePosition_x = highlightPos.x ;
			savePosition_z = highlightPos.z ;

			console.log('in ra vi tri x: ',savePosition_x)
			console.log('in ra vi tri z: ',savePosition_z)

			hightlightPlaneMesh.position.set(highlightPos.x, -3.0, highlightPos.z);

			if(contextMenu.classList.contains('show')) {
				contextMenu.classList.remove('show');
			} else {
				contextMenu.style.top = e.offsetY + 'px';
				contextMenu.style.left = e.offsetX + 'px';
				contextMenu.classList.add('show');
			}
			
		}
		function clickShowInfo(e){
			e.preventDefault();
				mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
				mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
				raycaster.setFromCamera( mouse, camera );

				var intersects = raycaster.intersectObjects( scene.children, true );

			 	if ( intersects.length > 0 ) {

					// console.log(intersects[0].point);
					// console.log('in x:', intersects[0].point.x)
					// let selectObject = intersects[0].object.userData.currentSquare;
   					var clickedName = intersects[0].object.name;
					objectchoose = clickedName;

    				// console.log('Test click Tên Showinfo: ' + clickedName);
					if (clickedName !== '' && clickedName.split("_") [0] !== 'nhapho'&& clickedName !== 'ground'){
						if(contextMenu2.classList.contains('show')) {
							contextMenu2.classList.remove('show');
						} else {
							contextMenu2.style.top = e.offsetY + 'px';
							contextMenu2.style.left = e.offsetX + 'px';
							contextMenu2.classList.add('show');
						}
					}
    				
				}

			
			
		}
		
		function closemenu (e){
			contextMenu.classList.remove('show');
			// stopClickbyEdit = true;
			if (scaling_Object){
				stopClickbyEdit = true;
				scaling_Object = false;
				objectchoose = '';
			}
			// stopscaleObject = false;
		}
		function closeInfo (e){
			contextMenu2.classList.remove('show');
			// stopClickbyEdit = true;
			
			// stopscaleObject = false;
		}
		function scaleObject (event) {
			//Lay ti vi tri hien tai
			// console.log('toa do hien tai la: ',20*Math.abs(mouse.y));
			
			if (!stopClickbyEdit ){
				
				scaling_Object = true;
				for (let i =0; i < allNoithat2.length; i ++){
					if(allNoithat2[i].children[0].name === objectchoose.split("_") [0]) {
						console.log('T or F:',allNoithat2[i].children[0].name === objectchoose.split("_") [0])
						console.log('allNoithat2[i].children[0]: ',allNoithat2[i].children[0]);
						console.log('allNoithat2[i] ',allNoithat2[i]);
						

						
						allNoithat2[i].scale.set(20*Math.abs(mouse.y),20*Math.abs(mouse.y),20*Math.abs(mouse.y));


					}}
				

			}

		}

		
		window.addEventListener('mousemove', scaleObject, false);
		function clickNormal (e) {
			// hightlightPlaneMesh.material.color.setHex(0xFF0000);

		}
		window.addEventListener('click', clickNormal, false);

		document.getElementById( 'insert' ).addEventListener( 'click', function( e ) {
			console.log('da click insert')
			const showInsert = document.getElementById('imageobjectClick');
			showInsert.setAttribute('aria-expanded','true');

			const showInsert2 = document.getElementById('image_object');
			showInsert2.setAttribute('class','collapse list-unstyled show');

			getPosition_x = savePosition_x;
			getPosition_z = savePosition_z;
			// loader.load( './models/' + 'noithatphongbep.gltf', function ( gltf ) {
			// 	let nt_phongbep = gltf.scene;
			// 	// move_object2 = true;
				

			// 	mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
			// 	mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
			// 	raycaster.setFromCamera( mouse, camera );

			// 	var intersects = raycaster.intersectObjects( scene.children, true );

				
			// 		nt_phongbep.position.set(savePosition_x, 0, savePosition_z);

			// 		nt_phongbep.children[0].name = 'phongbep' + savePosition_x + savePosition_z;
			// 		scene.add( nt_phongbep );
			// 		allNoithat2.push(nt_phongbep)
			// 		console.log('in noithat2 push: ',allNoithat2)
				
			

			// });
		} );

		const newObject_by_clickInsert = (event, data, positionX, positionZ) => {
 
			dataObject = data[parseInt(event.target.dataset.key)];
			console.log('dataObject click dc: ',dataObject)
			console.log('in dataObject.path: ', dataObject.path)
			nameDataObject = dataObject.name;
			let nameObject = dataObject.path;
			console.log('in nameObject: ',nameObject)
			console.log('in dataObject.name: ',dataObject.name)
			console.log('vi tri moi x: ',positionX)
			console.log('vi tri moi z: ',positionZ)


			// savePosition_x2 = highlightPos.x  +2;
			// savePosition_z2 = highlightPos.z - 2.8;
		 
			loader.load(dataObject.path, function ( gltf ) {
				let object_created = gltf.scene;
				// move_object2 = true;
				// object_created.position.set(positionX, 0, positionZ);
				object_created.children[0].position.set(positionX, 0, positionZ)
			
				// nt_phongbep.children[0].name = 'phongbep' + savePosition_x + savePosition_z;
				object_created.children[0].name = dataObject.name + positionX + positionZ;
				console.log('in ra object_created.children[0].name: ',object_created.children[0].name)
				scene.add( object_created );
				allNoithat2.push(object_created)
				console.log('in noithat2 push: ',allNoithat2)
				
			 
		 
		 });
		 getPosition_x = null;
		 getPosition_z = null;

		}
		const newObject_onSpace = (event,data, positionX, positionZ) => {
			dataObject = data[parseInt(event.target.dataset.key)];
			console.log('dataObject click dc: ',dataObject)
			console.log('in dataObject.path: ', dataObject.path)
			nameDataObject = dataObject.name;

			console.log(' positionX: ',positionX)
			console.log(' positionZ: ',positionZ)

			loader.load(dataObject.path, function ( gltf ) {
				let object_created = gltf.scene;
				// move_object2 = true;
				object_created.children[0].position.set(positionX, 0, positionZ)
			
				// nt_phongbep.children[0].name = 'phongbep' + savePosition_x + savePosition_z;
				object_created.children[0].name = dataObject.name + positionX + positionZ;
				console.log('in ra object_created.children[0].name: ',object_created.children[0].name)
				scene.add( object_created );
				allNoithat2.push(object_created)
				console.log('in noithat2 push: ',allNoithat2)
				
			 
		 
		 });
		}

		const movenewObject_onSpace = (event, data, positionX, positionY) => {
			let getnewObject = allNoithat2[allNoithat2.length -1];

			raycaster.setFromCamera(mouse, camera);
				var intersects = raycaster.intersectObjects(scene.children);
				intersects.forEach(function(intersect) {
					
					
					//Tao vecto3 lay toa do bat ky
					highlightPos = new THREE.Vector3().copy(intersect.point).floor().addScalar(0.5);
					
					console.log('allNoithat2[allNoithat2.length -1].children[0].name: ',allNoithat2[allNoithat2.length -1].children[0].name)
					console.log('nameDataObject: ',nameDataObject)
					console.log('clicktray_ChooseObject: ',clicktray_ChooseObject)
					// if(allNoithat2[allNoithat2.length -1].children[0].name === nameDataObject && clicktray_ChooseObject) {

					if( clicktray_ChooseObject && move_object2) {
						console.log('exclusive_name move: ',exclusive_name)

						if (exclusive_name === 'oto'){
							allNoithat2[i].children[0].position.set(fixedcenterPoint_otoX ,0,fixedcenterPoint_otoZ);
							console.log('dang vao oto')


						} else if (exclusive_name === 'noithatlau2') {
							console.log('dang vao noi that lau 2')
							allNoithat2[i].children[0].position.set(fixedcenterPoint_noithatlau2X ,0,fixedcenterPoint_noithatlau2Z);

						} else if (exclusive_name === 'noithatphongngu'){
							allNoithat2[i].children[0].position.set(fixedcenterPoint_noithatphongnguX ,0,fixedcenterPoint_noithatphongnguZ);


						} else if (nameDataObject === 'noithatphongbep' || nameDataObject === allNoithat2[allNoithat2.length -1].children[0].name){
							console.log('da vao noi that phong bep')

							allNoithat2[allNoithat2.length -1].children[0].position.set(fixedcenterPoint_noithatphongbepX ,0,fixedcenterPoint_noithatphongbepZ);


						} else if (exclusive_name === 'noithatphongkhach'){
							allNoithat2[i].children[0].position.set(fixedcenterPoint_noithatphongkhachX ,0,fixedcenterPoint_noithatphongkhachZ);

						}
						
						else {
							// allNoithat2[i].children[0].position.set(highlightPos.x -1.0 ,0,highlightPos.z );
							console.log('dang vao con lai')

						}
						
						
						}
						
			
					
					
				});

		
			 
		 
		 
		
		}

		window.addEventListener('mousemove', movenewObject_onSpace, false)

		document.getElementById( 'edit' ).addEventListener( 'click', function( e ) {
			console.log('da click edit')
			stopClickbyEdit = false;
			
		} );
		document.getElementById( 'delete' ).addEventListener( 'click', function( e ) {
			console.log('da click delete')
			for (let i =0; i < allNoithat2.length; i ++){
				if (allNoithat2[i].children[0].name === exclusive_name ){
					scene.remove(allNoithat2[i])

				} 
			}
		} );
		document.getElementById( 'move' ).addEventListener( 'click', function( event ) {
			
			console.log('Click Object')
			event.preventDefault();
			// mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			// mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
			raycaster.setFromCamera( mouse, camera );
			// currentAngle = controls.getPolarAngle();
			currentAngle = 	controls.getAzimuthalAngle ();

			console.log('in goc: ', currentAngle);
			var intersects = raycaster.intersectObjects( scene.children, true );
			move_object2 = true;

			if ( intersects.length > 0 ) {

				// console.log('Toa do click: ',intersects[0].point);
				console.log('in object click: ',intersects[0].object)
				// move_object2 = true;
				console.log('Da click nham object')
				NameObject = intersects[0].object.name;
				// console.log('object nene: ',noithat.children[0])
				console.log('Name Object: ',NameObject.split("_") [0])

				
			}

		}
	
	 );
		

		window.addEventListener('click',closeInfo, false)

		window.addEventListener('click',closemenu, false)
		window.addEventListener('contextmenu',rightClickobject, false)
		window.addEventListener('mousemove',clickShowInfo, false)


			

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

			// icon chuột
			function onPointerMove_mouse( event ) {
				mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
				mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

				raycaster.setFromCamera( mouse, camera );


				var intersects = raycaster.intersectObjects( scene.children, true  );

				if ( intersects.length > 0 ) {
					helper.position.set( 0, 0, 0 );
					helper.position.copy( intersects[ 0 ].point );
					// scene.add( helper );

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

			var TRAY_Cua = document.getElementById("js-tray-slide-cua");

			var TRAY_imageObject = document.getElementById("js-tray-slide-image-object");


			function buildColors(colors) {
				textureOption = "nhapho_8";
  				for (var [i, color] of colors.entries()) {
    				var swatch = document.createElement("div");
    				swatch.classList.add("tray__swatch");

      				swatch.style.backgroundImage = "url(" + color.texture + ")";
      				

    				swatch.setAttribute("data-key", i);
    				TRAY.append(swatch);
  				}
			}


			//Thay đổi màu mái
			function buildTranColors(colors) {
				textureOption_tran = "nhapho_119";
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
				textureOption_san = "nhapho_108";
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

			//Thay đổi màu của sổ
			function build_CuaColors(colors) {
				textureOption_cua = "cua_2";
  				for (var [i, color] of colors.entries()) {
    				var swatch_Cua = document.createElement("div");
    				swatch_Cua.classList.add("tray__swatch_Cua");
    				

    				if (color.texture) {
      					swatch_Cua.style.backgroundImage = "url(" + color.texture + ")";

    				} else {
      					swatch_Cua.style.background = "#" + color.color;

    				}

    				swatch_Cua.setAttribute("data-key", i);
    				TRAY_Cua.append(swatch_Cua);
  				}
			}

			function buildImageObject(colors){
  				for (var [i, color] of colors.entries()) {
    				var swatch_imageObject = document.createElement("div");
    				swatch_imageObject.classList.add("tray__swatch_imageObject");
    				

    				if (color.texture) {
						swatch_imageObject.style.backgroundImage = "url(" + color.texture + ")";

    				} else {
						swatch_imageObject.style.background = "#" + color.color;

    				}

    				swatch_imageObject.setAttribute("data-key", i);
    				TRAY_imageObject.append(swatch_imageObject);
  				}
			}
			
			
			buildTranColors(texturesTranAndColors);
			
			buildColors(texturesTuongAndColors);
			
			build_SanColors(texturesSanAndColors);


			build_CuaColors(texturesCuaAndColors);
			
			buildImageObject(texturesImageObject);

			// Swatches
			var swatches = document.querySelectorAll(".tray__swatch");
			
			var swatches_Tran = document.querySelectorAll(".tray__swatch_Tran");
			
			var swatches_San = document.querySelectorAll(".tray__swatch_San");

			var swatches_Cua = document.querySelectorAll(".tray__swatch_Cua");

			var swatches_imageObject = document.querySelectorAll(".tray__swatch_imageObject");
			

			for (var swatch of swatches_imageObject) {
				 swatch.addEventListener("click", (event) => {
					clicktray_ChooseObject = true;
				   getStateofclickSwatch = 'running_swatch';
				  // console.log('in thu trong swatch: ',getStateofclickSwatch)
				  console.log('in ra getPosition_x: ',getPosition_x)
				  console.log('in ra getPosition_z: ',getPosition_z)

				  if (getPosition_x === null && getPosition_z === null){
					console.log('dang vao await')
					move_object2 = true;
					newObject_onSpace(event, texturesImageObject, fixedcenterPoint_noithatphongbepX, fixedcenterPoint_noithatphongbepZ)

				  } else {
					newObject_by_clickInsert(event, texturesImageObject, getPosition_x +2.6 , getPosition_z -2.6 )

				  }

			  });	
		  	}
			for (var swatch of swatches) {
  				swatch.addEventListener("click", (event) => {
				 	getStateofclickSwatch = 'running_swatch';
					// console.log('in thu trong swatch: ',getStateofclickSwatch)
    				selectSwatch(event, ngoinha, texturesTuongAndColors, textureOption, get_event_v)

				});	
			}
			

			for (var swatch_Tran of swatches_Tran) {
				swatch_Tran.addEventListener("click", (event) =>{
					// console.log('in ra texturesTranAndColor: ',texturesTranAndColors)
			 		getStateofclickSwatch = 'running_swatch_Tran';
					//  console.log('in thu trong swatch: ',getStateofclickSwatch)

				  selectSwatch(event, ngoinha, texturesTranAndColors, textureOption_tran, get_event_v)
				 
			});
		  }
			
			for (var swatch_San of swatches_San) {
  				swatch_San.addEventListener("click", (event) =>{
				  getStateofclickSwatch = 'running_swatch_San';
				//   console.log('in thu trong swatch: ',getStateofclickSwatch)

    				selectSwatch(event, ngoinha, texturesSanAndColors, textureOption_san, get_event_v)
				});
			}

			for (var swatch_Cua of swatches_Cua) {
				swatch_Cua.addEventListener("click", (event) =>{
				getStateofclickSwatch = 'running_swatch_Cua';
				// console.log('in thu trong swatch: ',getStateofclickSwatch)

				  selectSwatch(event, cuaso, texturesCuaAndColors, textureOption_cua,get_event_v)
			});
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



		document.getElementById( 'nhamau1' ).addEventListener( 'click', function( e ) {
			scene.remove( noithat );
			scene.remove( ngoinha );
		} );

		document.getElementById( 'nhamau2' ).addEventListener( 'click', function( e ) {
			scene.add( noithat );
			scene.add( ngoinha );
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
        
        
		
