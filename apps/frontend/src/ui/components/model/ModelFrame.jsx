import React, { Suspense, forwardRef, useRef, useImperativeHandle } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import CameraControls from "./camera/CameraControls";
import CameraLight from "./camera/CameraLight"
import Model3MF from "../../../service/Model3mf";
import Model3DS from "../../../service/Model3ds";
import ModelOBJ from "../../../service/ModelObj";
import LoadingSpinner from "../LoadingSpinner";

const ModelViewer = forwardRef(({ modelPath, fileExt, onPartsLoaded, partSettings, drawMode, isLocked, canvasStyle }, ref) => {
  const model3mfRef = useRef();
  const orbitControlsRef = useRef();

  useImperativeHandle(ref, () => ({
    clearDrawing() {
      model3mfRef.current?.clearDrawing();
    },
    resetRotation() {
      model3mfRef.current?.resetRotation();
    },
    resetCamera() {
      orbitControlsRef.current?.reset();
    }
  }));

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Canvas style={canvasStyle} shadows camera={{ position: [0, 0, 5], fov: 50 }} gl={{ antialias: true }}>
        <ambientLight intensity={0.4} />
        <CameraLight />
        <CameraControls />
        {(fileExt ? fileExt.toLowerCase().endsWith('3ds') : (typeof modelPath === 'string' && modelPath.toLowerCase().endsWith('.3ds'))) ? (
          <Model3DS
            ref={model3mfRef}
            modelPath={modelPath}
            onPartsLoaded={onPartsLoaded}
            partSettings={partSettings}
            drawMode={drawMode}
            enable={!isLocked}
          />
        ) : (fileExt ? fileExt.toLowerCase().endsWith('obj') : (typeof modelPath === 'string' && modelPath.toLowerCase().endsWith('.obj'))) ? (
          <ModelOBJ
            ref={model3mfRef}
            modelPath={modelPath}
            onPartsLoaded={onPartsLoaded}
            partSettings={partSettings}
            drawMode={drawMode}
            enable={!isLocked}
          />
        ) : (
          <Model3MF
            ref={model3mfRef}
            modelPath={modelPath}
            onPartsLoaded={onPartsLoaded}
            partSettings={partSettings}
            drawMode={drawMode}
            enable={!isLocked}
          />
        )}
        <OrbitControls
          ref={orbitControlsRef}
          enableDamping={true}
          dampingFactor={0.05}
          enabled={!isLocked}
        />
      </Canvas>
    </Suspense>
  );
});

export default ModelViewer;
