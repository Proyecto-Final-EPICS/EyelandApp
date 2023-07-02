import { StyleSheet, Text, View } from 'react-native';

import React from 'react';
import { Theme } from '@theme';
import useTheme from '@hooks/useTheme';

interface Props {
	text: string;
}

const Instructions = ({ text }: Props) => {
	const theme = useTheme();
	const styles = getStyles(theme);

	return (
		<View
			style={styles.container}
			accessible={true}
			accessibilityLabel={`Instrucciones: ${text}`}
		>
			<Text style={styles.text}>{text}</Text>
			<View style={styles.line}></View>
		</View>
	);
};

const getStyles = (theme: Theme) =>
	StyleSheet.create({
		container: {
			marginHorizontal: 20,
			marginBottom: 20
		},
		text: {
			color: theme.colors.black,
			fontSize: theme.fontSize.large,
			fontFamily: theme.fontWeight.bold
		},
		line: {
			backgroundColor: theme.colors.black,
			height: 2,
			width: '100%',
			marginTop: 3,
			borderRadius: theme.borderRadius.medium,
			opacity: 0.1
		}
	});

export default Instructions;
