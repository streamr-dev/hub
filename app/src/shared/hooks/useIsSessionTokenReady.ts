import {useContext} from "react"
import {AuthenticationControllerContext} from "$auth/authenticationController"

export default function useIsSessionTokenReady() {
    const {currentAuthSession} = useContext(AuthenticationControllerContext)
    return !!currentAuthSession.address
}