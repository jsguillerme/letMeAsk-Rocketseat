import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/Button';

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg';

import { database } from '../services/firebase'

import '../styles/auth.scss'
import { useAuth } from '../hooks/useAuth';

export function NewRoom() {
  const { user } = useAuth();
  const [newRoom, setNewRoom] = useState('');
  const navigate = useNavigate();

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();
    if (newRoom.trim() === '') {
      return;
    }

    const roomRef = database.ref(database.getDatabase(), 'rooms');
    const firebaseRoom = database.push(roomRef);
    database.set(firebaseRoom, {
      title: newRoom,
      authorId: user?.id
    })

    navigate(`/rooms/${firebaseRoom.key}`)
  }

  return (
    <div id='page-auth'>
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando  perguntas e respostas" />
        <strong>Toda pergunta tem uma resposta.</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className='main-content'>
          <img src={logoImg} alt="Letmeask" />
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder='Nome da sala'
              onChange={(event) => setNewRoom(event.target.value)}
              value={newRoom}
            />
            <Button type='submit'>
              Criar sala
            </Button>
          </form>
          <p>Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link></p>
        </div>
      </main>
    </div>
  )
}