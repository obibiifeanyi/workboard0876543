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

    // Initialize nodes
    const initNodes = () => {
      const nodes: Node[] = [];
      const numNodes = 15;
      
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
        const numConnections = Math.floor(Math.random() * 3) + 1;
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
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, isHovered ? 12 : 8);
      gradient.addColorStop(0, '#ea384c');
      gradient.addColorStop(1, '#0EA5E9');
      
      ctx.beginPath();
      ctx.arc(x, y, isHovered ? 12 : 8, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Add glow effect
      ctx.shadowColor = '#ea384c';
      ctx.shadowBlur = isHovered ? 15 : 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const drawConnection = (x1: number, y1: number, x2: number, y2: number, alpha: number) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = `rgba(234, 56, 76, ${alpha})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    };

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw nodes
      nodesRef.current.forEach((node, i) => {
        // Update position
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off walls
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        // Draw connections
        node.connections.forEach(targetIndex => {
          const target = nodesRef.current[targetIndex];
          const distance = Math.hypot(target.x - node.x, target.y - node.y);
          const alpha = Math.max(0, 1 - distance / 300);
          
          if (alpha > 0) {
            const pulseAlpha = alpha * (0.5 + 0.5 * Math.sin(time / 1000));
            drawConnection(node.x, node.y, target.x, target.y, pulseAlpha);
          }
        });

        // Draw node
        const isHovered = false; // TODO: Add hover detection if needed
        drawNode(node.x, node.y, isHovered);
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    // Setup
    resizeCanvas();
    nodesRef.current = initNodes();
    frameRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.6 }}
    />
  );
};