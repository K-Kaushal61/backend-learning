import {asyncHandler} from '../utils/asyncHandler.js';

// handles the client request -> no error ? ok report : middleware takes over

const resgisterUser = asyncHandler( async (req, res) => {
    res.status(200).json({
        message: "ok"
    })
})

export {resgisterUser}