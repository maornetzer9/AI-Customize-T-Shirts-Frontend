import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSnapshot } from 'valtio'

import config from '../config/config';
import state from '../store'

import { download, logoShirt, stylishShirt } from '../assets'
import { downloadCanvasToImage, reader } from '../config/helpers';
import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants'
import { fadeAnimation, slideAnimation } from '../config/motion'
import { AIPicker, ColorPicker, FilePicker, CustomButton, Tab } from '../components'


const Customizer = () => {

    const snap = useSnapshot(state)

    const [ file, setFile ] = useState('')
    const [ prompt, setPrompt ] = useState('')
    const [ generatingImg, setGeneratingImg ] = useState(false)
    const [ activeEditorTab, setActiveEditorTab ] = useState("")
    const [ activeFilterTab, setActiveFilterTab ] = useState({logoShirt: true, stylishShirt: false});
    const openAIApi = import.meta.env.VITE_OPENAI_API

    // show tab content depending on the activeTab
    const generateTabContent = () => {
        switch(activeEditorTab)
        {
            case "colorpicker":  return <ColorPicker/>
            case "filepicker" :  
            return <FilePicker 
                        file={file} 
                        setFile={setFile} 
                        readFile={readFile}
                    />
            case "aipicker"   :  
            return <AIPicker
                        prompt={prompt}
                        setPrompt={setPrompt}
                        generatingImg={generatingImg}
                        handleSubmit={handleSubmit}
                    />
            default : return null;
        }
    }

    const handleSubmit = async (type)=> {
        if(!prompt) return alert('Please enter prompt');

        try
        {
            // call our backend to generate an ai image!
            const method = 'POST'
            const headers = {"Content-Type":'Application/json'}; 
            const body = JSON.stringify({ prompt });

            const response = await fetch(openAIApi , { method, headers, body });
            const response_result = await response.json();
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const { image } = response_result;

            handleDecals(type, `data:image/png;base64,${image}`);
        }
        catch(err)
        {
            console.error(err);
        }
        finally
        {
            setGeneratingImg(false);
            setActiveEditorTab("");
        }
    }

    const handleDecals = (type, result) => {
        const decalType = DecalTypes[type];

        state[decalType.stateProperty] = result;
        if(!activeFilterTab[decalType.filterTab])
        {
            handleActiveFilterTab(decalType.filterTab)
        }
    }


    const handleActiveFilterTab = (tabName) => {
        switch(tabName)
        {
            case "logoShirt"    : state.isLogoTexture = !activeFilterTab[tabName];
            break;
            case "stylishShirt" : state.isFullTexture = !activeFilterTab[tabName];
            break;
            default: 
            state.isLogoTexture = true; 
            state.isFullTexture = false; 
        }

        //  after setting the state, activeFilterTab is updated
        setActiveFilterTab((prevState) => {
            return {
                ...prevState,
                [tabName]: !prevState[tabName]
            }
        })
    }

    const readFile = (type) => {
        reader(file)
        .then((result) => {
            handleDecals(type, result);
            setActiveEditorTab("")
        })
    }


  return (
    <AnimatePresence>
        {!snap.intro && (
            <>
                <motion.div 
                    key="custom"
                    {...slideAnimation('left')}
                    className='absolute top-0 left-0 z-10'
                >
                    <div className='flex items-center min-h-screen'>
                        <div className='editortabs-container tabs'>
                            {EditorTabs.map((tab) => {
                                return (
                                    <Tab
                                        key={tab.name}
                                        tab={tab}
                                        handleClick={() => setActiveEditorTab(tab.name)}
                                    />
                                ) 
                            })}

                            {generateTabContent()}
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    {...fadeAnimation}
                    className='absolute z-10 top-5 right-5' 
                >
                    <CustomButton
                        type="filled"
                        title="Go Back"
                        handleClick={() => state.intro = true}
                        customStyles="w-fit px-4 py-2.5 font-bold text-sm"
                    />
                </motion.div>
                        
                <motion.div 
                    {...slideAnimation('up')}
                    className='filtertabs-container' 
                >
                    {FilterTabs.map((tab) => {
                            return (
                                <Tab
                                    key={tab.name}
                                    tab={tab}
                                    isFilterTab
                                    isActiveTab={activeFilterTab[tab.name]}
                                    handleClick={() => handleActiveFilterTab(tab.name)}
                                />
                            ) 
                        })}
                </motion.div>
            </>
        )}
    </AnimatePresence>
  )
}

export default Customizer