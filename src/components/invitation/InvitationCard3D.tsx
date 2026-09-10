import { forwardRef } from "react";
import type { Group } from "three";
import { RoundedBox, Text } from "@react-three/drei";

interface InvitationCard3DProps {
  monogram: string;
}

/**
 * Ornate invitation card with gold borders, decorative lines,
 * monogram, and "You are invited" text. Taller and more prominent
 * than the previous version to fill the viewport beautifully.
 */
export const InvitationCard3D = forwardRef<Group, InvitationCard3DProps>(function InvitationCard3D(
  { monogram },
  ref
) {
  const cardW = 2.0;
  const cardH = 2.8;

  return (
    <group ref={ref} position={[0, -0.15, -0.02]}>
      {/* Card body — slightly thicker for realism */}
      <RoundedBox args={[cardW, cardH, 0.05]} radius={0.03} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color="#fffdf7" roughness={0.65} />
      </RoundedBox>

      {/* Subtle inner face for text background */}
      <mesh position={[0, 0, 0.026]}>
        <planeGeometry args={[cardW - 0.15, cardH - 0.15]} />
        <meshBasicMaterial color="#fffdf7" transparent opacity={0} />
      </mesh>

      {/* ─── Gold border frame ─── */}
      {/* Top border */}
      <mesh position={[0, cardH / 2 - 0.12, 0.026]}>
        <planeGeometry args={[cardW - 0.28, 0.005]} />
        <meshBasicMaterial color="#b89d6a" />
      </mesh>
      {/* Bottom border */}
      <mesh position={[0, -(cardH / 2 - 0.12), 0.026]}>
        <planeGeometry args={[cardW - 0.28, 0.005]} />
        <meshBasicMaterial color="#b89d6a" />
      </mesh>
      {/* Left border */}
      <mesh position={[-(cardW / 2 - 0.12), 0, 0.026]}>
        <planeGeometry args={[0.005, cardH - 0.28]} />
        <meshBasicMaterial color="#b89d6a" />
      </mesh>
      {/* Right border */}
      <mesh position={[cardW / 2 - 0.12, 0, 0.026]}>
        <planeGeometry args={[0.005, cardH - 0.28]} />
        <meshBasicMaterial color="#b89d6a" />
      </mesh>

      {/* ─── Corner accents (small gold squares) ─── */}
      {[[-1, 1], [1, 1], [-1, -1], [1, -1]].map(([sx, sy], i) => (
        <mesh key={i} position={[sx * (cardW / 2 - 0.12), sy * (cardH / 2 - 0.12), 0.027]}>
          <planeGeometry args={[0.025, 0.025]} />
          <meshBasicMaterial color="#b89d6a" />
        </mesh>
      ))}

      {/* ─── Decorative rule above monogram ─── */}
      <mesh position={[0, 0.7, 0.027]}>
        <planeGeometry args={[1.0, 0.005]} />
        <meshBasicMaterial color="#a9895a" />
      </mesh>
      {/* Small ornament dots on the rule */}
      <mesh position={[-0.55, 0.7, 0.028]}>
        <circleGeometry args={[0.012, 12]} />
        <meshBasicMaterial color="#a9895a" />
      </mesh>
      <mesh position={[0.55, 0.7, 0.028]}>
        <circleGeometry args={[0.012, 12]} />
        <meshBasicMaterial color="#a9895a" />
      </mesh>

      {/* "You are invited" text */}
      <Text
        position={[0, 0.92, 0.027]}
        fontSize={0.11}
        color="#8a7a65"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.15}
      >
        YOU ARE INVITED
      </Text>

      {/* Monogram — large and centered */}
      <Text
        position={[0, 0.25, 0.027]}
        fontSize={0.40}
        color="#34281f"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.02}
      >
        {monogram}
      </Text>

      {/* ─── Decorative rule below monogram ─── */}
      <mesh position={[0, -0.15, 0.027]}>
        <planeGeometry args={[1.0, 0.005]} />
        <meshBasicMaterial color="#a9895a" />
      </mesh>
      <mesh position={[-0.55, -0.15, 0.028]}>
        <circleGeometry args={[0.012, 12]} />
        <meshBasicMaterial color="#a9895a" />
      </mesh>
      <mesh position={[0.55, -0.15, 0.028]}>
        <circleGeometry args={[0.012, 12]} />
        <meshBasicMaterial color="#a9895a" />
      </mesh>

      {/* "Together with their families" */}
      <Text
        position={[0, -0.4, 0.027]}
        fontSize={0.08}
        color="#8a7a65"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.08}
      >
        TOGETHER WITH THEIR FAMILIES
      </Text>

      {/* Date */}
      <Text
        position={[0, -0.65, 0.027]}
        fontSize={0.1}
        color="#6b5d4e"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.06}
      >
        12 · OCTOBER · 2026
      </Text>

      {/* Small bottom flourish */}
      <mesh position={[0, -0.9, 0.027]}>
        <planeGeometry args={[0.4, 0.004]} />
        <meshBasicMaterial color="#c4b291" />
      </mesh>
    </group>
  );
});
