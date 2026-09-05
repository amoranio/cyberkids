import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ProgressProvider } from './context/ProgressContext'
import { HubPage } from './pages/HubPage'
import { LessonPage } from './pages/LessonPage'
import { GamePage } from './pages/GamePage'
import { QuizPage } from './pages/QuizPage'
import { BadgesPage } from './pages/BadgesPage'
import { ParentsPage } from './pages/ParentsPage'

export default function App() {
  return (
    <ProgressProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HubPage />} />
            <Route path="learn/:moduleId" element={<LessonPage />} />
            <Route path="play/:moduleId" element={<GamePage />} />
            <Route path="quiz/:moduleId" element={<QuizPage />} />
            <Route path="badges" element={<BadgesPage />} />
            <Route path="parents" element={<ParentsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </ProgressProvider>
  )
}
