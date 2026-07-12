const SCENE_SCALE = 5000;

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const createScene = () => {

    const scene = new BABYLON.Scene(engine);

    scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);

    const camera = new BABYLON.ArcRotateCamera(
        "camera",
        Math.PI / 2,
        Math.PI / 3,
        12000,
        BABYLON.Vector3.Zero(),
        scene
    );

    camera.attachControl(canvas, true);

    camera.lowerRadiusLimit = 10;
    camera.wheelDeltaPercentage = 0.01;

    const light = new BABYLON.HemisphericLight(
        "light",
        new BABYLON.Vector3(1, 1, 0),
        scene
    );

    planets.forEach(p => {

        const sphere = BABYLON.MeshBuilder.CreateSphere(
            p.name,
            {
                diameter: p.radius / SCENE_SCALE
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

    scene.onPointerObservable.add((pointer) => {

        if (!pointer.pickInfo.hit)
            return;

        const mesh = pointer.pickInfo.pickedMesh;

        if (!mesh || !mesh.metadata)
            return;

        const p = mesh.metadata;

        document.getElementById("planetInfo").innerHTML = `
            <h3>${p.name}</h3>

            <b>X</b> ${p.x.toLocaleString()}<br>
            <b>Y</b> ${p.y.toLocaleString()}<br>
            <b>Z</b> ${p.z.toLocaleString()}<br><br>

            <b>Surface radius</b><br>
            ${p.radius.toLocaleString()} m<br><br>

            <b>Gravity radius</b><br>
            ${p.gravity.toLocaleString()} m
        `;

    }, BABYLON.PointerEventTypes.POINTERPICK);

    return scene;

};

const scene = createScene();

engine.runRenderLoop(() => {
    scene.render();
});

window.addEventListener("resize", () => {
    engine.resize();
});
