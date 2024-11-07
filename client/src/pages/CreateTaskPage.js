// client/src/pages/CreateTaskPage.js
import React from 'react';
import Header from '../components/Header';
import CreateTaskForm from '../components/CreateTaskForm';

const CreateTaskPage = () => {
  return (
    <div className="flex h-screen">
      <Header />
      <div className="w-3/4 p-6">
        <CreateTaskForm />
      </div>
    </div>
  );
};

export default CreateTaskPage;
