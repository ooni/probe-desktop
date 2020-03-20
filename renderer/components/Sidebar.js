/* global process */
import React from 'react'
import styled from 'styled-components'
import { withRouter } from 'next/router'
import {
  Text,
  Flex,
  Box
} from 'ooni-components'
import Link from 'next/link'
import { FormattedMessage } from 'react-intl'
import OONILogo from 'ooni-components/components/svgs/logos/Probe-HorizontalMonochrome.svg'
import { MdWeb, MdHistory } from 'react-icons/md'
import { FaCog } from 'react-icons/fa'

import ExternalLink from './ExternalLink'

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
      <Link href={href}>
        <Flex alignItems='center'>
          <Box>
            {icon}
          </Box>
          <Box pl={2}>
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
    name: <FormattedMessage id='Dashboard.Tab.Label' />,
    icon: <MdWeb size={40} />
  },
  '/test-results': {
    name: <FormattedMessage id='TestResults.Overview.Tab.Label' />,
    icon: <MdHistory size={40} />
  },
  '/settings': {
    name: <FormattedMessage id='Settings.Title' />,
    icon: <FaCog size={40} />
  }
}

const WindowContainer = styled.div``

const SidebarContainer = styled(Flex)`
  padding-top: 50px;
  background-color: ${props => props.theme.colors.gray1};
  border-right: 1px solid ${props => props.theme.colors.gray3};
  width: 220px;
  height: 100%;
  position: fixed;
  z-index: 70;
  top: 0;
  left: 0;
  /* This makes it possible to drag the window around from the side bar */
  -webkit-app-region: drag;
`

const MainContainer = styled.div`
  margin-left: 220px;
`

const StyledOONILogo = styled(OONILogo)`
  fill: ${props => props.theme.colors.gray8};
`

export const Sidebar = ({children, router}) => (
  <WindowContainer>
    <SidebarContainer flexDirection='column' justifyContent='space-between'>
      <Box>
        {Object.keys(navigationPaths).map((path, idx) => {
          const info = navigationPaths[path]
          return (
            <NavItem
              key={idx}
              currentUrl={router}
              href={path}
              icon={info.icon}
              label={info.name}
            />
          )
        })}
      </Box>
      <Box px={2}>
        <Box my={2}>
          <StyledOONILogo />
        </Box>
        <Box my={2}>
          <Text fontSize={12} textAlign='right' color='gray8'>
            {process.env.npm_package_version}
          </Text>
        </Box>
      </Box>
    </SidebarContainer>

    <MainContainer>
      {children}
    </MainContainer>

  </WindowContainer>
)
export default withRouter(Sidebar)
