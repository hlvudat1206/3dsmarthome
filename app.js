import * as THREE from './build/three.module.js';
import { OrbitControls } from './js/OrbitControls.js';
import { GLTFLoader } from './js/GLTFLoader.js';
import { DRACOLoader } from './js/DRACOLoader.js';
import { CSS2DRenderer, CSS2DObject } from './js/CSS2DRenderer.js';
import { GUI } from './js/lil-gui.module.min.js';
import { getTextureMaterial, selectSwatch } from "./utils/materialHelper.js";
import { DragControls } from "./js/DragControls.js";
import {MouseMeshInteraction} from "./js/mousemes_interact.js";
// import {texturesImageObject}  from "./constants/imageObject.js";

import { TWEEN } from './js/tween.module.min.js';
import {Autotour,VivianiCurve} from './js/CurveExtras.js';
import {texturesImageObject} from "./constants/imageObject.js";
import { TransformControls } from './js/TransformControls.js';
import { texturesTuongAndColors, texturesTranAndColors, texturesSanAndColors, texturesCuaAndColors } from "./constants/constants.js";
		
		// let camera, scene, renderer, firstPerson;
		let hemiLight_helper;

		let renderer, scene, camera, miniCamera,firstPerson;
		let stateshowAxis= false;
		let exclusive_normalName;
		let x_centerBox, y_centerBox, z_centerBox;
		let cubeAxis
		let stateRightclick = false;
		let seconds;
		let transcon_Object;
		let bulbLightBack, bulbMatBack, hemiLight;
		let bulbLightFront, bulbMatFront;
		let hemiLightHelper, directionalLight1, dirLightHelper;
		let dirLight;
		let street
		let reflectionCube;
		let previousShadowMap = false;
		let groupNoithat
		// ref for lumens: http://www.power-sure.com/lumens.htm
		const bulbLuminousPowers = {
			'110000 lm (1000W)': 110000,
			'3500 lm (300W)': 3500,
			'1700 lm (100W)': 1700,
			'800 lm (60W)': 800,
			'400 lm (40W)': 400,
			'180 lm (25W)': 180,
			'20 lm (4W)': 20,
			'Off': 0
		};

		// ref for solar irradiances: https://en.wikipedia.org/wiki/Lux
		const hemiLuminousIrradiances = {
			'0.0001 lx (Moonless Night)': 0.0001,
			'0.002 lx (Night Airglow)': 0.002,
			'0.5 lx (Full Moon)': 0.5,
			'1.0 lx (Normal)': 2.0,

			'3.4 lx (City Twilight)': 3.4,
			'50 lx (Living Room)': 50,
			'100 lx (Very Overcast)': 100,
			'350 lx (Office Room)': 350,
			'400 lx (Sunrise/Sunset)': 400,
			'1000 lx (Overcast)': 1000,
			'18000 lx (Daylight)': 18000,
			'50000 lx (Direct Sun)': 50000
		};
		const params_bulb = {
			shadows: true,
			exposure: 0.68,
			bulbPowerBack: Object.keys( bulbLuminousPowers )[ 7 ],
			bulbPowerFront: Object.keys( bulbLuminousPowers )[ 7 ],

			hemiIrradiance: Object.keys( hemiLuminousIrradiances )[ 3 ]
		};

		let strDownloadMime = "image/octet-stream";
		let measurementDiv_x,measurementDiv_y,measurementDiv_z;
		let raycaster, mouse;
		let contextElement = document.getElementById("context-menu");;
		// const contextMenu = document.querySelector('.context-menu');
		const contextMenu2 = document.querySelector('.context-menu2');

		let joinRoom3D =false;
		let loader;
		let isUserInteracting = false,
			onPointerDownMouseX = 0, onPointerDownMouseY = 0,
					lon = 0, onPointerDownLon = 0,
					lat = 0, onPointerDownLat = 0,
					phi = 0, theta = 0;
		let controlCamera = false;

		let noithatlau2, noithatphongbep, noithatphongkhach, noithatphongngu, 
		cauthang, hethongden, thietbivesinh, oto;
		let noithatphongbepHover;
		let allNoithat2 = [];
		let borderhoverObject = [];
		let helper, ngoinha, noithat, cuaso;

		let savePosition_x;
		let savePosition_z;
		let centerPosition_PhongbepX;
		let centerPosition_PhongbepZ;



		let getPosition_x = null;
		let getPosition_z = null;

		let controls;

		let startTime, endTime;

		let rotation_speed = 0;

		let textureOption = "";
		
		let textureOption_tran = "";
		
		let textureOption_san = "";

		let textureOption_cua = ";"

		let pickableObjects;

		//Đo kích thước
		let ctrlDown = false;

		let lineId = 0;

		let line;
		
		let dracoLoader;

		let labelRenderer;
		let clock ;
		let drawingLine = false;
		let stopClickbyEdit = true;
		let measurementLabels = {};
		let measurementLabels_x = {};
		let measurementLabels_y = {};
		let measurementLabels_z = {};

		let objectchoose;
		let moveCameraClick = true;
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
		let object_created;
		
		let bienX = 0;
		let bienXTomove = 0;
		let currentPointerX = 0;
		let currentPointerY = 0;
		let groundMesh;
		let first_clickGround = false;
		let meshCurve;
		let statusAnimationCamera = false;

		const splineHelperObjects = [];

		let splinePointsLength = 12; 
		
	
		const positions = [];
		const point = new THREE.Vector3();

		const pointer = new THREE.Vector2();
		const onUpPosition = new THREE.Vector2();
		const onDownPosition = new THREE.Vector2();

		const geometry = new THREE.BoxGeometry( 0.5, 0.5, 0.5 );
		let transformControl;

		const ARC_SEGMENTS = 200;

		const splines = {};

		const params_splineEditor = {
			uniform: true,
			tension: 0.35,
			centripetal: true,
			chordal: true,
			addPoint: addPoint,
			removePoint: removePoint,
			exportSpline: exportSpline
		};
		
		let getDataObject = new XMLHttpRequest();
		let data_Object
		let data_object_array
		let statusProperties = false
		let insetWidth, insetHeight;

		let stats;
		let boxHover;
		
		let INTERSECTED;
		
		const radius = 100;
		let lights = [];

		getDataObject.open("GET", "https://starglobal3d.vn/sanpham/smart-home-3d/hoasen-home/backend/savedata.php", true);
		getDataObject.send();

		init();

		animate();
		
		function init() {
			
			
			//Get Data from server

		getDataObject.onreadystatechange = function() {
			
			if (this.readyState == 4 && this.status == 200) {
				data_Object = this.responseText;
				console.log('in ra text: ',data_Object)
				data_object_array = data_Object.split("-")
				console.log('in data_object_array: ',data_object_array)
				dataObjectoHTML()
			}
		};
		
			//KT trinh duyet
			console.log('He dieu hanh dang su dung: ',navigator.platform)
			raycaster = new THREE.Raycaster();
			clock = new THREE.Clock();
		

			labelRenderer = new CSS2DRenderer();

			mouse = new THREE.Vector2();
			
			dracoLoader = new DRACOLoader();

			let container = document.getElementById( 'container' );
			scene = new THREE.Scene();
			
			// camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.25, 1000 );
			// // camera.position.set(-10,5,-10);
			

			// camera.position.set( 26,5,1 );
			// // camera.position.set( 0,1,3 );
			// camera.lookAt(0,0,0);

			// let miniCamera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight,0.25, 1000 );
			// // camera.position.set(-10,5,-10);
			// miniCamera.position.copy( camera.position );
			// // camera.position.set( 0,1,3 );
			// // miniCamera.lookAt(0,0,-10);
			// miniCamera.position.set(26,10,1)
			// camera.add(miniCamera)
			// scene.add(camera)
			camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.25, 1000 );
				camera.position.set( 26, 5, 1 );
				camera.layers.toggle(1)

				miniCamera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.25, 1000 );
				miniCamera.position.copy( camera.position );
			

			groupNoithat = new THREE.Group();

			const geometryAxis = new THREE.BoxGeometry( 1, 1, 1 );
			const materialAxis = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
			cubeAxis = new THREE.Mesh( geometryAxis, materialAxis );
			// scene.add(cubeAxis)

			const planeMesh = new THREE.Mesh(new THREE.PlaneGeometry(20,9)
				, new THREE.MeshBasicMaterial({color: 0x38202c, side: THREE.DoubleSide,
					visible: false

				}));

			planeMesh.rotateX(Math.PI/2)
			planeMesh.name = 'ground';
			scene.add(planeMesh);
			planeMesh.position.set(0,-2.8,0);
			console.log('in planemesh: ',planeMesh)
			const params = {
				spline: 'GrannyKnot',
				scale: 4,
				extrusionSegments: 100,
				radiusSegments: 3,
				closed: true,
				animationView: false,
				lookAhead: false,
				cameraHelper: false,
			};
			const largePlanemesh = new THREE.Mesh(new THREE.PlaneGeometry(40,40)
				, new THREE.MeshBasicMaterial({color: 0xffff00, side: THREE.DoubleSide,
					visible: false

				}));
				
			largePlanemesh.rotateX(Math.PI/2)
			largePlanemesh.name = 'largeGround';
			scene.add(largePlanemesh);
			largePlanemesh.position.set(0,-4.0,0);
			console.log('in planemesh: ',planeMesh)

			//15 30
			// const gridHelper = new THREE.GridHelper(15, 30, 0xffffff, 0xffffff);
			// gridHelper.position.set(0,-2.6,0);
			// gridHelper.visible = false;
			// scene.add(gridHelper);
				
			hightlightPlaneMesh = new THREE.Mesh(new THREE.CircleGeometry(0.2,32)
				, new THREE.MeshBasicMaterial({color: 0x008000, side: THREE.DoubleSide
					
				}));
			
			hightlightPlaneMesh.rotateX(Math.PI/2);
			// hightlightPlaneMesh.rotateZ(Math.PI);
			// scene.add(hightlightPlaneMesh);



			groundMesh = new THREE.Mesh(new THREE.CircleGeometry(0.2,32)
				, new THREE.MeshBasicMaterial({color: 0xff0000, side: THREE.DoubleSide

				}));
				groundMesh.rotateX(Math.PI/2);
				// groundMesh.rotateZ(Math.PI);
			
			// scene.add(groundMesh);
			
			
			

			
			
			/*******
				 * Curves
				 *********/

			for ( let i = 0; i < splinePointsLength; i ++ ) {

				addSplineObject( positions[ i ] );

			}

			positions.length = 0;

			for ( let i = 0; i < splinePointsLength; i ++ ) {

				positions.push( splineHelperObjects[ i ].position );

			}

			const geometry = new THREE.BufferGeometry();
			geometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array( ARC_SEGMENTS * 3 ), 3 ) );

			let curve_splineEditor = new THREE.CatmullRomCurve3( positions );
			
			curve_splineEditor = new THREE.CatmullRomCurve3( positions );
			curve_splineEditor.curveType = 'centripetal';
			curve_splineEditor.mesh = new THREE.Line( geometry.clone(), new THREE.LineBasicMaterial( {
				color: 0x00ff00,
				opacity: 0.35,
				visible: true

			} ) );

			curve_splineEditor.mesh.castShadow = true;
			splines.centripetal = curve_splineEditor;

			curve_splineEditor = new THREE.CatmullRomCurve3( positions );
			curve_splineEditor.curveType = 'chordal';
			curve_splineEditor.mesh = new THREE.Line( geometry.clone(), new THREE.LineBasicMaterial( {
				color: 0x0000ff,
				opacity: 0.35,
				visible: true

			} ) );

			curve_splineEditor.mesh.castShadow = true;
			splines.chordal = curve_splineEditor;

			curve_splineEditor.curveType = 'catmullrom';
			curve_splineEditor.mesh = new THREE.Line( geometry.clone(), new THREE.LineBasicMaterial( {
				color: 0xff0000,
				opacity: 1,
				visible: true
			} ) );
			curve_splineEditor.mesh.castShadow = true;
			splines.uniform = curve_splineEditor;


			for ( const k in splines ) {

				const spline = splines[ k ];
				// scene.add( spline.mesh );

			}

			
			load([ 
				new THREE.Vector3( 16, 4.2, 0 ),
				new THREE.Vector3( 10, -0.4, -0.25 ),

				new THREE.Vector3( - 3.5, -1.5, 0.44 ),
				new THREE.Vector3( - 4.4, -1.2, 2.69),
				new THREE.Vector3( 0.2, -1.3, 1.3 ),
				new THREE.Vector3( 0.42, 0.2, 3.8 ),
				new THREE.Vector3( 1.0, 1.75, 1.2 ),
				new THREE.Vector3( 1.4, 1.9, -0.5 ),
				new THREE.Vector3( 5.18, 2.1, -0.7 ),
				new THREE.Vector3( 5.7, 1.9, -2.4 ),
				new THREE.Vector3( 2, 2, -2.8 ),
				new THREE.Vector3( 0.5, 1.7, -1.5 )



				 ]);

			

			//
			const geomytryCurve = new THREE.TubeGeometry(curve_splineEditor,100,0.6,1,true);

			const materialCurve = new THREE.MeshBasicMaterial({wireframe:true, color: 0xFF0000, visible: false});
			// meshCurve = new THREE.Mesh(geomytryCurve, materialCurve);
			meshCurve = new THREE.Mesh(geomytryCurve, materialCurve);
			// meshCurve.position.set(20, 10, 0);
			scene.add(meshCurve)

			//Ảnh nền model
			let path = './cube/';
			let format = '.jpg';
			let urls = [
				path + 'pano_r' + format, path + 'pano_l' + format,
				path + 'pano_u' + format, path + 'pano_d' + format,
				path + 'pano_f' + format, path + 'pano_b' + format
			];

			let folder = "./models/";
			let duoi_file = ".gltf";
			let model_url = [
				"noithatlau2",
				"noithatphongbep",
				"noithatphongkhach",
				"noithatphongngu",
				"cauthang",
				"hethongden",
				"thietbivesinh",
				"oto"
			];
	

			reflectionCube = new THREE.CubeTextureLoader().load( urls );

			let onProgress = function ( xhr ) {
				if ( xhr.lengthComputable ) {
					let percentComplete = xhr.loaded / xhr.total * 100;
					document.getElementById("progress").value =  Math.round( percentComplete, 2 ) + '% Đang tải chờ chút nhé.';
				}
			};

			
		
			pickableObjects = new Array();

			loader = new GLTFLoader();
			dracoLoader.setDecoderPath("./");
			dracoLoader.setDecoderConfig({type: 'js'});
			loader.setDRACOLoader( dracoLoader );

			
				
			loader.load( folder + 'nhapho.gltf', function ( gltf ) {

				ngoinha = gltf.scene;					
				ngoinha.position.set(0,0,0);

				ngoinha.name='ngoinha';
				console.log('in ra ngoi nha: ', ngoinha)
				gltf.scene.traverse(function (child) {
					if (child.isMesh) {
						child.material.side = THREE.DoubleSide;
						child.material.clippingPlanes = [ localPlane, yclipPlane  ];
						child.material.localClippingEnabled = [ globalPlane ];
						// child.material.clippingPlanes[0].constant = child.material.clippingPlanes[0].distanceToPoint(child.position)
						let m = child;
						
						// console.log(child);
						
						switch (m.name) {
							case "nhapho_2":
							m.material.transparent  = true;
							m.material.opacity = 0.5;
							m.material.color = new THREE.Color("rgb(20, 41, 81)");

						}

					
					pickableObjects.push(child);
					}
					document.getElementById("js-loader").style.display =  'none';
				  	document.getElementById("progress").style.display =  'none';
				  });
				  console.log(' in objectchoose',objectchoose )
				
				  scene.add(ngoinha);
				  

			}, onProgress, function ( e ) {
				console.error( e );
			
			
			});
			// GROUND
			loader.load( folder + 'street.gltf', function ( gltf ) {

				street = gltf.scene;					
				street.position.set(1,-4,1);
				street.scale.set(0.3,0.3,0.3);
				street.name='street';
				
				  scene.add(street);


			});

			loader.load( folder + 'cua.gltf', function ( gltf ) {

				cuaso = gltf.scene;

				cuaso.traverse(function (child) {
					if (child.isMesh) {
						child.material.side = THREE.DoubleSide;
						child.material.clippingPlanes = [ localPlane, yclipPlane  ];
						child.material.localClippingEnabled = [ globalPlane ];
					let m = child;
					
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
			
			
			loader.load( folder + 'noithatlau2.gltf', function ( gltf ) {

				noithatlau2 = gltf.scene;
				allNoithat2.push(noithatlau2)
				noithatlau2.traverse(function (child) {
							if (child.isMesh) {
								child.material.side = THREE.DoubleSide;
								child.material.clippingPlanes = [ localPlane, yclipPlane  ];
								child.material.localClippingEnabled = [ globalPlane ];
								child.material.envMap = reflectionCube;
								let m = child;


								
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
				console.log('in noithatphongbep test: ',noithatphongbep)

				allNoithat2.push(noithatphongbep)
				noithatphongbep.traverse(function (child) {
							if (child.isMesh) {
								child.material.side = THREE.DoubleSide;
								child.material.clippingPlanes = [ localPlane, yclipPlane  ];
								child.material.localClippingEnabled = [ globalPlane ];
								child.material.envMap = reflectionCube;
								let m = child;


								
								pickableObjects.push(child);
							}
						});
						scene.add( noithatphongbep );
						

					document.getElementById("js-loader").style.display =  'none';
					document.getElementById("progress").style.display =  'none';
					
					

			}, onProgress, function ( e ) {
				console.error( e );
			
			
			}
			);
			
			loader.load( folder + 'noithatphongkhach.gltf', function ( gltf ) {

				noithatphongkhach = gltf.scene;
				allNoithat2.push(noithatphongkhach)
				noithatphongkhach.traverse(function (child) {
							if (child.isMesh) {
								child.material.side = THREE.DoubleSide;
								child.material.clippingPlanes = [ localPlane, yclipPlane  ];
								child.material.localClippingEnabled = [ globalPlane ];
								child.material.envMap = reflectionCube;
								let m = child;


								
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
								let m = child;


								
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
								let m = child;


								
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
								let m = child;


								
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
								let m = child;


								
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
								let m = child;


								
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

			const globalPlane = new THREE.Plane( new THREE.Vector3( - 10, 0, 0 ), 2 );

			
			const yclipPlane = new THREE.Plane( new THREE.Vector3( 0, 0, -10 ), 2 );

			//Light in house			
			const bulbGeometry = new THREE.SphereGeometry( 0.2, 16, 8 );
			bulbLightBack = new THREE.PointLight( 0xffee88, 1, 100, 2 );

			bulbMatBack = new THREE.MeshStandardMaterial( {
				emissive: 0xffffee,
				emissiveIntensity: 1,
				color: 0xA9A9A9
			} );
			bulbLightBack.add( new THREE.Mesh( bulbGeometry, bulbMatBack ) );
			bulbLightBack.position.set( -4, 1.0, 3 );
			bulbLightBack.castShadow = true;
			scene.add( bulbLightBack );

			const bulbGeometryFront = new THREE.SphereGeometry( 0.2, 16, 8 );

			bulbLightFront = new THREE.PointLight( 0xffee88, 1, 100, 2 );

			bulbMatFront = new THREE.MeshStandardMaterial( {
				emissive: 0xffffee,
				emissiveIntensity: 1,
				color: 0xA9A9A9
			} );
			bulbLightFront.add( new THREE.Mesh( bulbGeometryFront, bulbMatFront ) );
			bulbLightFront.position.set( 4, 0.4, -3.0 );
			bulbLightFront.castShadow = true;
			scene.add( bulbLightFront );
			
			
			
			

			// const floorGeometry = new THREE.PlaneGeometry( 20, 20 );
			// const floorMesh = new THREE.Mesh( floorGeometry, floorMat );
			// floorMesh.receiveShadow = true;
			// floorMesh.rotation.x = - Math.PI / 2.0;
			// scene.add( floorMesh );

			// const ballGeometry = new THREE.SphereGeometry( 0.25, 32, 32 );
			// const ballMesh = new THREE.Mesh( ballGeometry, ballMat );
			// ballMesh.position.set( 1, 0.25, 1 );
			// ballMesh.rotation.y = Math.PI;
			// ballMesh.castShadow = true;
			// scene.add( ballMesh );

			
							

			//Đèn không gian


			// let HemisphereLight1 = new THREE.HemisphereLight( 0xE9EAD6, 0XF9B52F, 0.15);
			// // HemisphereLight1.position.set(3.4, 3, 0);
			// HemisphereLight1.position.set(3.4, 25, 0);

			// scene.add(HemisphereLight1);
			
			// const hemiLightHelper = new THREE.HemisphereLightHelper( HemisphereLight1, 2 );
			// 	scene.add( hemiLightHelper );

			
			// hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 2 );
			// 	scene.add( hemiLightHelper );
			// Lights
			// directionalLight1 = new THREE.DirectionalLight( 0xffffff, 0.1 );
			// // directionalLight1.position.set( 5, 15, 1 );
			// directionalLight1.position.set( 5, 30, 1 );

			// scene.add( directionalLight1 );

			// dirLightHelper = new THREE.DirectionalLightHelper( directionalLight1, 2 );

			// scene.add( dirLightHelper );

			///////////////////////////////////Su dung gan day
			// hemiLight = new THREE.HemisphereLight( 0xddeeff, 0x0f0e0d, 0.02 );
			// scene.add( hemiLight );
			// //new dirlight
			
			//  dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
			// 	dirLight.color.setHSL( 0.1, 1, 0.95 );
			// 	// dirLight.position.set( - 1, 1.75, 1 );
			// 	dirLight.position.set( - 1, 30, 1 );

			// 	dirLight.position.multiplyScalar( 50 );
			// 	scene.add( dirLight );

			// 	dirLight.castShadow = true;

			// 	dirLight.shadow.mapSize.width = 2048;
			// 	dirLight.shadow.mapSize.height = 2048;

			// 	const d = 50;

			// 	dirLight.shadow.camera.left = - d;
			// 	dirLight.shadow.camera.right = d;
			// 	dirLight.shadow.camera.top = d;
			// 	dirLight.shadow.camera.bottom = - d;

			// 	dirLight.shadow.camera.far = 3500;
			// 	dirLight.shadow.bias = - 0.0001;

			// 	// dirLightHelper = new THREE.DirectionalLightHelper( dirLight, 10 );
			// 	// scene.add( dirLightHelper );



				
const light1  = new THREE.AmbientLight(0xffffff, 0.3);
light1.name = 'ambient_light';
camera.add(light1)
// scene.add(light1)
hemiLight = new THREE.HemisphereLight();
// hemiLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 24 );
// hemiLight = new THREE.HemisphereLight( 0xffffed, 0x080820, 24 );

// hemiLight = new THREE.HemisphereLight( 0xf0e424, 0xd41384, 24 );

// hemiLight.position.set(0,25,0)
// hemiLight.position.set(0,20,0)

scene.add( hemiLight );
lights.push(hemiLight)
// hemiLight.intensity = 0.3;
// hemiLight.color.setHex(0xFFFFFF);
// light1.intensity = 0.8 * Math.PI;
// light1.color.setHex(0xFFFFFF);

hemiLight_helper = new THREE.HemisphereLightHelper( hemiLight, 5 );
// scene.add( hemiLight_helper );
scene.add( new THREE.AmbientLight( 0xaaaaaa, 0.2 ) );

const light = new THREE.DirectionalLight( 0xffffff, 0.8 * Math.PI );
light.position.set(0.5, 0, 0.866); // ~60º
camera.add(light)
lights.push(light1,light)
// light.castShadow = true;
// light.shadow.mapSize.width = 1024;
// light.shadow.mapSize.height = 1024;

// const d = 10;

// light.shadow.camera.left = - d;
// light.shadow.camera.right = d;
// light.shadow.camera.top = d;
// light.shadow.camera.bottom = - d;
// light.shadow.camera.far = 1000;

scene.add( light );
			// GROUND

			// const groundGeo = new THREE.PlaneGeometry( 10000, 10000 );
			// const groundMat = new THREE.MeshLambertMaterial( { color: 0xffffff } );
			// groundMat.color.setHSL( 0.095, 1, 0.75 );

			// const ground = new THREE.Mesh( groundGeo, groundMat );
			// ground.position.y = - 10;
			// ground.rotation.x = - Math.PI / 2;
			// ground.receiveShadow = true;
			// scene.add( ground );

			//Pointer
			let geometryHelper = new THREE.CircleGeometry( 0.3, 10000 );
			geometryHelper.translate( 0, 0, 0.01 );
			const marker = new THREE.TextureLoader().load( 'img/marker.png' );

			let rollOverMaterial = new THREE.MeshBasicMaterial( { map: marker, color: 0x00000, flatShading: true, transparent: true, opacity: 0.7 } );
			// let rollOverMaterial = new THREE.MeshBasicMaterial( {  color: 0xff0000, flatShading: true, transparent: true, opacity: 0.7 } );

			helper = new THREE.Mesh( geometryHelper, rollOverMaterial );			

			// renderer = new THREE.WebGLRenderer({container, camera, alpha: false, antialias : true, preserveDrawingBuffer: true});

			// renderer.rendererSize = {width: window.innerWidth, height: window.innerHeight, quality: 30, maxQuality: 50, minQuality: 20};
			
			// renderer.setPixelRatio( window.devicePixelRatio );

			// renderer.setSize( window.innerWidth, window.innerHeight );

			// renderer.outputEncoding = THREE.sRGBEncoding;
			// // renderer.toneMapping = THREE.ReinhardToneMapping;
			// // renderer.toneMappingExposure = 2.3;
			// renderer.shadowMap.enabled = true;

			
			renderer = new THREE.WebGLRenderer( { antialias: true } );
			renderer.physicallyCorrectLights = true;
			renderer.setPixelRatio( window.devicePixelRatio );
			
			// renderer.setClearColor( 0x000000, 0.0 );
			renderer.setSize( window.innerWidth, window.innerHeight );
			renderer.outputEncoding = THREE.sRGBEncoding;
			renderer.shadowMap.enabled = true;
			
				// document.body.appendChild( renderer.domElement );

			container.appendChild( renderer.domElement );

			scene.background = reflectionCube;

	

			labelRenderer.setSize(window.innerWidth, window.innerHeight);
			labelRenderer.domElement.style.position = 'absolute';
			labelRenderer.domElement.style.top = '2px';
			labelRenderer.domElement.style.pointerEvents = 'none';


			container.appendChild( labelRenderer.domElement );
			
			// camera.position.set( -10, 5, 100 );

			
			// camera.lookAt(0, 0, 0);

			//TransformControl
			transcon_Object = new TransformControls( camera, renderer.domElement );
			transcon_Object.size = 0.75
			transcon_Object.addEventListener( 'change', render );
			transcon_Object.addEventListener( 'dragging-changed', function ( event ) {

				controls.enabled = ! event.value;

			} );
			// scene.add( transcon_Object );
			transcon_Object.addEventListener( 'objectChange', function () {

			} );


			controls = new OrbitControls(camera, renderer.domElement);
			controls.enabled = true;
			
			// controls.target.set(-8.5, 5, 0);
			
			// camera.position.set( 35,10,1 );
			
			controls.keys = {
				LEFT: 'ArrowLeft', //left arrow
				UP: 'ArrowUp', // up arrow
				RIGHT: 'ArrowRight', // right arrow
				BOTTOM: 'ArrowDown' // down arrow
			}

			controls.target.set(0, 0, 0);
			// controls.enableDamping = true;
			controls.minDistance = 1;
			controls.maxDistance = 50;

			// controls.maxPolarAngle = 1.5;
			controls.maxPolarAngle = 2.5;

			controls.panSpeed = 3;
			
			controls.direction = -1;
			controls.enableRotate = true;

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

			
			//** enable transformControl **************/

			// transformControl = new TransformControls( camera, renderer.domElement );
			
			// console.log(' transformControl axis: ',transformControl.axis)

			// transformControl.addEventListener( 'change', render );
			// transformControl.addEventListener( 'dragging-changed', function ( event ) {

			// 	controls.enabled = ! event.value;

			// } );
			// scene.add( transformControl );

			// transformControl.addEventListener( 'objectChange', function () {

			// 	updateSplineOutline();

			// } );

			//************************************ */
			let saveLink = document.createElement('div');
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
			folderLocal.add( propsLocal, 'Mặt cắt', -0.33, 2 );

			folderGlobal.add( propsGlobal, 'Kích hoạt' );
			folderGlobal.add( propsGlobal, 'Mặt cắt', -0.7, 2 );

			folderLocal2.add( propsLocal2, 'Kích hoạt' );
			folderLocal2.add( propsLocal2, 'Mặt cắt', -0.33, 2 );
			

			container.addEventListener( 'pointerdown', onPointerDown );

			container.addEventListener( 'pointermove', onPointerMove_mouse, false );

			container.addEventListener( 'mouseup', moveCamera, true );
			container.addEventListener( 'mousedown', startTimer, true );

			container.addEventListener('resize', onWindowResize, false);
			


			const folderlightHome = gui.addFolder('Light in house');
			
			folderlightHome.add( params_bulb, 'hemiIrradiance', Object.keys( hemiLuminousIrradiances ) );
			folderlightHome.add( params_bulb, 'bulbPowerFront', Object.keys( bulbLuminousPowers ) );

			folderlightHome.add( params_bulb, 'bulbPowerBack', Object.keys( bulbLuminousPowers ) );

			// folderlightHome.add( params_bulb, 'exposure', 0, 1 );
			// folderlightHome.add( params_bulb, 'shadows' );

			folderlightHome.add( params_bulb, 'shadows' );

			gui.open();




			const folderCamera = gui.addFolder('Auto Tour');
			folderCamera.add(params, 'animationView').onChange(function(){
				// animateCamera();
				statusAnimationCamera = !statusAnimationCamera;
				console.log(' in ra statusAnimationCamera: ',statusAnimationCamera)
			})

			//**************************************************//			
			//enable spline editor
		
			// gui.add( params_splineEditor, 'uniform' ).onChange( render );
			// gui.add( params_splineEditor, 'tension', 0, 1 ).step( 0.01 ).onChange( function ( value ) {

			// splines.uniform.tension = value;
			// updateSplineOutline();
			// render();

			// } );
			// gui.add( params_splineEditor, 'centripetal' ).onChange( render );
			// gui.add( params_splineEditor, 'chordal' ).onChange( render );
			// gui.add( params_splineEditor, 'addPoint' );
			// gui.add( params_splineEditor, 'removePoint' );
			// gui.add( params_splineEditor, 'exportSpline' );
			
			gui.open();

			document.addEventListener( 'pointerdown', onPointerDown_splineEditor );
			document.addEventListener( 'pointerup', onPointerUp_splineEditor );
			document.addEventListener( 'pointermove', onPointerMove_splineEditor );
			// window.addEventListener( 'resize', onWindowResize );

			render();
			

		}
		

		
		function addSplineObject( position ) {

			const material = new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff , visible: false} );
			const object = new THREE.Mesh( geometry, material );

			if ( position ) {

				object.position.copy( position );

			} else {

				// object.position.x = Math.random() * 1000 - 500;
				// object.position.y = Math.random() * 600;
				// object.position.z = Math.random() * 800 - 400;
				object.position.x = Math.random() * 10 - 5;
				// object.position.y = Math.random() * 600 - 400;
				object.position.y = Math.random() * 10;

				object.position.z = Math.random() * 8 - 10;

			}

			object.castShadow = true;
			object.receiveShadow = true;
			scene.add( object );
			splineHelperObjects.push( object );
			return object;

		}

		function addPoint() {

			splinePointsLength ++;

			positions.push( addSplineObject().position );

			updateSplineOutline();

			render();

		}

		function removePoint() {

			if ( splinePointsLength <= 4 ) {

				return;

			}

			const point = splineHelperObjects.pop();
			splinePointsLength --;
			positions.pop();

			if ( transformControl.object === point ) transformControl.detach();
			scene.remove( point );

			updateSplineOutline();

			render();

		}
		function updateSplineOutline() {

			for ( const k in splines ) {

				const spline = splines[ k ];

				const splineMesh = spline.mesh;
				const position = splineMesh.geometry.attributes.position;

				for ( let i = 0; i < ARC_SEGMENTS; i ++ ) {

					const t = i / ( ARC_SEGMENTS - 1 );
					spline.getPoint( t, point );
					position.setXYZ( i, point.x, point.y, point.z );

				}

				position.needsUpdate = true;

			}

		}

		function exportSpline() {

			const strplace = [];

			for ( let i = 0; i < splinePointsLength; i ++ ) {

				const p = splineHelperObjects[ i ].position;
				strplace.push( `new THREE.Vector3(${p.x}, ${p.y}, ${p.z})` );

			}

			console.log( strplace.join( ',\n' ) );
			const code = '[' + ( strplace.join( ',\n\t' ) ) + ']';
			prompt( 'copy and paste code', code );

		}
		function load( new_positions ) {

			while ( new_positions.length > positions.length ) {

				addPoint();

			}

			while ( new_positions.length < positions.length ) {

				removePoint();

			}

			for ( let i = 0; i < positions.length; i ++ ) {

				positions[ i ].copy( new_positions[ i ] );

			}

			updateSplineOutline();

		}
		function render() {

			splines.uniform.mesh.visible = params_splineEditor.uniform;
			splines.centripetal.mesh.visible = params_splineEditor.centripetal;
			splines.chordal.mesh.visible = params_splineEditor.chordal;
			

			
			// renderer.render( scene, camera );

			renderer.toneMappingExposure = Math.pow( params_bulb.exposure, 5.0 ); // to allow for very bright scenes.
			renderer.shadowMap.enabled = params_bulb.shadows;
			bulbLightBack.castShadow = params_bulb.shadows;

				

			bulbLightBack.power = bulbLuminousPowers[ params_bulb.bulbPowerBack ];
			bulbMatBack.emissiveIntensity = bulbLightBack.intensity / Math.pow( 0.02, 2.0 ); // convert from intensity to irradiance at bulb surface

			hemiLight.intensity = hemiLuminousIrradiances[ params_bulb.hemiIrradiance ];
			const time = Date.now() * 0.0005;
			

			// bulbLightBack.position.y = Math.cos( time ) * 0.75 + 1.25;
			bulbLightBack.position.y = Math.cos( time ) * 0.0 + 1.25;


			bulbLightFront.castShadow = params_bulb.shadows;

				

			bulbLightFront.power = bulbLuminousPowers[ params_bulb.bulbPowerFront ];
			bulbMatFront.emissiveIntensity = bulbLightFront.intensity / Math.pow( 0.02, 2.0 ); // convert from intensity to irradiance at bulb surface
			renderer.render( scene, camera );

			// stats.update();


		}
		function onPointerDown_splineEditor( event ) {

			onDownPosition.x = event.clientX;
			onDownPosition.y = event.clientY;

		}

		function onPointerUp_splineEditor() {

			onUpPosition.x = event.clientX;
			onUpPosition.y = event.clientY;
			if (transformControl === null){

			} else{
				if ( onDownPosition.distanceTo( onUpPosition ) === 0 ) transformControl.detach();

			}

		}

		function onPointerMove_splineEditor( event ) {

			pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

			raycaster.setFromCamera( pointer, camera );

			const intersects = raycaster.intersectObjects( splineHelperObjects, false );

			if ( intersects.length > 0 ) {

				const object = intersects[ 0 ].object;

				if (transformControl === null){

				}else{

					if ( object !== transformControl.object ) {

						transformControl.attach( object );
	
					}
				}
				

			}

		}


		document.getElementById( 'saveLink' ).addEventListener( 'click', function( e ) {
			let saveFile = function (strData, filename) {
				let link = document.createElement('a');
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
		
			

			let imgData, imgNode;
			startTime = new Date();

			  // get seconds
			  let seconds = Math.round(startTime);

			try {
				let strMime = "image/jpeg";
				imgData = renderer.domElement.toDataURL(strMime);
	
				saveFile(imgData.replace(strMime, strDownloadMime), "capture_"+seconds+".jpg");
	
			} catch (e) {
				console.log(e);
				return;
			}

		} );
		function updateCamera(){
			const time = clock.getElapsedTime();
			console.log('in ra time: ',time)
			const looptime = 30;
			const t = (time% looptime)/ looptime;
			console.log('in ra t: ',t)
			const t2 = ((time + 0.1) % looptime)/looptime;
			console.log('in ra t2: ',t2)

			const pos = meshCurve.geometry.parameters.path.getPointAt(t);
			const pos2 =  meshCurve.geometry.parameters.path.getPointAt(t2);
			camera.position.copy(pos);
			camera.lookAt(pos2);
		}
		
		

		function startTimer(){
			//rotation_speed = 0;
			startTime = new Date();
			moveCameraClick = true;
			console.log('in ra startTime: ',startTime)
			scene.remove( helper );
			event.preventDefault();
			mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
			raycaster.setFromCamera( mouse, camera );

			//let intersects = raycaster.intersectObjects( scene.children, true );

		}

		function onWindowResize() {

			camera.aspect = window.innerWidth / window.innerHeight;

			camera.updateProjectionMatrix();

			renderer.setSize( window.innerWidth, window.innerHeight );

			labelRenderer.setSize(window.innerWidth, window.innerHeight);

			insetWidth = window.innerWidth/8;
			insetHeight = window.innerHeight/8;
			miniCamera.aspect = insetWidth/insetHeight
			miniCamera.updateProjectionMatrix();
		}



	
		function animate() {
			
			//ngoinha.rotation.y -= rotation_speed;

			requestAnimationFrame( animate );

			labelRenderer.render(scene, camera);
			update();
			render();
			TWEEN.update();
			if (firstPerson != null){
				firstPerson.update(0.3);

			}
			if (statusAnimationCamera){
				updateCamera()
			}
			// console.log('in cubeAxis: ',cubeAxis)
			// allNoithat2[3].children[0].parent.position.x = cubeAxis.parent.position.x;
			// allNoithat2[3].children[0].parent.position.y = cubeAxis.parent.position.y;
			// allNoithat2[3].children[0].parent.position.z = cubeAxis.parent.position.z;
			// console.log('in allNoithat3: ',allNoithat2[3])


			// if (camera.position.y <0) {
			// 	controlCamera = true;
			// }
			// main scene
			renderer.setClearColor( 0xf58a42, 0 );

			renderer.setViewport( 0, 0, window.innerWidth, window.innerHeight );

			renderer.render(scene, camera);

			// controls.update(); // required if damping enabled
			
			// renderer.clearDepth();
			// renderer.setScissor(
			// 	window.innerWidth - insetWidth -16,
			// 	window.innerHeight - insetHeight - 16,
			// 	insetWidth,
			// 	insetHeight
			// )

			// renderer.setViewport(
			// 	window.innerWidth - insetWidth -16,
			// 	window.innerHeight - insetHeight - 16,
			// 	insetWidth,
			// 	insetHeight
			// )
			// renderer.render(camera, miniCamera);
			// renderer.setScissorTest(true);

			// inset scene

			renderer.setClearColor( 0x222222, 1 );

			renderer.clearDepth(); // important!

			renderer.setScissorTest( true );

			renderer.setScissor( 20, 20, insetWidth, insetHeight );

			renderer.setViewport( 20, 20, insetWidth, insetHeight );

			miniCamera.position.copy( camera.position );
			miniCamera.quaternion.copy( camera.quaternion );

			// renderer will set this eventually

			renderer.render( scene, miniCamera );

			renderer.setScissorTest( false );
		}
		function update() {


			if ( isUserInteracting === false ) {

				lon += 0.03;

			}
			
			
			if (controlCamera === true){
				// console.log(' da vao controlCamera: ',controlCamera)

				lat = Math.max( - 120, Math.min( 120, lat ) );
				phi = THREE.MathUtils.degToRad( 90 - lat );
				theta = THREE.MathUtils.degToRad( lon );

				let x = 500 * Math.sin( phi ) * Math.cos( theta );
				let y = 500 * Math.cos( phi );
				let z = 500 * Math.sin( phi ) * Math.sin( theta );

				// camera.lookAt( x, y, z );
				// if (camera.position.y < 0){
				camera.lookAt( x, y, z );

				// }
				
				// camera.lookAt(0,0,0);

				renderer.render( scene, camera );

				
			}


		}
	

		//Di chuyển trên sàn
		
		function moveCamera( event ) {
			endTime = new Date();
			let timeDiff = endTime - startTime; //in ms
			// strip the ms
			timeDiff /= 500;

			// get seconds
			seconds = Math.round(timeDiff);
			console.log(seconds + " seconds");

			event.preventDefault();
			mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
			raycaster.setFromCamera( mouse, camera );

			let intersects = raycaster.intersectObjects( scene.children, true );
			if (moveCameraClick == true){
			 if ( intersects.length > 0 ) {

				console.log(intersects[0].point);
				// console.log('in x:', intersects[0].point.x)
				// let selectObject = intersects[0].object.userData.currentSquare;
				let clickedName = intersects[0].object.name;
				objectchoose = clickedName;
				let clickObject = intersects[0].object
				console.log('in object vua click: ',intersects[0].object)
				console.log('All object: ',allNoithat2)
				console.log('in ngoi nha: ', ngoinha)
				console.log('Tên: ' + clickedName);
				console.log('lookAt da hoat dong')
				// camera.lookAt(10,0,1)
				// if ( intersects[0].object.parent.parent.name === 'ngoinha' ){
				if ( intersects[0].object.isObject3D && seconds < 0.05 &&  clickedName ==='ground'){

				// if ( clickedName === 'ground' && seconds < 0.1 ){
					console.log('Dang vao duoc dieu huong')
					let coords = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
					
					new TWEEN.Tween(coords)
						.to({ x: intersects[0].point.x, y: (intersects[0].point.y) + 2.3,  z: intersects[0].point.z})
						.onUpdate(() => camera.position.set(coords.x, coords.y, coords.z)
								)
						.start();
					controls.enabled = false;
					isUserInteracting = true;
					controlCamera = true;

					
			} else {
					console.log('Ko Dang vao duoc dieu huong')
					

				}
			}
				
			}
			
			
			

		}
		

		
		function click_Object (event) {
			if (move_object & stopClickbyEdit) {
				move_object2 = false;
				move_object = false;
				clicktray_ChooseObject = false;
				// console.log('Object has stopped')
				event.preventDefault();
				mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
				mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
				raycaster.setFromCamera( mouse, camera );

				let intersects = raycaster.intersectObjects( scene.children, true );

				if ( intersects.length > 0 ) {

					// console.log('Toa do click: ',intersects[0].point);
					
					NameObject = intersects[0].object.name;
					console.log('in ra transcon_obiect: ',transcon_Object)
					console.log('in toan bo Object: ',allNoithat2)
					console.log('dang click object: ',intersects[0].object)
					// intersects[0].object.position.set(intersects[0].point.x,0,intersects[0].point.z)
					// intersects[0].object.material.opacity =0.5;
					
				} 


			} 


		}
		window.addEventListener('click', click_Object, false);
	
		// }

		

		function editObject (event){
			console.log('da click editObject')
			}
		window.addEventListener('click', editObject, false);

		function moveObject (event) {
			
			if (move_object2 & stopClickbyEdit){
				// console.log('Da moveObject')
			move_object = true;
			// console.log('Object has moved')
			event.preventDefault();

			raycaster.setFromCamera(mouse, camera);
			let intersects = raycaster.intersectObjects(scene.children);
			
			intersects.forEach(function(intersect) {
				//highlightPos = new THREE.Vector3().copy(intersect.point).floor().addScalar(0.5);

				for (let i =0; i < allNoithat2.length; i ++){
				
				console.log('in allNoithat2[i].children[0].name: ',allNoithat2[i].children[0].name)
				console.log('exclusive_name: ',exclusive_name)
				if(allNoithat2[i].children[0].name === exclusive_name) {

					transcon_Object.attach(allNoithat2[i])
					// if (transcon_Object.position.x === 0 && transcon_Object.position.y === 0 &&transcon_Object.position.z === 0){ //Kiem tra neu axis chua duoc move thi move, move roi thi ko move nua
					// 	transcon_Object.position.set(x_centerBox, y_centerBox, z_centerBox)

					// } 
					transcon_Object.position.set(-allNoithat2[i].position.x+x_centerBox,-allNoithat2[i].position.y +y_centerBox,-allNoithat2[i].position.z +z_centerBox)

					console.log('in transcon_Object: ',transcon_Object)
					
					transcon_Object.setMode("translate")
					scene.add( transcon_Object );
	
					}
				}
			})
			}

		}
		window.addEventListener('click', moveObject, false);

		// moveObject(e,texturesImageObject)


		const objects =[];
		const moveMousegrid =(e) => {
			currentAngle = 	controls.getAzimuthalAngle ();

			// console.log('in goc: ', currentAngle);

			raycaster.setFromCamera(mouse, camera);
			let intersects = raycaster.intersectObjects(scene.children);
			intersects.forEach(function(intersect) {
				if(intersect.object.name === 'ground') {
					// console.log('da bat ddc ground')
					//Tao vecto3 lay toa do bat ky
					highlightPos = new THREE.Vector3().copy(intersect.point).floor().addScalar(0);
					// console.log('in toa do: ', highlightPos)
					hightlightPlaneMesh.position.set(highlightPos.x, -2.5, highlightPos.z);

					

		
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
				if(intersect.object.name === 'largeGround') {
					// console.log('da bat ddc ground')
					//Tao vecto3 lay toa do bat ky
					let groundPos = new THREE.Vector3().copy(intersect.point).floor().addScalar(0.5);
					// console.log('in toa do: ', highlightPos)
					groundMesh.position.set(groundPos.x, -3.75, groundPos.z);

					
		
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
	// const contextMenu2 = document.querySelector('.context-menu2');
	
	function hoverObject (event){
		// console.log(' da hover')
		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
		raycaster.setFromCamera( mouse, camera );
		let intersects = raycaster.intersectObjects(scene.children, true);
		


			// if (intersects[0].object.name === allNoithat2[i].children[0].name){
		if (intersects.length > 0 ){
			for (let i =0; i < allNoithat2.length; i ++){
				// console.log('in intersects[0].object.parent.name: ',intersects[0].object.parent)
				if (intersects[0].object.parent != null){
				if (allNoithat2[i].children[0].name === intersects[0].object.parent.name ){
					// console.log('in  allNoithat2[i].children[0].name: ', allNoithat2[i].children[0].name)
					// console.log('in intersects[0].object.parent.name: ',intersects[0].object.parent.name)
					// console.log('in chu')
					boxHover = new THREE.BoxHelper(allNoithat2[i].children[0], 0xff0000)
					scene.add(boxHover)
				
					getBoxHelperVertices(boxHover);

					break
	
				} 
			
				
			else if (allNoithat2[i].children[0].name === intersects[0].object.name.split("_") [0]     ){
				
				// console.log('Da trung trong chuc nang hover')
				// console.log('in ra hover: ',intersects[0].object);
				// borderhoverObject.push(boxHover)
				boxHover = new THREE.BoxHelper(allNoithat2[i].children[0], 0xff0000)
				getBoxHelperVertices(boxHover);

				scene.add(boxHover)
							

				// break
				
			}	

			else{

				// console.log('ko trung trong chuc nang hover')
				scene.remove(boxHover);
				
				scene.remove( measurementLabels_x[lineId] );
				scene.remove( measurementLabels_y[lineId] );
				scene.remove( measurementLabels_z[lineId] );


			}
		}
		}	
	}
	}
	window.addEventListener("mousemove", hoverObject, false)

	function getBoxHelperVertices(boxHelper) {
		var points = [];
		for(var i = 0; i < 8; ++i) {
			var x = boxHelper.geometry.attributes.position.getX(i)
			var y = boxHelper.geometry.attributes.position.getY(i)
			var z = boxHelper.geometry.attributes.position.getZ(i)
			points.push({x: x, y:y, z: z})
		}
		console.log('in points: ',points)
		const distanceX_ofbox = new THREE.Vector3(points[0].x,points[0].y,points[0].z) .distanceTo(new THREE.Vector3(points[1].x,points[1].y,points[1].z))
		const distanceY_ofbox = new THREE.Vector3(points[1].x,points[1].y,points[1].z) .distanceTo(new THREE.Vector3(points[2].x,points[2].y,points[2].z))
		const distanceZ_ofbox = new THREE.Vector3(points[1].x,points[1].y,points[1].z) .distanceTo(new THREE.Vector3(points[5].x,points[5].y,points[5].z))
		//get center Point of BoxHelper

		x_centerBox = (points[0].x+ points[1].x)/2
		y_centerBox = (points[1].y+ points[2].y)/2
		// z_centerBox = (points[3].z+ points[4].z)/2
		z_centerBox = (points[2].z+ points[6].z)/2

		console.log('x_centerBox: ',x_centerBox)
		console.log('y_centerBox: ',y_centerBox)
		console.log('z_centerBox: ',z_centerBox)



		measurementDiv_x = document.createElement('div');
		measurementDiv_x.className = 'measurementLabel';
		measurementDiv_x.innerText = "0.0m";
	
		//create x label
		let measurementLabel_x = new CSS2DObject(measurementDiv_x);
		measurementLabel_x.position.copy(points[0]);
		measurementLabels_x[lineId] = measurementLabel_x;
		scene.add( measurementLabels_x[lineId] );

		measurementLabels_x[lineId].element.innerText = distanceX_ofbox.toFixed(2) + "m";
		measurementLabels_x[lineId].position.lerpVectors(points[0], points[1], .5);

		// console.log(measurementLabels_x[lineId].element.innerText);

		//create y label

		measurementDiv_y = document.createElement('div');
		measurementDiv_y.className = 'measurementLabel';
		measurementDiv_y.innerText = "0.0m";

		let measurementLabel_y = new CSS2DObject(measurementDiv_y);
		measurementLabel_y.position.copy(points[0]);
		measurementLabels_y[lineId] = measurementLabel_y;
		scene.add( measurementLabels_y[lineId] );

		measurementLabels_y[lineId].element.innerText = distanceY_ofbox.toFixed(2) + "m";
		measurementLabels_y[lineId].position.lerpVectors(points[1], points[2], .5);

		// console.log(measurementLabels_y[lineId].element.innerText);

		//create z label

		measurementDiv_z = document.createElement('div');
		measurementDiv_z.className = 'measurementLabel';
		measurementDiv_z.innerText = "0.0m";

		let measurementLabel_z = new CSS2DObject(measurementDiv_z);
		measurementLabel_z.position.copy(points[0]);
		measurementLabels_z[lineId] = measurementLabel_z;
		scene.add( measurementLabels_z[lineId] );

		measurementLabels_z[lineId].element.innerText = distanceZ_ofbox.toFixed(2) + "m";
		measurementLabels_z[lineId].position.lerpVectors(points[1], points[5], .5);

		// console.log(measurementLabels_z[lineId].element.innerText);
		



		return points;
	}

	
	function rightClickobject(e){
		// document.getElementById("update-menu").classList.remove('context-menu2')
		//Lay name object
		e.preventDefault();
			document.getElementById("shortcut-guide").innerHTML = "Right Click"
			document.getElementById("shortcut-guide").style.fontSize = "14px"
			raycaster.setFromCamera( mouse, camera );

			let intersects = raycaster.intersectObjects( scene.children, true );

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

		// hightlightPlaneMesh.position.set(highlightPos.x, -3.0, highlightPos.z);

		if(contextMenu.classList.contains('show')) {
			contextMenu.classList.remove('context-menu2');
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

			let intersects = raycaster.intersectObjects( scene.children, true );

			 if ( intersects.length > 0 ) {

				// console.log(intersects[0].point);
				// console.log('in x:', intersects[0].point.x)
				// let selectObject = intersects[0].object.userData.currentSquare;
				   let clickedName = intersects[0].object.name;
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
	document.getElementById( 'close-form' ).addEventListener( 'click', function( e ) {
		document.getElementById("update-menu").classList.remove('context-menu2')
		// document.getElementById("update-menu").classList.remove('show')
		document.getElementById("update-info-material").style.display="none";
		console.log('Da tat contexmenu2')
		// const clearcolumn = document.querySelectorAll('.column')
		// clearcolumn.forEach(box => {
		// 	box.classList.remove('right','left','column')
		// })


	})
	
	function closeInfo (e){
		console.log('dang click man hinh')
		if (statusProperties){

		// statusProperties = false;
		}
		// e.preventDefault();
		let intersects = raycaster.intersectObjects( scene.children, true );

		 if ( intersects.length > 0 ) {
			let clickedName = intersects[0].object.name;
			console.log('in ra click Name info2: ',clickedName)

			if (clickedName === 'ground' || clickedName === 'largeGround'){
				console.log('in ra click Name info: ',clickedName)
				// document.getElementById("update-menu").classList.add('context-menu2')
			}
	}
		// stopClickbyEdit = true;
		
		// stopscaleObject = false;
	}
	function scaleObject (event) {
		//Lay ti vi tri hien tai
		// console.log('toa do hien tai la: ',20*Math.abs(mouse.y));
		
		// if (!stopClickbyEdit ){
			
		// 	scaling_Object = true;
		// 	for (let i =0; i < allNoithat2.length; i ++){
		// 		if(allNoithat2[i].children[0].name === objectchoose.split("_") [0]) {
		// 			console.log('T or F:',allNoithat2[i].children[0].name === objectchoose.split("_") [0])
		// 			console.log('allNoithat2[i].children[0]: ',allNoithat2[i].children[0]);
		// 			console.log('allNoithat2[i] ',allNoithat2[i]);
					

					
		// 			allNoithat2[i].scale.set(20*Math.abs(mouse.y),20*Math.abs(mouse.y),20*Math.abs(mouse.y));


		// 		}}
			

		// }

	}

	
	window.addEventListener('mousemove', scaleObject, false);
	function clickNormal (e) {
		e.preventDefault();

			raycaster.setFromCamera(mouse, camera);
			let intersects = raycaster.intersectObjects(scene.children);
			exclusive_normalName = intersects[0].object.parent.name;

			intersects.forEach(function(intersect) {
				//highlightPos = new THREE.Vector3().copy(intersect.point).floor().addScalar(0.5);

				for (let i =0; i < allNoithat2.length; i ++){
				
				console.log('in allNoithat2[i].children[0].name: ',allNoithat2[i].children[0].name)
				
				console.log('in ten exclusive_normalName: ',exclusive_normalName);
				if(allNoithat2[i].children[0].name === exclusive_normalName) {

					transcon_Object.attach(allNoithat2[i])
					
					transcon_Object.position.set(-allNoithat2[i].position.x+x_centerBox,-allNoithat2[i].position.y +y_centerBox,-allNoithat2[i].position.z +z_centerBox)

					console.log('in transcon_Object: ',transcon_Object)
					
					// scene.add( transcon_Object );
					stateshowAxis = true;

					document.getElementById("shortcut-guide").innerHTML = " W: translate & E: rotate & R: scale "+ "<br/>" +" (+/-): điều chỉnh kích thước  "+ "<br/>" + " X: Tắt trục X & Y: Tắt trục Y & Z: Tắt trục Z" + "<br/>" +" Esc: reset vị trí hiện tại" + "<br/>" + " V: zoom ngẫu nhiên  "
				
					document.getElementById("shortcut-guide").style.fontSize = '12px';

	
					}
				}
			})
	}
	container.addEventListener('click', clickNormal, false);

	function clickTurnonoff_Transform (e) {

		

		if (!contextMenu.classList.contains('show')){
			console.log('da run click turn off')
		
			e.preventDefault();
			mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
			raycaster.setFromCamera( mouse, camera );

			let intersects = raycaster.intersectObjects( scene.children, true );

			if ( intersects.length > 0 ) {

				console.log('Toa do click: ',intersects[0].point);
				
				NameObject = intersects[0].object.name;
				if (seconds < 0.05 && exclusive_normalName === '' ){
					// transcon_Object.position.set(-x_centerBox,-y_centerBox,-z_centerBox)
					// transcon_Object.position.set(0,0,0)
					console.log('turn off axis transform')
					transcon_Object.detach()
					scene.remove(transcon_Object)

					document.getElementById("shortcut-guide").innerHTML = "Left Click"
					document.getElementById("shortcut-guide").style.fontSize = "14px"

					// document.getElementById("shortcut-guide").innerHTML = ""
					

					// scene.remove(cubeAxis)
				
				}
	
			} 
		}
		
	}
	container.addEventListener('click', clickTurnonoff_Transform, false);
	// document.getElementById( 'dollHouse' ).addEventListener( 'click', function( e ) {

	// 	let coords = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
	// 	new TWEEN.Tween(coords)
	// 		  .to({ x: 7, y: 4,  z: 7})
	// 		  .onUpdate(() => camera.position.set(coords.x, coords.y, coords.z), controls.target.set(coords.x, 3, coords.z))
	// 		  .start();

	// 	  controls.enabled = true;
	// 	isUserInteracting = false;
	// 	controlCamera = false;
	// 	moveCameraClick = false;



	// 	controls.minDistance = 10;
	// 	controls.maxDistance = 15;

	// 	controls.maxPolarAngle = 1.5;

	// 	controls.panSpeed = 2;

	// 	controls.direction = -1;

	// 	controls.keys = {
	// 		LEFT: 'ArrowLeft', //left arrow
	// 		UP: 'ArrowUp', // up arrow
	// 		RIGHT: 'ArrowRight', // right arrow
	// 		BOTTOM: 'ArrowDown' // down arrow
	// 	}


	// 	controls.mouseButtons = {
	// 		LEFT: THREE.MOUSE.ROTATE,
	// 		MIDDLE: THREE.MOUSE.DOLLY,
	// 		RIGHT: THREE.MOUSE.PAN
	// 	}

	// 	//animate2();
	// 	controls.update();
	// } );

	document.getElementById( 'properties' ).addEventListener( 'click', function( e ) {
		document.getElementById("update-menu").classList.add('context-menu2')

		console.log('Da vao click properties')
		
		e.preventDefault();
			


			let intersects = raycaster.intersectObjects( scene.children, true );

			 if ( intersects.length > 0 ) {

				
				let clickedName = intersects[0].object.name;
				objectchoose = clickedName;
				console.log('in objectchoose: ',objectchoose)
			

				if (clickedName !== '' && clickedName.split("_") [0] !== 'nhapho'&& clickedName !== 'ground'){
					if(contextMenu2.classList.contains('show')) {
						// contextMenu2.classList.remove('context-menu2');
						contextMenu2.style.top =  window.innerHeight  - e.clientY + 'px';
						contextMenu2.style.left = window.innerWidth -  e.clientX  +'px';
						contextMenu2.classList.add('show');
						document.getElementById("update-info-material").style.display="inline";


					} else {
						// contextMenu2.style.top =  '200' + 'px';
						// contextMenu2.style.left =  '600' +'px';
						contextMenu2.style.top =  window.innerHeight  - e.clientY + 'px';
						contextMenu2.style.left = window.innerWidth -  e.clientX  +'px';

						document.getElementById("update-info-material").style.display="inline";

					
						contextMenu2.classList.add('show');
						statusProperties = true;

					}
				}
				
			}
		
		
	} );
	// document.getElementById('Ten-san-pham').innerHTML = data_object_array[0];
	function dataObjectoHTML(){
			// document.getElementById('Ten-san-pham').innerHTML = data_object_array[0];
			console.log('dataObject: ',data_object_array)
			document.getElementById('ten-san-pham').placeholder = `${data_object_array[0]}`;
			document.getElementById('thuong-hieu').placeholder = `${data_object_array[1]}`;
			document.getElementById('chuc-nang').placeholder = `${data_object_array[2]}`;
			document.getElementById('mo-ta-chi-tiet').placeholder = `${data_object_array[3]}`;
			document.getElementById('gia-san-pham').placeholder = `${data_object_array[4]}`;




	}
	document.getElementById( 'edit-form' ).addEventListener( 'click', function( e ) {
		console.log('button edit-form clicked')
		document.getElementById('ten-san-pham').disabled = false;
		document.getElementById('thuong-hieu').disabled = false;
		document.getElementById('chuc-nang').disabled = false;
		document.getElementById('mo-ta-chi-tiet').disabled = false;

		document.getElementById('gia-san-pham').disabled = false;
	})
	document.getElementById( 'rotation' ).addEventListener( 'click', function( event ) {

		console.log('da click rotation')
		event.preventDefault();

		raycaster.setFromCamera(mouse, camera);
		let intersects = raycaster.intersectObjects(scene.children);
		
		intersects.forEach(function(intersect) {
			highlightPos = new THREE.Vector3().copy(intersect.point).floor().addScalar(0.5);

			for (let i =0; i < allNoithat2.length; i ++){
			

			if(allNoithat2[i].children[0].name === exclusive_name) {
				for (let j=0; j< texturesImageObject.length; j++){
					
					console.log('in allNoithat2[i].children[0].name: ',allNoithat2[i].children[0].name)
					console.log('exclusive_name: ',exclusive_name)
					if(allNoithat2[i].children[0].name === exclusive_name) {

						transcon_Object.attach(allNoithat2[i])
						// if (transcon_Object.position.x === 0 && transcon_Object.position.y === 0 &&transcon_Object.position.z === 0){ //Kiem tra neu axis chua duoc move thi move, move roi thi ko move nua
						// 	transcon_Object.position.set(x_centerBox, y_centerBox, z_centerBox)

						// } 
						transcon_Object.position.set(-allNoithat2[i].position.x+x_centerBox,-allNoithat2[i].position.y +y_centerBox,-allNoithat2[i].position.z +z_centerBox)

						console.log('in transcon_Object: ',transcon_Object)
						
						transcon_Object.setMode("rotate")
						scene.add( transcon_Object );
		
						}
				}
				

				
				}
			}})
		

		
	} );
	document.getElementById( 'scale' ).addEventListener( 'click', function( event ) {
		console.log('da click scale')
		event.preventDefault();

		raycaster.setFromCamera(mouse, camera);
		let intersects = raycaster.intersectObjects(scene.children);
		
		intersects.forEach(function(intersect) {
			highlightPos = new THREE.Vector3().copy(intersect.point).floor().addScalar(0.5);

			for (let i =0; i < allNoithat2.length; i ++){
			

			if(allNoithat2[i].children[0].name === exclusive_name) {
				for (let j=0; j< texturesImageObject.length; j++){
					
					console.log('in allNoithat2[i].children[0].name: ',allNoithat2[i].children[0].name)
					console.log('exclusive_name: ',exclusive_name)
					if(allNoithat2[i].children[0].name === exclusive_name) {

						transcon_Object.attach(allNoithat2[i])
					
						transcon_Object.position.set(-allNoithat2[i].position.x+x_centerBox,-allNoithat2[i].position.y +y_centerBox,-allNoithat2[i].position.z +z_centerBox)

						console.log('in transcon_Object: ',transcon_Object)
						
						transcon_Object.setMode("scale")
						scene.add( transcon_Object );
		
						}
					}
				

				
				}
			}})
		

		
	} );
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

		// 	let intersects = raycaster.intersectObjects( scene.children, true );

			
		// 		nt_phongbep.position.set(savePosition_x, 0, savePosition_z);

		// 		nt_phongbep.children[0].name = 'phongbep' + savePosition_x + savePosition_z;
		// 		scene.add( nt_phongbep );
		// 		allNoithat2.push(nt_phongbep)
		// 		console.log('in noithat2 push: ',allNoithat2)
			
		

		// });
	} );

	
	window.addEventListener( 'resize', onWindowResize );

	window.addEventListener( 'keydown', function ( event ) {

		switch ( event.keyCode ) {

			
			case 87: // W
			if (stateshowAxis){
				console.log('in ra model keycode')
				scene.add( transcon_Object );
				transcon_Object.setMode( 'translate' );
				stateshowAxis = false;

				document.getElementById("shortcut-guide").innerHTML = "W"
				document.getElementById("shortcut-guide").style.fontSize = '30px'

			}
				break;

			case 69: // E
			if (stateshowAxis){
				console.log('in ra model keycode')
				scene.add( transcon_Object );
				transcon_Object.setMode( 'rotate' );
				stateshowAxis = false;

				document.getElementById("shortcut-guide").innerHTML = "E"
				document.getElementById("shortcut-guide").style.fontSize = '30px'


			}
				break;

			case 82: // R
			if (stateshowAxis){
				console.log('in ra model keycode')
				scene.add( transcon_Object );
				transcon_Object.setMode( 'scale' );
				stateshowAxis = false;

				document.getElementById("shortcut-guide").innerHTML = "R"
				document.getElementById("shortcut-guide").style.fontSize = '30px'


			}
				break;

			
			case 86: // V
				const randomFoV = Math.random() + 0.1;
				const randomZoom = Math.random() + 0.1;

				cameraPersp.fov = randomFoV * 160;
				cameraOrtho.bottom = - randomFoV * 500;
				cameraOrtho.top = randomFoV * 500;

				cameraPersp.zoom = randomZoom * 5;
				cameraOrtho.zoom = randomZoom * 5;
				onWindowResize();
				break;

			
			case 107: // +, =, num+
			transcon_Object.setSize( Math.max( transcon_Object.size + 0.1, 0.1 ) );
			document.getElementById("shortcut-guide").innerHTML = "+"
			document.getElementById("shortcut-guide").style.fontSize = '30px'

				break;

			
			case 109: // -, _, num-
			transcon_Object.setSize( Math.max( transcon_Object.size - 0.1, 0.1 ) );
			document.getElementById("shortcut-guide").innerHTML = "-"
			document.getElementById("shortcut-guide").style.fontSize = '30px'


				break;

			case 88: // X
			transcon_Object.showX = ! transcon_Object.showX;
			document.getElementById("shortcut-guide").innerHTML = "X"
			document.getElementById("shortcut-guide").style.fontSize = '30px'
				break;

			case 89: // Y
			transcon_Object.showY = ! transcon_Object.showY;
			document.getElementById("shortcut-guide").innerHTML = "Y"
			document.getElementById("shortcut-guide").style.fontSize = '30px'
				break;

			case 90: // Z
			transcon_Object.showZ = ! transcon_Object.showZ;
			document.getElementById("shortcut-guide").innerHTML = "Z"
			document.getElementById("shortcut-guide").style.fontSize = '30px'
				break;

			case 27: // Esc
			transcon_Object.reset();
				break;

		}

	} );

	



	const newObject_by_clickInsert = (event, data, positionX, positionZ) => {

		dataObject = data[parseInt(event.target.dataset.key)];
		// console.log('dataObject click dc: ',dataObject)
		// console.log('in dataObject.path: ', dataObject.path)

		nameDataObject = dataObject.name;
		let nameObject = dataObject.path;
		// console.log('in nameObject: ',nameObject)
		// console.log('in dataObject.name: ',dataObject.name)
		// console.log('vi tri moi x: ',positionX)
		// console.log('vi tri moi z: ',positionZ)


		// savePosition_x2 = highlightPos.x  +2;
		// savePosition_z2 = highlightPos.z - 2.8;
	 
		loader.load(dataObject.path, function ( gltf ) {
			let object_created = gltf.scene;
			// move_object2 = true;
			// object_created.position.set(positionX, 0, positionZ);
			object_created.children[0].position.set(positionX, 0, positionZ)
		
			// nt_phongbep.children[0].name = 'phongbep' + savePosition_x + savePosition_z;
			object_created.children[0].name = dataObject.name + '_' + positionX + positionZ;
			// console.log('in ra object_created.children[0].name: ',object_created.children[0].name)
			scene.add( object_created );
			allNoithat2.push(object_created)
			console.log('in noithat2 push: ',allNoithat2)
			
		 
	 
	 });
	 getPosition_x = null;
	 getPosition_z = null;

	}
	const newObject_onSpace = (event,data, positionX, positionY,positionZ) => {
		dataObject = data[parseInt(event.target.dataset.key)];
		// console.log('dataObject click dc: ',dataObject)
		// console.log('in dataObject.path: ', dataObject.path)
		
		// console.log(' positionX: ',positionX)
		// console.log(' positionZ: ',positionZ)

		nameDataObject = dataObject.name;
		loader.load(dataObject.path, function ( gltf ) {
			object_created = gltf.scene;
			// move_object2 = true;
			object_created.children[0].position.set(positionX, positionY, positionZ)
		
			// nt_phongbep.children[0].name = 'phongbep' + savePosition_x + savePosition_z;
			object_created.children[0].name = dataObject.name + '_' + positionX + positionZ;
			console.log('in ra object_created.children[0].name: ',object_created.children[0].name)
			scene.add( object_created );
			allNoithat2.push(object_created)
			console.log('in noithat2 push: ',allNoithat2)
			
		 
	 
	 });
	}

	const movenewObject_onSpace = (event, data, positionX, positionY) => {
		let getnewObject = allNoithat2[allNoithat2.length -1];

		raycaster.setFromCamera(mouse, camera);
			let intersects = raycaster.intersectObjects(scene.children);
			intersects.forEach(function(intersect) {
				
				
				//Tao vecto3 lay toa do bat ky
				highlightPos = new THREE.Vector3().copy(intersect.point).floor().addScalar(0.5);
				
				// if( clicktray_ChooseObject && move_object2) {
				if( clicktray_ChooseObject && move_object2) {
					console.log('exclusive_name move: ',exclusive_name)

					
					
					for (let i =0; i < allNoithat2.length; i++){
							// console.log('in ra allNoithat2[i].children[0].name: ',allNoithat2[i].children[0].name)
							// console.log('in ra object_created: ',object_created)

							if (allNoithat2[i].children[0].name === object_created.children[0].name){
								allNoithat2[i].children[0].position.set(highlightPos.x + parseInt(dataObject.x),parseInt(dataObject.y),highlightPos.z + parseInt(dataObject.z));

							
						}	
					}

				

					}
					
		
				
				
			});

	
		 
	 
	 
	
	}
	
	window.addEventListener('mousemove', movenewObject_onSpace, false)

	//Interact with Light
	const hemisphereButton = document.getElementById( 'hemisphereButton' );
				hemisphereButton.addEventListener( 'click', function () {

					hemiLight.visible = ! hemiLight.visible;
					// hemiLightHelper.visible = ! hemiLightHelper.visible;
					console.log('scene background: ',scene.background.isColor)
					if (scene.background.isColor === true){
						scene.background = reflectionCube
						console.log('dang trong isColor = true')
					} else {
						scene.background = new THREE.Color(0x28140f)
					}
				} );

	const directionalButton = document.getElementById( 'directionalButton' );
	directionalButton.addEventListener( 'click', function () {

		// directionalLight1.visible = ! directionalLight1.visible;
		// dirLightHelper.visible = ! dirLightHelper.visible;

		dirLight.visible = ! dirLight.visible;
		// dirLightHelper.visible = ! dirLightHelper.visible;

	} );

	document.getElementById( 'edit' ).addEventListener( 'click', function( e ) {
		console.log('da click edit')
		stopClickbyEdit = false;
		editObject()

		
		
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
		let intersects = raycaster.intersectObjects( scene.children, true );
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
 document.getElementById( 'homeButton' ).addEventListener( 'click', function( e ) {

	let coords = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
	new TWEEN.Tween(coords)
		  .to({ x: 29, y: 10,  z: 1})
		  .onUpdate(() => camera.position.set(coords.x, coords.y, coords.z))
		  .start();

		controlCamera = false;
	  	controls.enabled = true;
		isUserInteracting = false;

		// controls.enabled = true;
		// isUserInteracting = false;
		// controlCamera = false;
		

		
		
	
 })
 document.getElementById( 'upButton' ).addEventListener( 'click', function( event ) {
	event.preventDefault();
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	raycaster.setFromCamera( mouse, camera );

	// let intersects = raycaster.intersectObjects( scene.children, true );

	//  if ( intersects.length > 0 ) {
	// 	let coords = {  x: intersects[0].point.x, y: (intersects[0].point.y) + 2.3,  z: intersects[0].point.z };
	// 		new TWEEN.Tween(coords)
	// 			.to({ x: intersects[0].point.x + 1, y: (intersects[0].point.y) + 2.3,  z: intersects[0].point.z})
	// 			.onUpdate(() => camera.position.set(intersects[0].point.x + 1 , coords.y, coords.z)
	// 					)
	// 			.start();
			
	//  }
	
	let intersects = raycaster.intersectObjects( scene.children, true );

		if ( intersects.length > 0 ) {
		let coords = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
			new TWEEN.Tween(coords)
				.to({ x: camera.position.x -2, y: camera.position.y ,  z: camera.position.z  })
				.onUpdate(() => camera.position.set(coords.x, coords.y, coords.z)
						)
				.start();

				// controls.enabled = false;
				// controlCamera = true;
				// isUserInteracting = true;
				
				
		}

		
	

 });
 document.getElementById( 'downButton' ).addEventListener( 'click', function( event ) {
	event.preventDefault();
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	raycaster.setFromCamera( mouse, camera );

	

	let intersects = raycaster.intersectObjects( scene.children, true );

		if ( intersects.length > 0 ) {
		let coords = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
			new TWEEN.Tween(coords)
				.to({ x: camera.position.x + 2, y: camera.position.y ,  z: camera.position.z  })
				.onUpdate(() => camera.position.set(coords.x, coords.y, coords.z)
						)
				.start();
			
		}
	

 });
 

document.getElementById( 'centerButton' ).addEventListener( 'click', function( event ) {
		
	console.log('Da click down')
	// camera.position.set(0, 0, 0)
	event.preventDefault();
			mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
			raycaster.setFromCamera( mouse, camera );

			let intersects = raycaster.intersectObjects( scene.children, true );

			 if ( intersects.length > 0 ) {
				let coords = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
					new TWEEN.Tween(coords)
						.to({ x: -2, y:-1,  z: 0})
						.onUpdate(() => camera.position.set(coords.x, coords.y, coords.z)
								)
						.start();
			 }
			 controls.enabled = false;
			isUserInteracting = true;
			controlCamera = true;
	
}

);

document.getElementById( 'leftButton' ).addEventListener( 'click', function( event ) {
	
	console.log('Da click left')
	event.preventDefault();
			mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
			raycaster.setFromCamera( mouse, camera );

			let intersects = raycaster.intersectObjects( scene.children, true );

			 if ( intersects.length > 0 ) {
				let coords = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
					new TWEEN.Tween(coords)
						.to({ x: camera.position.x , y: camera.position.y,  z: camera.position.z +2})
						.onUpdate(() => camera.position.set(coords.x, coords.y, coords.z)
								)
						.start();
					
			 }
	

});

document.getElementById( 'rightButton' ).addEventListener( 'click', function( event ) {
		
	console.log('Da click right')
	
	event.preventDefault();
			mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
			raycaster.setFromCamera( mouse, camera );

			let intersects = raycaster.intersectObjects( scene.children, true );

			 if ( intersects.length > 0 ) {
				let coords = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
					new TWEEN.Tween(coords)
						.to({ x: camera.position.x , y: camera.position.y,  z: camera.position.z - 2})
						.onUpdate(() => camera.position.set(coords.x, coords.y, coords.z)
								)
						.start();
					
						if(contextMenu2.classList.contains('show')) {
							contextMenu2.classList.remove('show');
							console.log('click propertises11')
		
						} else {
							contextMenu2.style.top = e.offsetY + 'px';
							contextMenu2.style.left = e.offsetX + 'px';
						
							contextMenu2.classList.add('show');
		
						}
					
			 }

}

);
	

	window.addEventListener('click',closeInfo, false)

	window.addEventListener('click',closemenu, false)
	window.addEventListener('contextmenu',rightClickobject, false)
	// window.addEventListener('click',clickShowInfo, false)


		

		function onPointerDown( event ) {

			if ( event.isPrimary === false ) return;

			moveCameraClick = false;
			console.log('in onPointerDown')

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
			lon = ( onPointerDownMouseX - event.clientX ) * 0.1 + onPointerDownLon;
			lat = ( event.clientY - onPointerDownMouseY ) * 0.1 + onPointerDownLat;

		}

	
		//icon chuột hover
		function onPointerMove_mouse( event ) {
			mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

			raycaster.setFromCamera( mouse, camera );

			let intersects = raycaster.intersectObjects( scene.children, true  );

			if ( intersects.length > 0 ) {
				helper.position.set( 0, 0, 0 );
				// console.log('in intersects[0]: ',intersects[ 0 ])
				// helper.lookAt( intersects[ 0 ].face.area );
				if (intersects[ 0 ].face.normal === null){

				} else{
					helper.lookAt( intersects[ 0 ].face.normal );

				}

				// helper.lookAt( intersects[ 0 ].object.isObject3D );

				helper.position.copy( intersects[ 0 ].point );
				scene.add( helper );

			}


		}


		function onPointerUp() {

			if ( event.isPrimary === false ) return;
				// isUserInteracting = false;

			document.removeEventListener( 'pointermove', onPointerMove );

			document.removeEventListener( 'pointerup', onPointerUp );

		}

		


		// Thanh thay đổi textures

		let TRAY = document.getElementById("js-tray-slide");
		let TRAY_Tran = document.getElementById("js-tray-slide-tran");
		let TRAY_San = document.getElementById("js-tray-slide-san");

		let TRAY_Cua = document.getElementById("js-tray-slide-cua");

		let TRAY_imageObject = document.getElementById("js-tray-slide-image-object");


		function buildColors(colors) {
			textureOption = "nhapho_8";
			  for (let [i, color] of colors.entries()) {
				let swatch = document.createElement("div");
				swatch.classList.add("tray__swatch");

				swatch.style.backgroundImage = "url(" + color.texture + ")";
				  

				swatch.setAttribute("data-key", i);
				TRAY.append(swatch);
			  }
		}


		//Thay đổi màu mái
		function buildTranColors(colors) {
			textureOption_tran = "nhapho_119";
			  for (let [i, color] of colors.entries()) {
				let swatch_Tran = document.createElement("div");
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
			  for (let [i, color] of colors.entries()) {
				let swatch_San = document.createElement("div");
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
			  for (let [i, color] of colors.entries()) {
				let swatch_Cua = document.createElement("div");
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
			  for (let [i, color] of colors.entries()) {
				let swatch_imageObject = document.createElement("div");
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
		let swatches = document.querySelectorAll(".tray__swatch");
		
		let swatches_Tran = document.querySelectorAll(".tray__swatch_Tran");
		
		let swatches_San = document.querySelectorAll(".tray__swatch_San");

		let swatches_Cua = document.querySelectorAll(".tray__swatch_Cua");

		let swatches_imageObject = document.querySelectorAll(".tray__swatch_imageObject");
		

		for (let swatch of swatches_imageObject) {
			 swatch.addEventListener("click", (event) => {
				clicktray_ChooseObject = true;
			   getStateofclickSwatch = 'running_swatch';
			  // console.log('in thu trong swatch: ',getStateofclickSwatch)
			  console.log('in ra getPosition_x: ',getPosition_x)
			  console.log('in ra getPosition_z: ',getPosition_z)

			  if (getPosition_x === null && getPosition_z === null){
				console.log('dang vao await')
				move_object2 = true;
				object_created = null;

				console.log('in ra: texturesImageObject: ',texturesImageObject[parseInt(event.target.dataset.key)])
				console.log('da click tao object: ',highlightPos.x + parseInt(texturesImageObject[parseInt(event.target.dataset.key)].x))
				
				newObject_onSpace(event, texturesImageObject, highlightPos.x + parseInt(texturesImageObject[parseInt(event.target.dataset.key)].x) 
					, parseInt(texturesImageObject[parseInt(event.target.dataset.key)].y),highlightPos.z + parseInt(texturesImageObject[parseInt(event.target.dataset.key)].z))

			  } else {
				newObject_by_clickInsert(event, texturesImageObject, getPosition_x +2.6 , getPosition_z -2.6 )

			  }

		  });	
		  }
		for (let swatch of swatches) {
			  swatch.addEventListener("click", (event) => {
				 getStateofclickSwatch = 'running_swatch';
				// console.log('in thu trong swatch: ',getStateofclickSwatch)
				selectSwatch(event, ngoinha, texturesTuongAndColors, textureOption, get_event_v)

			});	
		}
		

		for (let swatch_Tran of swatches_Tran) {
			swatch_Tran.addEventListener("click", (event) =>{
				// console.log('in ra texturesTranAndColor: ',texturesTranAndColors)
				 getStateofclickSwatch = 'running_swatch_Tran';
				//  console.log('in thu trong swatch: ',getStateofclickSwatch)

			  selectSwatch(event, ngoinha, texturesTranAndColors, textureOption_tran, get_event_v)
			 
		});
	  }
		
		for (let swatch_San of swatches_San) {
			  swatch_San.addEventListener("click", (event) =>{
			  getStateofclickSwatch = 'running_swatch_San';
			//   console.log('in thu trong swatch: ',getStateofclickSwatch)

				selectSwatch(event, ngoinha, texturesSanAndColors, textureOption_san, get_event_v)
			});
		}

		for (let swatch_Cua of swatches_Cua) {
			swatch_Cua.addEventListener("click", (event) =>{
			getStateofclickSwatch = 'running_swatch_Cua';
			// console.log('in thu trong swatch: ',getStateofclickSwatch)

			  selectSwatch(event, cuaso, texturesCuaAndColors, textureOption_cua,get_event_v)
		});
	  }


		// Select Option

		let options = document.querySelectorAll(".option");

		for (let option of options) {
			  option.addEventListener("click", selectOption);
		}

		function selectOption(e) {
			  let option = e.target;
			  textureOption = e.target.dataset.option;
			  for (let otherOption of options) {
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
			//delete the last line because it wasn't committed
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
		scene.add(   ngoinha   );
	} );


	//Đo kích thước
	renderer.domElement.addEventListener('pointerdown', onClickMeasure, false);

	function onClickMeasure(event) {

		if (ctrlDown) {

				mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;

			mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

			raycaster.setFromCamera( mouse, camera );

			let intersects = raycaster.intersectObjects( pickableObjects, true  );

			if ( intersects.length > 0 ) {
				if (!drawingLine) {
					//start the line
					let points = [];
					points.push(intersects[0].point);
					points.push(intersects[0].point.clone());
					let geometry = new THREE.BufferGeometry().setFromPoints(points);
					line = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({
						color: 0xFA0D00,
						transparent: true,
						opacity: 1,
						// depthTest: false,
						// depthWrite: false
					}));
					line.frustumCulled = false;
					scene.add( line );

					let measurementDiv = document.createElement('div');
					measurementDiv.className = 'measurementLabel';
					measurementDiv.innerText = "0.0m";

					let measurementLabel = new CSS2DObject(measurementDiv);
					measurementLabel.position.copy(intersects[0].point);
					measurementLabels[lineId] = measurementLabel;
					scene.add( measurementLabels[lineId] );
					drawingLine = true;
				} else {
					//finish the line
					let positions = line.geometry.attributes.position.array;
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

			let intersects = raycaster.intersectObjects( pickableObjects, true  );

			if ( intersects.length > 0 ) {
				let positions = line.geometry.attributes.position.array;
				let v0 = new THREE.Vector3(positions[0], positions[1], positions[2]);
				let v1 = new THREE.Vector3(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
				positions[3] = intersects[0].point.x;
				positions[4] = intersects[0].point.y;
				positions[5] = intersects[0].point.z;
				line.geometry.attributes.position.needsUpdate = true;
				let distance = v0.distanceTo(v1);
				measurementLabels[lineId].element.innerText = distance.toFixed(2) + "m";
				measurementLabels[lineId].position.lerpVectors(v0, v1, .5);

				console.log(measurementLabels[lineId].element.innerText);
			}
		}
	}

	
		
	
