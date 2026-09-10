import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { InstancedMesh } from "three";
import { Object3D, Color } from "three";
import { mapRange, OPENING_PHASES, type OpeningProgressRef } from "../../animations/envelopeTimeline";

interface PaperParticlesProps {
  progressRef: React.RefObject<OpeningProgressRef>;
  count: number;
}

const dummy = new Object3D();

interface Seed {
  angle: number;
  radius: number;
  rise: number;
  spin: number;
  scale: number;
  drift: number;     // horizontal drift speed
  sparkle: boolean;  // golden sparkle vs confetti
}

export function PaperParticles({ progressRef, count }: PaperParticlesProps) {
  const confettiRef = useRef<InstancedMesh>(null);
  const sparkleRef = useRef<InstancedMesh>(null);

  const sparkleCount = Math.floor(count * 0.4);
  const confettiCount = count - sparkleCount;

  const confettiSeeds = useMemo<Seed[]>(
    () =>
      Array.from({ length: confettiCount }, () => ({
        angle: Math.random() * Math.PI * 2,
        radius: 0.15 + Math.random() * 0.6,
        rise: 0.2 + Math.random() * 0.8,
        spin: Math.random() * Math.PI * 2,
        scale: 0.015 + Math.random() * 0.025,
        drift: (Math.random() - 0.5) * 0.3,
        sparkle: false,
      })),
    [confettiCount]
  );

  const sparkleSeeds = useMemo<Seed[]>(
    () =>
      Array.from({ length: sparkleCount }, () => ({
        angle: Math.random() * Math.PI * 2,
        radius: 0.1 + Math.random() * 0.4,
        rise: 0.3 + Math.random() * 0.5,
        spin: Math.random() * Math.PI * 2,
        scale: 0.008 + Math.random() * 0.015,
        drift: (Math.random() - 0.5) * 0.2,
        sparkle: true,
      })),
    [sparkleCount]
  );

  useFrame(({ clock }) => {
    const progress = progressRef.current?.value ?? 0;
    const time = clock.getElapsedTime();

    // Confetti: bursts when seal breaks, drifts gently
    const confettiMesh = confettiRef.current;
    if (confettiMesh) {
      const burst = mapRange(progress, OPENING_PHASES.sealReacts, OPENING_PHASES.flapOpens);
      const fade = 1 - mapRange(progress, OPENING_PHASES.cardRises, OPENING_PHASES.cardStraightens);
      const visible = burst * Math.max(0, fade);

      confettiSeeds.forEach((seed, i) => {
        const t = burst;
        const x = Math.cos(seed.angle) * seed.radius * t + seed.drift * t;
        const y = -0.05 + seed.rise * t + Math.sin(time * 0.8 + seed.spin) * 0.03 * t;
        const z = 0.3 + Math.sin(seed.angle) * seed.radius * 0.3 * t;
        dummy.position.set(x, y, z);
        dummy.rotation.set(
          seed.spin + time * 0.5,
          seed.spin * t + time * 0.3,
          Math.sin(time + seed.angle) * 0.5
        );
        dummy.scale.setScalar(seed.scale * visible);
        dummy.updateMatrix();
        confettiMesh.setMatrixAt(i, dummy.matrix);
      });
      confettiMesh.instanceMatrix.needsUpdate = true;
    }

    // Sparkles: golden glints that appear when the seal cracks
    const sparkleMesh = sparkleRef.current;
    if (sparkleMesh) {
      const burst = mapRange(progress, OPENING_PHASES.sealOpens - 0.05, OPENING_PHASES.flapOpens);
      const fade = 1 - mapRange(progress, OPENING_PHASES.cardEmerges, OPENING_PHASES.cardRises);
      const visible = burst * Math.max(0, fade);

      sparkleSeeds.forEach((seed, i) => {
        const t = burst;
        const twinkle = (Math.sin(time * 4 + seed.angle * 5) + 1) * 0.5;
        const x = Math.cos(seed.angle) * seed.radius * t * 1.2;
        const y = seed.rise * t + Math.sin(time * 1.2 + seed.spin) * 0.05 * t;
        const z = 0.35 + Math.sin(seed.angle) * seed.radius * 0.2 * t;
        dummy.position.set(x, y, z);
        dummy.rotation.set(0, 0, time * 2 + seed.spin);
        dummy.scale.setScalar(seed.scale * visible * (0.5 + twinkle * 0.5));
        dummy.updateMatrix();
        sparkleMesh.setMatrixAt(i, dummy.matrix);
      });
      sparkleMesh.instanceMatrix.needsUpdate = true;
    }
  });

  if (count === 0) return null;

  return (
    <>
      {/* Confetti pieces — warm cream */}
      {confettiCount > 0 && (
        <instancedMesh ref={confettiRef} args={[undefined, undefined, confettiCount]}>
          <planeGeometry args={[1, 0.6]} />
          <meshBasicMaterial color="#d8c39f" transparent opacity={0.55} />
        </instancedMesh>
      )}

      {/* Golden sparkle particles */}
      {sparkleCount > 0 && (
        <instancedMesh ref={sparkleRef} args={[undefined, undefined, sparkleCount]}>
          <planeGeometry args={[0.5, 0.5]} />
          <meshBasicMaterial color={new Color("#c9a84c")} transparent opacity={0.7} />
        </instancedMesh>
      )}
    </>
  );
}
