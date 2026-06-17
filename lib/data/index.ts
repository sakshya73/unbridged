import { Step } from "../types"
import { bridgeSteps } from "./bridge"
import { threadsSteps } from "./threads"
import { jsiSteps } from "./jsi"
import { lifecycleSteps } from "./lifecycle"
import { usestateSteps } from "./usestate"
import { useeffectSteps } from "./useeffect"
import { flatlistSteps } from "./flatlist"
import { hermesSteps } from "./hermes"
import { metroSteps } from "./metro"
import { navigationSteps } from "./navigation"
import { animatedSteps } from "./animated"
import { renderPipelineSteps } from "./render-pipeline"
import { startupSteps } from "./startup"

export const conceptSteps: Record<string, Step[]> = {
  bridge: bridgeSteps,
  threads: threadsSteps,
  jsi: jsiSteps,
  lifecycle: lifecycleSteps,
  usestate: usestateSteps,
  useeffect: useeffectSteps,
  flatlist: flatlistSteps,
  hermes: hermesSteps,
  metro: metroSteps,
  navigation: navigationSteps,
  animated: animatedSteps,
  "render-pipeline": renderPipelineSteps,
  startup: startupSteps,
}
