import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { Group, PerspectiveCamera } from "three";
import { Envelope3D } from "./Envelope3D";
import { InvitationCard3D } from "./InvitationCard3D";
import { PaperParticles } from "./PaperParticles";
import { SceneLighting } from "./SceneLighting";
import { smoothMapRange, OPENING_PHASES, type OpeningProgressRef } from "../../animations/envelopeTimeline";
import { getSceneLayout } from "../../animations/sceneLayout";

interface SceneContentProps {
  progressRef: React.RefObject<OpeningProgressRef>;
  isMobile: boolean;
  monogram: string;
}

function SceneContent({ progressRef, isMobile, monogram }: SceneContentProps) {
  const { size, camera } = useThree();
  const layout = getSceneLayout({ width: size.width, height: size.height, isMobile });

  const envelopeGroup = useRef<Group>(null);
  const flapRef = useRef<Group>(null);
  const sealRef = useRef<Group>(null);
  const cardRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const progress = progressRef.current?.value ?? 0;
    const P = OPENING_PHASES;
    const time = clock.getElapsedTime();

    // ── Idle floating animation (gentle hover before scroll starts) ──
    const idleFactor = 1 - smoothMapRange(progress, 0, P.cameraApproach);
    const hoverY = Math.sin(time * 0.8) * 0.015 * idleFactor;
    const hoverRot = Math.sin(time * 0.6) * 0.008 * idleFactor;

    // ── Camera: approaches, tilts slightly, then eases back for card ──
    const approach = smoothMapRange(progress, P.idle, P.cameraApproach);
    const settle = smoothMapRange(progress, P.cardFillsViewport, P.complete);
    const cardFill = smoothMapRange(progress, P.cardStraightens, P.cardFillsViewport);

    camera.position.z = layout.cameraZ - approach * 0.8 + settle * 0.5 + cardFill * 0.3;
    camera.position.y = 0.1 - approach * 0.06 + hoverY;
    // Subtle camera tilt during opening for drama
    camera.position.x = Math.sin(progress * Math.PI * 0.5) * 0.05 * (1 - cardFill);
    camera.lookAt(0, hoverY * 0.5, 0);
    if ("fov" in camera) {
      // Slowly widen FOV as card fills viewport for grandeur
      const fovShift = cardFill * 4;
      (camera as PerspectiveCamera).fov = layout.cameraFov - approach * 2 + fovShift;
      camera.updateProjectionMatrix();
    }

    // ── Envelope body ──
    if (envelopeGroup.current) {
      const scale = layout.envelopeScale * (1 + approach * 0.04);
      envelopeGroup.current.scale.setScalar(scale);

      // Subtle float + rotation during idle
      envelopeGroup.current.position.y = hoverY;
      envelopeGroup.current.rotation.z = hoverRot;

      // Tilt backward slightly as flap opens, giving a sense of weight
      const flapProgress = smoothMapRange(progress, P.sealOpens, P.flapOpens);
      envelopeGroup.current.rotation.x = flapProgress * 0.08;

      // Fade out once the card has risen
      const envelopeFade = 1 - smoothMapRange(progress, P.cardRises, P.cardStraightens);
      envelopeGroup.current.visible = envelopeFade > 0.01;
      // Slide downward as it fades for a natural exit
      if (envelopeFade < 1) {
        envelopeGroup.current.position.y = hoverY - (1 - envelopeFade) * 0.6;
      }
      envelopeGroup.current.traverse((obj) => {
        const mat = (obj as unknown as { material?: { opacity?: number; transparent?: boolean } }).material;
        if (mat && "opacity" in mat) {
          mat.transparent = true;
          mat.opacity = envelopeFade;
        }
      });
    }

    // ── Wax seal: wobbles, lifts, dissolves ──
    if (sealRef.current) {
      const react = smoothMapRange(progress, P.sealReacts, P.sealOpens - 0.06);
      const open = smoothMapRange(progress, P.sealOpens - 0.06, P.sealOpens);

      // Wobble
      sealRef.current.rotation.z = Math.sin(react * Math.PI * 3) * 0.15 * react - open * 1.2;
      // Lift and move forward
      sealRef.current.position.y = -0.05 + open * 0.7;
      sealRef.current.position.z = 0.32 + open * 0.8;
      // Shrink as it lifts away
      sealRef.current.scale.setScalar(1 - open * 0.6);
    }

    // ── Flap: opens by rotating around hinge ──
    if (flapRef.current) {
      const open = smoothMapRange(progress, P.sealOpens, P.flapOpens);
      // Full 180° rotation for the flap to fold backward
      flapRef.current.rotation.x = -open * Math.PI;
    }

    // ── Card: rises, straightens, fills viewport ──
    if (cardRef.current) {
      const emerge = smoothMapRange(progress, P.cardEmerges, P.cardRises);
      const straighten = smoothMapRange(progress, P.cardRises, P.cardStraightens);
      const fill = smoothMapRange(progress, P.cardStraightens, P.cardFillsViewport);

      // Rise out of envelope
      cardRef.current.position.y = -0.15 + emerge * layout.cardTravel * 0.55;
      cardRef.current.position.z = -0.02 + emerge * 0.6;

      // Gentle sway as it rises
      const sway = Math.sin(emerge * Math.PI * 2) * 0.015 * (1 - straighten);
      cardRef.current.rotation.z = sway;

      // Tilt forward slightly while emerging, then straighten
      cardRef.current.rotation.x = emerge * -0.15 + straighten * 0.15;

      // Scale: starts tiny inside envelope, grows as it fills viewport
      const baseScale = layout.cardScale * Math.max(emerge, 0.001);
      const fillScale = 1 + fill * 1.8;
      cardRef.current.scale.setScalar(Math.max(0.001, baseScale * fillScale));
      cardRef.current.visible = emerge > 0.001;
    }
  });

  return (
    <>
      <SceneLighting />

      {/* Subtle ground shadow plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
        <planeGeometry args={[6, 6]} />
        <shadowMaterial opacity={0.08} />
      </mesh>

      <group ref={envelopeGroup}>
        <Envelope3D flapRef={flapRef} sealRef={sealRef} />
      </group>
      <InvitationCard3D ref={cardRef} monogram={monogram} />
      <PaperParticles progressRef={progressRef} count={layout.particleCount} />
    </>
  );
}

interface InvitationSceneProps {
  progressRef: React.RefObject<OpeningProgressRef>;
  isMobile: boolean;
  monogram: string;
}

export function InvitationScene({ progressRef, isMobile, monogram }: InvitationSceneProps) {
  return (
    <Canvas
      dpr={Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2)}
      camera={{ position: [0, 0.1, 5.0], fov: 34 }}
      gl={{ antialias: true, alpha: true }}
      shadows={!isMobile}
    >
      <SceneContent progressRef={progressRef} isMobile={isMobile} monogram={monogram} />
    </Canvas>
  );
}
