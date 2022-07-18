import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb"
import { Avatar, Slider, Stack, Typography } from "@mui/material"
import Divider from "@mui/material/Divider"
import { VRM, VRMSchema } from "@pixiv/three-vrm"
import React, { useState } from "react"
import { AnimationMixer } from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { apiService, sceneService } from "../services"

export default function Selector(props) {
  const {
    templates,
    category,
    scene,
    skate,
    setSkate,
    setTemplateInfo,
    templateInfo,
    loading,
    setLoading
  }: any = props
  const [selectValue, setSelectValue] = useState("0")

  const [collection, setCollection] = useState([])
  const [partName, setPartName] = useState("")

  const [noPart, setNoPart] = useState(true)
  const [loaded, setLoaded] = useState(false)

  const handleChangeSkin = (event: Event, value: number | number[]) => {
    for (const bodyTarget of templateInfo.bodyTargets) {
      sceneService.setMaterialColor(scene, value, bodyTarget)
    }
  }

  const selectorContainer = {
    position: "absolute" as "absolute",
    height: "5rem",
    left: "0",
    bottom: "93px",
    width: "100vw",
    boxSizing: "border-box" as "border-box",
    padding: "14px 0px 14px 32px !important",
  }

  const selectorButton = {
    color: "#999999",
    textAlign: "center" as "center",
    fontSize: "12px",
    minWidth: "60px",
    margin: "20px 0",
    cursor: "pointer" as "pointer",
  }

  React.useEffect(() => {
    if (!scene) return
    if (category) {
      apiService.fetchPartsByCategory(category).then((parts) => {
        if (parts) {
          setCollection(parts?.collection)
          setPartName(parts?.part)
        }
      })
    }
  }, [category, scene])

  React.useEffect(() => {
    if (!scene) return
    async function _get() {
      if (!loaded) {
        setTempInfo("1")
        if (scene && templateInfo) {
          // for (const category of categories) {
          //   apiService.fetchTraitsByCategory(category).then((traits) => {
          //     if (parts) {
          //       selectParts(parts?.collection[0])
          //     }
          //   })
          // }
        }
      }
    }
    _get()
  }, [
    loaded,
    scene,
    templateInfo ? Object.keys(templateInfo).length : templateInfo,
  ])

  React.useEffect(() => {
    if (scene) {
      sceneService.setScene(scene)
    }
  }, [scene])

  const setTempInfo = (id) => {
    apiService.fetchTemplate(id).then((res) => {
      console.log("res is", res)
      setTemplateInfo(res)
    })
  }

  const selectPart = (part: any) => {
    if (scene) {
      if (skate && skate[category]) {
        scene.remove(skate[category].model)
      }
      if (part === "0") {
        setNoPart(true)
      } else {
        // setLoadingPartOverlay(true)
        setNoPart(false)
        console.log(`${templateInfo.traitsDirectory}${part?.directory}`);
        const loader = new GLTFLoader()
        let timer, modelMixer
        loader
          .loadAsync(
            `${part?.directory}`,
            (e) => {
              // console.log((e.loaded * 100) / e.total);
              setLoading(Math.round((e.loaded * 100) / e.total))
            },
          )
          .then(async (gltf) => {
            const vrm = gltf
            // VRM.from(gltf).then(async (vrm) => {
            // vrm.scene.scale.z = -1;
            // console.log("scene.add", scene.add)
            // TODO: This is a hack to prevent early loading, but we seem to be loading traits before this anyways
            // await until scene is not null
            await new Promise<void>((resolve) => {
              // if scene, resolve immediately
              if (scene && scene.add) {
                resolve()
              } else {
                // if scene is null, wait for it to be set
                const interval = setInterval(() => {
                  if (scene && scene.add) {
                    clearInterval(interval)
                    resolve()
                  }
                }, 100)
              }
            })

            scene.add(vrm.scene)
            // vrm.humanoid.getBoneNode(
            //   VRMSchema.HumanoidBoneName.Hips,
            // ).rotation.y = Math.PI
            vrm.scene.frustumCulled = false
            setSkate({
              ...skate,
              [category]: {
                traitInfo: part,
                model: vrm.scene,
              },
            })
            setTimeout(() => {
              setLoading(0)
            }, 400)
            return vrm
          })
          .then((modelGltf) => {
            loader.loadAsync(templateInfo.animation).then((animGltf) => {
              // modelGltf and animGltf are both gltf files
              // get the Idle animation from the model in animGltf
              // and apply the Idle animation to modelGltf
              modelGltf.scene.children.forEach( (mesh: any) => mesh.material.color.set( 0xffffff * Math.random()));
              modelMixer = new AnimationMixer(modelGltf.scene)
              ;(window as any).modelMixers.push(modelMixer)

              ;(window as any).modelMixers.forEach((mixer) => {
                mixer.setTime(0)
              })

              const idleAnimation = animGltf.animations[0]
              modelMixer.clipAction(idleAnimation).play()

              console.log("Playing")
              console.log(modelGltf.scene)
            })
          })
        return () => {
          // remove modelMixer from (window as any).modelMixers array
          ;(window as any).modelMixers.forEach((mixer, index) => {
            if (mixer === modelMixer) {
              ;(window as any).modelMixers.splice(index, 1)
            }
          })

          modelMixer = null
        }
        // })
      }
      setSelectValue(part?.id)
    }
  }

  return (
    <div className="selector-container" style={selectorContainer}>
      {templateInfo?.traitsDirectory && (
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          alignItems="center"
          divider={<Divider orientation="vertical" flexItem />}
        >
          {category === "color" ? (
            <Slider
              defaultValue={255}
              valueLabelDisplay="off"
              step={1}
              max={255}
              min={0}
              onChange={handleChangeSkin}
              sx={{ width: "50%", margin: "30px 0" }}
            />
          ) : (
            <React.Fragment>
              <div
                style={selectorButton}
                className={`selector-button ${noPart ? "active" : ""}`}
                onClick={() => selectPart("0")}
              >
                <Avatar className="icon">
                  <DoNotDisturbIcon />
                </Avatar>
              </div>
              {collection &&
                collection.map((item: any, index) => {
                  return (
                    <div
                      key={index}
                      style={selectorButton}
                      className={`selector-button coll-${partName} ${
                        selectValue === item?.id ? "active" : ""
                      }`}
                      onClick={() => {
                        if (category === "base") {
                          setLoaded(true)
                          setTempInfo(item.id)
                        }
                        selectPart(item)
                      }}
                    >
                      <Avatar
                        className="icon"
                        src={
                          item.thumbnailsDirectory
                            ? item.thumbnail
                            : `${templateInfo?.thumbnailsDirectory}${item?.thumbnail}`
                        }
                      />
                    </div>
                  )
                })}
              <div style={{ visibility: "hidden" }}>
                <Avatar className="icon" />
              </div>
            </React.Fragment>
          )}
        </Stack>
      )}
    </div>
  )
}
