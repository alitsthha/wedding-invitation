export function SceneLighting() {
  return (
    <>
      {/* Warm ambient fill */}
      <ambientLight intensity={0.85} color="#fff6e8" />

      {/* Main key light from upper-right */}
      <directionalLight
        position={[3, 5, 4]}
        intensity={1.0}
        color="#fff1de"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.001}
      />

      {/* Soft fill from opposite side */}
      <directionalLight position={[-4, 2, -3]} intensity={0.3} color="#e7d9c9" />

      {/* Warm rim light from behind for dramatic silhouette */}
      <directionalLight position={[0, 1, -5]} intensity={0.5} color="#f5dfc0" />

      {/* Subtle top-down spotlight for card highlight */}
      <pointLight position={[0, 3, 2]} intensity={0.4} color="#fff8ee" distance={10} decay={2} />

      {/* Warm glow from below/behind envelope — visible when flap opens */}
      <pointLight position={[0, -0.5, -0.3]} intensity={0.3} color="#ffe4c4" distance={5} decay={2} />
    </>
  );
}
