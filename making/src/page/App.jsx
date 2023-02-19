import axios from 'axios';
import {
  url_api,
  url_assets,
  url_base,
  url_api_server,
  url_server_api,
} from './config/config';
import React, { useEffect, useState } from 'react';
import LoadingSpinner from './components/LoadingSpinner';
import Surat from './Surat';
import { isEmpty } from './function/fx';
const App = () => {
  const [userSession, setUserSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    Auth();
  }, []);
  const Auth = async () => {
    const logIn = await axios.get(`${url_api_server}auth/userProfile`, {
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('_token'),
      },
    });
    if (!isEmpty(logIn.status) && logIn.status == 200) {
      setIsLoading(false);
      setUserSession(logIn?.data);
    }
  };
  return isLoading ? <LoadingSpinner /> : <Surat init={userSession} />;
};

export default App;
