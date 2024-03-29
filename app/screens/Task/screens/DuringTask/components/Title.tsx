import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

import useTheme from '@hooks/useTheme';

import { Theme } from '@theme';

interface Props {
	text: string;
}

const Title = ({ text }: Props) => {
	const theme = useTheme();
	const styles = getStyles(theme);

	return (
		<View style={styles.container}>
			<Text style={styles.text}>{text}</Text>
		</View>
	);
};

const getStyles = (theme: Theme) =>
	StyleSheet.create({
		container: {
			backgroundColor: theme.colors.white,
			justifyContent: 'center'
		},
		text: {
			color: theme.colors.black,
			fontSize: theme.fontSize.xxxxl,
			fontFamily: theme.fontWeight.bold,
			letterSpacing: theme.spacing.medium,
			paddingHorizontal: 20,
			marginBottom: 10,
			textAlign: 'center'
		}
	});

export default Title;
