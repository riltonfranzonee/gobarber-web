import React, { ChangeEvent, useCallback, useRef } from 'react';
import {
  FiMail, FiLock, FiUser, FiCamera, FiArrowLeft,
} from 'react-icons/fi';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { useHistory, Link } from 'react-router-dom';
import * as Yup from 'yup';

import api from '../../services/api';
import { useToast } from '../../hooks/toast';

import getValidationErrors from '../../utils/getValidationErrors';

import {
  Container, Content,
  AvatarInput,
} from './styles';

import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../hooks/auth';

interface ProfileDto {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const { user, updateUser } = useAuth();

  const handleSubmit = useCallback(async (data: ProfileDto): Promise<void> => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string().required('Email obrigatório').email('Digite um email válido'),
        old_password: Yup.string(),
        password: Yup.string().when('old_password', {
          is: (val) => !!val.length,
          then: Yup.string().min(6, 'A nova senha deve conter no mínimo 6 dígitos').required('A senha é obrigatória'),
        }),
        password_confirmation: Yup.string().oneOf([Yup.ref('password'), undefined], 'Confirmação incorreta'),
      });

      await schema.validate(data, { abortEarly: false });

      const {
        name, email, password, old_password, password_confirmation,
      } = data;

      const formData = {
        name,
        email,
        ...(old_password ? { old_password, password, password_confirmation } : {}),
      };

      const res = await api.put('/profile', formData);

      updateUser(res.data);

      history.push('/dashboard');

      addToast({
        type: 'success',
        title: 'Perfil atualizado',
        description: 'Informações atualizadas com sucesso!',
      });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors = getValidationErrors(error);

        formRef.current?.setErrors(errors);

        return;
      }

      addToast({
        type: 'error',
        title: 'Erro na atualização',
        description: 'Houve uma falha na atualização da conta, tente novamente',
      });
    }
  }, [history, addToast]);

  const handleAvatarChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target && e.target.files) {
      const data = new FormData();

      data.append('avatar', e.target.files[0]);

      const res = await api.patch('users/avatar', data);

      if (res) {
        updateUser(res.data);

        addToast({
          type: 'success',
          title: 'Avatar atualizado!',
        });
      }
    }
  }, []);

  return (
    <Container>
      <header>
        <div>

          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>

        </div>

      </header>
      <Content>

        <Form
          onSubmit={handleSubmit}
          initialData={{
            name: user.name,
            email: user.email,
          }}
          ref={formRef}
        >

          <AvatarInput>
            <img src={user.avatar_url} alt={user.avatar_url} />
            <label htmlFor="avatar">
              <FiCamera />
              <input type="file" id="avatar" onChange={handleAvatarChange} />
            </label>

          </AvatarInput>

          <h1>Meu perfil</h1>

          <Input icon={FiUser} name="name" placeholder="Email" />
          <Input icon={FiMail} name="email" placeholder="Email" />
          <Input icon={FiLock} name="old_password" type="password" placeholder="Senha atual" containerStyle={{ marginTop: 24 }} />
          <Input icon={FiLock} name="password" type="password" placeholder="Nova senha" />
          <Input icon={FiLock} name="password_confirmation" type="password" placeholder="Confirmar a senha" />

          <Button type="submit">Confirmar mudanças</Button>
        </Form>

      </Content>
    </Container>
  );
};

export default Profile;
