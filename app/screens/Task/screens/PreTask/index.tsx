import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import Header from "../../components/Header";

import Loading from "./screens/Loading";
import MultipleChoice from "./screens/MultipleChoice";
import FillBlank from "./screens/FillBlank";
import FlashCards from "./screens/FlashCards";
import Order from "./screens/Order";

import PreTaskProvider from "@contexts/PreTaskContext";

import useTaskContext from "@hooks/useTaskContext";

interface Props {
    route: any
}

const Stack = createNativeStackNavigator();

const PreTask = ({ route }: Props) => {
    const { progress } = useTaskContext()

    const optionsPrimary: NativeStackNavigationOptions = {
        animation: "slide_from_right",
        headerBackVisible: false,
        headerShown: false,
    }

    return (
        <PreTaskProvider>
            <Stack.Navigator>
                <Stack.Screen
                    name="Loading"
                    options={{
                        ...optionsPrimary,
                    }}
                    initialParams={{
                        taskOrder: route.params.taskOrder,
                    }}
                    component={Loading}
                />
                <Stack.Screen
                    name="MultipleChoice"
                    options={{
                        ...optionsPrimary,
                    }}
                    initialParams={{
                        question: null,
                    }}
                    component={MultipleChoice}
                />
                <Stack.Screen
                    name="FillBlank"
                    options={{
                        ...optionsPrimary,
                    }}
                    initialParams={{
                        question: null,
                    }}
                    component={FillBlank}
                />
                <Stack.Screen
                    name="FlashCards"
                    options={{
                        ...optionsPrimary,
                    }}
                    initialParams={{
                        question: null,
                    }}
                    component={FlashCards}
                />
                <Stack.Screen
                    name="Order"
                    options={{
                        ...optionsPrimary,
                    }}
                    initialParams={{
                        question: null,
                    }}
                    component={Order}
                />
                {/* <Stack.Screen
                name="PreTask"
                options={{
                    ...optionsPrimary,
                }}
                initialParams={{
                    taskOrder: route.params.taskOrder,
                    questionOrder: 0,
                }}
                component={PreTask}
            /> */}
            </Stack.Navigator>
        </PreTaskProvider>
    )
}

export default PreTask