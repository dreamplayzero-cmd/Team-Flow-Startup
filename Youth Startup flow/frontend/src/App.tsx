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
import { PremiumChatBot } from './ui/components/PremiumChatBot'

function App() {
  const dispatch = useAppDispatch()
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn)
  const currentView = useAppSelector((state) => state.navigation.currentView)

  return (
    <main className="bg-[#faf8ff] min-h-screen transition-colors duration-500">
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
            transition={{ duration: 0.18, ease: "easeOut" }} // [CSI SPEED FIX] 0.3s -> 0.18s
            className="w-full h-full"
          >
            {(() => {
              switch (currentView) {
                case 'dashboard':
                  return (
                    <DashboardPage
                      onStartProfiling={() => dispatch(setView('persona'))}
                      onStartBusinessPlan={() => dispatch(setView('business_plan'))}
                      onStartDistrictAnalysis={() => dispatch(setView('district_analysis'))}
                      onStartLeaderboard={() => dispatch(setView('district_leaderboard'))}
                    />
                  )
                case 'persona':
                  return (
                    <PersonaProfilingPage
                      onBack={() => dispatch(setView('dashboard'))}
                      onNext={() => dispatch(setView('business_plan'))}
                    />
                  )
                case 'business_plan':
                  return (
                    <BusinessPlanPage
                      onBack={() => dispatch(setView('dashboard'))}
                      onNext={() => dispatch(setView('district_analysis'))}
                    />
                  )
                case 'district_analysis':
                  return (
                    <DistrictAnalysisPage
                      onBack={() => dispatch(setView('dashboard'))}
                      onNext={() => dispatch(setView('district_leaderboard'))}
                    />
                  )
                case 'district_leaderboard':
                  return (
                    <DistrictLeaderboardPage
                      onBack={() => dispatch(setView('dashboard'))}
                      onShowReport={() => dispatch(setView('district_report'))}
                    />
                  )
                case 'district_report':
                  return <DistrictReportPage onBack={() => dispatch(setView('district_leaderboard'))} />
                default:
                  return <DashboardPage onStartProfiling={() => dispatch(setView('persona'))} />
              }
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Debug Overlay - Help track navigation state */}
      <div className="fixed bottom-4 right-4 z-[9999] bg-black/80 text-white text-[10px] px-3 py-1 rounded-full font-mono pointer-events-none opacity-50">
        SYS_LOG: VIEW={currentView} | AUTH={isLoggedIn ? 'TRUE' : 'FALSE'}
      </div>
      {/* Premium AI ChatBot */}
      {isLoggedIn && <PremiumChatBot />}
    </main>
  )
}

export default App
