import { View, Text, StyleSheet } from 'react-native';
import Title from '../../components/Title';
import Power from './components/Power';
import ReadyButton from './components/ReadyButton';

import { useEffect } from 'react';
import useTaskContext from '@app/core/hooks/Task/useTaskContext';
import useTheme from '@hooks/useTheme';

import { Theme } from '@theme';
import { PowerStatus } from '@enums/PowerStatus.enum';

const ChoosePower = () => {
	const theme = useTheme();
	const { resetContext } = useTaskContext();
	const styles = getStyles(theme);

	useEffect(() => {
		resetContext();
	}, []);

	//MOCK DATA
	const groupName = 'Grupo 1';

	return (
		<View style={styles.container}>
			<Text style={styles.text}>{groupName}</Text>
			<Title text={'Elige tu poder'} />
			<Power
				title="Memory Pro"
				image={require('@images/memoryPro.png')}
				description="Puede recordar la traducción de los sustantivos"
				status={PowerStatus.Disponible}
			/>
			<Power
				title="Super radar"
				image={require('@images/superRadar.png')}
				description="Puede recordar la traducción de las preposiciones"
				status={PowerStatus.Conflicto}
				people={['Leonardo Vergara', 'Leonardo Lizcano']}
			/>
			<Power
				title="Super hearing"
				image={require('@images/superHearing.png')}
				description="Puede recordar lo que el guía dijo"
				status={PowerStatus.Seleccionado}
			/>
			<ReadyButton />
		</View>
	);
};

const getStyles = (theme: Theme) =>
	StyleSheet.create({
		container: {
			backgroundColor: theme.colors.white,
			height: '100%'
		},
		text: {
			color: theme.colors.black,
			fontSize: theme.fontSize.xxl,
			fontFamily: theme.fontWeight.regular,
			letterSpacing: theme.spacing.medium,
			paddingHorizontal: 20,
			// marginBottom: 20,
			textAlign: 'center'
		}
	});

export default ChoosePower;
