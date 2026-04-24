import { browserTestCanvasGlOptions } from "@/lib/testing";
import { Canvas } from "@react-three/fiber";
import { Crosshair } from "./Crosshair";
import { HUD } from "./HUD";
import { World } from "./World";

interface GameStageProps {
  showOverlays: boolean;
}

// Single gameplay entry point so the landing chunk doesn't eagerly
// load R3F / drei / rapier / three. Everything on this page is async.
export default function GameStage({ showOverlays }: GameStageProps) {
  return (
    <>
      <Canvas gl={browserTestCanvasGlOptions}>{showOverlays && <World />}</Canvas>
      {showOverlays && (
        <>
          <HUD />
          <Crosshair />
        </>
      )}
    </>
  );
}
