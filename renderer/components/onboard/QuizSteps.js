import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import Lottie from 'react-lottie'
import {
  Fixed,
  Heading,
  Flex,
  Box,
  Text,
  Divider,
  theme
} from 'ooni-components'
import { default as tickAnimation } from '../../static/animations/checkMark.json'
import { default as crossAnimation } from '../../static/animations/crossMark.json'

const QuizModal = styled(Fixed)`
  max-width: 100vw;
  max-height: 100vh;
  overflow: auto;
  transform: translate(-50%, -50%);
  box-shadow: rgba(0, 0, 0, 0.80) 0 0 0 60vmax, rgba(0, 0, 0, 0.25) 0 0 32px;
  border-radius: 10px;
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

const BackButton = styled(QuizButton)`
  background-color: ${props => props.theme.colors.gray7};
  &:hover {
    background-color: ${props => props.theme.colors.gray6};
  }
`

const ContinueButton = styled(QuizButton)`
  color: ${props => props.theme.colors.black};
  background-color: ${props => props.theme.colors.gray4};
  &:hover {
    background-color: ${props => props.theme.colors.gray3};
  }
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

const QuizActually = ({text, onBack, onContinue}) => (
  <React.Fragment width={400} bg={theme.colors.gray7}>
    <Heading textAlign='center' h={3}>
      <FormattedMessage id='Onboarding.PopQuiz.1.Wrong.Title' />
    </Heading>
    <Divider borderColor='white' />
    <Text p={4}>{text}</Text>
    <Flex>
      <BackButton width={1/2} onClick={onBack}>
        <FormattedMessage id='Onboarding.PopQuiz.Wrong.Button.Back' />
      </BackButton>
      <ContinueButton width={1/2} onClick={onContinue}>
        <FormattedMessage id='Onboarding.PopQuiz.Wrong.Button.Continue' />
      </ContinueButton>
    </Flex>
  </React.Fragment>
)

QuizActually.propTypes = {
  text: PropTypes.node,
  onBack: PropTypes.func,
  onContinue: PropTypes.func
}

const QuizQuestion = ({qNum, question, onTrue, onFalse}) => (
  <React.Fragment width={400}>
    <div>
      <Heading textAlign='center' h={3}>
        <FormattedMessage id='Onboarding.PopQuiz.Title' />
      </Heading>
      <Divider borderColor='white' />
      <Heading textAlign='center' h={4}>
        <FormattedMessage id={`Onboarding.PopQuiz.${qNum}.Title`} />
      </Heading>
      <Text mx={5} my={4}>{question}</Text>
      <Flex>
        <TrueButton width={1/2} onClick={onTrue}>
          <FormattedMessage id='Onboarding.PopQuiz.True' />
        </TrueButton>
        <FalseButton width={1/2} onClick={onFalse}>
          <FormattedMessage id='Onboarding.PopQuiz.False' />
        </FalseButton>
      </Flex>
    </div>
  </React.Fragment>
)

QuizQuestion.propTypes = {
  qNum: PropTypes.number,
  question: PropTypes.node,
  onTrue: PropTypes.func,
  onFalse: PropTypes.func
}

const Animation = ({ okay, onComplete }) => {
  const animationData = okay ? tickAnimation : crossAnimation
  return (
    <Lottie
      width={300}
      height={300}
      options={{
        loop: false,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
      }}
      eventListeners={[{
        eventName: 'complete',
        callback: () => onComplete(),
      }]}
    />
  )
}

Animation.propTypes = {
  okay: PropTypes.bool,
  onComplete: PropTypes.func
}

class QuizSteps extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeIdx: 0,
      actuallyActive: false,
      showOkayAnimation: false,
      showNopeAnimation: false
    }
    this.nextStep = this.nextStep.bind(this)
    this.onWrongAnswer = this.onWrongAnswer.bind(this)
    this.onAnimatonComplete = this.onAnimatonComplete.bind(this)
  }

  nextStep() {
    this.setState({
      activeIdx: this.state.activeIdx + 1,
      actuallyActive: false,
      showOkayAnimation: true
    })
  }

  onWrongAnswer() {
    this.setState({
      actuallyActive: true,
      showNopeAnimation: true
    })
  }

  onAnimatonComplete() {
    const questionCount = this.props.questionList.length
    this.setState({
      showOkayAnimation: false,
      showNopeAnimation: false
    })
    if (this.state.activeIdx >= questionCount) {
      return this.props.onDone()
    }
  }

  render() {
    const {
      questionList,
      actuallyList,
      onClose
    } = this.props

    const {
      showOkayAnimation,
      showNopeAnimation,
      actuallyActive,
      activeIdx
    } = this.state

    const qNum = activeIdx + 1,
      questionText = questionList[activeIdx],
      actuallyText = actuallyList[activeIdx]

    const showAnimation = () => (
      <Animation
        okay={showOkayAnimation === true && showNopeAnimation === false}
        onComplete={() => this.onAnimatonComplete()}
      />
    )

    return (
      <QuizModal>
        <Fixed top right bottom left />
        {(showOkayAnimation || showNopeAnimation) ? (
          showAnimation()
        ) : (
          !actuallyActive ? (
            <QuizQuestion
              qNum={qNum}
              question={questionText}
              actually={actuallyText}
              onTrue={this.nextStep}
              onFalse={this.onWrongAnswer}
            />
          ) : (
            <QuizActually
              text={actuallyText}
              onContinue={this.nextStep}
              onBack={onClose}
            />
          )
        )}
      </QuizModal>
    )
  }
}

QuizSteps.propTypes = {
  questionList: PropTypes.arrayOf(PropTypes.node),
  actuallyList: PropTypes.arrayOf(PropTypes.node),
  onClose: PropTypes.func,
  onDone: PropTypes.func
}

export default QuizSteps
