import { Dispatch, SetStateAction, createContext, useState, useEffect } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign'

interface TaskContextProps {
    progress?: number;
    setProgress: Dispatch<SetStateAction<number | undefined>>;
    phaseCompleted: boolean;
    setPhaseCompleted: Dispatch<SetStateAction<boolean>>;
    onPressNext: () => void;
    setOnPressNext: Dispatch<SetStateAction<() => void>>;
    resetContext: () => void;
    icon?: keyof typeof AntDesign.glyphMap;
    setIcon: Dispatch<SetStateAction<keyof typeof AntDesign.glyphMap>>;
    taskOrder: number;
    setTaskOrder: Dispatch<SetStateAction<number>>;
    state: 'pre' | 'during' | 'post';
    setState: Dispatch<SetStateAction<'pre' | 'during' | 'post'>>;
    totalQuestions?: number;
    setTotalQuestions: Dispatch<SetStateAction<number | undefined>>;
}

const TaskContext = createContext<TaskContextProps | null>(null);

const TaskProvider = ({ children }: { children: React.ReactNode }) => {
    const [progress, setProgress] = useState<number | undefined>(undefined);
    const [phaseCompleted, setPhaseCompleted] = useState(false);
    const [onPressNext, setOnPressNext] = useState<() => void>(() => () => { });
    const [icon, setIcon] = useState<keyof typeof AntDesign.glyphMap>('closecircle');
    const [taskOrder, setTaskOrder] = useState(0);
    const [state, setState] = useState<'pre' | 'during' | 'post'>('pre');
    const [totalQuestions, setTotalQuestions] = useState<number | undefined>(undefined);

    const resetContext = () => {
        setProgress(undefined);
        setPhaseCompleted(false);
        setOnPressNext(() => () => { });
    };

    return (
        <TaskContext.Provider
            value={{
                progress,
                setProgress,
                phaseCompleted,
                setPhaseCompleted,
                onPressNext,
                setOnPressNext,
                resetContext,
                icon,
                setIcon,
                taskOrder,
                setTaskOrder,
                state,
                setState,
                totalQuestions,
                setTotalQuestions,
            }}>
            {children}
        </TaskContext.Provider>
    );
};

export { TaskContext, TaskProvider };
