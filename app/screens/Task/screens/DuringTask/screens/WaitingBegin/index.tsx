import { View, Text, StyleSheet, StatusBar } from 'react-native'
import Title from '../../components/Title'
import LottieView from 'lottie-react-native';
import Power from './components/Power';
import Placeholder from './components/Placeholder';

import { useEffect } from 'react';
import useTheme from '@hooks/useTheme'
import useTaskContext from '@hooks/useTaskContext';
import { useDuringTaskContext } from '@hooks/useDuringTaskContext';
import { useNavigation } from '@react-navigation/native';
import useTeam from '@hooks/useTeam';
import usePower from '@hooks/usePower';

import { Theme } from '@theme'
import { SocketEvents } from '@enums/SocketEvents.enum';
import { Power as PowerEnum } from '@enums/Power.enum';

interface Props {
    route: any
}

const WaitingBegin = ({ route }: Props) => {
    const { taskOrder } = route.params
    const theme = useTheme()
    const { resetContext, setProgress, setHeaderColor, setHeaderComplementaryColor } = useTaskContext()
    const { socket, power, setPower, numQuestions } = useDuringTaskContext()
    const { data, loading, getMyTeam } = useTeam()
    const navigation = useNavigation<any>()
    const { rollPower, loading: loadingPower } = usePower()

    const getData = async () => {
        await getMyTeam()
    }

    const handleReRoll = async () => {
        await rollPower()
    }

    useEffect(() => {
        setProgress(0.01)
        setHeaderColor('white')
        setHeaderComplementaryColor('darkGreen')
        getData()

        socket.on(SocketEvents.sessionTeacherStart, () => {
            if (numQuestions) setProgress(1 / numQuestions)
            navigation.navigate('Question', { taskOrder, questionOrder: 1 })
        })

        socket.on(SocketEvents.teamStudentUpdate, (data: { power: PowerEnum }) => {
            setPower(data.power)
        })

        return () => {
            socket.off(SocketEvents.sessionTeacherStart)
            socket.off(SocketEvents.teamStudentUpdate)
        }
    }, [])

    if (!data || loading || !power) return <Placeholder />

    return (
        <>
            <StatusBar backgroundColor={theme.colors.white} barStyle="dark-content" />
            <View
                style={getStyles(theme).container}
                accessible
                accessibilityLabel="Pantalla de espera para comenzar la actividad"
            >
                <Title text={data.name} />
                <Text
                    style={getStyles(theme).title}
                    accessible
                    accessibilityRole="header"
                    accessibilityLabel="Instrucciones"
                >
                    Instrucciones
                </Text>
                <Text
                    style={getStyles(theme).description}
                    accessible
                    accessibilityLabel="Avanza respondiendo a las preguntas con ayuda de tus amigos. El primer equipo en llegar a la meta gana."
                >
                    Avanza respondiendo a las preguntas con ayuda de tus amigos. El primer equipo en llegar a la meta gana.
                </Text>
                <Text
                    style={getStyles(theme).title}
                    accessible
                    accessibilityRole="header"
                    accessibilityLabel="Tu super poder es"
                >
                    Tu super poder es
                </Text>
                <Power
                    power={power}
                    onReRoll={() => { handleReRoll() }}
                    loading={loadingPower}
                    blockReRoll={data.students.length >= 3}
                />
                <LottieView
                    source={require('@animations/waitingBegin.json')}
                    autoPlay
                    loop
                    style={getStyles(theme).animation}
                />
                <Text
                    style={getStyles(theme).waitingText}
                    accessible
                    accessibilityLabel="Espera a que tu profesor de comienzo a la actividad..."
                >
                    Espera a que tu profesor de comienzo a la actividad...
                </Text>
            </View>
        </>
    );
}

const getStyles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.colors.primary,
            height: '100%',
            flex: 1,
            alignItems: 'center',
        },
        animation: {
            width: 300,
            height: 300,
        },
        title: {
            color: theme.colors.black,
            fontSize: theme.fontSize.large,
            fontFamily: theme.fontWeight.bold,
            letterSpacing: theme.spacing.medium,
            paddingHorizontal: 20,
            alignSelf: 'flex-start',
        },
        description: {
            color: theme.colors.black,
            fontSize: theme.fontSize.medium,
            fontFamily: theme.fontWeight.regular,
            letterSpacing: theme.spacing.medium,
            width: '100%',
            paddingHorizontal: 20,
            marginBottom: 20,
        },
        waitingText: {
            color: theme.colors.black,
            fontSize: theme.fontSize.xl,
            fontFamily: theme.fontWeight.bold,
            letterSpacing: theme.spacing.medium,
            paddingHorizontal: 20,
            marginBottom: 20,
            textAlign: 'center',
        }
    })

export default WaitingBegin