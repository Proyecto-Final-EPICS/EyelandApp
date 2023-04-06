import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Instructions from '../../components/Instructions';
import * as Haptics from 'expo-haptics';
import FlipCard from './components/FlipCard';
import Option from './components/Option';

import useTheme from '@hooks/useTheme';
import usePlaySound from '@hooks/usePlaySound';

import { Theme } from '@theme';
import { PreTaskQuestion } from '@interfaces/PreTaskQuestion.interface';

import { hexToRgbA } from '@utils/hexToRgba';
import { shuffleList } from '@utils/shuffleList';

interface Props {
    route: any;
}

const FlashCards = ({ route }: Props) => {
    const { question, taskOrder } = route.params as { question: PreTaskQuestion; taskOrder: number };
    const theme = useTheme();
    const [optionIndex, setOptionIndex] = useState<number>(0);
    const [isFlipped, setIsFlipped] = useState<boolean>(false);
    const [optionsQuestionShuffled, setOptionsQuestionShuffled] = useState<{ content: string, correct: boolean, id: number }[]>([]);
    const [containerStyleOptions, setContainerStyleOptions] = useState([{}])
    const [containerCardStyle, setContainerCardStyle] = useState({})
    const playSoundSuccess = usePlaySound(require('@sounds/success.wav'))
    const playSoundWrong = usePlaySound(require('@sounds/wrong.wav'))
    const flipIndicatorAnimation = useRef(new Animated.Value(0)).current;
    const cardPosition = useRef(new Animated.Value(0)).current;
    const cardOpacity = useRef(new Animated.Value(1)).current;


    const updateStyles = (option: 'true' | 'false') => {
        const color = option === 'true' ? theme.colors.green : theme.colors.red;
        const updatedContainerStyleOptions = {
            ...containerStyleOptions,
            [option === 'true' ? 0 : 1]: { backgroundColor: color },
        };
        setContainerStyleOptions(updatedContainerStyleOptions);
    }

    const resetContainerStyleOptions = () => {
        setTimeout(() => {
            setContainerStyleOptions([{}]);
            setContainerCardStyle({});
        }, 1000);
    }

    const onPressOption = (option: 'true' | 'false') => {
        updateStyles(option);

        if (option === 'true') {
            if (optionsQuestionShuffled[optionIndex].correct) {
                setContainerCardStyle({ backgroundColor: hexToRgbA(theme.colors.green, 0.2) });
                playSoundSuccess();
                // TODO - Go to next question
            } else {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                playSoundWrong();
                setContainerCardStyle({ backgroundColor: hexToRgbA(theme.colors.red, 0.2) });
            }
        }

        if (option === 'false') {
            if (optionsQuestionShuffled[optionIndex].correct) {
                setOptionIndex(0);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                playSoundWrong();
                setContainerCardStyle({ backgroundColor: hexToRgbA(theme.colors.red, 0.2) });
                setOptionsQuestionShuffled(shuffleOptions(question).map((option, index) => {
                    return {
                        id: index,
                        content: option.content,
                        correct: option.correct,
                    };
                }));
            } else {
                setOptionIndex(optionIndex + 1);
                playSoundSuccess();
            }
            setIsFlipped(false);
            animateNextCard();
        }

        resetContainerStyleOptions();
    }

    const shuffleOptions = (question: PreTaskQuestion) => {
        return shuffleList(question.options);
    }

    const animateNextCard = () => {
        // Fade out the current card
        Animated.timing(cardOpacity, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
        }).start(() => {
            // Update card position and reset opacity
            cardPosition.setValue(-500);
            cardOpacity.setValue(1);

            // Animate the incoming card
            Animated.timing(cardPosition, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start();
        });
    };


    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(flipIndicatorAnimation, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(flipIndicatorAnimation, {
                    toValue: 0,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ]),
        );
        animation.start();

        setOptionsQuestionShuffled(shuffleOptions(question).map((option, index) => {
            return {
                id: index,
                content: option.content,
                correct: option.correct,
            };
        }));

        return () => animation.stop();
    }, []);

    if (optionsQuestionShuffled.length === 0) return null;

    return (
        <View
            style={getStyles(theme).container}
            accessible={true}
            accessibilityLabel="Pantalla de tarjetas">
            <Instructions text='Voltea la tarjeta, ¿es correcta?' />
            <FlipCard
                setIsFlipped={setIsFlipped}
                containerStyle={{ transform: [{ translateX: cardPosition }], opacity: cardOpacity }}
                containerCardStyle={containerCardStyle}
                optionIndex={optionIndex}
                optionsQuestionShuffled={optionsQuestionShuffled}
                question={question}
                isFlipped={isFlipped} />
            <View
                style={getStyles(theme).optionsContainer}
                accessible={true}
                accessibilityLabel="Opciones">
                <Option
                    accessibilityLabel='Correcto'
                    containerStyle={containerStyleOptions[0]}
                    iconName='check'
                    onPress={() => { onPressOption('true') }} />
                <View style={{ width: 50 }} />
                <Option
                    accessibilityLabel='Incorrecto'
                    containerStyle={containerStyleOptions[1]}
                    iconName='cross'
                    onPress={() => { onPressOption('false') }} />
            </View>
        </View>
    );
};

const getStyles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.colors.primary,
            height: '100%',
        },
        optionsContainer: {
            marginTop: 20,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
        }
    });

export default FlashCards;