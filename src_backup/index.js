import React, { StrictMode, } from 'react';
import ReactDOM from "react-dom";
import './index.css';
import App from './App';

import { ThemeProvider } from "@material-tailwind/react";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const rootElement = document.getElementById('root');
ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider>
      <StrictMode>
        <App /> 
      </StrictMode>
    </ThemeProvider>
  </React.StrictMode>,
  rootElement
);

serviceWorkerRegistration.register();