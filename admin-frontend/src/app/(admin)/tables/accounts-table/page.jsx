import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AccountProvider } from './context/AccountContext';
import SearchBar from './components/SearchBar';
import AccountDetailTable from './components/AccountDetailTable';

function App() {
  return (
    <AccountProvider>
      <Routes>
        <Route path="/*" element={
          <>
            <SearchBar />
            <AccountDetailTable />
          </>
        } />
      </Routes>
    </AccountProvider>
  );
}

export default App;
