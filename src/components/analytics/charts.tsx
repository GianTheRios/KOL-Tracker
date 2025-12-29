'use client';

import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BarChartData {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarChartData[];
  height?: number;
  showLabels?: boolean;
  showValues?: boolean;
  formatValue?: (value: number) => string;
  className?: string;
}

export function AnimatedBarChart({
  data,
  height = 200,
  showLabels = true,
  showValues = true,
  formatValue = (v) => v.toLocaleString(),
  className,
}: BarChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const maxValue = Math.max(...data.map(d => d.value));
  
  // Calculate min width per bar based on data length
  const minBarWidth = data.length > 6 ? 60 : undefined;

  return (
    <div ref={ref} className={cn('w-full overflow-x-auto', className)}>
      <div 
        className="flex items-end gap-3" 
        style={{ 
          height,
          minWidth: minBarWidth ? data.length * minBarWidth : undefined 
        }}
      >
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * height * 0.7; // Use absolute pixels
          
          return (
            <div 
              key={item.label} 
              className="flex-1 flex flex-col items-center justify-end"
              style={{ minWidth: minBarWidth }}
            >
              {/* Value */}
              {showValues && (
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="text-xs font-medium text-zinc-400 mb-2 whitespace-nowrap"
                >
                  {formatValue(item.value)}
                </motion.span>
              )}
              
              {/* Bar */}
              <motion.div
                className={cn(
                  'w-full max-w-[40px] rounded-t-lg cursor-pointer',
                  item.color || 'bg-gradient-to-t from-indigo-600 to-indigo-400'
                )}
                initial={{ height: 0 }}
                animate={isInView ? { height: barHeight } : {}}
                transition={{
                  delay: index * 0.05,
                  duration: 0.6,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
                whileHover={{ 
                  scaleY: 1.05,
                  filter: 'brightness(1.2)',
                  transition: { duration: 0.2 }
                }}
              />
              
              {/* Label */}
              {showLabels && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="text-xs text-zinc-500 mt-2 text-center whitespace-nowrap"
                  title={item.label}
                >
                  {item.label}
                </motion.span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Donut chart
interface DonutChartData {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutChartData[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string;
  className?: string;
  onSegmentClick?: (item: DonutChartData) => void;
}

export function AnimatedDonutChart({
  data,
  size = 200,
  strokeWidth = 24,
  centerLabel,
  centerValue,
  className,
  onSegmentClick,
}: DonutChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate segment positions for rendering
  const segments = data.map((item, index) => {
    const percentage = item.value / total;
    return { ...item, percentage, index };
  });
  
  let accumulatedPercentage = 0;

  // Determine what to show in center
  const activeItem = hoveredIndex !== null ? data[hoveredIndex] : selectedIndex !== null ? data[selectedIndex] : null;
  const displayValue = activeItem ? `$${(activeItem.value / 1000).toFixed(0)}K` : centerValue;
  const displayLabel = activeItem ? activeItem.label : centerLabel;

  return (
    <div ref={ref} className={cn('relative', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="cursor-pointer">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#18181b"
          strokeWidth={strokeWidth}
        />
        
        {/* Data segments */}
        {segments.map((item, index) => {
          const strokeDasharray = circumference * item.percentage;
          const strokeDashoffset = -circumference * accumulatedPercentage;
          accumulatedPercentage += item.percentage;
          const isHovered = hoveredIndex === index;
          const isSelected = selectedIndex === index;
          const hasHover = hoveredIndex !== null;
          
          // Dim other segments when one is hovered
          const opacity = hasHover ? (isHovered ? 1 : 0.4) : 1;

          return (
            <motion.circle
              key={item.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth={strokeWidth}
              strokeLinecap="butt"
              strokeDasharray={`${strokeDasharray} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={isInView ? { 
                strokeDasharray: `${strokeDasharray} ${circumference}`,
                opacity: opacity,
              } : {}}
              transition={{
                delay: index * 0.1,
                duration: 0.8,
                ease: [0.25, 0.1, 0.25, 1],
                opacity: { duration: 0.2 },
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => {
                setSelectedIndex(selectedIndex === index ? null : index);
                onSegmentClick?.(item);
              }}
              style={{ cursor: 'pointer' }}
            />
          );
        })}
      </svg>

      {/* Center label - updates on hover */}
      {(displayLabel || displayValue) && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.5 }}
        >
          <motion.span 
            key={displayValue}
            className="text-2xl font-bold text-white"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {displayValue}
          </motion.span>
          <motion.span 
            key={displayLabel}
            className="text-sm text-zinc-400"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.05 }}
          >
            {displayLabel}
          </motion.span>
        </motion.div>
      )}
    </div>
  );
}

// Mini sparkline chart
interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export function Sparkline({
  data,
  width = 100,
  height = 30,
  color = '#6366f1',
  className,
}: SparklineProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true });
  
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
    >
      <motion.polyline
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
    </svg>
  );
}

// Animated Line Chart with labels - Responsive version
interface LineChartData {
  label: string;
  value: number;
}

interface LineChartProps {
  data: LineChartData[];
  height?: number;
  color?: string;
  gradientColor?: string;
  formatValue?: (value: number) => string;
  className?: string;
}

export function AnimatedLineChart({
  data,
  height = 200,
  color = '#6366f1',
  gradientColor,
  formatValue = (v) => v.toLocaleString(),
  className,
}: LineChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  // Use a fixed viewBox width for consistent scaling
  const viewBoxWidth = 500;
  const viewBoxHeight = height;
  const padding = { top: 30, right: 25, bottom: 35, left: 25 };
  const chartWidth = viewBoxWidth - padding.left - padding.right;
  const chartHeight = viewBoxHeight - padding.top - padding.bottom;
  
  const values = data.map(d => d.value);
  const min = Math.min(...values) * 0.85;
  const max = Math.max(...values) * 1.05;
  const range = max - min || 1;

  // Calculate positions within viewBox coordinates
  const getX = (index: number) => 
    padding.left + (index / (data.length - 1)) * chartWidth;
  
  const getY = (value: number) => 
    padding.top + chartHeight - ((value - min) / range) * chartHeight;

  // Build path strings
  const linePath = data.map((d, i) => 
    `${i === 0 ? 'M' : 'L'} ${getX(i)},${getY(d.value)}`
  ).join(' ');
  
  const areaPath = `
    ${linePath}
    L ${getX(data.length - 1)},${padding.top + chartHeight}
    L ${padding.left},${padding.top + chartHeight}
    Z
  `;

  return (
    <div ref={ref} className={cn('w-full', className)} style={{ height }}>
      <svg 
        width="100%" 
        height="100%" 
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        preserveAspectRatio="xMidYMid meet"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id={`lineGradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={gradientColor || color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={gradientColor || color} stopOpacity={0.02} />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.5, 1].map((pct, i) => (
          <line
            key={i}
            x1={padding.left}
            x2={viewBoxWidth - padding.right}
            y1={padding.top + chartHeight * pct}
            y2={padding.top + chartHeight * pct}
            stroke="#27272a"
            strokeWidth={0.5}
            strokeDasharray={pct === 1 ? "0" : "3 3"}
          />
        ))}

        {/* Area fill */}
        <motion.path
          d={areaPath}
          fill={`url(#lineGradient-${color.replace('#', '')})`}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
        />

        {/* Line */}
        <motion.path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />

        {/* Data points and labels */}
        {data.map((d, i) => {
          const x = getX(i);
          const y = getY(d.value);
          const isHovered = hoveredIndex === i;
          
          return (
            <g key={i}>
              {/* Invisible hover area */}
              <rect
                x={x - 15}
                y={padding.top}
                width={30}
                height={chartHeight}
                fill="transparent"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ cursor: 'pointer' }}
              />
              
              {/* Point */}
              <motion.circle
                cx={x}
                cy={y}
                r={isHovered ? 5 : 3}
                fill={color}
                stroke="#0a0a0f"
                strokeWidth={1.5}
                initial={{ scale: 0, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ delay: 0.5 + i * 0.03, duration: 0.3 }}
              />

              {/* Value tooltip on hover */}
              {isHovered && (
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
                >
                  <rect
                    x={x - 28}
                    y={y - 28}
                    width={56}
                    height={20}
                    rx={4}
                    fill="#18181b"
                    stroke="#3f3f46"
                    strokeWidth={0.5}
                  />
                  <text
                    x={x}
                    y={y - 14}
                    textAnchor="middle"
                    fill="white"
                    fontSize={10}
                    fontWeight={500}
                  >
                    {formatValue(d.value)}
                  </text>
                </motion.g>
              )}

              {/* X-axis label - show every label or every other for many points */}
              {(data.length <= 12 || i % 2 === 0 || i === data.length - 1) && (
                <text
                  x={x}
                  y={viewBoxHeight - 8}
                  textAnchor="middle"
                  fill="#71717a"
                  fontSize={9}
                >
                  {d.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// Legend component
interface LegendProps {
  items: { label: string; color: string; value?: string }[];
  className?: string;
}

export function ChartLegend({ items, className }: LegendProps) {
  return (
    <div className={cn('flex flex-wrap gap-4', className)}>
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-sm text-zinc-400">
            {item.label}
            {item.value && <span className="font-medium ml-1 text-white">{item.value}</span>}
          </span>
        </div>
      ))}
    </div>
  );
}
