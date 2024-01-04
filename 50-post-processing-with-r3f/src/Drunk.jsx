import { forwardRef } from 'react'
import DrunkEffect from './DrunkEffect'


export default forwardRef(function Drunk({ frequency, amplitude }, ref) {
    // console.log(ref)
    const effect = new DrunkEffect(frequency, amplitude)


    return <primitive ref={ref} object={effect} />
})
