export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand ${compact ? 'brand--compact' : ''}`}>
      <span className="brand__mark" aria-hidden="true"><i /><i /><i /></span>
      <span className="brand__word">TeensAI</span>
    </div>
  )
}
