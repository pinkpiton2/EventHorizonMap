const SCENE_SCALE = 5000;

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const createScene = () => {

    const scene = new BABYLON.Scene(engine);

    scene.clearColor = new BABYLON.Color4(0,0,0,1);

    const camera = new BABYLON.ArcRotateCamera(
        "camera",
        0,
        Math.PI / 2,
        200,
        BABYLON.Vector3.Zero(),
        scene
    );

    camera.attachControl(canvas, true);

    new BABYLON.HemisphericLight(
        "light",
        new BABYLON.Vector3(0,1,0),
        scene
    );

const sphere = BABYLON.MeshBuilder.CreateSphere(
    "Terra",
    { diameter: 20 },
    scene
);

sphere.position = BABYLON.Vector3.Zero();

const mat = new BABYLON.StandardMaterial("mat", scene);
mat.emissiveColor = new BABYLON.Color3(0, 1, 0);

sphere.material = mat;

    return scene;
}


const scene = createScene();

engine.runRenderLoop(() => {
    scene.render();
});


window.addEventListener("resize", () => {
    engine.resize();
});
