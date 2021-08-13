import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import Lottie from 'react-lottie-player'
import {
  Heading,
  Flex,
  Box,
  Text,
  Modal,
  theme
} from 'ooni-components'

import { YesButton, NoButton } from '../Modal'
import { default as tickAnimation } from '../../public/static/animations/checkMark.json'
import { default as crossAnimation } from '../../public/static/animations/crossMark.json'

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
    <Box as='hr' sx={{my: 3}} />
    <Text p={4}>{text}</Text>
    <Flex>
      <BackButton width={1/2} onClick={onBack} data-testid='button-pop-quiz-continue'>
        <FormattedMessage id='Onboarding.PopQuiz.Wrong.Button.Back' />
      </BackButton>
      <ContinueButton width={1/2} onClick={onContinue} data-testid='button-pop-quiz-continue'>
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
      <Box as='hr' sx={{my: 3}} />
      <Heading textAlign='center' h={4} data-testid='pop-quiz-question'>
        <FormattedMessage id={`Onboarding.PopQuiz.${qNum}.Title`} />
      </Heading>
      <Text mx={3} my={4} textAlign='center'>{question}</Text>
      <Flex>
        <YesButton width={1/2} onClick={onTrue} data-testid='button-pop-quiz-true'>
          <FormattedMessage id='Onboarding.PopQuiz.True' />
        </YesButton>
        <NoButton width={1/2} onClick={onFalse} data-testid='button-pop-quiz-false'>
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
  const testIdSuffix = okay ? 'tick' : 'cross'
  return (
    <Lottie
      data-testid={`quiz-steps-${testIdSuffix}`}
      loop={false}
      play={true}
      animationData={animationData}
      style={{width: '400px', height: '270px', alignSelf: 'center'}}
      rendererSettings={{
        preserveAspectRatio: 'xMidYMid slice'
      }}
      onComplete={() => onComplete()}
    />
  )
}

Animation.propTypes = {
  okay: PropTypes.bool,
  onComplete: PropTypes.func
}

const QuizSteps = ({ questionList, actuallyList, onDone, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [actuallyActive, setActuallyActive] = useState(false)
  const [showOkayAnimation, setShowOkayAnimation] = useState(false)
  const [showNopeAnimation, setShowNopeAnimation] = useState(false)

  const nextStep = useCallback(() => {
    // if continuing from wrong answer and all questions are answered
    const questionCount = questionList.length
    if (actuallyActive === true && currentStep >= (questionCount - 1)) {
      return onDone()
    }

    setCurrentStep(currentStep + 1)
    setActuallyActive(false)
    // if continuing after answering wrong, don't show okay animation
    setShowOkayAnimation(!actuallyActive)
  }, [actuallyActive, questionList, currentStep, onDone])

  const onWrongAnswer = useCallback(() => {
    setActuallyActive(true)
    setShowNopeAnimation(true)
  }, [])

  const onAnimatonComplete = useCallback(() => {
    const questionCount = questionList.length
    setShowOkayAnimation(false)
    setShowNopeAnimation(false)
    if (currentStep >= questionCount) {
      return onDone()
    }
  }, [currentStep, onDone, questionList.length])


  const qNum = currentStep + 1,
    questionText = questionList[currentStep],
    actuallyText = actuallyList[currentStep]

  const showAnimation = () => (
    <Animation
      okay={showOkayAnimation === true && showNopeAnimation === false}
      onComplete={() => onAnimatonComplete()}
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
    <Modal show={true} bg={modalBg} data-testid='quiz-steps-modal'>
      <Box sx={{
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      }} />
      {(showOkayAnimation || showNopeAnimation) ? (
        showAnimation()
      ) : (
        !actuallyActive ? (
          <QuizQuestion
            qNum={qNum}
            question={questionText}
            actually={actuallyText}
            onTrue={nextStep}
            onFalse={onWrongAnswer}
          />
        ) : (
          <QuizActually
            text={actuallyText}
            onContinue={nextStep}
            onBack={onClose}
          />
        )
      )}
    </Modal>
  )
}

QuizSteps.propTypes = {
  questionList: PropTypes.arrayOf(PropTypes.node),
  actuallyList: PropTypes.arrayOf(PropTypes.node),
  onClose: PropTypes.func,
  onDone: PropTypes.func
}

export default QuizSteps
