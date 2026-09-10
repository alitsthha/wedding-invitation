export interface SceneLayoutInput {
  width: number;
  height: number;
  isMobile: boolean;
}

export interface SceneLayout {
  envelopeScale: number;
  cardScale: number;
  cameraZ: number;
  cameraFov: number;
  cardTravel: number; // how far the card rises out of the envelope, in scene units
  particleCount: number;
}

/**
 * Derives every size/position the 3D scene needs from real viewport
 * dimensions and device tier, instead of hardcoded pixel/unit values.
 *
 * The envelope is scaled larger to fill ~65% of the viewport height so it
 * reads as a full-page cinematic hero on first load.
 */
export function getSceneLayout({ width, height, isMobile }: SceneLayoutInput): SceneLayout {
  const aspect = width / height;

  // Bigger envelope, closer camera for a dramatic full-page feel.
  const envelopeScale = isMobile ? 0.92 : aspect < 1.1 ? 1.0 : 1.15;
  const cardScale = isMobile ? 0.9 : 1.05;
  const cameraFov = isMobile ? 40 : aspect > 2.2 ? 30 : 34;
  const cameraZ = isMobile ? 5.8 : 5.0;
  const cardTravel = isMobile ? 2.4 : 2.8;
  const particleCount = isMobile ? 12 : 36;

  return { envelopeScale, cardScale, cameraZ, cameraFov, cardTravel, particleCount };
}
