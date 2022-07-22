import { createTheme, ThemeProvider } from "@mui/material"
import { VRM, VRMSchema } from "@pixiv/three-vrm"
import React, { Suspense, useState, useEffect, Fragment } from "react"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { sceneService } from "../services"
import DownloadCharacter from "./Download"
import LoadingOverlayCircularStatic from "./LoadingOverlay"
import Scene from "./Scene"
import { AnimationMixer } from "three"
import { SkateInterface } from "../interfaces/skate"

const skateInitialState = {
  deck: {},
  grip: {},
  truck: {},
  wheel: {},
  bearing: {},
}

export default function SkateEditor(props: any) {
  // Selected category State Hook
  const [category, setCategory] = useState("deck")
  // 3D Model Content State Hooks ( Scene, Nodes, Materials, Animations e.t.c ) //
  const [model, setModel] = useState<object>(Object)

  const [scene, setScene] = useState<object>(Object)
  // States Hooks used in template editor //
  const [templateInfo, setTemplateInfo] = useState({
    file: null,
    format: null,
    animation: null,
  })

  const [downloadPopup, setDownloadPopup] = useState<boolean>(false)
  const [template, setTemplate] = useState<number>(1)
  const [loading, setLoading] = useState<number>(0)
  const [skate, setSkate] = useState<SkateInterface>(skateInitialState)

  const defaultTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#de2a5e",
      },
    },
  })

  useEffect(() => {
    if (skate) {
      sceneService.setParts(skate)
    }
  }, [skate])

  useEffect(() => {
    if (model) sceneService.setModel(model)
  }, [model])

  useEffect(() => {
    let timer, modelMixer
    if (templateInfo.file && templateInfo.format) {
      const loader = new GLTFLoader()
      loader
        .loadAsync(templateInfo.file, (e) => {
          setLoading((e.loaded * 100) / (e.total || 1));
        })
        .then((gltf) => {
          const vrm = gltf
          // VRM.from(gltf).then((vrm) => {
          vrm.scene.traverse((o) => {
            o.frustumCulled = false
          })
          // vrm.humanoid.getBoneNode(
          //   VRMSchema.HumanoidBoneName.Hips,
          // ).rotation.y = Math.PI
          setLoading(0)
          setScene(vrm.scene)
          setModel(vrm)
          // })
          return vrm
        })
        .then((modelGltf) => {
          loader.loadAsync(templateInfo.animation).then((animGltf) => {
            // modelGltf and animGltf are both gltf files
            // get the Idle animation from the model in animGltf
            // and apply the Idle animation to modelGltf
            modelMixer = new AnimationMixer(modelGltf.scene);
            (window as any).modelMixers = [];
            (window as any).modelMixers.push(modelMixer);
            console.log("Loading Animation");
            const idleAnimation = animGltf.animations[0];
            console.log("idleAnimation is", idleAnimation);
            timer = setInterval(() => {
              ;(window as any).modelMixers.forEach((mixer) => {
                mixer.update(1 / 30)
              })
            }, 1000 / 30)
            modelMixer.clipAction(idleAnimation).play()
            console.log("Playing on avatar", idleAnimation)
          })
        })
      return () => {
        clearInterval(timer)
        modelMixer = null
      }
    }
  }, [templateInfo.file])

  return (
    <Suspense fallback="loading...">
      <ThemeProvider theme={defaultTheme}>
        {templateInfo && (
          <Fragment>
            {!!loading && (
              <LoadingOverlayCircularStatic
                loadingModelProgress={loading}
              />
            )}
            <DownloadCharacter
              scene={scene}
              templateInfo={templateInfo}
              model={model}
              downloadPopup={downloadPopup}
              setDownloadPopup={setDownloadPopup}
            />
            <Scene
              wrapClass="generator"
              scene={scene}
              downloadPopup={downloadPopup}
              category={category}
              setCategory={setCategory}
              skate={skate}
              setSkate={setSkate}
              setTemplate={setTemplate}
              template={template}
              setTemplateInfo={setTemplateInfo}
              templateInfo={templateInfo}
              loading={loading}
              setLoading={setLoading}
            />
          </Fragment>
        )}
      </ThemeProvider>
    </Suspense>
  )
}
