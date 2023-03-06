import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/root';

interface Props {
  to: string;
  children: React.ReactNode;
  className?: string;
}

const Link: React.FC<Props> = ({ to, children, className }) => {
  const canvas = useSelector((state: RootState) => state.canvas);

  const handleClick = () => {
    try {
      canvas.canvas?.dispose();
    } catch (err) {
      console.log('couldnt dispose canvas', err);
      // might've already been disposed
    }
  };

  return (
    <RouterLink to={to} onClick={handleClick} className={className}>
      {children}
    </RouterLink>
  );
};

export default Link;

