import React, { useState, useEffect, useCallback } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import './Chat.css';

import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import TextContainer from '../TextContainer/TextContainer';
let socket;
const Chat = ({ location, history }) => {
  const [logged, setLogged] = useState(false);
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [privateMessageTo, setPrivateMessageTo] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(
    localStorage.getItem('messages')
      ? JSON.parse(localStorage.getItem('messages'))
      : []
  );
  const [users, setUsers] = useState('');
  const ENDPOINT = 'localhost:5000';

  useEffect(() => {
    const { name, room, privateTo } = queryString.parse(location.search);
    setName(name);
    setRoom(room);
    setLogged(true);
    setPrivateMessageTo(privateTo);
    localStorage.setItem('privateTo', privateMessageTo);
    if (!logged) {
      socket = io(ENDPOINT);
      socket.emit('join', { name, room }, () => {});
    }
    return () => {
      socket.emit('disconnect');
      socket.off();
    };
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((messages) => [...messages, message]);
    });

    socket.on('roomData', ({ users }) => {
      setUsers(users);
    });
  }, []);

  useEffect(() => localStorage.setItem('messages', JSON.stringify(messages)), [
    messages,
  ]);

  const sendMessage = useCallback(
    (e) => {
      e.preventDefault();
      if (message) {
        socket.emit(
          'sendMessage',
          { message, privateTo: privateMessageTo ? privateMessageTo : null },
          () => setMessage('')
        );
        socket.on('roomData', ({ users }) => {
          setUsers(users);
        });
      }
      if (privateMessageTo) {
        setPrivateMessageTo(null);
        history.push(`/chat?name=${name}&room=${room}`);
        window.location.reload();
      }
    },
    [message]
  );

  console.log(message, messages);
  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input
          setMessage={setMessage}
          sendMessage={sendMessage}
          message={message}
        />
      </div>
      <TextContainer user={name} users={users} location={location} />
    </div>
  );
};

export default Chat;
