/**
 * Architecture diagram drawn as SVG from a project's `architecture` data
 * in content.ts. Nodes sit on a 4 x 3 grid; edges are straight lines with
 * flowing dashes to suggest traffic. Screen readers get a text summary.
 */
import type { Project } from '@/content';

const W = 820;
const H = 380;
const NODE_W = 156;
const NODE_H = 58;
const colX = (c: number) => 92 + c * 212;
const rowY = (r: number) => 64 + r * 126;

export default function ArchDiagram({ project, compact = false }: { project: Project; compact?: boolean }) {
  const { nodes, edges } = project.architecture;
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const summary = edges
    .map((e) => `${byId[e.from]?.label} to ${byId[e.to]?.label}${e.label ? ` (${e.label})` : ''}`)
    .join('; ');

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role={compact ? undefined : 'img'}
      aria-hidden={compact ? true : undefined}
      aria-label={compact ? undefined : `Architecture of ${project.name}: ${summary}.`}
    >
      <defs>
        <marker id={`arrow-${project.id}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#C6FF3D" opacity="0.8" />
        </marker>
      </defs>

      {/* Edges first so nodes draw on top */}
      {edges.map((e) => {
        const a = byId[e.from];
        const b = byId[e.to];
        if (!a || !b) return null;
        const [x1, y1, x2, y2] = clip(colX(a.col), rowY(a.row), colX(b.col), rowY(b.row));
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2;
        return (
          <g key={`${e.from}-${e.to}`}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#2E323A" strokeWidth="1.5" />
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#C6FF3D"
              strokeWidth="1.5"
              strokeDasharray="4 8"
              className="flow"
              opacity="0.85"
              markerEnd={`url(#arrow-${project.id})`}
            />
            {e.label && !compact && (
              <g>
                <rect x={mx - e.label.length * 3.6 - 8} y={my - 11} width={e.label.length * 7.2 + 16} height={22} rx={11} fill="#0A0B0D" stroke="#24272E" />
                <text x={mx} y={my + 4} textAnchor="middle" fontSize="11" fill="#9BA0A8" fontFamily="var(--font-mono)">
                  {e.label}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {nodes.map((n) => {
        const x = colX(n.col) - NODE_W / 2;
        const y = rowY(n.row) - NODE_H / 2;
        return (
          <g key={n.id}>
            <rect x={x} y={y} width={NODE_W} height={NODE_H} rx={12} fill="#121418" stroke={n.accent ? '#C6FF3D' : '#2E323A'} strokeWidth={n.accent ? 1.5 : 1} />
            <text x={colX(n.col)} y={rowY(n.row) - (n.sub ? 3 : -5)} textAnchor="middle" fontSize="15" fontWeight="600" fill="#EDEDE6" fontFamily="var(--font-sans)">
              {n.label}
            </text>
            {n.sub && (
              <text x={colX(n.col)} y={rowY(n.row) + 15} textAnchor="middle" fontSize="11" fill="#9BA0A8" fontFamily="var(--font-mono)">
                {n.sub}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/** Shortens a line so it starts and ends at the edge of the node boxes, not their centres. */
function clip(x1: number, y1: number, x2: number, y2: number): [number, number, number, number] {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const tFor = (ddx: number, ddy: number) => {
    const tx = ddx === 0 ? Infinity : NODE_W / 2 / Math.abs(ddx);
    const ty = ddy === 0 ? Infinity : NODE_H / 2 / Math.abs(ddy);
    return Math.min(tx, ty);
  };
  const t = tFor(dx, dy) + 0.02;
  return [x1 + dx * t, y1 + dy * t, x2 - dx * t, y2 - dy * t];
}
