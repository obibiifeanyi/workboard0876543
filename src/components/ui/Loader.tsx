import React from 'react';

const Loader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <main>
        <svg height="128px" width="128px" viewBox="0 0 128 128" className="pl1 w-32 h-32">
          <defs>
            <linearGradient y2={1} x2={1} y1={0} x1={0} id="pl-grad">
              <stop stopColor="#000" offset="0%" />
              <stop stopColor="#fff" offset="100%" />
            </linearGradient>
            <mask id="pl-mask">
              <rect fill="url(#pl-grad)" height={128} width={128} y={0} x={0} />
            </mask>
          </defs>
          <g fill="var(--primary)">
            <g className="pl1__g">
              <g transform="translate(20,20) rotate(0,44,44)">
                <g className="pl1__rect-g">
                  <rect height={40} width={40} ry={8} rx={8} className="pl1__rect" />
                  <rect transform="translate(0,48)" height={40} width={40} ry={8} rx={8} className="pl1__rect" />
                </g>
                <g transform="rotate(180,44,44)" className="pl1__rect-g">
                  <rect height={40} width={40} ry={8} rx={8} className="pl1__rect" />
                  <rect transform="translate(0,48)" height={40} width={40} ry={8} rx={8} className="pl1__rect" />
                </g>
              </g>
            </g>
          </g>
          <g mask="url(#pl-mask)" fill="hsl(343,90%,50%)">
            <g className="pl1__g">
              <g transform="translate(20,20) rotate(0,44,44)">
                <g className="pl1__rect-g">
                  <rect height={40} width={40} ry={8} rx={8} className="pl1__rect" />
                  <rect transform="translate(0,48)" height={40} width={40} ry={8} rx={8} className="pl1__rect" />
                </g>
                <g transform="rotate(180,44,44)" className="pl1__rect-g">
                  <rect height={40} width={40} ry={8} rx={8} className="pl1__rect" />
                  <rect transform="translate(0,48)" height={40} width={40} ry={8} rx={8} className="pl1__rect" />
                </g>
              </g>
            </g>
          </g>
        </svg>
      </main>
    </div>
  );
};

export default Loader;