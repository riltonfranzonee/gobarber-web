import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  header {
    height: 144px;

    background-color: #28262e;

    display: flex;
    align-items: center;

    div {
      width: 100%;
      max-width: 1120px;
      margin: 0 auto;

      svg {
        color: #999591;
        width: 26px;
        height: 26px;
      }
    }
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  place-content: center;
  align-items: center;

  width: 100%;
  margin: -176px auto;

  form {
    margin: 80px 0;
    width: 340px;
    text-align: center;
    display: flex;
    flex-direction: column;

    h1 {
      margin-bottom: 24px;
      font-size: 20px;
      text-align: left;
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

`;

export const AvatarInput = styled.div`
  margin-bottom: 32px;
  position: relative;
  align-self: center;

  img {
    width: 186px;
    height: 186px;
    border-radius: 50%;
  }

  label {
    position:absolute;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    right: 0;
    bottom: 0;
    background: #ff9000;
    border: none;
    transition: background-color 0.2s;
    cursor: pointer;

    display: flex;
    justify-content: center;
    align-items: center;

    svg {
      width: 20px;
      height: 20px;
      color: #312e38;
    }

    input {
      display: none;
    }

    &:hover {
      background: ${shade(0.2, '#ff9000')}
    }
  }
`;
