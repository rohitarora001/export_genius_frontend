import { Loader2 } from 'lucide-react'
import React from 'react'
import { Button } from './button'

const ButtonLoading = () => {
    return (
        <Button disabled className="w-full">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
        </Button>
    )
}

export default ButtonLoading