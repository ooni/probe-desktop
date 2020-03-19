import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { MdKeyboardArrowLeft } from 'react-icons/md'
/*
 * XXX This component is a bit written a bit hasily. State is stored and encapsulated in the following way:
 *
 * The `Sections` component keeps track of:
 * - What is the current step of the wizard
 * - If the Quiz has been completed and/or if it's shown or hidden

 * The `QuizSteps` component is responsible for the state of:
 * - What is the current step of the quizActive
 *
 * It learns of if it should be shown or hidden from the props passed to it by
 * the Sections component.
 *
 * Using something like flux would have maybe made writing this easier, but this
 * is really the only place in which I felt the need of something like flux.
 */

import {
  Text,
  Button,
  Box,
  Flex,
  Heading
} from 'ooni-components'
import NLink from 'next/link'

import FormattedMarkdownMessage from '../FormattedMarkdownMessage'
import ExternalLink from '../ExternalLink'
import Stepper from './Stepper'
import QuizSteps from './QuizSteps'

const ChangeLink = styled.a`
  color: ${props => props.theme.colors.white};
  cursor: pointer;
  display: block;
  text-align: center;
  padding-top: 10px;
  &:hover {
    color: ${props => props.theme.colors.gray3};
  }
`

const HeadsUpList = styled.li`
  margin-top: 20px;
  margin-bottom: 20px;
`

const TopBar = styled(Box)`
  position: absolute;
  top: 0;
  width: 100%;
  height: 50px;
  background-color: transparent;
  color: ${props => props.theme.colors.white};
  /* This makes it possible to drag the window around from the side bar */
  -webkit-app-region: drag;
`

const OnboardBG = styled(Flex)`
  background: ${props => `no-repeat url(${props.img})`};
  background-color: ${props => props.bgColor || '#002b54'};
  background-size: contain;
  height: 100vh;
`

const SectionThingsToKnow = ({onNext, quizActive, quizComplete, toggleQuiz, onQuizComplete}) => (
  <div>
    {(quizActive && !quizComplete) &&
      <QuizSteps
        onClose={toggleQuiz}
        onDone={onQuizComplete}
        questionList={[
          <FormattedMessage key='Onboarding.PopQuiz.1.Question' id='Onboarding.PopQuiz.1.Question' />,
          <FormattedMessage key='Onboarding.PopQuiz.2.Question' id='Onboarding.PopQuiz.2.Question' />
        ]}
        actuallyList={[
          <FormattedMessage key='Onboarding.PopQuiz.1.Wrong.Paragraph' id='Onboarding.PopQuiz.1.Wrong.Paragraph' />,
          <FormattedMessage key='Onboarding.PopQuiz.2.Wrong.Paragraph' id='Onboarding.PopQuiz.2.Wrong.Paragraph' />
        ]}
      />
    }

    <Flex flexWrap='wrap' flexDirection='column'>
      <Box width={1}>
        <Heading textAlign='center' h={1}>
          <FormattedMessage id="Onboarding.ThingsToKnow.Title" />
        </Heading>
      </Box>
      <Box width={2/3} my={0} mx='auto'>
        <ul>
          <HeadsUpList><FormattedMessage id="Onboarding.ThingsToKnow.Bullet.1" /></HeadsUpList>
          <HeadsUpList><FormattedMessage id="Onboarding.ThingsToKnow.Bullet.2" /></HeadsUpList>
          <HeadsUpList><FormattedMessage id="Onboarding.ThingsToKnow.Bullet.3" /></HeadsUpList>
        </ul>
      </Box>
      <Box mx='auto'>
        <Button inverted onClick={quizComplete ? onNext : toggleQuiz}>
          <FormattedMessage id="Onboarding.ThingsToKnow.Button" />
        </Button>
      </Box>
      <Box mt={3} mx='auto'>
        <NLink href='https://ooni.org/about/risks/' passHref>
          <ExternalLink color='gray3'>Learn More</ExternalLink>
        </NLink>
      </Box>
    </Flex>
  </div>
)

SectionThingsToKnow.propTypes = {
  quizActive: PropTypes.bool,
  quizComplete: PropTypes.bool,
  toggleQuiz: PropTypes.func,
  onQuizComplete: PropTypes.func,
  onNext: PropTypes.func
}

const SectionWhatIsOONI = ({onNext}) => (
  <Flex flexWrap='wrap' flexDirection='column'>
    <Box width={1} px={4}>
      <Heading h={1} textAlign='center'>
        <FormattedMessage id="Onboarding.WhatIsOONIProbe.Title" />
      </Heading>
    </Box>
    <Box width={1/2} my={3} px={4} mx='auto'>
      <Text>
        <FormattedMarkdownMessage id="Onboarding.WhatIsOONIProbe.Paragraph" />
      </Text>
    </Box>
    <Box mx='auto'>
      <Button inverted onClick={onNext}>
        <FormattedMessage id='Onboarding.WhatIsOONIProbe.GotIt' />
      </Button>
    </Box>
  </Flex>
)

SectionWhatIsOONI.propTypes = {
  onNext: PropTypes.func
}

const SectionDefaultSettings = ({onGo, onChange}) => (
  <Flex flexWrap='wrap' flexDirection='column'>
    <Box width={1}>
      <Heading textAlign='center' h={1}>
        <FormattedMessage id='Onboarding.DefaultSettings.Title' />
      </Heading>
    </Box>
    <Box width={1} px={4}>
      <Flex>
        <Box width={1/2}>
          <Heading h={4}>
            <FormattedMessage id='Onboarding.DefaultSettings.Header' />
          </Heading>
          <ul>
            <li>
              <FormattedMessage id='Onboarding.DefaultSettings.Bullet.1' />
            </li>
            <li>
              <FormattedMessage id='Onboarding.DefaultSettings.Bullet.2' />
            </li>
            <li>
              <FormattedMessage id='Onboarding.DefaultSettings.Bullet.3' />
            </li>
          </ul>
        </Box>
        <Box width={1/2} mt={4}>
          <FormattedMarkdownMessage id='Onboarding.DefaultSettings.Paragraph' />
        </Box>
      </Flex>
    </Box>
    <Box mx='auto'>
      <Button inverted onClick={onGo}>
        <FormattedMessage id='Onboarding.DefaultSettings.Button.Go' />
      </Button>
      <ChangeLink onClick={onChange}>
        <FormattedMessage id='Onboarding.DefaultSettings.Button.Change' />
      </ChangeLink>
    </Box>
  </Flex>
)

SectionDefaultSettings.propTypes = {
  onGo: PropTypes.func,
  onChange: PropTypes.func
}

const BackButtonContainer = styled.div`
  position: absolute;
  left: 10px;
  top: 40px;
  cursor: pointer;
  &:hover {
    color: ${props => props.theme.colors.gray4};
  }
`

const numSteps = 3

class Sections extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeIdx: 0,
      quizComplete: false,
      quizActive: false
    }
    this.nextStep = this.nextStep.bind(this)
    this.prevStep = this.prevStep.bind(this)
    this.onQuizComplete = this.onQuizComplete.bind(this)
    this.toggleQuiz = this.toggleQuiz.bind(this)
  }

  toggleQuiz() {
    this.setState({
      quizActive: !this.state.quizActive
    })
  }

  onQuizComplete() {
    this.setState({
      quizComplete: true,
      activeIdx: this.state.activeIdx + 1
    })
  }

  nextStep() {
    if (this.state.activeStep >= numSteps) {
      return
    }

    this.setState({
      activeIdx: this.state.activeIdx + 1
    })
  }

  prevStep() {
    if (this.state.activeIdx <= 0) {
      return
    }

    this.setState({
      activeIdx: this.state.activeIdx - 1
    })
  }

  render() {
    const {
      activeIdx,
      quizComplete,
      quizActive
    } = this.state

    const {
      onGo,
      onChange
    } = this.props

    const onboardingBGs = [
      '/static/images/onboarding_0.svg',
      '/static/images/onboarding_1.svg',
      '/static/images/onboarding_2.svg'
    ]

    return (
      <OnboardBG
        img={onboardingBGs[activeIdx]}
        // last onboarding screen needs a darker background
        bgColor={activeIdx === 2 ? '#001a33' : '#002b54'}
        flexDirection='column'
        justifyContent='flex-end'
        flex='0 1'
      >
        <TopBar />
        <Flex flexWrap='wrap' justifyContent='center' alignItems='center'>
          <Box width={1}>
            {activeIdx === 0 &&
              <SectionWhatIsOONI
                onNext={this.nextStep}
              />
            }

            {activeIdx === 1 &&
              <SectionThingsToKnow
                onQuizComplete={this.onQuizComplete}
                quizComplete={quizComplete}
                quizActive={quizActive}
                toggleQuiz={this.toggleQuiz}

                onPrevious={this.prevStep}
                onNext={this.nextStep}
              />
            }

            {activeIdx === 2 &&
              <SectionDefaultSettings
                onGo={onGo}
                onChange={onChange}
              />
            }
          </Box>

          <Box width={1}>
            {activeIdx !== 0 &&
              <BackButtonContainer onClick={this.prevStep}>
                <Flex>
                  <Box><MdKeyboardArrowLeft size={20} /></Box>
                  <Box>Go Back</Box>
                </Flex>
              </BackButtonContainer>
            }
          </Box>

          <Box width={1} my={4}>
            <Stepper activeIdx={activeIdx} />
          </Box>
        </Flex>
      </OnboardBG>
    )
  }
}

Sections.propTypes = {
  onGo: PropTypes.func,
  onChange: PropTypes.func
}

export default Sections
