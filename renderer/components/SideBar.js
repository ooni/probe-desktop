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

const TopBar = styled(Box)`
  height: 50px;
  background-color: ${props => props.theme.colors.gray5};
  color: ${props => props.theme.colors.white};
  /* This makes it possible to drag the window around from the side bar */
  -webkit-app-region: drag;
`

const sidebarWidth = '100px'

const SidebarContainer = styled.div`
  padding-top: 50px;
  background-color: ${props => props.theme.colors.gray1};
  width: ${sidebarWidth};
  /* This makes it possible to drag the window around from the side bar */
  -webkit-app-region: drag;
`


const WindowContainer = styled.div`
  position: absolute;
  top: 0px;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
`

const Content = styled.div`
  display: flex;
  overflow: auto;
  flex: 1;
  width: 100%;
`

const MainContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`

export const Sidebar = ({children, currentUrl}) => (
  <WindowContainer>
    <SidebarContainer>
      {Object.keys(navigationPaths).map((path, idx) => {
        console.log(path, currentUrl)
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

    <MainContainer>

      <TopBar w={1}>
      </TopBar>

      <Content>
        {children}
      </Content>

    </MainContainer>

  </WindowContainer>
)
export default Sidebar
