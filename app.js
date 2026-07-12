const SCENE_SCALE = 5000;

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

function createPlanet(scene, p) {

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

    // Поки що всі планети одного кольору
    const material = new BABYLON.StandardMaterial(p.name + "_mat", scene);
    material.emissiveColor = new BABYLON.Color3(0.8, 0.8, 0.8);

    sphere.material = material;

    sphere.metadata = p;

    return sphere;
}

const createScene = () => {

    const scene = new BABYLON.Scene(engine);

    scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);

    // Світло
    new BABYLON.HemisphericLight(
        "light",
        new BABYLON.Vector3(0, 1, 0),
        scene
    );

    // Камера дивиться на Terra
    const camera = new BABYLON.ArcRotateCamera(
        "camera",
        Math.PI / 2,
        Math.PI / 2.5,
        250,
        BABYLON.Vector3.Zero(),
        scene
    );

    camera.attachControl(canvas, true);

    camera.lowerRadiusLimit = 10;
    camera.wheelDeltaPercentage = 0.01;

    // Створення всіх планет
    planets.forEach(p => {

        const sphere = createPlanet(scene, p);

        // Terra зелена
        if (p.name === "Terra") {
            sphere.material.emissiveColor = new BABYLON.Color3(0, 1, 0);
        }

        // Moon білий
        if (p.name === "Moon") {
            sphere.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
        }

    });
	
	const list = document.getElementById("planetList");

list.innerHTML = "<h3>Планети</h3>";

planets.forEach(p => {

    const item = document.createElement("div");

    item.className = "planetItem";
    item.textContent = p.name;

    item.onclick = () => {

        camera.setTarget(
            new BABYLON.Vector3(
                p.x / SCENE_SCALE,
                p.y / SCENE_SCALE,
                p.z / SCENE_SCALE
            )
        );

        camera.radius = 80;

    };

    list.appendChild(item);

});

    // Клік по планеті
    scene.onPointerObservable.add((pointerInfo) => {

        if (pointerInfo.type !== BABYLON.PointerEventTypes.POINTERPICK)
            return;

        const mesh = pointerInfo.pickInfo.pickedMesh;

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

    });

    return scene;
};

const scene = createScene();

engine.runRenderLoop(() => {
    scene.render();
});

window.addEventListener("resize", () => {
    engine.resize();
});
