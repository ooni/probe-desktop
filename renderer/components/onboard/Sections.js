import React from 'react'

import styled from 'styled-components'

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
  theme
} from 'ooni-components'

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

const QuizActually = ({text, onBack, onContinue}) => (
  <QuizModal width={400} bg={theme.colors.gray7}>
    <Heading center h={3}>Actually...</Heading>
    <Text p={4}>{text}</Text>
    <Flex>
      <BackButton w={1/2} onClick={onBack}>Go Back</BackButton>
      <ContinueButton w={1/2} onClick={onContinue}>Continue</ContinueButton>
    </Flex>
  </QuizModal>
)

const QuizQuestion = ({title, qNum, qTotal, question, onTrue, onFalse}) => (
  <QuizModal width={400}>
    <div>
      <Heading center h={3}>Question {qNum}/{qTotal}</Heading>
      <Text p={4}>{question}</Text>
      <Flex>
        <TrueButton w={1/2} onClick={onTrue}>True</TrueButton>
        <FalseButton w={1/2} onClick={onFalse}>False</FalseButton>
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

    const qTotal = questionList.length,
      qNum = activeIdx + 1,
      questionText = questionList[activeIdx],
      actuallyText = actuallyList[activeIdx]

    return (
      <div>
        <Fixed top right bottom left />
        {!actuallyActive ?
          <QuizQuestion
            qNum={qNum}
            qTotal={qTotal}
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
        'Network Interference UDP Tor censorship TLS handshake?',
        'Observatory of Network Interference, traffic manipulation?'
      ]}
      actuallyList={[
        'internet network interference consequat ullamco',
        'censorship traffic manipulation middlebox consectetur'
      ]}
    />}

    <Flex wrap>
      <Box w={1} p={2}>
        <Heading center h={1}>Things to Know</Heading>
      </Box>
      <Box w={1} p={4}>
        <Text>Pariatur Open Observatory of Network Interference, incididunt, TCP
      internet network interference consequat ullamco tempor cupidatat ipsum
      network interference ex. Non in UDP surveillance, eiusmod aliquip TLS
      handshake network interference traffic manipulation Open Observatory of
      Network Interference UDP Tor censorship TLS handshake. Occaecat Open
      Observatory of Network Interference, traffic manipulation qui sint
      censorship DNS tampering DNS tampering connection reset UDP. In velit do
      cillum internet TCP, occaecat consectetur ullamco middlebox network
      interference tempor UDP voluptate surveillance. Esse, deserunt sed
      censorship traffic manipulation middlebox consectetur.
        </Text>
      </Box>
      <Box style={{'margin': '0 auto'}}>
        <Button inverted onClick={quizComplete ? onNext : toggleQuiz}>
      I understand
        </Button>
      </Box>
    </Flex>
  </div>
)

const SectionWhatIsOONI = ({onNext}) => (
  <div>
    <Flex wrap>
      <Box w={1} p={2}>
        <Heading center h={1}>What is OONI?</Heading>
      </Box>
      <Box w={1} p={4}>
        <Text>Pariatur Open Observatory of Network Interference, incididunt, TCP
      internet network interference consequat ullamco tempor cupidatat ipsum
      network interference ex. Non in UDP surveillance, eiusmod aliquip TLS
      handshake network interference traffic manipulation Open Observatory of
      Network Interference UDP Tor censorship TLS handshake. Occaecat Open
      Observatory of Network Interference, traffic manipulation qui sint
      censorship DNS tampering DNS tampering connection reset UDP. In velit do
      cillum internet TCP, occaecat consectetur ullamco middlebox network
      interference tempor UDP voluptate surveillance. Esse, deserunt sed
      censorship traffic manipulation middlebox consectetur.
        </Text>
      </Box>
      <Box style={{'margin': '0 auto'}}>
        <Button inverted onClick={onNext}>
      Continue
        </Button>
      </Box>
    </Flex>
  </div>
)

const SectionDefaultSettings = ({onGo, onChange}) => (
  <div>
    <Flex wrap>
      <Box w={1} p={2}>
        <Heading center h={1}>Default settings</Heading>
      </Box>
      <Box w={1} p={4}>
        <Text>Pariatur Open Observatory of Network Interference, incididunt, TCP
      internet network interference consequat ullamco tempor cupidatat ipsum
      network interference ex. Non in UDP surveillance, eiusmod aliquip TLS
      handshake network interference traffic manipulation Open Observatory of
      Network Interference UDP Tor censorship TLS handshake. Occaecat Open
      Observatory of Network Interference, traffic manipulation qui sint
      censorship DNS tampering DNS tampering connection reset UDP. In velit do
      cillum internet TCP, occaecat consectetur ullamco middlebox network
      interference tempor UDP voluptate surveillance. Esse, deserunt sed
      censorship traffic manipulation middlebox consectetur.
        </Text>
      </Box>
      <Box style={{'margin': '0 auto'}}>
        <Button inverted onClick={onChange}>
      Change
        </Button>
        <Button inverted onClick={onGo}>
      Continue
        </Button>
      </Box>
    </Flex>
  </div>
)

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
      <div>
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

        <Button inverted onClick={this.prevStep}>
        Back
        </Button>
      </div>
    )
  }
}

export default Sections
