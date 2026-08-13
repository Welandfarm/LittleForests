import { Leaf } from "lucide-react";
import { useEffect, useState } from "react";

const FloatingLeaves = () => {
  const [leaves, setLeaves] = useState<Array<{id: number, left: number, delay: number, duration: number}>>([]);

  useEffect(() => {
    // Generate random floating leaves
    const generateLeaves = () => {
      const newLeaves = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 5 + Math.random() * 4, // 5-9 seconds
      }));
      setLeaves(newLeaves);
    };

    generateLeaves();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {leaves.map((leaf) => (
        <Leaf 
          key={leaf.id}
          className={`absolute text-green-200/10 w-6 h-6 animate-float-leaf`}
          style={{
            left: `${leaf.left}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${leaf.delay}s`,
            animationDuration: `${leaf.duration}s`
          }}
        />
      ))}
    </div>
  );
};

export default FloatingLeaves;