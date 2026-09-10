import { forwardRef, useMemo } from "react";
import type { Group } from "three";
import { Shape, DoubleSide } from "three";

/**
 * Triangular V-flap for the envelope. The outer group's origin IS the hinge
 * line (the top edge of the envelope body). The flap mesh hangs downward from
 * that hinge, so rotating the group around X rotates the flap around its real
 * physical hinge — just like a real envelope.
 *
 * The shape is a pointed V (wider at the hinge, pointed at the bottom) with
 * slightly softened edges for an elegant look.
 */
export const EnvelopeFlap = forwardRef<Group>(function EnvelopeFlap(_props, ref) {
  const halfWidth = 1.08;
  const flapHeight = 1.0;

  const flapGeometryArgs = useMemo(() => {
    const shape = new Shape();
    // Start at left edge of hinge
    shape.moveTo(-halfWidth, 0);
    // Gentle curve down-left
    shape.quadraticCurveTo(-halfWidth * 0.5, -flapHeight * 0.65, 0, -flapHeight);
    // Gentle curve to right edge
    shape.quadraticCurveTo(halfWidth * 0.5, -flapHeight * 0.65, halfWidth, 0);
    shape.closePath();
    return shape;
  }, []);

  const linerGeometryArgs = useMemo(() => {
    const shape = new Shape();
    const inset = 0.06;
    const hw = halfWidth - inset;
    const h = flapHeight - inset;
    shape.moveTo(-hw, -inset * 0.5);
    shape.quadraticCurveTo(-hw * 0.5, -h * 0.65, 0, -h);
    shape.quadraticCurveTo(hw * 0.5, -h * 0.65, hw, -inset * 0.5);
    shape.closePath();
    return shape;
  }, []);

  return (
    <group ref={ref} position={[0, 0.78, 0.12]}>
      {/* Outer flap surface */}
      <mesh castShadow receiveShadow>
        <shapeGeometry args={[flapGeometryArgs]} />
        <meshStandardMaterial
          color="#efe3d0"
          roughness={0.88}
          metalness={0}
          side={DoubleSide}
        />
      </mesh>

      {/* Inner liner — slightly different color, visible when flap opens */}
      <mesh position={[0, 0, -0.003]}>
        <shapeGeometry args={[linerGeometryArgs]} />
        <meshStandardMaterial
          color="#e8d5b8"
          roughness={0.82}
          metalness={0}
          side={DoubleSide}
        />
      </mesh>

      {/* Subtle fold shadow line at the hinge */}
      <mesh position={[0, -0.015, 0.001]}>
        <planeGeometry args={[halfWidth * 2, 0.04]} />
        <meshBasicMaterial color="#c9b89a" transparent opacity={0.35} />
      </mesh>
    </group>
  );
});
