import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from './App.tsx';
import './index.css';
import Threads from './integrals/Threads.tsx';
import About from './integrals/About.tsx';
import Teach from './integrals/Teach.tsx';
import Learn from './integrals/Learn.tsx';
import Login from './integrals/Login.tsx';
import Signup from './integrals/Signup.tsx';
import Home from './integrals/Home.tsx';
import Call from './integrals/Call.tsx';
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import { store } from './redux/redux.store.ts';
import ProtectedRoutes from './components/ProtectedRoutes.tsx';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastContainer
      position="bottom-right"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick={true}
      theme="colored"
    />
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route path="/" element={<Home />} />
              <Route path="/" element={<ProtectedRoutes />}>
                <Route path="/threads" element={<Threads />} />
                <Route path="/teach" element={<Teach />} />
                <Route path="/call" element={<Call />} />
                <Route path="/learn" element={<Learn />} />
              </Route>
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>,
)
