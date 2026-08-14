interface BrandNameProps {
  className?: string;
  surface?: 'light' | 'dark';
}

const BrandName = ({ className = '', surface = 'light' }: BrandNameProps) => {
  const colors =
    surface === 'dark'
      ? { little: 'text-emerald-100', forest: 'text-lime-300' }
      : { little: 'text-emerald-800', forest: 'text-lime-600' };

  return (
    <span
      aria-label="Little Forest"
      className={`inline-flex items-baseline gap-[0.14em] font-serif font-bold tracking-tight ${className}`}
    >
      <span className={colors.little}>Little</span>
      <span className={colors.forest}>Forest</span>
    </span>
  );
};

export default BrandName;