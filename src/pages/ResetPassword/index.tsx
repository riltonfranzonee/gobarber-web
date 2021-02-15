import React, { useCallback, useRef, useState } from 'react';
import { FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { useHistory, useLocation } from 'react-router-dom';

import getValidationErrors from '../../utils/getValidationErrors';

import { useToast } from '../../hooks/toast';

import logo from '../../assets/logo.svg';

import api from '../../services/api';

import {
  Container, Content, AnimationContainer, Background,
} from './styles';

import Input from '../../components/Input';
import Button from '../../components/Button';

interface ResetPasswordDto {
  password: string;
  password_confirmation: string;
}

const ResetPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();

  const history = useHistory();
  const location = useLocation();

  const handleSubmit = useCallback(async (data: ResetPasswordDto): Promise<void> => {
    try {
      setLoading(true);
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        password: Yup.string().required('Senha obrigatória'),
        password_confirmation: Yup.string().oneOf([Yup.ref('password'), undefined], 'Confirmação incorreta'),
      });

      await schema.validate(data, { abortEarly: false });

      const { password, password_confirmation } = data;
      const token = location.search.replace('?token=', '');

      if (!token) {
        throw new Error();
      }

      await api.post('/password/reset', {
        password,
        password_confirmation,
        token,
      });

      history.push('/');
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors = getValidationErrors(error);
        formRef.current?.setErrors(errors);

        return;
      }

      addToast({
        type: 'error',
        title: 'Erro ao resetar senha',
        description: 'Houve uma falha ao resetar senha. Tente novamente',
      });
    } finally {
      setLoading(false);
    }
  }, [addToast, history, location]);

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logo} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Resetar senha</h1>

            <Input icon={FiLock} name="password" type="password" placeholder="Nova senha" />

            <Input icon={FiLock} name="password_confirmation" type="password" placeholder="Confirmação da senha" />

            <Button loading={loading} type="submit">Alterar senha</Button>
          </Form>

        </AnimationContainer>

      </Content>
      <Background />
    </Container>
  );
};

export default ResetPassword;
