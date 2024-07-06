import {Router } from 'express'
import { register,login,logout } from '../controllers/user.controller.js'
import { verifyJWT } from '../middleware/auth.middleware.js'

const useAuthRouter=Router()

useAuthRouter.route('/register').post(register)
useAuthRouter.route('/login').post(login)

//secure route
useAuthRouter.route("/logout").post(verifyJWT,logout)
export default useAuthRouter