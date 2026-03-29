/**
 * Button — maps to design system button classes
 * variant: 'primary' | 'secondary' | 'ghost' | 'danger'
 */
const Button = ({
  children,
  variant = 'primary',
  className = '',
  fullWidth = false,
  ...props
}) => {
  const variantClass = {
    primary:   'btn-primary',
    secondary: 'btn-secondary',
    ghost:     'btn-ghost',
    danger:    'btn-ghost !border-amz-red !text-amz-red hover:!bg-red-50',
  }[variant] ?? 'btn-primary';

  return (
    <button
      className={`${variantClass} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
