import { View, Text, StyleSheet, Platform } from 'react-native';
import LottieView from 'lottie-react-native';
import ButtonPrimary from '@components/ButtonPrimary';

import { useEffect } from 'react';
import useTaskContext from '@app/core/hooks/Task/useTaskContext';
import useTheme from '@hooks/useTheme';
import usePreTask from '@app/core/hooks/Task/PreTask/usePreTask';
import { useNavigation } from '@react-navigation/native';
import usePlaySound from '@app/core/hooks/usePlaySound';

import { Theme } from '@theme';

const Complete = () => {
	const theme = useTheme();
	const { setPreTaskComplete } = usePreTask();
	const { taskOrder } = useTaskContext();
	const navigation = useNavigation<any>();
	const playSoundSuccess = usePlaySound(require('@sounds/complete.wav'));
	const styles = getStyles(theme);
	const currentPlatform = Platform.OS;

	const onButtonPress = () => {
		navigation.reset({
			index: 0,
			routes: [{ name: 'Introduction', params: { taskOrder } }]
		});
	};

	useEffect(() => {
		setPreTaskComplete({ taskOrder });
		playSoundSuccess();
	}, []);

	return (
		<View style={styles.container}>
			<View>
				{currentPlatform !== 'web' && (
					<LottieView
						source={require('@animations/celebration.json')}
						autoPlay
						loop
						style={{
							width: 500,
							position: 'absolute',
							top: -80,
							alignItems: 'center',
							alignSelf: 'center'
						}}
					/>
				)}
				<Text style={styles.text}>¡Felicidades, lo lograste!</Text>
			</View>
			{currentPlatform !== 'web' && (
				<LottieView
					source={require('@animations/star.json')}
					autoPlay
					loop={false}
					duration={2000}
				/>
			)}
			<View>
				<ButtonPrimary
					text="Volver al menú"
					accessibilityHint="Volver al menú"
					onPress={onButtonPress}
					containerStyle={{}}
					textStyle={{
						fontFamily: theme.fontWeight.regular,
						fontSize: theme.fontSize.xl
					}}
				/>
				<View style={styles.safeSpace} />
			</View>
		</View>
	);
};

const getStyles = (theme: Theme) =>
	StyleSheet.create({
		container: {
			backgroundColor: theme.colors.white,
			height: '100%',
			justifyContent: 'space-between'
		},
		text: {
			fontSize: theme.fontSize.xxxxxxl,
			fontFamily: theme.fontWeight.bold,
			color: theme.colors.black,
			letterSpacing: theme.spacing.medium,
			marginHorizontal: 20,
			marginTop: 20,
			textAlign: 'center'
		},
		safeSpace: {
			height: 80
		},
		animationsContainer: {
			alignItems: 'center',
			position: 'relative'
		}
	});

export default Complete;
