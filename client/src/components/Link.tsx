import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

interface Props {
  to: string;
  children: React.ReactNode;
  className?: string;
}

const Link: React.FC<Props> = ({ to, children, className }) => {
  return (
    <RouterLink to={to} className={className}>
      {children}
    </RouterLink>
  );
};

export default Link;

