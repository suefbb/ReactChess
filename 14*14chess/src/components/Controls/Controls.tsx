import { type Color } from "../../core/types"
type Rprams ={
  onResignClick: void,
  turn:Color
}
export function ResignBTN({onResignClick , turn}:Rprams) {
  return(
    <>
      <button onClick={()=>{onResignClick(turn)}}>R</button>
    </>
  )    
}