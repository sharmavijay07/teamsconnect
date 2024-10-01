import React, { createContext, useState } from 'react'

export const PurposeContext = createContext(null)
export const PurposeContextProvider = ({children}) => {

    const [activeSection, setActiveSection] = useState("chat"); // State to track active section

    return(
        <PurposeContext.Provider
    value={{
        activeSection,
        setActiveSection
    }}
    >
        {children}
    </PurposeContext.Provider>
    )
}