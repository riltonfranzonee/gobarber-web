import React from 'react';
import {
  FiLogIn, FiMail, FiLock, FiUser, FiArrowLeft,
} from 'react-icons/fi';

import logo from '../../assets/logo.svg';

import { Container, Content, Background } from './styles';

import Input from '../../components/Input';
import Button from '../../components/Button';

const SignUp: React.FC = () => (
  <Container>
    <Background />

    <Content>
      <img src={logo} alt="GoBarber" />

      <form>
        <h1>Faça seu cadastro</h1>

        <Input icon={FiUser} name="name" placeholder="Email" />
        <Input icon={FiMail} name="email" placeholder="Email" />
        <Input icon={FiLock} name="password" type="password" placeholder="Senha" />

        <Button type="submit">Cadastrar</Button>
      </form>

      <a href="/create">
        <FiArrowLeft />
        Voltar para logon
      </a>
    </Content>
  </Container>
);

export default SignUp;
