import React, {
  useCallback, useState, useEffect, useMemo,
} from 'react';
import {
  isToday, format, parseISO, isAfter,
} from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import { FiClock, FiPower } from 'react-icons/fi';

import { Link } from 'react-router-dom';
import {
  Container, Header, HeaderContent, Profile,
  Content, Schedule, Calendar, NextAppointment, Section,
  Appointment,
} from './styles';

import logoImg from '../../assets/logo.svg';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}

interface Appointment {
  id: string;
  date: string;
  formattedHour: string;

  user: {
    id: string;
    name: string;
    avatar_url: string;
  }
}

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthAvailability, setMonthAvailability] = useState<MonthAvailabilityItem[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const { signOut, user } = useAuth();

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) {
      setSelectedDate(day);
    }
  }, []);

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  useEffect(() => {
    (async () => {
      const { data } = await api.get(`/providers/${user.id}/month-availability`, {
        params: {
          year: currentMonth.getFullYear(),
          month: currentMonth.getMonth() + 1,
        },
      });

      setMonthAvailability(data);
    })();
  }, [currentMonth, user.id]);

  useEffect(() => {
    (async () => {
      const { data } = await api.get<Appointment[]>('/appointments/me', {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      });

      const formattedAppointments = data.map((a) => ({
        ...a,
        formattedHour: format(parseISO(a.date), 'HH:mm'),
      }));

      setAppointments(formattedAppointments);
    })();
  }, [selectedDate]);

  const disabledDays = useMemo(() => {
    const dates = monthAvailability
      .filter((monthDay) => monthDay.available === false).map((monthDay) => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        return new Date(year, month, monthDay.day);
      });

    return dates;
  }, [currentMonth, monthAvailability]);

  const selectedDateAsText = useMemo(() => format(selectedDate, "'Dia' dd 'de' MMMM", { locale: ptBR }), [selectedDate]);

  const selectedWeekDay = useMemo(() => format(selectedDate, 'cccc', { locale: ptBR }), [selectedDate]);

  const morningAppointments = useMemo(() => appointments.filter(
    (a) => parseISO(a.date).getHours() < 12,
  ),
  [appointments]);

  const afternoonAppointments = useMemo(() => appointments.filter(
    (a) => parseISO(a.date).getHours() >= 12,
  ),
  [appointments]);

  const nextAppointment = useMemo(() => appointments.find(
    (a) => isAfter(parseISO(a.date), new Date()),
  ),
  [appointments]);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber" />

          <Profile>
            <img src={user.avatar_url} alt={user.name} />
            <div>
              <span>Bem vindo, </span>
              <Link to="/profile">
                <strong>{user.name}</strong>
              </Link>
            </div>
          </Profile>

          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Horários agendados</h1>
          <p>
            {isToday(selectedDate)
              && <span>Hoje</span>}
            <span>{selectedDateAsText}</span>
            <span>{selectedWeekDay}</span>
          </p>

          {isToday(selectedDate) && nextAppointment && (
            <NextAppointment>
              <strong>Agendamento a seguir</strong>
              <div>
                <img src={nextAppointment.user.avatar_url} alt={nextAppointment.user.name} />
                <strong>
                  {nextAppointment.user.name}
                </strong>

                <span>
                  <FiClock />
                  {nextAppointment.formattedHour}

                </span>
              </div>
            </NextAppointment>
          )}

          <Section>
            <strong>Manhã</strong>

            {morningAppointments.length === 0 && (<p>Nennhum agendamento nesse período</p>)}

            {morningAppointments.map((a) => (
              <Appointment key={a.id}>
                <span>
                  <FiClock />
                  {a.formattedHour}
                </span>

                <div>
                  <img src={a.user.avatar_url} alt={a.user.name} />
                  <strong>
                    {a.user.name}
                  </strong>
                </div>
              </Appointment>
            ))}

          </Section>

          <Section>
            <strong>Tarde</strong>

            {afternoonAppointments.length === 0 && (<p>Nennhum agendamento nesse período</p>)}

            {afternoonAppointments.map((a) => (
              <Appointment key={a.id}>
                <span>
                  <FiClock />
                  {a.formattedHour}
                </span>

                <div>
                  <img src={a.user.avatar_url} alt={a.user.name} />
                  <strong>
                    {a.user.name}
                  </strong>
                </div>
              </Appointment>
            ))}
          </Section>
        </Schedule>
        <Calendar>
          <DayPicker
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            fromMonth={new Date()}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disabledDays]}
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5, 6] },
            }}
            selectedDays={selectedDate}
            onDayClick={handleDateChange}
            onMonthChange={handleMonthChange}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default Dashboard;
