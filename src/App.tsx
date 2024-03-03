import { useState } from "react"
import Select from "./Select"

type SelectOption ={
    label: string
    value: string | number
}

const options = [
    {
        label: "First",
        value: 1
    },
    {
        label: "Second",
        value: 2
    },
    {
        label: "Three",
        value: 3
    },
    {
        label: "Four",
        value: 4
    },
    {
        label: "Five",
        value: 5
    },
    {
        label: "Six",
        value: 6
    },
]


const App = () => {

    const [ value1, setValue1 ] = useState<SelectOption | undefined>(options[0])
    const [ value2, setValue2 ] = useState<SelectOption[]>([options[0]])

    return (
        <>
            <Select
                multiple
                options={options}
                value={value2}
                onChange={(o) => setValue2(o)}
            />
            <br />
            <Select
                options={options}
                value={value1}
                onChange={(o) => setValue1(o)}
            />
        </>
    )
}

export default App