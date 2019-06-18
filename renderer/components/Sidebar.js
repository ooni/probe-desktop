// XXX rename this component to Navigation
// or maybe WithNavigation
import React from 'react'
import styled from 'styled-components'
import { withRouter } from 'next/router'

import {
  Flex,
  Box
} from 'ooni-components'

import Link from 'next/link'

import MdWeb from 'react-icons/lib/md/web'
import MdHistory from 'react-icons/lib/md/history'
import MdCog from 'react-icons/lib/fa/cog'

const StyledNavItem = styled.div`
  position: relative;
  color: ${props => props.isActive ? props.theme.colors.blue5 : props.theme.colors.gray4};
  margin-bottom: 16px;
  padding-left: 16px;
  padding-right: 16px;
  text-align: center;
  /* Disable text selection */
  user-select: none;
  /* Ensure we always have a pointer */
  cursor: pointer;
  &:active {
    color: ${props => props.theme.colors.blue2};
  }
  &:hover {
    color: ${props => props.theme.colors.blue4};
  }
  -webkit-app-region: no-drag;
`

const ColoredStrip = styled.span`
  display: ${props => props.active ? 'block' : 'none'};
  height: 100%;
  width: 8px;
  background: ${props => props.theme.colors.blue5};
  position: absolute;
  left: 0px;
  bottom: 0px;
`

const NavItem = ({href, icon, label, currentUrl}) => {
  const isActive = currentUrl.pathname === href
  return (
    <StyledNavItem isActive={isActive}>
      <Link href={href} prefetch>
        <Flex flexDirection='column' alignItems='center'>
          <Box>
            {icon}
          </Box>
          <Box>
            {label}
          </Box>
        </Flex>
      </Link>
      <ColoredStrip active={isActive} />
    </StyledNavItem>
  )
}

const navigationPaths = {
  '/home': {
    name: 'Home',
    icon: <MdWeb size={40} />
  },
  '/results': {
    name: 'Test Results',
    icon: <MdHistory size={40} />
  },
  '/settings': {
    name: 'Settings',
    icon: <MdCog size={40} />
  }
}

const WindowContainer = styled.div``

const SidebarContainer = styled.div`
  padding-top: 50px;
  background-color: ${props => props.theme.colors.gray1};
  width: 160px;
  height: 100%;
  position: fixed;
  z-index: 70;
  top: 0;
  left: 0;
  /* This makes it possible to drag the window around from the side bar */
  -webkit-app-region: drag;
`

const MainContainer = styled.div`
  margin-left: 160px;
`

export const Sidebar = ({children, router}) => (
  <WindowContainer>
    <SidebarContainer>
      {Object.keys(navigationPaths).map((path, idx) => {
        const info = navigationPaths[path]
        return (
          <NavItem
            key={idx}
            currentUrl={router}
            href={path}
            icon={info.icon}
            label={info.name} />
        )
      })}
    </SidebarContainer>

    <MainContainer>
      {children}
    </MainContainer>

  </WindowContainer>
)
export default withRouter(Sidebar)
