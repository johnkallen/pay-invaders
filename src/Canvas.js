import React, { useRef, useEffect } from 'react'

const Canvas = props => {
  
  const { draw, gamePaused, ...rest } = props
  const canvasRef = useRef(null)
  
  useEffect(() => {
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    let animationFrameId
    
    const render = (timestamp) => {
      
      draw(ctx, timestamp)
      if (!gamePaused) animationFrameId = window.requestAnimationFrame(render)
      
    }
    render(0)
    
    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [draw, props])
  
  return (
  <div>
    <canvas id="canvas1" ref={canvasRef} {...rest}/>
  </div>)
 
}

export default Canvas;