import React, { createContext, useContext, useState, useEffect } from 'react'

export const Context = createContext()

export const StateContext = ({children}) => {
    const [isPlaying, setIsPlaying] = useState(true)

    return (
        <Context.Provider value={{
            isPlaying,
            setIsPlaying
        }}>
            {children}
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context)