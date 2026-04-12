import React from "react"
import type { JSX } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "@/pages/Login"
import Register from "@/pages/Register"
import Dashboard from "@/pages/Dashboard"
import MainLayout from "@/layouts/MainLayout"
import AuthLayout from "@/layouts/AuthLayout"


function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token")

  return token ? children : <Navigate to="/" />
}
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <AuthLayout>
            <Login />
          </AuthLayout>
          } />
        <Route path="/register" element={
          <AuthLayout>
            <Register />
          </AuthLayout>
          } />
          <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}