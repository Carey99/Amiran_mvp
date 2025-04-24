import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function ParticlesBackground() {
  const particlesInit = useCallback(async (engine: any) => {
    console.log("Initializing tsparticles engine...");
    try {
      await loadFull(engine);
      console.log("tsparticles engine loaded successfully!");
    } catch (error) {
      console.error("Error loading tsparticles engine:", error);
    }
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-full z-0">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: false }, // Important to prevent full takeover
          background: {
            color: { value: "#121212" },
          },
          particles: {
            number: { value: 150, density: { enable: true, value_area: 1000 } },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: { value: 0.7 },
            size: { value: 5, random: true },
            line_linked: {
              enable: true,
              distance: 120,
              color: "#ffffff",
              opacity: 0.6,
              width: 1.5,
            },
            move: {
              enable: true,
              speed: 1.5,
              direction: "none",
              random: false,
              straight: false,
              out_mode: "out",
              bounce: false,
            },
          },
          interactivity: {
            detect_on: "canvas",
            events: {
              onhover: { enable: true, mode: "repulse" },
              onclick: { enable: true, mode: "push" },
              resize: true,
            },
            modes: {
              repulse: { distance: 150, duration: 0.4 },
              push: { particles_nb: 5 },
            },
          },
          retina_detect: true,
        }}
      />
    </div>
  );
}
