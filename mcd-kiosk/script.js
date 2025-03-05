// setup
// import useMenuStore from "./src/store/useMenuStore"

// const isRecording = useMenuStore((state)=>state.isRecording);
// console.log(isRecording)
// Select the target element
// Select the target element
let allowToTalk = false;
function allowTalking() {
  allowToTalk = true;
  console.log("Talking allowed!");
}

// Function to shut mouth
function shutMouth() {
  allowToTalk = false;
  console.log("Mouth shut!");
}
function listningHandler(){
  console.log("listening handler ran")
  debugger;
  const targetNode = document.getElementById("av");
  console.log("targeNode", targetNode)
if (targetNode) {
    // Create a MutationObserver instance
    const observer = new MutationObserver((mutationsList) => {
      debugger;
        for (const mutation of mutationsList) {
            if (mutation.type === "attributes" && mutation.attributeName === "data-speaking") {
                console.log("data-speaking changed to:", targetNode.getAttribute("data-speaking"));
                let curVal = targetNode.getAttribute("data-speaking") !== "true" ? true : false;
                console.log("type of curVal" , typeof curVal)
                if(curVal){
                  console.log(curVal);
                  allowTalking();
                }
                else{
                  console.log("else case",curVal)
                  shutMouth();
                }
            }
        }
    });

    // Configure the observer to watch for attribute changes
    observer.observe(targetNode, { attributes: true });

    console.log("Listening for changes in data-speaking...");
} else {
    console.error("Element with id 'av' not found.");
}
}


  //expression setup
  var expressionyay = 0;
  var expressionoof = 0;
  var expressionlimityay = 0.5;
  var expressionlimitoof = 0.5;
  var expressionease = 100;
  var expressionintensity = 0.75;
  
    //interface values
  if (localStorage.localvalues) {
    var initvalues = true;
    var mouththreshold = Number(localStorage.mouththreshold) ;
    var mouthboost = Number(localStorage.mouthboost) ;
    var bodythreshold = Number(localStorage.bodythreshold) ;
    var bodymotion = Number(localStorage.bodymotion) ;
    var expression = Number(localStorage.expression) ;
  } else {
    var mouththreshold = 10;
    var mouthboost = 10;
    var bodythreshold = 10;
    var bodymotion = 10;
    var expression = 80;
  }
  
  // setup three-vrm
  
  // Create container div if it doesn't exist
  function setupContainer() {
    const containerId = 'avatar-container';
    let container = document.getElementById(containerId);
    
    if (!container) {
      container = document.createElement('div');
      container.id = containerId;
      container.style.width = '100%';
      container.style.height = '100%';
      container.style.position = 'relative';
      
      // You can specify where to insert the container
      // For this example, we'll just append it to the body
      document.body.appendChild(container);
    }
    
    return container;
  }
  
  // Get the container element
  const container = setupContainer();
  
  // renderer
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  
  // Append to container instead of body
  container.appendChild(renderer.domElement);
  
  // camera
  const camera = new THREE.PerspectiveCamera(30.0, container.clientWidth / container.clientHeight, 0.1, 100.0);
  camera.position.set(0.0, 1.5, 1.5);
  
  // camera controls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.screenSpacePanning = true;
  controls.target.set(0.0, 1.45, 0.0);
  controls.update();
  
  // scene
  const scene = new THREE.Scene();
  
  // light
  const light = new THREE.DirectionalLight(0xffffff);
  light.position.set(1.0, 1.0, 1.0).normalize();
  scene.add(light);
  
  // lookat target
  const lookAtTarget = new THREE.Object3D();
  camera.add(lookAtTarget);
  
  // gltf and vrm
  let currentVrm = undefined;
  const loader = new THREE.GLTFLoader();
  
  function load(url) {
    loader.crossOrigin = 'anonymous';
    loader.load(
      url,
      (gltf) => {
        //THREE.VRMUtils.removeUnnecessaryVertices( gltf.scene ); Vroid VRM can't handle this for some reason
        THREE.VRMUtils.removeUnnecessaryJoints(gltf.scene);
  
        THREE.VRM.from(gltf).then((vrm) => {
          if (currentVrm) {
            scene.remove(currentVrm.scene);
            currentVrm.dispose();
          }
  
          currentVrm = vrm;
          scene.add(vrm.scene);
  
          vrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.Hips).rotation.y = Math.PI;
          vrm.springBoneManager.reset();
  
          // un-T-pose
          vrm.humanoid.getBoneNode(
            THREE.VRMSchema.HumanoidBoneName.RightUpperArm
          ).rotation.z = 250;
        
          vrm.humanoid.getBoneNode(
            THREE.VRMSchema.HumanoidBoneName.RightLowerArm
          ).rotation.z = -0.2;
  
          vrm.humanoid.getBoneNode(
            THREE.VRMSchema.HumanoidBoneName.LeftUpperArm
          ).rotation.z = -250;
       
          vrm.humanoid.getBoneNode(
            THREE.VRMSchema.HumanoidBoneName.LeftLowerArm
          ).rotation.z = 0.2;
  
          // randomise init positions
          function randomsomesuch() {
            return (Math.random() - 0.5) / 10;
          }
  
          vrm.humanoid.getBoneNode(
            THREE.VRMSchema.HumanoidBoneName.Head
          ).rotation.x = randomsomesuch();
          vrm.humanoid.getBoneNode(
            THREE.VRMSchema.HumanoidBoneName.Head
          ).rotation.y = randomsomesuch();
          vrm.humanoid.getBoneNode(
            THREE.VRMSchema.HumanoidBoneName.Head
          ).rotation.z = randomsomesuch();
  
          vrm.humanoid.getBoneNode(
            THREE.VRMSchema.HumanoidBoneName.Neck
          ).rotation.x = randomsomesuch();
          vrm.humanoid.getBoneNode(
            THREE.VRMSchema.HumanoidBoneName.Neck
          ).rotation.y = randomsomesuch();
          vrm.humanoid.getBoneNode(
            THREE.VRMSchema.HumanoidBoneName.Neck
          ).rotation.z = randomsomesuch();
  
          vrm.humanoid.getBoneNode(
            THREE.VRMSchema.HumanoidBoneName.Spine
          ).rotation.x = randomsomesuch();
          vrm.humanoid.getBoneNode(
            THREE.VRMSchema.HumanoidBoneName.Spine
          ).rotation.y = randomsomesuch();
          vrm.humanoid.getBoneNode(
            THREE.VRMSchema.HumanoidBoneName.Spine
          ).rotation.z = randomsomesuch();
  
          vrm.lookAt.target = lookAtTarget;
          vrm.springBoneManager.reset();
  
          console.log(vrm);
        });
      },
      (progress) => console.log('Loading model...', 100.0 * (progress.loaded / progress.total), '%'),
      (error) => console.error(error)
    );
  }
  
  // beware of CORS errors when using this locally. If you can't https, import the required libraries.
  // load('https://automattic.github.io/VU-VRM/assets/VU-VRM-elf.vrm');
  load('/src/assets/mcd.vrm');
  
  // animate
  const clock = new THREE.Clock();
  
  function animate() {
    requestAnimationFrame(animate);
  
    const deltaTime = clock.getDelta();
  
    if (currentVrm) {
      // update vrm
      currentVrm.update(deltaTime);
    }
  
    renderer.render(scene, camera);
  }
  
  animate();
  
  // mic listener - get a value
  navigator.mediaDevices
  .getUserMedia({ audio: true })
  .then(function (stream) {
    audioContext = new AudioContext();
    analyser = audioContext.createAnalyser();
    microphone = audioContext.createMediaStreamSource(stream);
    javascriptNode = audioContext.createScriptProcessor(256, 1, 1);

    analyser.smoothingTimeConstant = 0.5;
    analyser.fftSize = 1024;

    microphone.connect(analyser);
    analyser.connect(javascriptNode);
    javascriptNode.connect(audioContext.destination);

    javascriptNode.onaudioprocess = function () {
      var array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);
      var values = 0;

      var length = array.length;
      for (var i = 0; i < length; i++) {
        values += array[i];
      }

      var average = values / length;
      var inputvolume = average;

      // Move slider if exists
      const inputLevelElement = document.getElementById("inputlevel");
      if (inputLevelElement) {
        inputLevelElement.value = inputvolume;
      }

      // Check if currentVrm exists
      if (currentVrm) {
        if (allowToTalk) {
          // Allow talking only if allowToTalk is true
          var voweldamp = 53;
          var vowelmin = 12;
          if (inputvolume > mouththreshold * 2) {
            currentVrm.blendShapeProxy.setValue(
              THREE.VRMSchema.BlendShapePresetName.A,
              ((average - vowelmin) / voweldamp) * (mouthboost / 10)
            );
          } else {
            currentVrm.blendShapeProxy.setValue(
              THREE.VRMSchema.BlendShapePresetName.A,
              0
            );
          }
        } else {
          // Force mouth to stay shut in "shut state"
          currentVrm.blendShapeProxy.setValue(
            THREE.VRMSchema.BlendShapePresetName.A,
            0
          );
        }
      }
    };
  })
  .catch(function (err) {
    console.log("Error: " + err.name);
  });
  
  // blink
  function blink() {
    if (!currentVrm) return;
    
    var blinktimeout = Math.floor(Math.random() * 250) + 50;
    lookAtTarget.position.y = camera.position.y - camera.position.y * 2 + 1.25;
      
    setTimeout(() => {
      if (!currentVrm) return;
      currentVrm.blendShapeProxy.setValue(
        THREE.VRMSchema.BlendShapePresetName.BlinkL,
        0
      );
      currentVrm.blendShapeProxy.setValue(
        THREE.VRMSchema.BlendShapePresetName.BlinkR,
        0
      );
    }, blinktimeout);
  
    currentVrm.blendShapeProxy.setValue(
      THREE.VRMSchema.BlendShapePresetName.BlinkL,
      1
    );
    currentVrm.blendShapeProxy.setValue(
      THREE.VRMSchema.BlendShapePresetName.BlinkR,
      1
    );
  }
  
  // loop blink timing
  (function loop() {
    var rand = Math.round(Math.random() * 10000) + 1000;
    setTimeout(function () {
      blink();
      loop();
    }, rand);
  })();
  
  // drag and drop + file handler
  container.addEventListener('dragover', function(event) {
    event.preventDefault();
  });
  
  container.addEventListener('drop', function(event) {
    event.preventDefault();
  
    // read given file then convert it to blob url
    const files = event.dataTransfer.files;
    if (!files) { return; }
    const file = files[0];
    if (!file) { return; }
    const blob = new Blob([file], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    load(url);
  });
  
  // handle window resizes
  window.addEventListener('resize', onWindowResize, false);
  
  function onWindowResize() {
    // Use container dimensions instead of window
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }
  
  // interface handling
  var talktime = true;
  
  function interface() {
    if (initvalues == true) {
      if (localStorage.localvalues) {
        initvalues = false;
        const mouthThresholdElement = document.getElementById("mouththreshold");
        const mouthBoostElement = document.getElementById("mouthboost");
        const bodyThresholdElement = document.getElementById("bodythreshold");
        const bodyMotionElement = document.getElementById("bodymotion");
        const expressionElement = document.getElementById("expression");
        
        if (mouthThresholdElement) mouthThresholdElement.value = mouththreshold;
        if (mouthBoostElement) mouthBoostElement.value = mouthboost;
        if (bodyThresholdElement) bodyThresholdElement.value = bodythreshold;
        if (bodyMotionElement) bodyMotionElement.value = bodymotion;
        if (expressionElement) expressionElement.value = expression;
      }
    }
  
    const mouthThresholdElement = document.getElementById("mouththreshold");
    const mouthBoostElement = document.getElementById("mouthboost");
    const bodyThresholdElement = document.getElementById("bodythreshold");
    const bodyMotionElement = document.getElementById("bodymotion");
    const expressionElement = document.getElementById("expression");
    
    if (mouthThresholdElement) mouththreshold = mouthThresholdElement.value;
    if (mouthBoostElement) mouthboost = mouthBoostElement.value;
    if (bodyThresholdElement) bodythreshold = bodyThresholdElement.value;
    if (bodyMotionElement) bodymotion = bodyMotionElement.value;
    if (expressionElement) expression = expressionElement.value;
  
    expressionlimityay = (expression);
    expressionlimitoof = (100 - expression); 
    expressionlimityay = expressionlimityay/100;
    expressionlimitoof = expressionlimitoof/100;
    expressionlimityay = expressionlimityay*expressionintensity;
    expressionlimitoof = expressionlimitoof*expressionintensity;    
  
    console.log("Expression " + expressionyay + " yay / " + expressionoof + " oof");
    console.log("Expression mix " + expressionlimityay + " yay / " + expressionlimitoof + " oof");
  
    // store it too
    localStorage.localvalues = 1;
    localStorage.mouththreshold = mouththreshold;
    localStorage.mouthboost = mouthboost;
    localStorage.bodythreshold = bodythreshold;
    localStorage.bodymotion = bodymotion;
    localStorage.expression = expression;
  }
  
  // click to dismiss non-vrm divs
  function hideinterface() {
    var a = document.getElementById("backplate");
    var b = document.getElementById("interface");
    var x = document.getElementById("infobar");
    var y = document.getElementById("credits");
    if (a) a.style.display = "none";
    if (b) b.style.display = "none";
    if (x) x.style.display = "none";
    if (y) y.style.display = "none";
  }
  
  // click to dismiss non-interface divs
  function hideinfo() {
    var a = document.getElementById("backplate");
    var x = document.getElementById("infobar");
    var y = document.getElementById("credits");
    if (a) a.style.display = "none";
    if (x) x.style.display = "none";
    if (y) y.style.display = "none";
  }
  
  // load file from user picker
  function dofile() {
    var fileInput = document.querySelector('input[type=file]');
    if (!fileInput) return;
    
    var file = fileInput.files[0];
    if (!file) { return; }
    const blob = new Blob([file], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    load(url);
  }
  
  // Function to initialize with a specific div
  function initWithDiv(divId) {
    const targetDiv = document.getElementById(divId);
    if (!targetDiv) {
      console.error(`Target div with ID "${divId}" not found.`);
      return;
    }
    
    // Move the container to the target div
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
    targetDiv.appendChild(container);
    
    // Update dimensions
    container.style.width = '100%';
    container.style.height = '100%';
    
    // Trigger resize to adjust rendering
    onWindowResize();
    listningHandler();
  } 
  
  // wait to trigger interface and load init values
  setTimeout(() => { interface(); }, 500);
  
  // Export the initialization function
  window.initAvatarInDiv = initWithDiv;