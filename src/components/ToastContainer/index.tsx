import React from 'react';
import Toast from './Toast';

import { Container } from './styles';

import { ToastMessage } from '../../hooks/toast';

interface ToastContainerProps {
  messages: ToastMessage[]
}

const ToastContainer: React.FC<ToastContainerProps> = ({ messages }) => (
  <Container>
    { messages.map((message) => (
      <Toast message={message} />
    ))}
  </Container>
);

export default ToastContainer;
