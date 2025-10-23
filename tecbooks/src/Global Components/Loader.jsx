import React from 'react'
// import 'materialize-css/dist/css/materialize.min.css'

function Loader({ message }) {
    return (
        <div className='view-child'>
            <div className='loader'></div>
            {message && (
                <p>{message}</p>
            )}
        </div>
    )
}

export default Loader