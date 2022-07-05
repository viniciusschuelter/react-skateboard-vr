import { PerspectiveCamera } from "@react-three/drei/core/PerspectiveCamera"
import { OrbitControls } from "@react-three/drei/core/OrbitControls"
import { Canvas } from "@react-three/fiber"
import React, { useEffect } from "react"
import Editor from "./Editor"
import { TemplateModel } from "./Models"
import Selector from "./Selector"

export default function Scene(props: any) {
  const {
    wrapClass,
    templates,
    scene,
    downloadPopup,
    mintPopup,
    category,
    setCategory,
    skate,
    setSkate,
    setTemplate,
    template,
    setTemplateInfo,
    templateInfo,
  }: any = props

  const canvasWrap = {
    height: "100vh",
    width: "100vw",
    position: "absolute" as "absolute",
    zIndex: "0",
    top: "0",
    backgroundSize: "cover",
    backgroundImage: "url('bg.png')",
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative" as "relative",
      }}
    >
      <div
        id="canvas-wrap"
        className={`canvas-wrap ${wrapClass && wrapClass}`}
        style={canvasWrap}
      >
        <Canvas
          className="canvas"
          id="editor-scene"
          gl={{ preserveDrawingBuffer: true }}
        >
          <spotLight
            intensity={1}
            position={[0, 3.5, 2]}
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            castShadow
          />
          <spotLight
            intensity={0.2}
            position={[-5, 2.5, 4]}
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <spotLight
            intensity={0.2}
            position={[5, 2.5, 4]}
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <spotLight
            intensity={0.3}
            position={[0, -2, -8]}
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            castShadow
          />
          <OrbitControls
            minDistance={1}
            maxDistance={3}
            minPolarAngle={0.0}
            maxPolarAngle={Math.PI / 2 - 0.1}
            enablePan={true}
            target={[0, 1, 0]}
          />
          <PerspectiveCamera>
            {!downloadPopup && !mintPopup && <TemplateModel scene={scene} />}
          </PerspectiveCamera>
        </Canvas>
      </div>
      <div>
        <Selector
          templates={templates}
          category={category}
          scene={scene}
          skate={skate}
          setSkate={setSkate}
          setTemplate={setTemplate}
          template={template}
          setTemplateInfo={setTemplateInfo}
          templateInfo={templateInfo}
        />
        <Editor category={category} setCategory={setCategory} />
      </div>
    </div>
  )
}
