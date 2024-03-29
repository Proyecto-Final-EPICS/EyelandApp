import { Text, StyleSheet } from 'react-native';
import Pressable from './Pressable';
import { Theme } from '@theme';
import { Animated, Easing } from 'react-native';

import useTheme from '@hooks/useTheme';
import usePlaySound from '@hooks/usePlaySound';

interface Props {
	onPress: () => void;
	accessibilityLabel?: string;
}

const ContinueButton = ({ onPress, accessibilityLabel }: Props) => {
	const theme = useTheme();
	const scaleValue = new Animated.Value(1);
	const playSound = usePlaySound(require('@assets/sounds/success.wav'));
	const styles = getStyles(theme);

	const scaleButton = () => {
		Animated.timing(scaleValue, {
			toValue: 0.95,
			duration: 200,
			easing: Easing.linear,
			useNativeDriver: true
		}).start(() => {
			Animated.timing(scaleValue, {
				toValue: 1,
				duration: 200,
				easing: Easing.linear,
				useNativeDriver: true
			}).start(() => {
				playSound();
				onPress();
			});
		});
	};

	return (
		<Pressable
			onPress={() => {
				scaleButton();
			}}
			accessibilityLabel={accessibilityLabel}
		>
			<Animated.View style={{ transform: [{ scale: scaleValue }] }}>
				<Text style={styles.text}>Siguiente</Text>
			</Animated.View>
		</Pressable>
	);
};

const getStyles = (theme: Theme) =>
	StyleSheet.create({
		text: {
			color: theme.colors.black,
			fontSize: theme.fontSize.large,
			fontFamily: theme.fontWeight.bold
		}
	});

export default ContinueButton;
