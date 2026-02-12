import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ContentPage from './pages/ContentPage';
import ResourcesPage from './pages/ResourcesPage';
import CustomCursor from './components/CustomCursor';
import PageTransition from './components/PageTransition';

export default function App() {
  return (
    <BrowserRouter>
      <CustomCursor />
      <PageTransition />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/content" element={<ContentPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
      </Routes>
    </BrowserRouter>
  );
}
