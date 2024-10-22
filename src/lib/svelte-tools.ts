/** Blurs the node when Escape or Enter is pressed */
export function blurOnEnterEscape(node: any) {
  
    const handleKey = (event: any) => {
      if ( (event.key === 'Escape' || event.key === 'Enter') && node && typeof node.blur === 'function') node.blur()
    }
    
    node.addEventListener('keydown', handleKey)
    
    return {
      destroy() {
        node.removeEventListener('keydown', handleKey)
      }
    }
  }