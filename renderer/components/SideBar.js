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

import MdHome from 'react-icons/lib/md/home'
import MdList from 'react-icons/lib/md/list'

const sidebarWidth = '100px'

const TopbarContainer = styled.div`
  background-color: transparent;
  border-bottom: 1px solid ${props => props.theme.colors.gray4};
  /* This makes it possible to drag the window around from the side bar */
  -webkit-app-region: drag;
`

const SidebarContainer = styled.div`
  border-radius: 0;
  padding: 0;
  background-color: ${props => props.theme.colors.base};
  width: ${sidebarWidth};
  padding-top: 50px;
  height: 100vh;
  /* This makes it possible to drag the window around from the side bar */
  -webkit-app-region: drag;
`
const StyledNavItem = styled.div`
  color: ${props => props.isActive ? props.theme.colors.blue2 : props.theme.colors.gray3};
  margin-bottom: 10px;
  &:active {
    color: ${props => props.theme.colors.blue2};
  }
  -webkit-app-region: no-drag;
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
    </StyledNavItem>
  )
}

const navigationPaths = {
  '/home': {
    name: 'Home',
    icon: <MdHome size={60} />
  },
  '/results': {
    name: 'Results',
    icon: <MdList size={60} />
  }
}

const ContentContainer = styled(Box)`
  overflow: scroll;
  min-height: 100%;
  height: 100%;
  background-color: ${props => props.theme.colors.gray1};
`
export const Sidebar = ({children, currentUrl}) => (
  <Flex style={{height: '100%', overflow: 'hidden'}}>
    <Box>
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
    </Box>
    <Box style={{width: '100%', height: '100%'}}>
      <TopbarContainer>
        <Heading h={5} center>{navigationPaths[currentUrl.pathname].name}</Heading>
      </TopbarContainer>
      <ContentContainer>
        {children}
      </ContentContainer>
    </Box>
  </Flex>
)
export default Sidebar
