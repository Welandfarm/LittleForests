import { Sprout, TreePine, Leaf, Flower } from "lucide-react";
import { useEffect, useState } from "react";

const GrowthTimeline = () => {
  const [animatedStages, setAnimatedStages] = useState<Set<number>>(new Set());

  const stages = [
    { name: 'Seed', icon: Sprout, description: 'Beginning of life' },
    { name: 'Sprout', icon: Leaf, description: 'First signs of growth' },
    { name: 'Sapling', icon: TreePine, description: 'Young and strong' },
    { name: 'Mature Tree', icon: Flower, description: 'Full potential' }
  ];

  useEffect(() => {
    // Animate stages progressively
    stages.forEach((_, index) => {
      setTimeout(() => {
        setAnimatedStages(prev => new Set([...Array.from(prev), index]));
      }, index * 800);
    });
  }, []);

  return (
    <div className="my-12 scroll-animate-scale">
      <h3 className="text-2xl font-bold text-center text-green-800 mb-8">Growth Journey</h3>
      <div className="flex justify-between items-center max-w-4xl mx-auto relative">
        {/* Progress line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-green-100 transform -translate-y-1/2"></div>
        <div className="absolute top-1/2 left-0 h-1 bg-green-500 transform -translate-y-1/2 transition-all duration-3000 ease-out"
             style={{ width: `${(animatedStages.size / stages.length) * 100}%` }}>
        </div>

        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const isAnimated = animatedStages.has(index);
          
          return (
            <div 
              key={stage.name} 
              className="flex flex-col items-center relative z-10 group"
            >
              <div className={`w-16 h-16 rounded-full bg-white border-4 flex items-center justify-center transition-all duration-500 transform ${
                isAnimated 
                  ? 'border-green-500 shadow-lg scale-110' 
                  : 'border-green-200 scale-100'
              }`}>
                <Icon 
                  className={`w-8 h-8 transition-all duration-500 ${
                    isAnimated ? 'text-green-600' : 'text-green-300'
                  }`} 
                />
              </div>
              
              <div className={`mt-4 text-center transition-all duration-500 transform ${
                isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}>
                <p className="font-semibold text-green-800">{stage.name}</p>
                <p className="text-xs text-green-600 mt-1">{stage.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GrowthTimeline;