import { createContext, ReactNode, useReducer, useState } from "react";
import { addNewCycleAction, InterruptCurrentCycleAction, markCurrentCyclesAsFinishedAction } from "../reducers/cycles/actions";
import { Cycle, cyclesReducer } from "../reducers/cycles/reducer";

interface CreateCycleData {
    task: string;
    minutesAmount: number
}

interface CyclesContextType {
    cycles: Cycle[];
    activeCycle: Cycle | undefined;
    activeCycleId: string | null;
    amountSecondsPassed: number;
    markCurrentCyclesAsFinished: () => void;
    setSecondsPassed: (seconds: number) => void;
    CreateNewCycle: (data: CreateCycleData) => void;
    InterruptCurrentCycle: () => void;

}

interface CyclesContextProviderProps {
    children: ReactNode
}

export const CyclesContext = createContext({} as CyclesContextType)


export function CyclesContextProvider({ children }: CyclesContextProviderProps) {

    const [cyclesState, dispatch] = useReducer(cyclesReducer, {
        cycles: [],
        activeCycleId: null,
    })

    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

    const { cycles, activeCycleId } = cyclesState

    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

    function setSecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds)
    }

    function CreateNewCycle(data: CreateCycleData) {

        const id = String(new Date().getTime())

        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date()
        }

        dispatch(addNewCycleAction(newCycle))
        setAmountSecondsPassed(0)
    }

    function markCurrentCyclesAsFinished() {
        dispatch(markCurrentCyclesAsFinishedAction())
    }

    function InterruptCurrentCycle() {
        dispatch(InterruptCurrentCycleAction())
    }


    return (
        <CyclesContext.Provider
            value={{
                cycles,
                activeCycle,
                activeCycleId,
                markCurrentCyclesAsFinished,
                amountSecondsPassed,
                setSecondsPassed,
                CreateNewCycle,
                InterruptCurrentCycle
            }}
        >

            {children}
        </CyclesContext.Provider>
    )
}