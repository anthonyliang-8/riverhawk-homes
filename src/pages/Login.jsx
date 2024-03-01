import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    FormHelperText,
} from '@chakra-ui/react'

import React from 'react';


{/*look into formik for email validation, or find easier alternative*/}
function Login() {
    return (
        <div>
            <h2>Test</h2>
            <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input type='email' />
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input type='password' />
            </FormControl>
        </div>
    )
}

export default Login;