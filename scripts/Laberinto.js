/// <reference path="Babylon.js/babylon.2.0.js" />

"use strict";


// Size of a cube/block
var BLOCK_SIZE = 8;
var freeCamera, canvas, engine, Scene;

var inicio;

var Laberinto = function(_name, _inicio, _fin, _scene) {
    this.name = _name;
    this.inicio = _inicio;
    this.fin = _fin;
    this.scene = _scene;

    this.getInicio = function() {
        return new BABYLON.Vector3(this.inicio.x, this.inicio.y, this.inicio.z);
    }

}


function createMaze() {
    //number of modules count or cube in width/height
    var mCount = 33;

    inicio = new BABYLON.Vector3(-90, 7, 98);

    var scene = new BABYLON.Scene(engine);
    scene.gravity = new BABYLON.Vector3(0, -0.8, 0);
    scene.collisionsEnabled = true;

    freeCamera = new BABYLON.FreeCamera("free", new BABYLON.Vector3(10, 10, 0), scene);
    //freeCamera = new BABYLON.OculusCamera("Camera", new BABYLON.Vector3(0, 20, -45), scene)
    freeCamera.minZ = 1;
    freeCamera.checkCollisions = true;
    freeCamera.applyGravity = true;
    freeCamera.ellipsoid = new BABYLON.Vector3(1, 3, 1);
    freeCamera.inertia = 0.4;
    freeCamera.angularSensibility = 1000;

    freeCamera.keysUp.push(87); // W
    freeCamera.keysLeft.push(65); // A
    freeCamera.keysDown.push(83); // S
    freeCamera.keysRight.push(68); // D

    //engine.isPointerLock = true;


    // Ground
    var groundMaterial = new BABYLON.StandardMaterial("groundMat", scene);
    groundMaterial.emissiveTexture = new BABYLON.Texture("textures/arroway.de_tiles-35_d100.jpg", scene);
    groundMaterial.emissiveTexture.uScale = mCount;
    groundMaterial.emissiveTexture.vScale = mCount;
    groundMaterial.bumpTexture = new BABYLON.Texture("textures/arroway.de_tiles-35_b010.jpg", scene);
    groundMaterial.bumpTexture.uScale = mCount;
    groundMaterial.bumpTexture.vScale = mCount;
    groundMaterial.specularTexture = new BABYLON.Texture("textures/arroway.de_tiles-35_s100-g100-r100.jpg", scene);
    groundMaterial.specularTexture.uScale = mCount;
    groundMaterial.specularTexture.vScale = mCount;

    var ground = BABYLON.Mesh.CreateGround("ground", (mCount + 2) * BLOCK_SIZE,
                                                     (mCount + 2) * BLOCK_SIZE,
                                                      1, scene, false);
    ground.material = groundMaterial;
    ground.checkCollisions = true;

    //groundMaterial.diffuseTexture = new BABYLON.Texture("textures/green_long_grass.JPG", scene);

    var WallTexture = "textures/white_wall.jpg";
    var scaleValue = 100;
    
    var WallMaterial = new BABYLON.StandardMaterial("Walls", scene);
    WallMaterial.diffuseColor = new BABYLON.Color3(0,1,0);
    WallMaterial.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.7);
    WallMaterial.specularColor = new BABYLON.Color3(0.8, 0.8, 0.9);

    /*WallMaterial.emissiveTexture = new BABYLON.Texture(WallTexture, scene);
    WallMaterial.emissiveTexture.uScale = scaleValue;
    WallMaterial.emissiveTexture.vScale = scaleValue;
    WallMaterial.bumpTexture = new BABYLON.Texture(WallTexture, scene);
    WallMaterial.bumpTexture.vScale = scaleValue;
    WallMaterial.bumpTexture.uScale = scaleValue;
    WallMaterial.specularTexture = new BABYLON.Texture(WallTexture, scene);
    WallMaterial.specularTexture.uScale = scaleValue;
    WallMaterial.specularTexture.vScale = scaleValue;*/

    
    //var groundPlane = BABYLON.Mesh.CreatePlane("groundPlane", 200.0, scene);
                                                                            // w   H   divs max min
    var walls = BABYLON.Mesh.CreateGroundFromHeightMap("wall", "binMaze.png", 200, 200, 200, 10, -2, scene, false);
    walls.material = WallMaterial;
    walls.checkCollisions = true;


    //Skybox
    /*
    var skybox = BABYLON.Mesh.CreateBox("skyBox", 800.0, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
    */
    //At Last, add some lights to our scene
    var light0 = new BABYLON.PointLight("pointlight0", new BABYLON.Vector3(28, 78, 385), scene);
    light0.diffuse = new BABYLON.Color3(0.5137254901960784, 0.2117647058823529, 0.0941176470588235);
    light0.intensity = 0.2;

    var light1 = new BABYLON.PointLight("pointlight1", new BABYLON.Vector3(382, 96, 4), scene);
    light1.diffuse = new BABYLON.Color3(1, 0.7333333333333333, 0.3568627450980392);
    light1.intensity = 0.2;

    //TO DO: create the labyrinth

    /*var row = 15;
    var col = 20;

    var cubeWallMaterial = new BABYLON.StandardMaterial("cubeWalls", scene);
    cubeWallMaterial.emissiveTexture = new BABYLON.Texture("textures/coniferous_hedge.JPG", scene);
    cubeWallMaterial.bumpTexture = new BABYLON.Texture("textures/coniferous_hedge.JPG", scene);
    cubeWallMaterial.specularTexture = new BABYLON.Texture("textures/coniferous_hedge.JPG", scene);

    var mainCube = BABYLON.Mesh.CreateBox("mainCube", BLOCK_SIZE, scene);
    mainCube.material = cubeWallMaterial;
    mainCube.checkCollisions = true;
    mainCube.position = new BABYLON.Vector3(BLOCK_SIZE / 2 + (row - (mCount / 2)) * BLOCK_SIZE, BLOCK_SIZE / 2,
        BLOCK_SIZE / 2 + (col - (mCount / 2)) * BLOCK_SIZE);
*/
    return scene;
};

window.onload = function () {
    canvas = document.getElementById("canvas");


    if (!BABYLON.Engine.isSupported()) {
        window.alert('Browser not supported');
    } else {
        engine = new BABYLON.Engine(canvas, true);

        window.addEventListener("resize", function () {
            engine.resize();
        });

        window.onkeyup = function(e) {
            var key = e.keyCode ? e.keyCode : e.which;

            if (key == 80) // P
                alert(freeCamera.position)
            else if (key == 70) {  // F
                freeCamera.applyGravity = false;
            } else if(key = 82) { //R
                freeCamera.position = inicio;
            } else {
                alert(key);
            }
        }

        Scene = createMaze();
        var obj = new Laberinto("lab", inicio, inicio, Scene);

        var seen = [];
        var json = JSON.stringify(obj, function(key, val) {
            if (val != null && typeof val == "object") {
                if (seen.indexOf(val) >= 0) {
                    return;
                }
                seen.push(val);
            }
            return val;
        });
        var objeto = JSON.parse(json);
        var lab = new Laberinto(objeto.name, objeto.inicio, objeto.fin, objeto.scene);
        alert(lab.getInicio());

        // Enable keyboard/mouse controls on the scene (FPS like mode)
        Scene.activeCamera.attachControl(canvas);

        engine.runRenderLoop(function () {
            Scene.render();
        });
    }
};