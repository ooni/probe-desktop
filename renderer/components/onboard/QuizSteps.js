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

import { Modal, YesButton, NoButton } from '../Modal'
import { default as tickAnimation } from '../../static/animations/checkMark.json'
import { default as crossAnimation } from '../../static/animations/crossMark.json'

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

const QuizActually = ({text, onBack, onContinue}) => (
  <Box width={400} bg={theme.colors.gray7}>
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
  </Box>
)

QuizActually.propTypes = {
  text: PropTypes.node,
  onBack: PropTypes.func,
  onContinue: PropTypes.func
}

const QuizQuestion = ({qNum, question, onTrue, onFalse}) => (
  <Box width={400}>
    <div>
      <Heading textAlign='center' h={3}>
        <FormattedMessage id='Onboarding.PopQuiz.Title' />
      </Heading>
      <Divider borderColor='white' />
      <Heading textAlign='center' h={4}>
        <FormattedMessage id={`Onboarding.PopQuiz.${qNum}.Title`} />
      </Heading>
      <Text mx={3} my={4} textAlign='center'>{question}</Text>
      <Flex>
        <YesButton width={1/2} onClick={onTrue}>
          <FormattedMessage id='Onboarding.PopQuiz.True' />
        </YesButton>
        <NoButton width={1/2} onClick={onFalse}>
          <FormattedMessage id='Onboarding.PopQuiz.False' />
        </NoButton>
      </Flex>
    </div>
  </Box>
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
      width={400}
      height={270}
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
    const { actuallyActive, activeIdx } = this.state
    const { questionList } = this.props

    // if continuing from wrong answer and all questions are answered
    const questionCount = questionList.length
    if (actuallyActive === true && activeIdx >= (questionCount - 1)) {
      return this.props.onDone()
    }

    // if continuing after answering wrong, don't show okay animation
    const showOkayAnimation = actuallyActive ? false : true

    this.setState({
      activeIdx: this.state.activeIdx + 1,
      actuallyActive: false,
      showOkayAnimation: showOkayAnimation
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

    let modalBg = theme.colors.blue5
    if (showOkayAnimation) {
      modalBg = theme.colors.green7
    } else if (showNopeAnimation) {
      modalBg = theme.colors.red8
    } else if (actuallyActive) {
      modalBg = theme.colors.gray7
    }

    return (
      <Modal show={true} bg={modalBg}>
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
      </Modal>
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
