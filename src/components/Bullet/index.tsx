import React from 'react';

import { Container } from './styles';

interface IProps {
  active?: boolean;
}

const Bullet: React.FC<IProps> = ({ active = false }) => {
  return <Container active={active} />;
};

export { Bullet };
