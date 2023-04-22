import {
	View,
	Text,
	StyleSheet,
	StyleProp,
	ViewStyle,
	TextStyle
} from 'react-native';
import Pressable from '@components/Pressable';

import useTheme from '@hooks/useTheme';

import { Theme } from '@theme';

interface Props {
	text: string;
	onPress: () => void;
	containerStyle: StyleProp<ViewStyle>;
	textStyle: StyleProp<TextStyle>;
}

const Option = ({ text, onPress, containerStyle, textStyle }: Props) => {
	const theme = useTheme();
	const styles = getStyles(theme);

	const containerStyles = StyleSheet.flatten([
		styles.container,
		containerStyle
	]);

	const textStyles = StyleSheet.flatten([styles.text, textStyle]);

	return (
		<Pressable style={containerStyles} onPress={onPress}>
			<Text style={textStyles}>{text}</Text>
		</Pressable>
	);
};

const getStyles = (theme: Theme) =>
	StyleSheet.create({
		container: {
			backgroundColor: theme.colors.black,
			marginHorizontal: 20,
			marginBottom: 20,
			borderRadius: theme.borderRadius.medium,
			paddingVertical: 10,
			justifyContent: 'center',
			alignItems: 'center',
			...theme.shadow
		},
		text: {
			color: theme.colors.white,
			fontSize: theme.fontSize.xxl,
			fontFamily: theme.fontWeight.medium,
			letterSpacing: theme.spacing.medium,
			marginHorizontal: 10
		}
	});

export default Option;
