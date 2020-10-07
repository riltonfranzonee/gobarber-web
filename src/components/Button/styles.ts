import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.button`
      background: #ff9000;
      height: 56px;
      border-radius: 10px;
      border: 2px solid #232129;
      color: #312e38;
      font-weight: 500;
      margin-top: 16px;
      padding: 0 16px;
      width: 100%;
      transition: background-color .2s;

      &:hover {
        background: ${shade(0.2, '#ff9000')}
      }
`;
