import styled from 'styled-components';
import { shade } from 'polished';

import SignInBackgroundImg from '../../assets/sign-in-background.png';

export const Container = styled.div`
  height: 100vh;
  display: flex;
  align-items: stretch;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  place-content: center;
  align-items: center;

  width: 100%;
  max-width: 700px;

  form {
    margin: 80px 0;
    width: 340px;
    text-align: center;

    h1 {
      margin-bottom: 24px;
    }



    button {
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
    }

    a {
      color: #f4ede8;
      display: block;
      margin-top: 24px;
      text-decoration: none;
      transition: color .2s;

      &:hover {
        color: ${shade(0.2, '#f4ede8')}
      }
    }
  }

  > a {
      color: #ff9000;
      display: block;
      margin-top: 24px;
      text-decoration: none;
      transition: color .2s;

      display: flex;
      align-items: center;

      svg {
        margin-right: 16px;
      }

      &:hover {
        color: ${shade(0.2, '#ff9000')}
      }
    }
`;

export const Background = styled.div`
  flex: 1;
  background: url(${SignInBackgroundImg}) no-repeat center;
  background-size: cover;
`;
