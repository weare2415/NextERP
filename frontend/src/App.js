import React from 'react';
import { RouterProvider } from 'react-router-dom';
import root from './common/router/root';  // root.js를 import

const App = () => {
  return <RouterProvider router={root} />;  // RouterProvider에 root 설정
};

export default App;