interface TelecomPerformanceIndicatorProps {
  performance: number;
}

export const TelecomPerformanceIndicator = ({ performance }: TelecomPerformanceIndicatorProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald rounded-full"
          style={{ width: `${performance}%` }}
        />
      </div>
      <span className="text-sm text-white/70">{performance}%</span>
    </div>
  );
};