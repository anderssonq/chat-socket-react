import React from 'react';
import { Link } from 'react-router-dom';
import onlineIcon from '../../assets/onlineIcon.png';
import queryString from 'query-string';

import './TextContainer.css';

const TextContainer = ({ user, users, location }) => {
  const { search } = location;
  const { privateTo } = queryString.parse(location.search);

  return (
    <div className="textContainer">
      <div>
        <h1>
          Realtime Chat Application{' '}
          <span role="img" aria-label="emoji">
            💬
          </span>
        </h1>
        <h2>Developed by Andersson Quintero</h2>
      </div>
      {users ? (
        <div>
          <h1>People currently chatting:</h1>
          <div className="activeContainer">
            <h2>
              {users.map((userl) => {
                return userl.name === user ? (
                  <div key={userl.name} className="activeItem">
                    {userl.name} (You)
                    <img alt="Online Icon" src={onlineIcon} />
                  </div>
                ) : (
                  <div key={userl.name} className="activeItem">
                    <Link to={`/chat${search}&privateTo=${userl.name}`}>
                      {userl.name}{' '}
                      {privateTo
                        ? ' - Next message will be private to him/her'
                        : null}
                      <img alt="Online Icon" src={onlineIcon} />
                    </Link>
                  </div>
                );
              })}
            </h2>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TextContainer;
