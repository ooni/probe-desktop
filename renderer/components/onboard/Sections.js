import React from 'react'

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
  Heading,
  Fixed,
  Container,
  Divider,
  theme
} from 'ooni-components'

import FormattedMarkdownMessage from '../FormattedMarkdownMessage'

const QuizModal = styled(Fixed)`
  max-width: 100vw;
  max-height: 100vh;
  overflow: auto;
  transform: translate(-50%, -50%);
  box-shadow: rgba(0, 0, 0, 0.25) 0 0 0 60vmax, rgba(0, 0, 0, 0.25) 0 0 32px;
  border-radius: 4px;
  top: 50%;
  left: 50%;
  background-color: ${props => props.bg || props.theme.colors.blue5};
`

const QuizButton = styled(Box)`
  height: 50px;
  text-align: center;
  line-height: 50px;
  cursor: pointer;
`

const TrueButton = styled(QuizButton)`
  background-color: ${props => props.theme.colors.green7};
  &:hover {
    background-color: ${props => props.theme.colors.green6};
  }
`

const FalseButton = styled(QuizButton)`
  background-color: ${props => props.theme.colors.red8};
  &:hover {
    background-color: ${props => props.theme.colors.red7};
  }
`

const ContinueButton = styled(QuizButton)`
  color: ${props => props.theme.colors.black};
  background-color: ${props => props.theme.colors.gray4};
  &:hover {
    background-color: ${props => props.theme.colors.gray3};
  }
`

const BackButton = styled(QuizButton)`
  background-color: ${props => props.theme.colors.gray7};
  &:hover {
    background-color: ${props => props.theme.colors.gray6};
  }
`

const ChangeLink = styled.a`
  color: ${props => props.theme.colors.white};
  cursor: pointer;
  display: block;
  text-align: center;
  padding-top: 10px;
  &:hover {
    color: ${props => props.theme.colors.gray7};
  }
`

const HeadsUpList = styled.li`
  margin-top: 20px;
  margin-bottom: 20px;
`

const QuizActually = ({text, onBack, onContinue}) => (
  <QuizModal width={400} bg={theme.colors.gray7}>
    <Heading center h={3}>
      <FormattedMessage id='Onboarding.PopQuiz.1.Wrong.Title' />
    </Heading>
    <Text p={4}>{text}</Text>
    <Flex>
      <BackButton width={1/2} onClick={onBack}>
        <FormattedMessage id='Onboarding.PopQuiz.Wrong.Button.Back' />
      </BackButton>
      <ContinueButton width={1/2} onClick={onContinue}>
        <FormattedMessage id='Onboarding.PopQuiz.Wrong.Button.Continue' />
      </ContinueButton>
    </Flex>
  </QuizModal>
)

const QuizQuestion = ({qNum, question, onTrue, onFalse}) => (
  <QuizModal width={400}>
    <div>
      <Heading center h={3}>
        <FormattedMessage id='Onboarding.PopQuiz.Title' />
      </Heading>
      <Divider />
      <Heading center h={4}>
        <FormattedMessage id={`Onboarding.PopQuiz.${qNum}.Title`} />
      </Heading>
      <Container pb={3}>
        <Text>{question}</Text>
      </Container>
      <Flex>
        <TrueButton width={1/2} onClick={onTrue}>
          <FormattedMessage id='Onboarding.PopQuiz.True' />
        </TrueButton>
        <FalseButton width={1/2} onClick={onFalse}>
          <FormattedMessage id='Onboarding.PopQuiz.False' />
        </FalseButton>
      </Flex>
    </div>
  </QuizModal>
)

class QuizSteps extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeIdx: 0,
      actuallyActive: false
    }
    this.nextStep = this.nextStep.bind(this)
    this.onWrongAnswer = this.onWrongAnswer.bind(this)
  }

  nextStep() {
    const questionCount = this.props.questionList.length
    if (this.state.activeIdx >= (questionCount - 1)) {
      return this.props.onDone()
    }

    this.setState({
      activeIdx: this.state.activeIdx + 1,
      actuallyActive: false
    })
  }

  onWrongAnswer() {
    this.setState({
      actuallyActive: true
    })
  }

  render() {
    const {
      questionList,
      actuallyList,
      onClose
    } = this.props

    const {
      actuallyActive,
      activeIdx
    } = this.state

    const qNum = activeIdx + 1,
      questionText = questionList[activeIdx],
      actuallyText = actuallyList[activeIdx]

    return (
      <div>
        <Fixed top right bottom left />
        {!actuallyActive ?
          <QuizQuestion
            qNum={qNum}
            question={questionText}
            actually={actuallyText}
            onTrue={this.nextStep}
            onFalse={this.onWrongAnswer}
          />
          :
          <QuizActually
            text={actuallyText}
            onContinue={this.nextStep}
            onBack={onClose}
          />
        }
      </div>
    )
  }
}
const SectionThingsToKnow = ({onNext, quizActive, quizComplete, toggleQuiz, onQuizComplete}) => (
  <div>
    {(quizActive && !quizComplete)
    && <QuizSteps
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
    />}

    <Flex flexWrap='wrap'>
      <Box width={1} p={2}>
        <Heading center h={1}>
          <FormattedMessage id="Onboarding.ThingsToKnow.Title" />
        </Heading>
      </Box>
      <Box width={1} p={4}>
        <Container width={700}>
          <ul>
            <HeadsUpList><FormattedMessage id="Onboarding.ThingsToKnow.Bullet.1" /></HeadsUpList>
            <HeadsUpList><FormattedMessage id="Onboarding.ThingsToKnow.Bullet.2" /></HeadsUpList>
            <HeadsUpList><FormattedMessage id="Onboarding.ThingsToKnow.Bullet.3" /></HeadsUpList>
          </ul>
        </Container>
      </Box>
      <Box mx='auto'>
        <Button inverted onClick={quizComplete ? onNext : toggleQuiz}>
          <FormattedMessage id="Onboarding.ThingsToKnow.Button" />
        </Button>
      </Box>
    </Flex>
  </div>
)

const SectionWhatIsOONI = ({onNext}) => (
  <div>
    <Flex flexWrap='wrap'>
      <Box width={1} p={2}>
        <Heading center h={1}>
          <FormattedMessage id="Onboarding.WhatIsOONIProbe.Title" />
        </Heading>
      </Box>
      <Box width={1} p={4}>
        <Container width={700}>
          <Text>
            <FormattedMarkdownMessage id="Onboarding.WhatIsOONIProbe.Paragraph" />
          </Text>
        </Container>
      </Box>
      <Box mx='auto'>
        <Button inverted onClick={onNext}>
          <FormattedMessage id='Onboarding.WhatIsOONIProbe.GotIt' />
        </Button>
      </Box>
    </Flex>
  </div>
)

const SectionDefaultSettings = ({onGo, onChange}) => (
  <div>
    <Flex flexWrap='wrap'>
      <Box width={1} p={2}>
        <Heading center h={1}>
          <FormattedMessage id='Onboarding.DefaultSettings.Title' />
        </Heading>
      </Box>
      <Box width={1} p={4}>
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
          <Box width={1/2}>
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
  </div>
)

const StepperCircle = styled(Box)`
  background-color: ${props => props.active ? props.theme.colors.white : props.theme.colors.blue5};
  width: 15px;
  height: 15px;
  border-radius: 15px;
`

const StepperLine = styled(Box)`
  background-color: ${props => props.active ? props.theme.colors.white : props.theme.colors.blue5};
  width: 50px;
  height: 3px;
`

const Stepper = ({activeIdx}) => {
  return (
    <Flex justifyContent='center' alignItems='center'>
      <StepperCircle active={true} />
      <StepperLine active={activeIdx > 0} />
      <StepperCircle active={activeIdx > 0} />
      <StepperLine active={activeIdx > 1} />
      <StepperCircle active={activeIdx > 1} />
    </Flex>
  )
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

    return (
      <Flex flexWrap='wrap' justifyContent='center' alignItems='center'>
        <Box width={1}>
          {activeIdx === 0
        && <SectionWhatIsOONI
          onNext={this.nextStep}
        />}

          {activeIdx === 1
        && <SectionThingsToKnow
          onQuizComplete={this.onQuizComplete}
          quizComplete={quizComplete}
          quizActive={quizActive}
          toggleQuiz={this.toggleQuiz}

          onPrevious={this.prevStep}
          onNext={this.nextStep}
        />}

          {activeIdx === 2
        && <SectionDefaultSettings
          onGo={onGo}
          onChange={onChange}
        />}
        </Box>

        <Box width={1}>
          {activeIdx !== 0 && <BackButtonContainer onClick={this.prevStep}>
            <Flex>
              <Box><MdKeyboardArrowLeft size={20} /></Box>
              <Box>Go Back</Box>
            </Flex>
          </BackButtonContainer>}
        </Box>

        <Box width={1} pt={4}>
          <Stepper activeIdx={activeIdx} />
        </Box>
      </Flex>
    )
  }
}

export default Sections
