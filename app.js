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
                diameter:10
            },
            scene
        );

        sphere.position = new BABYLON.Vector3(

            p.x/5000,
            p.y/5000,
            p.z/5000

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

Radius ${m.metadata.radius}

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