import React, { useRef, useEffect } from 'react'

const Canvas = props => {
  
  const { draw, gamePaused, ...rest } = props
  const canvasRef = useRef(null)
  const collisionRef = useRef(null)
  
  useEffect(() => {
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const collision = collisionRef.current
    const collisionCtx = collision.getContext('2d')
    
    let animationFrameId
    
    const render = (timestamp) => {
      
      draw(ctx, collisionCtx, timestamp)
      if (!gamePaused) animationFrameId = window.requestAnimationFrame(render)
      
    }
    render(0)
    
    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [draw, props])
  
  return (
  <div>
    <canvas id="canvas2" ref={collisionRef} {...rest}/>
    <canvas id="canvas1" ref={canvasRef} {...rest}/>
  </div>)
 
}

export default Canvas;