/// <reference path="Babylon.js/babylon.2.0.js" />

"use strict";


// Size of a cube/block
var BLOCK_SIZE = 8;
var Camera, canvas, engine, Scene;
var oculus = false;
var useSkybox = false;
var cubes = 0;
var amarillos = [];
var verdes = [];

var degree = 0; //cubes animation

//Control de tiempo
var started = false;
var finished = false;
var tstart;
var tend;
var alerted = false;


//var inicio new BABYLON.Vector3(-90, 7, 98);
var inicio = new BABYLON.Vector3(0,20,0);
var meta;
var metaDefinida = false;
var cuboMeta;

var Laberinto = function(_name, _img, _inicio, _meta, _skybox, _size, _verdes, _amarillos) {
    this.name = _name;
    this.img = _img;
    this.inicio = _inicio;
    this.meta = _meta;
    this.verdes = _verdes;
    this.amarillos = _amarillos;
    this.skybox = _skybox;
    this.size = _size;

    this.getInicio = function() {
        return new BABYLON.Vector3(this.inicio.x, this.inicio.y, this.inicio.z);
    };

    this.getMeta = function() {
        return new BABYLON.Vector3(this.meta.x, this.meta.y, this.meta.z);
    };

    this.getImgUrl = function() {
        return "laberintos/" + this.img;
    };

    this.genAmarillos = function() {
        this.amarillos.forEach(function(elem) {
            var punto = new BABYLON.Vector3(elem.x, elem.y, elem.z);
            createCube(AMARILLO, punto, Scene);
            amarillos.push(punto);
        });
    };

    this.genVerdes = function() {
        this.verdes.forEach(function(elem) {
            var punto = new BABYLON.Vector3(elem.x, elem.y, elem.z);
            createCube(VERDE, punto, Scene);
            verdes.push(punto);
        });
    };

};



var setCamera = function(scene, inicio) {
    var _camera;
    var pos = new BABYLON.Vector3(inicio.x, inicio.y, inicio.z);
    
    _camera = new BABYLON.FreeCamera("free", pos, scene);
    
    _camera.minZ = 1;
    _camera.checkCollisions = true;
    _camera.applyGravity = true;
    _camera.ellipsoid = new BABYLON.Vector3(1, 3, 1);
    _camera.inertia = 0.4;
    _camera.angularSensibility = 1000;
    _camera.speed = 3;
    /*_camera.keysUp.push(87); // W
    _camera.keysLeft.push(65); // A
    _camera.keysDown.push(83); // S
    _camera.keysRight.push(68); // D*/

    if(oculus){
        var originCamera = _camera;

        _camera =  new BABYLON.OculusCamera("Oculus", originCamera.position, scene);
        scene.activeCamera = _camera;
        scene.activeCamera.minZ = originCamera.minZ;
        scene.activeCamera.maxZ = originCamera.maxZ;
        scene.activeCamera.gravity = originCamera.gravity;
        scene.activeCamera.checkCollisions = true;
        scene.activeCamera.applyGravity = true;
        scene.activeCamera.attachControl(canvas);
        scene.activeCamera.speed = originCamera.speed;
        scene.activeCamera.rotation.copyFrom(originCamera.rotation);
        _camera.ellipsoid = new BABYLON.Vector3(1, 3, 1);
        _camera.inertia = 0.4;
        _camera.angularSensibility = 1000;
        _camera.speed = 3;
        
    }

    return _camera;
};

function createMaze(img, size) {
    

    var scene = new BABYLON.Scene(engine);
    scene.gravity = new BABYLON.Vector3(0, -0.8, 0);
    scene.collisionsEnabled = true;

    Camera = setCamera(scene, inicio);
    


    // Ground
    var mCount = 33;
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

    //var ground = BABYLON.Mesh.CreateGround("ground", (mCount + 2) * BLOCK_SIZE, (mCount + 2) * BLOCK_SIZE, 1, scene, false);
    var ground = BABYLON.Mesh.CreateGround("ground", size * 2, size*2, 1, scene, false);

    ground.material = groundMaterial;
    ground.checkCollisions = true;


    /*var WallTexture = "textures/white_wall.jpg";
    var scaleValue = 100;*/
    
    var WallMaterial = new BABYLON.StandardMaterial("Walls", scene);
    WallMaterial.diffuseColor = new BABYLON.Color3(0,1,0);
    WallMaterial.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.7);
    WallMaterial.specularColor = new BABYLON.Color3(0.8, 0.8, 0.9);

   
    
    var imglocation = "laberintos/" + img;
    
                                                                            // w   H   divs max min
    //var walls = BABYLON.Mesh.CreateGroundFromHeightMap("wall", "binMaze.png", 200, 200, 200, 10, -2, scene, false);
    var walls = BABYLON.Mesh.CreateGroundFromHeightMap("wall", imglocation, size, size, 250, 10, -2, scene, false);
    walls.material = WallMaterial;
    walls.checkCollisions = true;


    //Skybox
    var skybox;
    var skyboxMaterial;
    if(useSkybox) {
        skybox = BABYLON.Mesh.CreateBox("skyBox", 800.0, scene);
        skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skybox.infiniteDistance = true;
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("skybox/skybox", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyboxMaterial;
    }

        
    
    
    
    //At Last, add some lights to our scene
    var light0 = new BABYLON.PointLight("pointlight0", new BABYLON.Vector3(28, 78, 385), scene);
    light0.diffuse = new BABYLON.Color3(0.5137254901960784, 0.2117647058823529, 0.0941176470588235);
    light0.intensity = 0.2;

    var light1 = new BABYLON.PointLight("pointlight1", new BABYLON.Vector3(382, 96, 4), scene);
    light1.diffuse = new BABYLON.Color3(1, 0.7333333333333333, 0.3568627450980392);
    light1.intensity = 0.2;


    return scene;
};

function cargarEjemplo() {
    var seleccion = $('#SelectorEjemplos').val();
    switch(seleccion) {
        case '0':
            alert("¡Selecciona un laberinto!");
            break;
        case '1':
            cargarLaberinto(PasilloSinSkyBox);
            break;
        case '2':
            cargarLaberinto(PasilloConSkyBox);
            break;
        case '3':
            cargarLaberinto(LabEnCruz);
            break;
        case '4':
            cargarLaberinto(LabEnCruzReferencias);
            break;
        case '5':
            cargarLaberinto(Circular);
            break;
        case '6':
            cargarLaberinto(CircularRef);
            break;
        case '7':
            cargarLaberinto(LaberintoNormal);
            break;
    }
};

function cargar() {
    var file = $('#laberintoJson')[0].files[0];
    if (file) {
        // create reader
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(e) {
            // browser completed reading file 
            var obj = JSON.parse(e.target.result);
            cargarLaberinto(obj);
        };
    }
};

function cargarLaberinto(obj) {
    
    var laberinto = new Laberinto(obj.name, obj.img, obj.inicio, obj.meta, obj.skybox, obj.size, obj.verdes, obj.amarillos);
    oculus = $('#oculus').is(':checked');
    useSkybox = laberinto.skybox;
    inicio = laberinto.getInicio();
    meta = laberinto.getMeta();
    metaDefinida = true;
    
    Scene = createMaze(laberinto.img, laberinto.size);
    cuboMeta = createCube(ROJO, meta, Scene);

    laberinto.genVerdes();
    laberinto.genAmarillos();

    Scene.activeCamera.attachControl(canvas);

    started = false;
    finished = false;
    alerted = false;
    
    engine.runRenderLoop(function () {
        Scene.render();
        if(!started)
            checkStart();
        else checkFinish();
        if (finished && !alerted)
            doFinish();
    });

    Camera.applyGravity = true;
    aLaPantalla();

    alert("¡Hola!, tu objetivo es encontrar el cubo rojo. En cuanto te muevas el tiempo empezara a contar y se detendrá cuando atravieses el cubo rojo.");


};

function checkStart() {
    var pos = Camera.position;
    if(pos.x != inicio.x || pos.z != inicio.z){
        tstart = new Date().getTime();
        started = true;
    }
};

function checkFinish() {
    var pos = Camera.position;

    if (distancia(pos, meta)<=2) {
        tend = new Date().getTime();
        finished = true;
    } 
};

function doFinish() {
    engine.stopRenderLoop();
    alerted = true;
    engine.runRenderLoop(function() {});
    fueraCanvas();
    var tiempo = tend - tstart;
    alert("¡Enhorabuena!\nHas completado el laberinto en "+tiempo/1000 +" segundos");

}

function distancia(p1, p2) {
    return Math.sqrt((p1.x - p2.x)*(p1.x - p2.x) + (p1.y - p2.y)*(p1.y - p2.y) + (p1.z - p2.z)*(p1.z - p2.z));
};

var seleccionInicio = function() {
    
    var nombre = $("#nombreLab").val();
    var img = $('#imagen').val();
    var size = $("#size").val();
    useSkybox = $('#skybox').is(':checked');
    
    Scene = createMaze(img, size);
    Scene.activeCamera.attachControl(canvas);

    engine.runRenderLoop(function () {
        Scene.render();
    });

    Camera.applyGravity = false;
    aLaPantalla();

    alert("Vamos a seleccionar el punto de Inicio, para ello colocate en el lugar deseado (¡puedes volar!) y pulsa la tecla \"i\"");


    window.onkeyup = function(e) {
        var key = e.keyCode ? e.keyCode : e.which;

        switch(key) {
            case 73: //i
                var pos = Camera.position;
                inicio = pos;
                fueraCanvas();
                alert("Inicio fijado");
                break;
            case 27: //ESC
                fueraCanvas();
                break;
        }
    };
    

};

var seleccionMeta = function() {
    
    var nombre = $("#nombreLab").val();
    var img = $('#imagen').val();
    var size = $("#size").val();
    useSkybox = $('#skybox').is(':checked');
    
    Scene = createMaze(img, size);
    Scene.activeCamera.attachControl(canvas);

    engine.runRenderLoop(function () {
        Scene.render();
    });

    Camera.applyGravity = false;
    aLaPantalla();

    alert("Vamos a seleccionar el punto de Meta (cubo Rojo), para ello colocate en el lugar deseado (¡puedes volar!) y pulsa la tecla \"m\", también puedes usar las teclas \"a\" o \"v\" para añadir referencias (cubos amarillos y verdes respectivamente). \n Pulsa ESC cuando hayas terminado.");


    window.onkeyup = function(e) {
        var key = e.keyCode ? e.keyCode : e.which;

        var pos = Camera.position;
        var cubePos = new BABYLON.Vector3(pos.x, pos.y-1, pos.z);
        switch(key) {
            case 77: //m
                if (!metaDefinida){
                    meta = cubePos;
                    metaDefinida = true;
                    cuboMeta = createCube(ROJO, meta, Scene);
                } else {
                    meta.x = pos.x;
                    meta.y = pos.y;
                    meta.z = pos.z;
                }
                break;
            case 65: //a
                amarillos.push(cubePos);
                createCube(AMARILLO, cubePos, Scene);
                break;
            case 86: //v
                verdes.push(cubePos);
                createCube(VERDE, cubePos, Scene)
                break;
            case 27: //ESC
                fueraCanvas();
                break;
        }
    };
    

};




var AMARILLO = 1;
var ROJO = 2;
var VERDE = 3;

function createCube(color, pos, scene) {
    cubes += 1;
    name = "cube" + cubes;
    var cube = BABYLON.Mesh.CreateBox(name, 2.0, scene);
    cube.position = pos
    var cubematerial = new BABYLON.StandardMaterial("Walls", scene);
    if (color == AMARILLO) {
        cubematerial.diffuseColor = new BABYLON.Color3(1,1,0);
        cubematerial.emissiveColor = new BABYLON.Color3(0.9,0.9,0);
        cubematerial.specularColor = new BABYLON.Color3(0.8,0.8,0);
    } else if (color == ROJO) {
        cubematerial.diffuseColor = new BABYLON.Color3(1,0,0);
        cubematerial.emissiveColor = new BABYLON.Color3(0.9,0,0);
        cubematerial.specularColor = new BABYLON.Color3(0.8,0,0);
    } else if(color == VERDE) {
        cubematerial.diffuseColor = new BABYLON.Color3(0,1,0);
        cubematerial.emissiveColor = new BABYLON.Color3(0,0.9,0);
        cubematerial.specularColor = new BABYLON.Color3(0,0.8,0);
    }

    cubematerial.backFaceCulling = false;
    cubematerial.alpha = 0.6;
    cube.material = cubematerial;
    cube.checkCollisions = false;

    setInterval(function() {
    var value = Math.PI * degree++/180;
    cube.rotation = new BABYLON.Vector3(-Math.PI/12, value, 0);
    if (degree === 360) {
      degree = 0;
    }
  }, 10);


    return cube;
};

var aLaPantalla = function() {
    canvas.className = "onScreen";
    $('body').addClass('no-scroll');
    window.scrollTo(0,0);
};

var fueraCanvas = function() {
    canvas.className ="offScreen";
    $('body').removeClass('no-scroll');
    window.onkeyup = function () {};
};

function guardar() {
    var nombre = $("#nombreLab").val();
    var img = $('#imagen').val();
    var size = $("#size").val();
    useSkybox = $('#skybox').is(':checked');

    var obj = new Laberinto(nombre, img, inicio, meta, useSkybox, size, verdes, amarillos);

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

    var blob = new Blob([json], {type: "text/plain;charset=utf-8"});
    var fileName = nombre + ".json";
    saveAs(blob, fileName);
}

window.onload = function () {
    canvas = document.getElementById("canvas");


    if (!BABYLON.Engine.isSupported()) {
        window.alert('Browser not supported');
    } else {
        engine = new BABYLON.Engine(canvas, true);

        window.addEventListener("resize", function () {
            engine.resize();
        });
    
    }
};

