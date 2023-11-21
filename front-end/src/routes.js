import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Module = React.lazy(() => import('./views/schedule/Schedule'))
const Attnd = React.lazy(() => import('./views/attendance/Attendance'))
const Addmdl = React.lazy(() => import('./views/module/Module'))
const PDregister = React.lazy(() => import('./views/pdregister/PDregister'))
const Login = React.lazy(() => import('./views/pages/login/Login'))
const AddInsti = React.lazy(() => import('./views/institution/Institution'))
const ListInsti = React.lazy(() => import('./views/listinsti/ListInsti'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Tutoreg = React.lazy(() => import('./views/tutor/Tutoreg'))
const Mainqr = React.lazy(() => import('./views/qrcode/Mainqr'))
const Monthly = React.lazy(() => import('./views/report/monthly/Monthly'))
const Quaterly = React.lazy(() => import('./views/report/quaterly/Quaterly'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/quaterly', name: 'quaterly', element: Quaterly },
  { path: '/monthly', name: 'monthly', element: Monthly },
  { path: '/qrcode', name: 'Mainqr', element: Mainqr },
  { path: '/module', name: 'Module', element: Addmdl },
  { path: '/register', name: 'Register', element: Register },
  { path: '/login', name: 'Login', element: Login },
  { path: '/institution', name: 'Institution', element: AddInsti },
  { path: '/listinsti', name: 'Institution', element: ListInsti },
  { path: '/pdregister', name: 'Student', element: PDregister },
  { path: '/attendance', name: 'Attendance', element: Attnd },
  { path: '/schedule', name: 'Schedule', element: Module },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/tutor', name: 'Register Tutor', element: Tutoreg },
]

export default routes
