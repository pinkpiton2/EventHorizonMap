const SCENE_SCALE = 5000;

const canvas = document.getElementById("renderCanvas");

const engine = new BABYLON.Engine(canvas,true);

const createScene = ()=>{

    const scene = new BABYLON.Scene(engine);

    scene.clearColor = new BABYLON.Color4(0,0,0,1);

    const camera = new BABYLON.ArcRotateCamera(
        "camera",
        Math.PI/2,
        Math.PI/3,
        500,
        BABYLON.Vector3.Zero(),
        scene
    );

    camera.attachControl(canvas,true);

    const light = new BABYLON.HemisphericLight(
        "light",
        new BABYLON.Vector3(1,1,0),
        scene
    );

    planets.forEach(p=>{

        const sphere = BABYLON.MeshBuilder.CreateSphere(
            p.name,
            {
                diameter:p.radius / SCENE_SCALE
            },
            scene
        );

sphere.position = new BABYLON.Vector3(
    p.x / SCENE_SCALE,
    p.y / SCENE_SCALE,
    p.z / SCENE_SCALE
);

        sphere.metadata = p;

    });

    scene.onPointerObservable.add(pointer=>{

        if(pointer.pickInfo.hit){

            const m = pointer.pickInfo.pickedMesh;

            if(m.metadata){

                document.getElementById("planetInfo").innerHTML=`

<b>${m.metadata.name}</b><br><br>

X ${m.metadata.x}<br>
Y ${m.metadata.y}<br>
Z ${m.metadata.z}<br>

document.getElementById("planetInfo").innerHTML = `
<h3>${m.metadata.name}</h3>

<b>X</b> ${m.metadata.x}<br>
<b>Y</b> ${m.metadata.y}<br>
<b>Z</b> ${m.metadata.z}<br><br>

<b>Surface radius</b><br>
${m.metadata.radius.toLocaleString()} m<br><br>

<b>Gravity radius</b><br>
${m.metadata.gravity.toLocaleString()} m
`;

`;

            }

        }

    },BABYLON.PointerEventTypes.POINTERPICK);

    return scene;

};

const scene=createScene();

engine.runRenderLoop(()=>{

    scene.render();

});

window.addEventListener("resize",()=>{

    engine.resize();

});