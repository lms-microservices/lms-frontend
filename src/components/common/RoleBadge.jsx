const RoleBadge = ({ role, className = '' }) => {
  const config = {
    ADMIN: { label: 'Admin', className: 'bg-red-50 text-red-700 border-red-200' },
    INSTRUCTOR: { label: 'Instructor', className: 'bg-blue-50 text-blue-700 border-blue-200' },
    STUDENT: { label: 'Student', className: 'bg-green-50 text-green-700 border-green-200' },
  };

  const { label, className: badgeClass } = config[role] || config.STUDENT;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeClass} ${className}`}>
      {label}
    </span>
  );
};

export default RoleBadge;
