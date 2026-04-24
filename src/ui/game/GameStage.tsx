import { browserTestCanvasGlOptions } from "@/lib/testing";
import { Canvas } from "@react-three/fiber";
import { Crosshair } from "./Crosshair";
import { HUD } from "./HUD";
import { World } from "./World";
import { init } from "@dimforge/rapier3d-compat";
import { useEffect, useState } from "react";

interface GameStageProps {
  showOverlays: boolean;
}

// Single gameplay entry point so the landing chunk doesn't eagerly
// load R3F / drei / rapier / three. Everything on this page is async.
export default function GameStage({ showOverlays }: GameStageProps) {
  const [isRapierReady, setIsRapierReady] = useState(false);

  useEffect(() => {
    // Explicitly initialize the compat version which handles its own WASM correctly
    init().then(() => {
      setIsRapierReady(true);
    }).catch(err => {
      console.error("Rapier Init Error:", err);
    });
  }, []);

  return (
    <>
      <Canvas gl={browserTestCanvasGlOptions}>
        {showOverlays && isRapierReady && <World />}
      </Canvas>
      {showOverlays && (
        <>
          <HUD />
          <Crosshair />
        </>
      )}
    </>
  );
}
