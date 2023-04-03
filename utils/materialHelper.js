let textureChoose
let dataMesh = []
let count = -1;

export const setMaterial = (parent, material, activeOption) => {
  parent.traverse((o) => {
    const materialMap = {
      nhapho_108: ["nhapho_108"],
      nhapho_119: ["nhapho_119"],
    	nhapho_8: ["nhapho_8"],
      cua_2: ["cua_2", "cua_6"],
      // cua_2: ["cua_2"],

    };
    if (o.isMesh && materialMap[activeOption].includes(o.name)) {

     

      if (o.material.map === null){
        console.log('in ra material: ',material)
      
        o.material.color.setHex(material)

      } else {
        o.material.map = material;

      }

    }
  
  });
};

export const getTextureMaterial = (color,v) => {
  
    textureChoose = new THREE.TextureLoader().load(color.texture);

    textureChoose.repeat.set(color.size[0], color.size[1], color.size[2]);
    textureChoose.wrapS = THREE.RepeatWrapping;
    textureChoose.wrapT = THREE.RepeatWrapping;
    
    
    dataMesh.push(textureChoose);

    //Remove texture to save memory
    count = count + 1;
    for (let i = 0; i <= count-1; i++){
      dataMesh.splice(i,1)

    }
    console.log('in dataMesh: ',dataMesh)
  
  
  
   
  return textureChoose;
  
};

export const selectSwatch = (event, theModel, colors, activeOption, v) => {
  console.log('in ra colors initial: ', colors)
  let color = colors[parseInt(event.target.dataset.key)];
  console.log('in ra color: ',color)
  let new_mtl;
  console.log('in activeOption: ',activeOption )
  if (color.texture) {
    new_mtl = getTextureMaterial(color);
  } else {
    // new_mtl =  parseInt("0x" + color.color)
    new_mtl =  "0x" + color.color

    console.log('in new_mtl: ',new_mtl)
    
  }
  setMaterial(theModel, new_mtl, activeOption);
};
