// XXX rename this component to Navigation
// or maybe WithNavigation
import React from 'react'
import styled from 'styled-components'
import Router from 'next/router'

import {
  Heading,
  Container,
  Input,
  Button,
  Flex,
  Box,
  Row,
  Column,
  colors
} from 'ooni-components'

import Link from 'next/link'

import MdWeb from 'react-icons/lib/md/web'
import MdHistory from 'react-icons/lib/md/history'
import MdCog from 'react-icons/lib/fa/cog'

const sidebarWidth = '100px'

const TopbarContainer = styled.div`
  position: fixed;
  z-index: 1000;
  width: 100%;
  margin-left: 100px;
  background-color: ${props => props.theme.colors.gray5};
  color: ${props => props.theme.colors.white};
  padding-top: 5px;
  padding-bottom: 5px;
  /* This makes it possible to drag the window around from the side bar */
  -webkit-app-region: drag;
`

const SidebarContainer = styled.div`
  position: fixed;
  border-radius: 0;
  padding: 0;
  padding-top: 50px;
  background-color: ${props => props.theme.colors.gray1};
  width: ${sidebarWidth};
  height: 100vh;
  /* This makes it possible to drag the window around from the side bar */
  -webkit-app-region: drag;
`

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
        <Flex column align='center'>
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

const ContentContainer = styled(Box)`
  position: absolute;
  top: 50px;
  left: 100px;
  background-color: ${props => props.theme.colors.gray0};
  z-index: 10;
`
export const Sidebar = ({children, currentUrl}) => (
  <div>
    <SidebarContainer>
      {Object.keys(navigationPaths).map((path, idx) => {
        const info = navigationPaths[path]
        return (
          <NavItem
            key={idx}
            currentUrl={currentUrl}
            href={path}
            icon={info.icon}
            label={info.name} />
        )
      })}
    </SidebarContainer>
    <TopbarContainer>
      <Heading h={5} center>{navigationPaths[currentUrl.pathname].name}</Heading>
    </TopbarContainer>
    <ContentContainer>
      {children}
    </ContentContainer>
  </div>
)
export default Sidebar
