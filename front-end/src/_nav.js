import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilHome,
  cilTask,
  cilCalendarCheck,
  cilInstitution,
  cilUserPlus,
  cilBook,
  cilClipboard,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Schedule',
    to: '/schedule',
    icon: <CIcon icon={cilCalendarCheck} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Attendance',
    to: '/attendance',
    icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Module',
    to: '/module',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
  },
  /*{
    component: CNavItem,
    name: 'Qr Code',
    to: '/qrcode',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
  },*/
  {
    component: CNavTitle,
    name: 'Detail',
  },
  {
    component: CNavGroup,
    name: 'Student',
    to: '/base',
    icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Participant Detail',
        to: '/pdregister',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Institution',
    icon: <CIcon icon={cilInstitution} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Register',
        to: '/institution',
      },
      {
        component: CNavItem,
        name: 'List',
        to: '/listinsti',
      },
      {
        component: CNavItem,
        name: 'Tutor',
        to: '/tutor',
      },
    ],
  },

  {
    component: CNavTitle,
    name: 'Reporting',
  },
  {
    component: CNavItem,
    name: 'Monthly Report',
    to: '/monthly',
    icon: <CIcon icon={cilTask} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Quaterly Report',
    to: '/quaterly',
    icon: <CIcon icon={cilTask} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Yearly Report',
    to: '/',
    icon: <CIcon icon={cilTask} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Assesment',
    to: '/theme/typography',
    icon: <CIcon icon={cilTask} customClassName="nav-icon" />,
  },
]

export default _nav
