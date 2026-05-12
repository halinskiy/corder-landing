import "./HeroBeams.css";

const DATA_SOURCE = "projects/corder-landing/src/components/hero/HeroBeams.tsx";

const BEAMS: ReadonlyArray<{ angle: number; delay: number; len: number; thick: number }> = [
  { angle: -86, delay: 0.0,  len: 640, thick: 22 },
  { angle: -62, delay: 1.4,  len: 700, thick: 28 },
  { angle: -38, delay: 0.7,  len: 760, thick: 34 },
  { angle: -14, delay: 2.0,  len: 800, thick: 40 },
  { angle:  14, delay: 0.4,  len: 800, thick: 40 },
  { angle:  38, delay: 1.8,  len: 760, thick: 34 },
  { angle:  62, delay: 0.9,  len: 700, thick: 28 },
  { angle:  86, delay: 2.4,  len: 640, thick: 22 },
];

export function HeroBeams() {
  return (
    <div
      className="hero-beams"
      aria-hidden="true"
      data-component="HeroBeams"
      data-source={DATA_SOURCE}
      data-tokens="color-accent"
    >
      <div className="hero-beams__origin">
        {BEAMS.map((b, i) => (
          <span
            key={i}
            className="hero-beams__beam"
            style={{
              ["--beam-angle" as string]: `${b.angle}deg`,
              ["--beam-len" as string]: `${b.len}px`,
              ["--beam-thick" as string]: `${b.thick}px`,
              ["--beam-delay" as string]: `${b.delay}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
