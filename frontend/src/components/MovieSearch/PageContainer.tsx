import React, {ReactNode} from 'react';
import './PageContainer.css';

interface ContainerProps {
  children: ReactNode; // This type allows anything that React can render
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return <div className='container'>{children}</div>;
};

export default Container;
