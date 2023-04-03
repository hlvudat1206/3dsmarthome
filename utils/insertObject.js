export const newObject = (event, data, positionX, positionY) => {
 
   let dataObject = data[parseInt(event.target.dataset.key)];
   console.log('dataObject click dc: ',dataObject)
  

   loader.load( dataObject.path, function ( gltf ) {
    let nt_phongbep = gltf.scene;
    // move_object2 = true;
    nt_phongbep.position.set(positionX, 0, positionY);

    // nt_phongbep.children[0].name = 'phongbep' + savePosition_x + savePosition_z;
    scene.add( nt_phongbep );
    // allNoithat2.push(nt_phongbep)
    console.log('in noithat2 push: ',allNoithat2)
    


});

  };
  export const movenewObject = (event, data, positionX, positionY) => {
 
    let dataObject = data[parseInt(event.target.dataset.key)];
    console.log('dataObject click dc: ',dataObject)
   
 
    loader.load( dataObject.path, function ( gltf ) {
     let nt_phongbep = gltf.scene;
     // move_object2 = true;
     nt_phongbep.position.set(positionX, 0, positionY);
 
     // nt_phongbep.children[0].name = 'phongbep' + savePosition_x + savePosition_z;
     scene.add( nt_phongbep );
     // allNoithat2.push(nt_phongbep)
     console.log('in noithat2 push: ',allNoithat2)
     
 
 
 });
}

  export const setObject = (event, theModel, colors, activeOption, v) => {
    
  };
  
  window.addEventListener('mousemove',setObject, false)