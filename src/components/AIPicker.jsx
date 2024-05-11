import React from 'react'
import CustomButton from './CustomButton'
import { motion } from 'framer-motion'
import { slideAnimation } from '../config/motion'

const AIPicker = ( {prompt, setPrompt, generatingImg, handleSubmit } ) => {


  return (
    <motion.div className='aipicker-container' {...slideAnimation('left')}>
        <textarea 
            rows={5}
            value={prompt}
            placeholder='Ask AI...'
            onChange={(e) => setPrompt(e.target.value)}
            className='aipicker-textarea'
        />
        <div className='flex flex-wrap gap-3'>
            {generatingImg ? (
                <CustomButton
                    type='outline'
                    title='Asking AI...'
                    customStyles='text-xs'

                />
            ) : (
                <>
                    <CustomButton 
                        type='outline'
                        title='AI Logo'
                        className='text-xs'
                        handleClick={() => handleSubmit('logo')}
                    />
                    <CustomButton 
                        type='filled'
                        title='AI Full'
                        className='text-xs'
                        handleClick={() => handleSubmit('full')}
                    />
                </>
            ) }

        </div>
    </motion.div>
  )
}

export default AIPicker