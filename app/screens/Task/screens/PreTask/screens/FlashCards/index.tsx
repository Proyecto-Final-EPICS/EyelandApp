import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, ScrollView } from 'react-native';
import Instructions from '../../components/Instructions';
import * as Haptics from 'expo-haptics';
import FlipCard from './components/FlipCard';
import Option from './components/Option';
import Modal from '@screens/Task/components/Modal';

import useTheme from '@hooks/useTheme';
import usePlaySound from '@hooks/usePlaySound';
import usePreTask from '@app/core/hooks/Task/PreTask/usePreTask';

import { Theme } from '@theme';
import { PreTaskQuestion } from '@interfaces/PreTaskQuestion.interface';

import { hexToRgbA } from '@utils/hexToRgba';
import { shuffleList } from '@utils/shuffleList';

interface Props {
	route: any;
}

const FlashCards = ({ route }: Props) => {
	const { question } = route.params as { question: PreTaskQuestion };
	const theme = useTheme();
	const [optionIndex, setOptionIndex] = useState<number>(0);
	const [isFlipped, setIsFlipped] = useState<boolean>(false);
	const [optionsQuestionShuffled, setOptionsQuestionShuffled] = useState<
		{ content: string; correct: boolean; id: number; feedback: string }[]
	>([]);
	const [containerStyleOptions, setContainerStyleOptions] = useState([{}]);
	const [containerCardStyle, setContainerCardStyle] = useState({});
	const [feedback, setFeedback] = useState('');
	const [showModal, setShowModal] = useState(false);
	const playSoundSuccess = usePlaySound(
		require('@sounds/success.wav'),
		'@sounds/success.wav'
	);
	const playSoundWrong = usePlaySound(
		require('@sounds/wrong.wav'),
		'@sounds/wrong.wav'
	);
	const playCardEffect = usePlaySound(
		require('@sounds/flashcard.wav'),
		'@sounds/flashcard.wav'
	);
	const flipIndicatorAnimation = useRef(new Animated.Value(0)).current;
	const cardPosition = useRef(new Animated.Value(0)).current;
	const cardOpacity = useRef(new Animated.Value(1)).current;
	const { nextQuestion } = usePreTask();
	const styles = getStyles(theme);

	const updateStyles = (option: 'true' | 'false') => {
		const isCorrect = optionsQuestionShuffled[optionIndex].correct;
		const color =
			(option === 'true' && isCorrect) ||
			(option === 'false' && !isCorrect)
				? theme.colors.green
				: theme.colors.red;
		const updatedContainerStyleOptions = {
			...containerStyleOptions,
			[option === 'true' ? 0 : 1]: { backgroundColor: color }
		};
		setContainerStyleOptions(updatedContainerStyleOptions);
	};

	const resetContainerStyleOptions = () => {
		setTimeout(() => {
			setContainerStyleOptions([{}]);
			setContainerCardStyle({});
		}, 1000);
	};

	const incorrectAnswer = () => {
		setOptionIndex(0);
		Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
		playSoundWrong();
		setContainerCardStyle({
			backgroundColor: hexToRgbA(theme.colors.red, 0.2)
		});
		setOptionsQuestionShuffled(
			shuffleOptions(question).map((option, index) => {
				return {
					id: index,
					content: option.content,
					correct: option.correct,
					feedback: option.feedback
				};
			})
		);
		setShowModal(true);
	};

	const onPressOption = (option: 'true' | 'false') => {
		setFeedback(optionsQuestionShuffled[optionIndex].feedback);
		updateStyles(option);

		if (option === 'true') {
			if (optionsQuestionShuffled[optionIndex].correct) {
				setContainerCardStyle({
					backgroundColor: hexToRgbA(theme.colors.green, 0.2)
				});
				playSoundSuccess();
				nextQuestion();
			} else {
				incorrectAnswer();
			}
		}

		if (option === 'false') {
			if (optionsQuestionShuffled[optionIndex].correct) {
				incorrectAnswer();
			} else {
				setOptionIndex(optionIndex + 1);
				playSoundSuccess();
			}
			setIsFlipped(false);
			animateNextCard();
		}

		resetContainerStyleOptions();
	};

	const shuffleOptions = (question: PreTaskQuestion) => {
		return shuffleList(question.options);
	};

	const closeModal = () => {
		setShowModal(false);
	};

	const animateNextCard = () => {
		playCardEffect();
		// Fade out the current card
		Animated.timing(cardOpacity, {
			toValue: 0,
			duration: 250,
			useNativeDriver: true
		}).start(() => {
			// Update card position and reset opacity
			cardPosition.setValue(-500);
			cardOpacity.setValue(1);

			// Animate the incoming card
			Animated.timing(cardPosition, {
				toValue: 0,
				duration: 500,
				useNativeDriver: true
			}).start();
		});
	};

	useEffect(() => {
		const animation = Animated.loop(
			Animated.sequence([
				Animated.timing(flipIndicatorAnimation, {
					toValue: 1,
					duration: 800,
					useNativeDriver: true
				}),
				Animated.timing(flipIndicatorAnimation, {
					toValue: 0,
					duration: 800,
					useNativeDriver: true
				})
			])
		);
		animation.start();

		setOptionsQuestionShuffled(
			shuffleOptions(question).map((option, index) => {
				return {
					id: index,
					content: option.content,
					correct: option.correct,
					feedback: option.feedback
				};
			})
		);

		return () => animation.stop();
	}, []);

	if (optionsQuestionShuffled.length === 0) return null;

	return (
		<ScrollView style={styles.scroll}>
			<View
				style={styles.container}
				// accessible={true}
				// accessibilityLabel="Su abuela"
				accessible={false}
			>
				<Instructions
					text="Voltea la tarjeta. ¿La descripción corresponde a la imagen?"
					accessibilityLabel="Se muestra una tarjeta con una imagen. Toca la tarjeta para voltearla, examina la descripción y marca verdadero o falso"
				/>
				<FlipCard
					setIsFlipped={setIsFlipped}
					containerStyle={{
						transform: [{ translateX: cardPosition }],
						opacity: cardOpacity
					}}
					containerCardStyle={containerCardStyle}
					optionIndex={optionIndex}
					optionsQuestionShuffled={optionsQuestionShuffled}
					question={question}
					isFlipped={isFlipped}
				/>
				<View
					style={styles.optionsContainer}
					accessible={true}
					accessibilityLabel="Opciones"
				>
					<Option
						accessibilityLabel="Verdadero"
						containerStyle={containerStyleOptions[0]}
						iconName="check"
						onPress={() => {
							onPressOption('true');
						}}
					/>
					<View style={{ width: 50 }} />
					<Option
						accessibilityLabel="Falso"
						containerStyle={containerStyleOptions[1]}
						iconName="cross"
						onPress={() => {
							onPressOption('false');
						}}
					/>
				</View>
			</View>
			<Modal
				closeModal={closeModal}
				showModal={showModal}
				help={feedback}
			/>
		</ScrollView>
	);
};

const getStyles = (theme: Theme) =>
	StyleSheet.create({
		scroll: {
			backgroundColor: theme.colors.white
		},
		container: {
			backgroundColor: theme.colors.white,
			height: '100%'
		},
		optionsContainer: {
			marginTop: 20,
			width: '100%',
			alignItems: 'center',
			justifyContent: 'center',
			flexDirection: 'row'
		}
	});

export default FlashCards;
