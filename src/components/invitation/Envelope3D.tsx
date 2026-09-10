import { useMemo } from "react";
import type { Group } from "three";
import { Shape, DoubleSide } from "three";
import { RoundedBox } from "@react-three/drei";
import { EnvelopeFlap } from "./EnvelopeFlap";
import { WaxSeal } from "./WaxSeal";

interface Envelope3DProps {
  flapRef: React.RefObject<Group | null>;
  sealRef: React.RefObject<Group | null>;
}

/**
 * Full envelope body with:
 * - Back panel (the full back face)
 * - Front pocket (lower half, slightly overlapping)
 * - Side fold triangles for realistic depth
 * - Inner liner visible when flap opens
 * - Gold edge accents
 * - Triangular flap and wax seal via child components
 */
export function Envelope3D({ flapRef, sealRef }: Envelope3DProps) {
  const envW = 2.2;
  const envH = 1.6;

  // Side fold triangles
  const sideFoldLeft = useMemo(() => {
    const s = new Shape();
    s.moveTo(0, envH / 2 - 0.05);
    s.lineTo(0.45, 0);
    s.lineTo(0, -(envH / 2 - 0.05));
    s.closePath();
    return s;
  }, []);

  const sideFoldRight = useMemo(() => {
    const s = new Shape();
    s.moveTo(0, envH / 2 - 0.05);
    s.lineTo(-0.45, 0);
    s.lineTo(0, -(envH / 2 - 0.05));
    s.closePath();
    return s;
  }, []);

  // Bottom fold triangle
  const bottomFold = useMemo(() => {
    const s = new Shape();
    const hw = envW / 2 - 0.05;
    s.moveTo(-hw, 0);
    s.lineTo(0, 0.55);
    s.lineTo(hw, 0);
    s.closePath();
    return s;
  }, []);

  return (
    <group>
      {/* ─── Back panel ─── */}
      <RoundedBox
        args={[envW, envH, 0.04]}
        radius={0.05}
        smoothness={4}
        position={[0, 0, -0.06]}
        receiveShadow
      >
        <meshStandardMaterial color="#f0e4d0" roughness={0.88} />
      </RoundedBox>

      {/* ─── Inner liner (darker, visible when flap opens) ─── */}
      <mesh position={[0, 0.1, -0.035]}>
        <planeGeometry args={[envW - 0.12, envH - 0.12]} />
        <meshStandardMaterial color="#e2d0b4" roughness={0.82} side={DoubleSide} />
      </mesh>

      {/* ─── Bottom fold triangle ─── */}
      <mesh position={[0, -(envH / 2) + 0.02, 0.02]} receiveShadow>
        <shapeGeometry args={[bottomFold]} />
        <meshStandardMaterial color="#f5eadb" roughness={0.86} side={DoubleSide} />
      </mesh>

      {/* ─── Side fold triangles ─── */}
      <mesh position={[-(envW / 2) + 0.01, 0, 0.03]} receiveShadow>
        <shapeGeometry args={[sideFoldLeft]} />
        <meshStandardMaterial color="#f2e6d4" roughness={0.86} side={DoubleSide} />
      </mesh>
      <mesh position={[(envW / 2) - 0.01, 0, 0.03]} receiveShadow>
        <shapeGeometry args={[sideFoldRight]} />
        <meshStandardMaterial color="#f2e6d4" roughness={0.86} side={DoubleSide} />
      </mesh>

      {/* ─── Front pocket (lower trapezoid area) ─── */}
      <RoundedBox
        args={[envW - 0.06, 1.15, 0.03]}
        radius={0.04}
        smoothness={4}
        position={[0, -0.22, 0.08]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#f8f0e2" roughness={0.84} />
      </RoundedBox>

      {/* ─── Gold edge accents ─── */}
      {/* Top edge */}
      <mesh position={[0, envH / 2 - 0.01, 0.05]}>
        <planeGeometry args={[envW - 0.1, 0.008]} />
        <meshBasicMaterial color="#c4a96a" transparent opacity={0.5} />
      </mesh>
      {/* Bottom edge */}
      <mesh position={[0, -(envH / 2) + 0.04, 0.1]}>
        <planeGeometry args={[envW - 0.3, 0.006]} />
        <meshBasicMaterial color="#c4a96a" transparent opacity={0.4} />
      </mesh>

      {/* ─── Side gussets for thickness ─── */}
      <mesh position={[-(envW / 2 + 0.01), 0, 0]}>
        <boxGeometry args={[0.025, envH - 0.06, 0.16]} />
        <meshStandardMaterial color="#e2d0b4" roughness={0.9} />
      </mesh>
      <mesh position={[envW / 2 + 0.01, 0, 0]}>
        <boxGeometry args={[0.025, envH - 0.06, 0.16]} />
        <meshStandardMaterial color="#e2d0b4" roughness={0.9} />
      </mesh>

      {/* ─── Subtle shadow between pocket and body ─── */}
      <mesh position={[0, 0.35, 0.065]}>
        <planeGeometry args={[envW - 0.2, 0.03]} />
        <meshBasicMaterial color="#c0ad90" transparent opacity={0.2} />
      </mesh>

      <EnvelopeFlap ref={flapRef} />
      <WaxSeal ref={sealRef} />
    </group>
  );
}
