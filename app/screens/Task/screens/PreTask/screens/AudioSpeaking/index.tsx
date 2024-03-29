import {
	View,
	Text,
	StyleSheet,
	AccessibilityInfo,
	ScrollView
} from 'react-native';
import Record from '@screens/Task/components/Record';
import AudioPlayer from '@screens/Task/components/AudioPlayer';
import ButtonPrimary from '@components/ButtonPrimary';

import React, { useEffect, useState } from 'react';
import useTheme from '@hooks/useTheme';
import usePreTask from '@hooks/Task/PreTask/usePreTask';
import useTextToSpeech from '@hooks/useTextToSpeech';
import useRecord from '@app/core/hooks/Task/PosTask/useRecord';

import { Theme } from '@theme';
import { PreTaskQuestion } from '@interfaces/PreTaskQuestion.interface';
import Instructions from '../../components/Instructions';
import usePlaySound from '@app/core/hooks/usePlaySound';

interface Props {
	route: any;
}

const CONFIRM_TEXT_STYLE_DEFAULT = (theme: Theme) => {
	return {
		fontFamily: theme.fontWeight.regular,
		fontSize: theme.fontSize.xl
	};
};

const AudioSpeaking = ({ route }: Props) => {
	const { question } = route.params as {
		question: PreTaskQuestion;
		taskOrder: number;
	};
	const theme = useTheme();
	const styles = getStyles(theme);
	const words = question.content.split(' ');
	const { stopAudio } = useRecord();

	const { nextQuestion } = usePreTask();
	const { speak } = useTextToSpeech();
	const [recorded, setRecorded] = useState(false);
	const [hasConfirm, setHasConfirm] = useState(false);
	const [confirmContainerStyle, setConfirmContainerStyle] = useState({});
	const [confirmTextStyle] = useState(CONFIRM_TEXT_STYLE_DEFAULT(theme));
	const playSoundSuccess = usePlaySound(require('@sounds/success.wav'));

	const handlePressConfirm = () => {
		playSoundSuccess();
		setConfirmContainerStyle({ backgroundColor: theme.colors.green });
		setHasConfirm(true);
	};

	useEffect(() => {
		if (hasConfirm) {
			stopAudio();
			nextQuestion();
		}
	}, [hasConfirm]);

	useEffect(() => {
		AccessibilityInfo.announceForAccessibility(question.content);
		speak(question.content, question.lang);
	}, []);

	return (
		<ScrollView style={styles.scroll}>
			<View style={styles.container}>
				<View>
					<Instructions
						text="Grábate diciendo la frase"
						accessibilityLabel="Escucha la frase y grábate diciéndola"
					/>
					<Text
						style={styles.question}
						accessibilityLabel={`Frase: ${question.content}`}
					>
						{words.map((word, index) => {
							return <Text key={index}>{word} </Text>;
						})}
					</Text>
					<AudioPlayer
						textToSpeech={question.content}
						lang={question.lang}
					/>
					<Text style={styles.title} accessibilityLabel="Grabación">
						Grabación
					</Text>
					<View style={styles.secondaryContainer}>
						<Record
							blocked={false}
							minimumTime={1000}
							setRecorded={setRecorded}
							setRecording={() => {}}
							maximumTime={60000}
						/>
					</View>
				</View>
				{recorded && (
					<View>
						<ButtonPrimary
							text="Confirmar"
							onPress={handlePressConfirm}
							containerStyle={confirmContainerStyle}
							textStyle={confirmTextStyle}
						/>
						<View style={styles.safeSpace} />
					</View>
				)}
			</View>
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
			height: '100%',
			justifyContent: 'space-between',
			flex: 1
		},
		subtitle: {
			color: theme.colors.black,
			fontSize: theme.fontSize.small,
			fontFamily: theme.fontWeight.regular,
			letterSpacing: theme.spacing.medium,
			textAlign: 'center',
			width: 250,
			marginHorizontal: 20,
			marginTop: 30
		},
		secondaryContainer: {
			backgroundColor: theme.colors.white,
			justifyContent: 'center',
			alignItems: 'center'
		},
		title: {
			color: theme.colors.black,
			fontSize: theme.fontSize.xxl,
			fontFamily: theme.fontWeight.bold,
			letterSpacing: theme.spacing.medium,
			marginRight: 10,
			marginHorizontal: 20,
			marginTop: 30,
			marginBottom: 50
		},
		question: {
			fontSize: theme.fontSize.xxl,
			color: theme.colors.black,
			fontFamily: theme.fontWeight.regular,
			letterSpacing: theme.spacing.medium,
			marginHorizontal: 20
		},
		safeSpace: {
			height: 80
		}
	});

export default AudioSpeaking;
