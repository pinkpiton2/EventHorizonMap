const SCENE_SCALE = 5000;

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const createScene = () => {
	console.log("PLANETS:", planets);

    const scene = new BABYLON.Scene(engine);
	BABYLON.MeshBuilder.CreateSphere(
    "test",
    {diameter:100},
    scene
);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);

    // Освітлення
    new BABYLON.HemisphericLight(
        "light",
        new BABYLON.Vector3(1, 1, 0),
        scene
    );

    // ---------- Знаходимо центр усіх планет ----------
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

    planets.forEach(p => {

        const x = p.x / SCENE_SCALE;
        const y = p.y / SCENE_SCALE;
        const z = p.z / SCENE_SCALE;

        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        minZ = Math.min(minZ, z);

        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
        maxZ = Math.max(maxZ, z);

    });

    const center = new BABYLON.Vector3(
        (minX + maxX) / 2,
        (minY + maxY) / 2,
        (minZ + maxZ) / 2
    );

    const size = Math.max(
        maxX - minX,
        maxY - minY,
        maxZ - minZ
    );

    // ---------- Камера ----------
    const camera = new BABYLON.ArcRotateCamera(
    "camera",
    Math.PI / 2,
    Math.PI / 3,
    20000,
    BABYLON.Vector3.Zero(),
    scene
);

    camera.attachControl(canvas, true);

    camera.lowerRadiusLimit = 5;
    camera.wheelDeltaPercentage = 0.01;

    // ---------- Планети ----------
    planets.forEach(p => {

        const sphere = BABYLON.MeshBuilder.CreateSphere(
            p.name,
            {
                diameter: Math.max(4, p.radius / SCENE_SCALE)
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

// ---------- Клік ----------

scene.onPointerObservable.add((pointerInfo) => {

    if (pointerInfo.type !== BABYLON.PointerEventTypes.POINTERPICK)
        return;

    if (pointerInfo.pickInfo.hit &&
        pointerInfo.pickInfo.pickedMesh.metadata) {

        const p = pointerInfo.pickInfo.pickedMesh.metadata;

        const container = document.getElementById("planetInfo");

        if (container) {

            container.innerHTML = `
                <h3>${p.name}</h3>

                <b>X:</b> ${p.x.toLocaleString()}<br>
                <b>Y:</b> ${p.y.toLocaleString()}<br>
                <b>Z:</b> ${p.z.toLocaleString()}<br><br>

                <b>Surface radius:</b><br>
                ${p.radius.toLocaleString()} m<br><br>

                <b>Gravity radius:</b><br>
                ${p.gravity.toLocaleString()} m
            `;

        }
    }

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
