import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import '../styles/room.scss';
import { database } from '../services/firebase';

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  const navigate = useNavigate();
  const params = useParams<RoomParams>();

  const roomId = params.id;

  const { title, questions } = useRoom(roomId);

  async function handleEndRoom() {
    const roomRef = database.ref(database.getDatabase(), `rooms/${roomId}`);
    await database.update(roomRef, {
      endedAt: new Date()
    })
    navigate('/')
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que deseja excluir esta pergunta?')) {
      const questionRef = database.ref(database.getDatabase(), `rooms/${roomId}/questions/${questionId}`);
      await database.remove(questionRef);
    }

  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    const questionRef = database.ref(database.getDatabase(), `rooms/${roomId}/questions/${questionId}`);
    await database.update(questionRef, {
      isAnswered: true
    });
  }

  async function handleHighlightQuestion(questionId: string, isHighlighted: boolean) {
    const questionRef = database.ref(database.getDatabase(), `rooms/${roomId}/questions/${questionId}`);

    if (!isHighlighted) {
      await database.update(questionRef, {
        isHighlighted: true
      });
    } else {
      await database.update(questionRef, {
        isHighlighted: false
      });
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className='content'>
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId || ''} />
            <Button
              isOutlined
              onClick={() => handleEndRoom()}
              children='Encerrar sala'
            />
          </div>
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} perguntas</span>}
        </div>

        <div className="question-list">
          {questions.map(question => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswer={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                {!question.isAnswered && (
                  <>
                    <button
                      type='button'
                      onClick={() => handleCheckQuestionAsAnswered(question.id)}
                    >
                      <img src={checkImg} alt="marcar pergunta como respondida" />
                    </button>
                    <button
                      type='button'
                      onClick={() => handleHighlightQuestion(question.id, question.isHighlighted)}
                    >
                      <img src={answerImg} alt="dar destaque a pergunta" />
                    </button>
                  </>
                )}
                <button
                  type='button'
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="botão para deletar pergunta" />
                </button>
              </Question>
            )
          })}
        </div>
      </main>
    </div>
  )
}