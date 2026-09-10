import { forwardRef } from "react";
import type { Group } from "three";

/**
 * Enhanced wax seal with glossy highlight, layered geometry for depth,
 * and a small drip for an organic hand-pressed look.
 */
export const WaxSeal = forwardRef<Group>(function WaxSeal(_props, ref) {
  return (
    <group ref={ref} position={[0, -0.05, 0.32]}>
      {/* Base disc — wider and thicker */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.38, 0.4, 0.12, 32]} />
        <meshStandardMaterial color="#8f3b34" roughness={0.45} metalness={0.08} />
      </mesh>

      {/* Irregular embossed cap for a hand-pressed look */}
      <mesh position={[0, 0.065, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.36, 0.05, 10]} />
        <meshStandardMaterial color="#9c453d" roughness={0.4} metalness={0.08} />
      </mesh>

      {/* Glossy centre highlight */}
      <mesh position={[0, 0.095, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.18, 32]} />
        <meshStandardMaterial color="#a54e46" roughness={0.3} metalness={0.12} />
      </mesh>

      {/* Monogram ring emboss */}
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.08, 0.15, 32]} />
        <meshStandardMaterial color="#7a2f29" roughness={0.55} />
      </mesh>

      {/* Inner monogram disc */}
      <mesh position={[0, 0.105, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.06, 24]} />
        <meshStandardMaterial color="#7a2f29" roughness={0.5} />
      </mesh>

      {/* Small wax drip on the lower right for organic feel */}
      <mesh position={[0.12, -0.04, 0.02]} rotation={[0, 0, -0.3]}>
        <sphereGeometry args={[0.04, 12, 8]} />
        <meshStandardMaterial color="#8f3b34" roughness={0.5} metalness={0.06} />
      </mesh>
      <mesh position={[0.09, -0.08, 0.01]}>
        <sphereGeometry args={[0.025, 10, 6]} />
        <meshStandardMaterial color="#8f3b34" roughness={0.5} metalness={0.06} />
      </mesh>
    </group>
  );
});
