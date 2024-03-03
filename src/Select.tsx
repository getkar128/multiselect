import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './select.module.css'

type SelectOption ={
    label: string
    value: string | number
}

type MultipleSelectProps = {
    multiple: true
    value: SelectOption[]
    onChange: (value: SelectOption[]) => void
}

type SingleSelectProps = {
    multiple?: false
    value?: SelectOption
    onChange: (value: SelectOption | undefined) => void
}

type SelectProps = {
    options: SelectOption[]
} & (SingleSelectProps | MultipleSelectProps)

const Select = ({ multiple, value, onChange, options }: SelectProps) => {

    const [ isOpen, setIsOpen ] = useState(false)
    const [ highlightedIndex, setHighlightedIndex ] = useState(0)

    const containerRef = useRef<HTMLDivElement>(null)

    const clearOptions = () => {
        multiple ? onChange([]) : onChange(undefined)
    }

    const selectOption = useCallback((option: SelectOption) => {
        if (multiple){
            if (value.includes(option)){
                onChange(value.filter(o => o !== option))
            }else{
                onChange([...value, option])
            }
        }else{
            if (option !== value){
                onChange(option)
            }
        }
    }, [multiple, onChange, value])

    const isOptionsSelected = (option: SelectOption) => {
        return multiple ? value.includes(option) : option === value
    }

    useEffect(() => {
        if (isOpen) {
            setHighlightedIndex(0)
        }
    }, [isOpen])

    useEffect(() => {
        const currentRef = containerRef.current

        const handler = (e: KeyboardEvent) => {
            if (e.target !== containerRef.current) return

            switch (e.code){
                case "Enter":
                case "Space":
                    setIsOpen(prev => !prev)
                    if (isOpen) selectOption(options[highlightedIndex])
                    break
                case "ArrowUp":
                case "ArrowDown":{
                    if (!isOpen){
                        setIsOpen(true)
                    }
                    const newValue = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1)
                    if (newValue >= 0 && newValue < options.length){
                        setHighlightedIndex(newValue)
                    }
                    break
                }
                case "Escape":
                    setIsOpen(false)
                    break
                default:
                    break
            }
        }

        containerRef.current?.addEventListener("keydown", handler)

        return () => {
            if (currentRef){
                currentRef?.removeEventListener("keydown", handler)
            }
        }
    }, [highlightedIndex, isOpen, options, selectOption])

    return (
        <div
            ref={containerRef}
            onBlur={() => setIsOpen(false)} 
            onClick={() => setIsOpen(prev => !prev)} 
            tabIndex={0} 
            className={styles.conatiner}
        >
            <span className={styles.value}>{multiple ? value.map(v => (
                <button 
                    key={v.value}
                    onClick={e => {
                        e.stopPropagation()
                        selectOption(v)
                    }}
                    className={styles["option-badge"]}
                >
                    {v.label}
                    <span className={styles["remove-btn"]}>&times;</span>
                </button>
            )) : value?.label}</span>
            <button 
                onClick={e => {
                    e.stopPropagation()
                    clearOptions()
                }} 
                className={styles["clear-btn"]}
            >
                &times;
            </button>
            <div className={styles.divider}></div>
            <div className={styles.caret}></div>
            <ul className={`${styles.options} ${isOpen ? styles.show : ''}`}>
                {options.map((option, index) => (
                    <li 
                        onClick={e => {
                            e.stopPropagation()
                            selectOption(option)
                            setIsOpen(false)
                        }}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        key={index} 
                        className={`${styles.option} ${isOptionsSelected(option) ? styles.selected : ''} ${index === highlightedIndex ? styles.highlighted : ""}`}
                    >
                        {option.label}
                    </li>
                ))}
            </ul>
            
        </div>
    )
}

export default Select