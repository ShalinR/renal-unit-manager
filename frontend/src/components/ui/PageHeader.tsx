import React from 'react';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
  iconClassName?: string;
  titleClassName?: string;
  children?: React.ReactNode;
};

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon,
  className = '',
  iconClassName = 'w-20 h-20',
  titleClassName = 'text-4xl',
  children,
}) => {
  return (
    <div className={`text-center space-y-3 ${className}`}>
      <div className={`inline-flex items-center justify-center ${iconClassName} bg-gradient-to-br from-primary/10 to-primary/5 rounded-full mb-0 mx-auto`}>
        {icon}
      </div>
      <h1 className={`${titleClassName} font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600`}>
        {title}
      </h1>
      {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      {children}
    </div>
  );
};

export default PageHeader;
