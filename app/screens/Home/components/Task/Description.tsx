import { View, Text, StyleSheet } from 'react-native';

import useTheme from '@hooks/useTheme';
import { Theme } from '@theme';

interface DescriptionProps {
	text: string;
}

const Description = ({ text }: DescriptionProps) => {
	const theme = useTheme();
	const styles = getStyles(theme);

	return (
		<View>
			<Text style={styles.description}>{text}</Text>
		</View>
	);
};

const getStyles = (theme: Theme) =>
	StyleSheet.create({
		description: {
			fontFamily: theme.fontWeight.regular,
			color: theme.colors.black,
			letterSpacing: theme.spacing.medium,
			fontSize: theme.fontSize.small
		}
	});

export default Description;
