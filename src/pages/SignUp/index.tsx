import React, { useCallback, useRef } from 'react';
import {
  FiMail, FiLock, FiUser, FiArrowLeft,
} from 'react-icons/fi';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { Link, useHistory } from 'react-router-dom';
import * as Yup from 'yup';

import api from '../../services/api';
import { useToast } from '../../hooks/toast';

import getValidationErrors from '../../utils/getValidationErrors';

import logo from '../../assets/logo.svg';

import {
  Container, Content, AnimationContainer, Background,
} from './styles';

import Input from '../../components/Input';
import Button from '../../components/Button';

interface SignUpDto {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(async (data: SignUpDto): Promise<void> => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string().required('Email obrigatório').email('Digite um email válido'),
        password: Yup.string().min(6, 'Senha deve conter no mínimo 6 dígitos'),
      });

      await schema.validate(data, { abortEarly: false });

      await api.post('/users', data);

      history.push('/');

      addToast({
        type: 'success',
        title: 'Cadastro realizado',
        description: 'Você já pode fazer seu logon no GoBarber',
      });
    } catch (error) {
      const errors = getValidationErrors(error);

      formRef.current?.setErrors(errors);

      addToast({
        type: 'error',
        title: 'Erro no cadastro',
        description: 'Houve uma falha na criação da conta, tente novamente',
      });
    }
  }, [history, addToast]);

  return (
    <Container>
      <Background />

      <Content>
        <AnimationContainer>
          <img src={logo} alt="GoBarber" />

          <Form onSubmit={handleSubmit} ref={formRef}>
            <h1>Faça seu cadastro</h1>

            <Input icon={FiUser} name="name" placeholder="Email" />
            <Input icon={FiMail} name="email" placeholder="Email" />
            <Input icon={FiLock} name="password" type="password" placeholder="Senha" />

            <Button type="submit">Cadastrar</Button>
          </Form>

          <Link to="/">
            <FiArrowLeft />
            Voltar para logon
          </Link>

        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default SignUp;
