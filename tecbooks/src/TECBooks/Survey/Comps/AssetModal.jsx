import React, { useState } from 'react'
import { Typography } from '@mui/material';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function AssetModal({ open, handleClose }) {
    const [modal1, setModal1] = useState(false)
    const [modal2, setModal2] = useState(false)
    const [modal3, setModal3] = useState(false)
    const handleOpen1 = () => setModal1(true)
    const handleOpen2 = () => setModal2(true)
    const handleOpen3 = () => setModal3(true)
    const handleClose1 = () => setModal1(false)
    const handleClose2 = () => setModal2(false)
    const handleClose3 = () => setModal3(false)

    const style = {
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        zIndex: 2, // Just in case it's being hidden
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        fontWeight: 500
    }

  return (
    <div>
        <Modal
          open={open}
          onClose={handleClose}
            aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
            <Box className='modal-pop-up' sx={{ minHeight: 'none', minWidth: '600px' }}>
                {open && !modal1 && !modal2 && !modal3 && (
                    <div style={{ margin: 'auto' }}>
                        <Typography variant='h6' component='h2' sx={{ textAlign: 'center', marginBottom: '2rem' }}>
                            Assets and Inventory Help
                        </Typography>
                        <div onClick={handleOpen1} className='modal-option'>
                        <Typography variant='body1'>Owning vs Renting</Typography>
                        </div>
                        <div onClick={handleOpen2} className='modal-option'>
                            <Typography>Depreciation and Amortization</Typography>
                        </div>
                        <div onClick={handleOpen3} className='modal-option'>
                            <Typography>Inventory</Typography>
                        </div>
                        </div>
                    )}
    
                    {modal1 && (
                    <div style={{ minWidth: '500px' }}>
                        <div onClick={handleClose1}
                        style={style}
                        >
                        <ArrowBackIcon sx={{ marginRight: '0.5rem' }} /> Back
                        </div>
                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ marginTop: '1.5rem' }}>
                        What's the difference between Owning, Renting, and Leasing with Assets?
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <b>Owning</b> is when you outright buy the product or service, and only pay once to use
                        that product or service. Owned assets are subject to more complex value/expense calculations.
                        (depreciation/amortization)<br/><br/>
                        <b>Renting</b> is when you pay continously to use or have access to the product or service,
                        and leasing is the same just for longer terms. Rented assets are easier in accounting, they 
                        are simply recorded as fixed costs. <br/><br/>
                        </Typography>
                    </div>
                    )}
                {modal2 && (
                  <div style={{ minWidth: '500px' }}>
                    <div onClick={handleClose2} 
                      style={style}
                    >
                      <ArrowBackIcon sx={{ marginRight: '0.5rem' }} /> Back
                    </div>
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ marginTop: '1.5rem' }}>
                      What is depreciation and amortization?
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>                  
                      <b>Depreciation Rate</b>, or Dep Rate, is the % value that your asset loses in its value 
                      each year. It only applies to <b>assets you own</b>. For example, a car generally loses around 
                      15% of its value each year. <br/>
                      This is important, because you only want to be paying taxes on the current value of your 
                      assets, and the depreciation rate is how you track that. <br/><br/>
                      <b>Amortization</b> is when you split the cost of <b>an intangible asset</b>, like a patent
                      or license, over its useful lifetime. This is to <b>1.</b> reflect its cost over the entire time it 
                      contributes to the business, and therefore its profits, and <b>2.</b> helps to not record the entire 
                      expense all at once and reduce taxable income for its entire lifetime. 
                      as 
                    </Typography>
                  </div>
                )}
                {modal3 && (
                  <div style={{ minWidth: '500px' }}>
                    <div onClick={handleClose3}
                      style={style}
                    >
                      <ArrowBackIcon sx={{ marginRight: '0.5rem' }} /> Back
                    </div>
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ marginTop: '1.5rem' }}>
                      Does my business have inventory?
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>                  
                      Do your business buy any products in order to make/assemble the product you sell?
                      Then you have to buy and keep a certain quantity of those parts on hand, meaning
                      you have raw material.
                      <br/><br/>
                      If your business is often working on many products and doesn't finish them quickly, 
                      then a part-way made final product, like a halfway made car, is no longer raw material 
                      but needs to be represented in the balance sheet.
                      <br/><br/>
                      Finished goods work the same way, 
                    </Typography>
                  </div>
                )}
              </Box>
            </Modal>
        </div>
  )
}

export default AssetModal