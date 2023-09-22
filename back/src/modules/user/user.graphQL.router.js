import { userType } from '../../../graphQL/userType.js'
import * as userController from './controller/user.js'

export const userQueryFields = {
    user: {
        type: userType,
        resolve: userController.getUser
    },
}
