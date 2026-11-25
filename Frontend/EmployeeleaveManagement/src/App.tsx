import type { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { AppShell } from './components/AppShell';
import { isLoggedIn, isManager } from './lib/session';

import Approvals from './pages/Approval';
import ApplyLeave from './pages/ApplyLeave';
import Balance from './pages/Balance';
import Login from './pages/Login';
import MyLeaves from './pages/Myleave';
import PlannerPage from './pages/Plannerpage';
import AddEmployee from './pages/AddEmployee';

function RequireAuth() {
    return isLoggedIn()
        ? <AppShell />
        : <Navigate to="/login" replace />;
}

function ManagerOnly({ children }: { children: ReactElement }) {
    return isManager()
        ? children
        : <Navigate to="/my-leaves" replace />;
}

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<RequireAuth />}>
                <Route
                    path="/add-employee"
                    element={
                        <ManagerOnly>
                            <AddEmployee />
                        </ManagerOnly>
                    }
                />

                <Route path="/my-leaves" element={<MyLeaves />} />
                <Route path="/planner" element={<PlannerPage />} />
                <Route path="/apply" element={<ApplyLeave />} />
                <Route path="/balance" element={<Balance />} />

                <Route
                    path="/approvals"
                    element={
                        <ManagerOnly>
                            <Approvals />
                        </ManagerOnly>
                    }
                />
            </Route>

            <Route
                path="*"
                element={
                    <Navigate
                        to={isLoggedIn() ? '/planner' : '/login'}
                        replace
                    />
                }
            />
        </Routes>
    );
}