import { useEffect, useState, useRef } from 'react';

interface Orb {
  x: number;
  y: number;
  vx: number; // velocity x
  vy: number; // velocity y
}

export default function Background() {
  const [orbs, setOrbs] = useState<Orb[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Initialize orbs with random positions and velocities
    const initialOrbs: Orb[] = Array.from({ length: colors.length }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 5, // Random velocity between -1 and 1
      vy: (Math.random() - 0.5) * 5,
    }));

    setOrbs(initialOrbs);

    const animate = () => {
      setOrbs((currentOrbs) =>
        currentOrbs.map((orb) => {
          let newX = orb.x + orb.vx;
          let newY = orb.y + orb.vy;
          let newVx = orb.vx;
          let newVy = orb.vy;
          const orbSize = 256;
          const overflow = 0.2; // Allow some overflow for smoother edges

          const lowerBoundX = orbSize * overflow * -1;
          const upperBoundX = width - orbSize * (1 - overflow);

          const lowerBoundY = orbSize * overflow * -1;
          const upperBoundY = height - orbSize * (1 - overflow);

          // Bounce off edges
          if (newX <= lowerBoundX || newX >= upperBoundX) {
            newVx = -newVx;
            newX = Math.max(lowerBoundX, Math.min(upperBoundX, newX));
          }
          if (newY <= lowerBoundY || newY >= upperBoundY) {
            newVy = -newVy;
            newY = Math.max(lowerBoundY, Math.min(upperBoundY, newY));
          }

          return {
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
          };
        })
      );

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const colors = [
    'from-pink-400',
    'from-teal-300',
    'from-red-500',
    'from-green-400',
    'from-blue-600',
    'from-violet-500',
    'from-yellow-400',
  ];

  return (
    <div className="fixed h-screen w-screen overflow-hidden blur-lg -z-10">
      {orbs.map((orb, index) => (
        <div
          key={index}
          style={{
            top: orb.y,
            left: orb.x,
            transform: 'translate3d(0, 0, 0)', // Hardware acceleration
          }}
          className={`absolute size-64 bg-radial ${colors[index]} from-70% to-70% to-transparent`}
        />
      ))}
    </div>
  );
}
