import { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  connections: number[];
}

export const NeuralNetwork = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const frameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Initialize nodes with increased count
    const initNodes = () => {
      const nodes: Node[] = [];
      const numNodes = 25; // Increased from 15 to 25
      
      for (let i = 0; i < numNodes; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          connections: []
        });
      }

      // Create connections
      nodes.forEach((node, i) => {
        const numConnections = Math.floor(Math.random() * 4) + 2; // Increased connections
        for (let j = 0; j < numConnections; j++) {
          const target = Math.floor(Math.random() * numNodes);
          if (target !== i && !node.connections.includes(target)) {
            node.connections.push(target);
          }
        }
      });

      return nodes;
    };

    const drawNode = (x: number, y: number, isHovered: boolean) => {
      ctx.beginPath();
      ctx.arc(x, y, isHovered ? 12 : 8, 0, Math.PI * 2);
      ctx.fillStyle = '#ea384c'; // System red color
      ctx.fill();
    };

    const drawConnection = (x1: number, y1: number, x2: number, y2: number, alpha: number) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = `rgba(234, 56, 76, ${alpha})`; // System red color with alpha
      ctx.lineWidth = 0.5;
      ctx.stroke();
    };

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      nodesRef.current.forEach((node, i) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        node.connections.forEach(targetIndex => {
          const target = nodesRef.current[targetIndex];
          const distance = Math.hypot(target.x - node.x, target.y - node.y);
          const alpha = Math.max(0, 1 - distance / 300);
          
          if (alpha > 0) {
            const pulseAlpha = alpha * (0.5 + 0.5 * Math.sin(time / 1000));
            drawConnection(node.x, node.y, target.x, target.y, pulseAlpha);
          }
        });

        drawNode(node.x, node.y, false);
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    nodesRef.current = initNodes();
    frameRef.current = requestAnimationFrame(animate);

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.8 }} // Increased opacity
    />
  );
};