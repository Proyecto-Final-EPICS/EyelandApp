import {
	View,
	StyleSheet,
	ActivityIndicator,
	Platform,
	Text
} from 'react-native';
import ErrorScreen from '@components/ErrorScreen';
import LottieView from 'lottie-react-native';

import React, { useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import usePreTask from '@app/core/hooks/Task/PreTask/usePreTask';
import useTheme from '@hooks/useTheme';
import usePreTaskContext from '@app/core/hooks/Task/PreTask/usePreTaskContext';

import { Theme } from '@theme';

const Loading = ({ route }: { route: any }) => {
	const { taskOrder } = route.params;
	const theme = useTheme();
	const { getPreTask, data, error, loading, nextQuestion } = usePreTask();
	const { setData, data: dataContext } = usePreTaskContext();
	const styles = getStyles(theme);
	const currentPlatform = Platform.OS;

	useFocusEffect(
		useCallback(() => {
			const getQuestion = async () => {
				const data = await getPreTask({ taskOrder });
				if (data) {
					setData(data);
				}
			};
			getQuestion();
		}, [])
	);

	useEffect(() => {
		if (dataContext) {
			nextQuestion();
		}
	}, [dataContext]);

	if (error)
		return (
			<ErrorScreen
				error={error}
				retryAction={() => {
					getPreTask({ taskOrder });
				}}
			/>
		);

	return (
		<View style={styles.container}>
			<View accessible={true} accessibilityLabel="Cargando">
				{currentPlatform !== 'web' ? (
					<LottieView
						source={require('@animations/loading.json')}
						autoPlay
						loop
						style={styles.animation}
					/>
				) : (
					<ActivityIndicator
						size={50}
						color={theme.colors.black}
						style={styles.animation}
					/>
				)}
			</View>
		</View>
	);
};

const getStyles = (theme: Theme) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: theme.colors.white,
			justifyContent: 'center'
		},
		animation: {
			width: 200,
			height: 200,
			alignSelf: 'center'
		}
	});

export default Loading;
