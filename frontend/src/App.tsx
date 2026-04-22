import { motion, AnimatePresence } from 'framer-motion'
import { LoginPage } from './ui/pages/LoginPage'
import { DashboardPage } from './ui/pages/DashboardPage'
import { PersonaProfilingPage } from './ui/pages/PersonaProfilingPage'
import { BusinessPlanPage } from './ui/pages/BusinessPlanPage'
import { DistrictAnalysisPage } from './ui/pages/DistrictAnalysisPage'
import { DistrictLeaderboardPage } from './ui/pages/DistrictLeaderboardPage'
import { DistrictReportPage } from './ui/pages/DistrictReportPage'
import { useAppDispatch, useAppSelector } from './store'
import { setView } from './store/slices/navigationSlice'
import { login } from './store/slices/authSlice'

function App() {
  const dispatch = useAppDispatch()
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn)
  const currentView = useAppSelector((state) => state.navigation.currentView)

  return (
    <div className={`${!isLoggedIn ? 'bg-stitch-background' : 'bg-[#faf8ff]'} min-h-screen transition-colors duration-500`}>
      <AnimatePresence mode="wait">
        {!isLoggedIn ? (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
          >
            <LoginPage onLogin={() => dispatch(login())} />
          </motion.div>
        ) : (
          <motion.div
            key={currentView}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            {currentView === 'dashboard' ? (
              <DashboardPage
                onStartProfiling={() => dispatch(setView('persona'))}
                onStartBusinessPlan={() => dispatch(setView('business_plan'))}
                onStartDistrictAnalysis={() => dispatch(setView('district_analysis'))}
                onStartLeaderboard={() => dispatch(setView('district_leaderboard'))}
              />
            ) : currentView === 'persona' ? (
              <PersonaProfilingPage
                onBack={() => dispatch(setView('dashboard'))}
                onNext={() => dispatch(setView('business_plan'))}
              />
            ) : currentView === 'business_plan' ? (
              <BusinessPlanPage
                onBack={() => dispatch(setView('dashboard'))}
                onNext={() => dispatch(setView('district_analysis'))}
              />
            ) : currentView === 'district_analysis' ? (
              <DistrictAnalysisPage
                onBack={() => dispatch(setView('dashboard'))}
                onNext={() => dispatch(setView('district_leaderboard'))}
              />
            ) : currentView === 'district_leaderboard' ? (
              <DistrictLeaderboardPage
                onBack={() => dispatch(setView('dashboard'))}
                onShowReport={() => dispatch(setView('district_report'))}
              />
            ) : (
              <DistrictReportPage onBack={() => dispatch(setView('district_leaderboard'))} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
